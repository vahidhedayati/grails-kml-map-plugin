package org.grails.plugins.kml

import grails.core.GrailsApplication
import grails.core.support.GrailsApplicationAware
import org.grails.plugins.kml.utils.GeoHelper
import org.grails.plugins.kml.utils.GeoMapListener
import org.grails.plugins.kml.utils.KmlHelper

class LookupService implements GrailsApplicationAware {

    GrailsApplication grailsApplication
    def config


    def postcodeDetails(String countryCode, String code) {
        def result=[:]
        try {
            result= GeoHelper.resolveCountryPostCode(countryCode, code, true)?:[:]
            if (result && result.lat && result.lng) {
                //If config DISABLE_LAT_LNG_LOOKUP is set to true  it won't do this check
                if (Boolean.valueOf(config?.DISABLE_LAT_LNG_LOOKUP?:false)) {
                    def decodeLatLong = GeoHelper.decodeLatLong(Double.valueOf(result.lat as String), Double.valueOf(result.lng as String), code, true)
                    result.streetName = decodeLatLong?.streetName?:''
                    result.city = decodeLatLong?.city?:''
                    result.state = decodeLatLong?.state?:''
                    result.country = countryCode //decodeLatLong?.country
                    result.zip = decodeLatLong?.zip?:''
                    result.latLongDetails=decodeLatLong?:[:]
                }
                //This checks the map boundaries and returns the borough as per def on the map boundary
                List communityNames=[]
                String primaryCommunity=''
                // If config ENABLE_MAP_LOOKUP is set to false it won't do boundary check
                // Also the country doing postcode lookup needs to be already part of the boundary information
                // otherwise waste of resources
                if (Boolean.valueOf(config?.ENABLE_MAP_LOOKUP?:true) && SupportedCountries.findByCountryCode(countryCode)) {
                    GeoMapListener.loadElements()?.each {
                        boolean found = KmlHelper.coordinate_is_inside_polygon(Double.valueOf(result.lat as String),Double.valueOf(result.lng as String),it.lati,it.longi)
                        if (found ) {
                            primaryCommunity=it.name
                            communityNames<<it.name
                        }
                    }
                }
                result.comunityNames=communityNames
                result.comunityName=primaryCommunity
            }
        } catch (Exception e){
            log.error "e ${e.toString()}",e
        }
        return result
    }

    void setGrailsApplication(GrailsApplication ga) {
        config = ga.config.kmlplugin
    }
}

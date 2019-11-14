package grails.km.plugin

import grails.kml.plugin.utils.GeoHelper
import grails.kml.plugin.utils.GeoMapListener
import grails.kml.plugin.utils.KmlHelper

class LookupService {

    def postcodeDetails(String countryCode, String code) {
        def result
        try {
            result= GeoHelper.resolveCountryPostCode(countryCode, code, true)?:[:]
            if (result && result.lat && result.lng) {
                def  decodeLatLong = GeoHelper.decodeLatLong(Double.valueOf(result.lat as String),Double.valueOf(result.lng as String), code, true)
                //log.info "${code}  ${countryCode} - returned decodeLatLong ${decodeLatLong} "
                //result.streetNumber=a.streetNumber
                result.streetName=decodeLatLong?.streetName
                result.city=decodeLatLong?.city
                result.state=decodeLatLong?.state
                result.country=countryCode //decodeLatLong?.country
                //if (decodeLatLong.country && decodeLatLong.country!='null' && decodeLatLong.country!='NULL' && decodeLatLong.country!=null) {
                //try {
               // Country.withTransaction {
                //    result?.countryName=Country?.findByCode(countryCode)?.name
                //}
                result.zip=decodeLatLong?.zip
                //This checks the map boundaries and returns the borough as per def on the map boundary
                List communityNames=[]
                String primaryCommunity
                GeoMapListener.loadElements()?.each {
                    boolean found = KmlHelper.coordinate_is_inside_polygon(Double.valueOf(result.lat as String),Double.valueOf(result.lng as String),it.lati,it.longi)
                    if (found ) {
                        primaryCommunity=it.name
                        communityNames<<it.name
                    }
                }
                result.comunityName=primaryCommunity
            }
        } catch (Exception e){
            log.error "e ${e.toString()}",e
        }
        return result
    }
}

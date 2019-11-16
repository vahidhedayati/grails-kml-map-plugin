package org.grails.plugins.kml.utils

import org.grails.plugins.kml.Areas

class GeoPlaceMarks {

    String name
    List<Double> latitudes
    List<Double> longitudes
    List results
    String firstgoogleMapString
    String googleMapString

    Areas area


    GeoPlaceMarks() {

    }

    GeoPlaceMarks(name,List results) {
        this.name=name
        latitudes=results?.latitude?.flatten()
        longitudes=results?.longitude?.flatten()
        this.results=results
        this.area=Areas.executeQuery("from Areas where upper(name)=:name",[name:name.toUpperCase()])[0]
        List sb=[]
        results?.each {
            sb << "new google.maps.LatLng(${it.latitude},${it.longitude})"
        }
        firstgoogleMapString=sb[0]
        googleMapString=sb.join(',')
    }



}

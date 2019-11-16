package org.grails.plugins.kml.utils

class GeoPlaceMarks {

    String name
    List<Double> latitudes
    List<Double> longitudes
    List results
    String firstgoogleMapString
    String googleMapString



    GeoPlaceMarks() {

    }

    GeoPlaceMarks(name,List results) {
        this.name=name
        latitudes=results?.latitude?.flatten()
        longitudes=results?.longitude?.flatten()
        this.results=results

        List sb=[]
        results?.each {
            sb << "new google.maps.LatLng(${it.latitude},${it.longitude})"
        }
        firstgoogleMapString=sb[0]
        googleMapString=sb.join(',')
    }



}

package org.grails.plugins.kml.utils



class GeoCoordinates {



    String name
    String areaName


    Double latitude
    Double longitude

    String toString() {
        return "${longitude},${latitude}"
    }
}

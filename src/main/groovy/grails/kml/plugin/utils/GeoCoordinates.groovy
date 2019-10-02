package grails.kml.plugin.utils



class GeoCoordinates {



    String name
    String areaName


    Double latitude
    Double longitude

    String toString() {
        return "${longitude},${latitude}"
    }
}

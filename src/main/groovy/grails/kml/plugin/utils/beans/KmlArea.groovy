package grails.kml.plugin.utils.beans

import grails.validation.Validateable

class KmlArea implements Validateable {
    List<KmlUser> members=[]


    String name
    BigDecimal neLongitude
    BigDecimal neLatitude
    BigDecimal swLongitude
    BigDecimal swLatitude
    BigDecimal longitude
    BigDecimal latitude

    static constraints = {

        neLongitude(nullable: true, scale: 15, min: -180.0G, max: 180.0G)
        neLatitude(nullable: true, scale: 15, min: -90.0G, max: 90.0G)
        swLongitude(nullable: true, scale: 15, min: -180.0G, max: 180.0G)
        swLatitude(nullable: true, scale: 15, min: -90.0G, max: 90.0G)
        longitude(nullable: true, scale: 15, min: -180.0G, max: 180.0G)
        latitude(nullable: true, scale: 15, min: -90.0G, max: 90.0G)

    }


}

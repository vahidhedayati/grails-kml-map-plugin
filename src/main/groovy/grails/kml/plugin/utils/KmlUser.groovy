package grails.kml.plugin.utils

class KmlUser {

    Long id
    String username
    String firstName
    String lastName

    String getFriendlyName() {
        return firstName+' '+lastName
    }

    String areaName

    BigDecimal longitude
    BigDecimal latitude


    static constraints = {
        longitude(nullable: true, scale: 15, min: -180.0G, max: 180.0G)
        latitude(nullable: true, scale: 15, min: -90.0G, max: 90.0G)
    }
}

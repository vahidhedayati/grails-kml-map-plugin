package org.grails.plugins.kml.utils.beans

import grails.validation.Validateable

class KmlUser implements Validateable {

    Long id
    String username
    String firstName
    String lastName

    KmlArea area


    List<KmlUser> siblings=[]
    KmlUser father
    KmlUser mother

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

package org.grails.plugins.kml.utils.beans

import grails.validation.Validateable

class KmlAddress implements Validateable {


    String street
    String city
    String postcode

    BigDecimal longitude
    BigDecimal latitude


    static constraints = {
        longitude(nullable: true, scale: 15, min: -180.0G, max: 180.0G)
        latitude(nullable: true, scale: 15, min: -90.0G, max: 90.0G)
    }
}

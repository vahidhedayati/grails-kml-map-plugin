package org.grails.plugins.kml.utils.beans

import org.grails.plugins.kml.Areas
import org.grails.plugins.kml.utils.KmlBuilder
import grails.validation.Validateable

class AreaMapBean implements Validateable {

    Areas area

    String areaHierarchy

    static  constraints = {
        areaHierarchy(nullable:true)
    }
    protected def buildKml() {
        //builds up a user and the entire community on the map
        KmlBuilder builder = new KmlBuilder()
        builder.linkCommunity(area)
        areaHierarchy=builder.marshal()
        return this

    }
}


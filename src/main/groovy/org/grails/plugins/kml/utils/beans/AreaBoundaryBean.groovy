package org.grails.plugins.kml.utils.beans

import org.grails.plugins.kml.Area
import org.grails.plugins.kml.utils.GeoCoordinates
import grails.validation.Validateable

class AreaBoundaryBean implements Validateable{

    String name
    String oldName


    String coordinations
    Boolean override
    Area foundArea
    List<GeoCoordinates> coords=[]
    List areas=[]


    //When a user clicks on combine communities - it will recollect itself (i.e. this bean)
    //all over again in this object and reprocess itself same way
    // List<CommunityBoundaryBean> combined= ListUtils.lazyList([], { new CommunityBoundaryBean() } as Factory)


    static constraints={
        coordinations(nullable:true)
        foundArea(nullable:true)

        override(nullable:true)
    }

    def formatBean() {
        if (name) {
            /*  foundArea=Area.executeQuery("from Area where upper(name)=:name",[name:name.toUpperCase()])[0]
            if (foundArea) {
                Double longi= foundArea.longitude?.doubleValue()
                Double lat=foundArea.latitude?.doubleValue()
                println "yes ${lat}"

              def actualAreas=Holders.grailsApplication.mainContext.areaService.getArea(longi, lat,90,'MILES', foundArea.id as Long)?.
                        sort{it.distance}?.take(Holders.grailsApplication.config.kmlplugin?.MAX_AREAS?:30)?.collect()
                if (actualAreas) {
                    def ids=actualAreas.id
                    def found = GeoMapListener.PLACEMARKS.values().findAll{it.community && it.community.id in ids||it.name.toUpperCase()==name.toUpperCase()}
                    //Sort the communities according to distance - so it is easier closest first
                    actualAreas?.each { c->
                        areas+= (found.findAll{k-> k.community.id==c.id})
                    }
                }



            }*/
        }

        if (coordinations) {
            coordinations?.tokenize('\n')?.collect{it}?.each { v->
                def vv = v.split(',')
                GeoCoordinates gc  = new GeoCoordinates()
                gc.longitude=Double.valueOf(vv[0])
                gc.latitude=Double.valueOf(vv[1])
                coords << gc
            }
        }
        if (!oldName) {
            oldName=name
        }
        return this
    }

}

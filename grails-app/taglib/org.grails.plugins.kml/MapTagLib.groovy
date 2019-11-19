package org.grails.plugins.kml

class MapTagLib {
   // static defaultEncodeAs = [taglib:'html']
    static namespace  =  "map"
    //static encodeAsForTags = [tagName: [taglib:'html'], otherTagName: [taglib:'none']]
def areaService

    def selectBoundary={attrs ->
        def results = areaService.bindBoundary()
        out << g.render(template:'/map/selectBoundary', model:[instance:results, name:attrs.name])
    }

    def lookup={ attrs->
        Map model=[:]
        if (attrs?.instance) {
            model.instance=attrs.instance
        } else {
            model.instance=attrs
        }
        model.showState=Boolean.valueOf(attrs?.showState?:true)
        model.streetRequired=Boolean.valueOf(attrs?.streetRequired?:true)
        model.showLatLong=Boolean.valueOf(attrs?.showLatLong?:true)
        model.showArea=Boolean.valueOf(attrs?.showArea?:true)
        out << g.render(template:'/lookup/address', model:model?:[:])
    }
}

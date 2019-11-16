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
        out << g.render(template:'/lookup/address', model:[instance:attrs?.instance?:[:]])
    }
}

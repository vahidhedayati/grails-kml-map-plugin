package grails.kml.plugin

import grails.converters.JSON
import grails.kml.plugin.utils.GeoMapListener
import grails.kml.plugin.utils.KmlHelper
import grails.kml.plugin.utils.beans.AreaBoundaryBean
import grails.kml.plugin.utils.beans.AreaMapBean
import grails.kml.plugin.utils.beans.KmlArea

class MapController {


    def index() {
        AreaBoundaryBean bean = new AreaBoundaryBean()
        bindData(bean,params)
        bean.formatBean()
        def currentEntry
        if (bean.name) {
            currentEntry=GeoMapListener.PLACEMARKS.get(bean.name)
        } else {
            currentEntry=GeoMapListener.PLACEMARKS.find().value
        }

        render view:'index', model:[currentEntry:currentEntry, instance:bean]
    }
    def upload() {

    }
    def uploadKml() {
        try {
            def f = request.getFile('filename')
            if (f) {
                KmlHelper.uploadFile(f,userService.currentUser,params?.communityName)
                render text:g.message(code:'kmlUploaded.label', args:[params?.communityName?:''])
                return
            }
        } catch (Throwable t) {
            // ChildValidator.propagateException(t,bean.errors)
            log.error "issue uploading file ${t.message}",t
            KmlHelper.deleteFile(params.communityName, userService.currentUser.username)
            render text:g.message(code:'kmlFailedUpload.label', args:[params.communityName])
            return
        }

        render status: response.SC_NOT_FOUND
    }

    def delete() {
        if (params.id) {
            def currentEntry= GeoMapListener.PLACEMARKS.get(params.id as String)
            if (currentEntry) {
                KmlHelper.deleteFile(params.id as String, userService.currentUser.username)
                render status: response.SC_OK
            }

        }
        render status: response.SC_NOT_FOUND
    }
    def communityFromGeo() {
        if (params.lat && params.lng) {
            String primaryCommunity
            //return GeoHelper.decodeLatLong(Double.valueOf(params.lat as String),Double.valueOf(params.lng as String))
            GeoMapListener.loadElements()?.each {
                if (!primaryCommunity) {
                    boolean found = KmlHelper.coordinate_is_inside_polygon(Double.valueOf(params.lat as String),Double.valueOf(params.lng as String),it.lati,it.longi)
                    if (found ) {
                        primaryCommunity=it.name
                    }
                }
            }
            if (primaryCommunity) {
                def m = [name:primaryCommunity]
                render m as JSON
                return
            }
        }
        render status: response.SC_NOT_FOUND
    }


    def loadHistory() {
        if (params.name && params.original) {
            KmlHelper.generateHistoryKml(params.original,params.name)
            //render(text: KmlHelper.generateHistoryKml(params.original,params.name), encoding:"UTF-8", contentType:"text/xml")
            def currentEntry=GeoMapListener.PLACEMARKS_HISTORY.get(params.name)
            render view:'index', model:[currentEntry:currentEntry, instance:[:]]
            return
        }

        render status: response.SC_NOT_FOUND
    }
    def communityXml() {
        if (params.id) {
            render(text: KmlHelper.generateKml(params.id as Long), encoding:"UTF-8")
        } else {
            render(text: KmlHelper.generateKml(params.name), encoding:"UTF-8", contentType:"text/xml")
        }

    }

    def addGeo(AreaBoundaryBean bean) {
        bean.formatBean()
        if (bean.foundArea) {
            institutionService.updateGeo(bean.foundArea.id,bean.coords[0].longitude,bean.coords[0].latitude)
        }
        render status:response.SC_OK
    }

    def loadCommunityUserMap(AreaMapBean bean) {
        bean.buildKml()
        render(text:bean.areaHierarchy, encoding:"UTF-8", contentType:"text/xml")
    }

    def saveBoundary(AreaBoundaryBean bean) {
        bean.formatBean()
        bean.validate()
        bean.updateUser=userService.currentUser
        try {
            if (!bean.hasErrors() && ((!bean.foundArea ||!bean.coordinations)&& bean.override)||bean.foundArea && bean.coordinations) {
                KmlHelper.writeBoundary(bean)
                if ((!bean.foundArea ||!bean.coordinations)&& bean.override){
                    redirect(action: 'index')
                    return
                } else {
                    def currentEntry=GeoMapListener.PLACEMARKS.get(bean.name)
                    render view: "index",
                            model: [currentEntry:currentEntry,instance: bean]
                    return
                }



            }
        } catch (Throwable t) {

        }
        if (!bean.foundCommunity) {
            flash.message=message(code:'communityMissmatch.label')
        }
        if (!bean.coordinations) {
            flash.message=message(code:'noCoordsDel.label')
        }
        def currentEntry=GeoMapListener.PLACEMARKS.get(bean.name)


        render view: "saveBoundary",
                model: [currentEntry:currentEntry,instance: bean]
        return
    }

}

package org.grails.plugins.kml

import com.neovisionaries.i18n.CountryCode
import grails.converters.JSON

import java.util.regex.Pattern

class LookupController {

    def lookupService

    def index() {

        Map model=[:]
        model.instance=params
        model.showState=Boolean.valueOf(params?.showState?:true)
        model.streetRequired=Boolean.valueOf(params?.streetRequired?:true)
        model.showLatLong=Boolean.valueOf(params?.showLatLong?:true)
        model.showArea=Boolean.valueOf(params?.showArea?:true)
        render view:'/lookup/index', model:model
    }

    def postcodeDetails() {
        if (params.code && params.countryCode) {
            render lookupService.postcodeDetails(params.countryCode,params.code) as JSON
            return
        }
        render text:'failed', status: response.SC_NOT_FOUND
    }

    def searchCountry() {
        ///, Pattern.CASE_INSENSITIVE)
        render CountryCode.findByName("(?i).*${params.term.toLowerCase()}.*").collect{ CountryCode c->[value:c.getName(), code:c.getAlpha2(), label:c.getName()]} as JSON, status:200
    }
}

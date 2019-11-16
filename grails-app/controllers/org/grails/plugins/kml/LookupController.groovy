package org.grails.plugins.kml

import com.neovisionaries.i18n.CountryCode
import grails.converters.JSON

import java.util.regex.Pattern

class LookupController {

    def lookupService

    def index() {
        render view:'/lookup/index'
    }

    def postcodeDetails() {
        if (params.code && params.countryCode) {
            render lookupService.postcodeDetails(params.countryCode,params.code) as JSON
            return
        }
        render status: response.SC_NOT_FOUND
    }

    def searchCountry() {
        ///, Pattern.CASE_INSENSITIVE)
        render CountryCode.findByName("(?i).*${params.term.toLowerCase()}.*").collect{ CountryCode c->[value:c.getName(), code:c.getAlpha2(), label:c.getName()]} as JSON, status:200
    }
}
package grails.kml.plugin

import com.neovisionaries.i18n.CountryCode
import grails.converters.JSON

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
        def cc = CountryCode.values()
        def countries =CountryCode.findByName(".*${params.term.toLowerCase()}.*").collect{CountryCode c->[name:c.getName(), code:c.getAlpha2()]}
        println "== countries = ${countries}  --  ${params}"


        render CountryCode.findByName(".*${params.term.toLowerCase()}.*").collect{CountryCode c->[value:c.getName(),code:c.getAlpha2(), label:c.getName()]} as JSON, status:200
    }
}

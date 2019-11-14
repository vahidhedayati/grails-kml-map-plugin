package grails.kml.plugin

import com.maxmind.geoip.LookupService
import grails.plugins.Plugin
import grails.util.Holders

class KmlGrailsPlugin extends Plugin {
    def version = "1.0"
    def grailsVersion = "3 > *"
    def title = "grails kml parser google map overlay / postcode lookup plugin"
    def description = """A plugin to read raw kml file in - load google maps and overlay kml boundaries
             over map geo locations, international postcode lookup & resolve address from postcode feature 
                        """
    def documentation = "https://github.com/vahidhedayati/grails-kml-map-plugin"
    def license = "APACHE"
    def developers = [name: 'Vahid Hedayati', email: 'badvad@gmail.com']
    def issueManagement = [system: 'GITHUB', url: 'https://github.com/vahidhedayati/grails-kml-map-plugin/issues']
    def scm = [url: 'https://github.com/vahidhedayati/grails-kml-map-plugin']

    Closure doWithSpring() {
        { ->

            def conf=[:]
            conf.active = true

            //conf.printStatusMessages = true

            conf.data= [
                    cache : LookupService.GEOIP_MEMORY_CACHE | LookupService.GEOIP_CHECK_CACHE
            ]
            conf.path= (Holders.grailsApplication.config.kmplugin.geoMap?:"/opt/kmlplugin/_map/GeoLiteCity.dat")
           // boolean printStatusMessages = (conf.printStatusMessages instanceof Boolean) ? conf.printStatusMessages : true

            def dataResource
            try {
                if (conf) {
                    dataResource =new File(conf.path)
                }
            } catch (Exception e) {
                return;
            }

            if (!dataResource) {
                return;
            }



            /** geoLookupService */
            geoLookupService(LookupService, dataResource, conf.data.cache ?:
                    (LookupService.GEOIP_MEMORY_CACHE | LookupService.GEOIP_CHECK_CACHE))

            //if (printStatusMessages) {
                //log.info '... finished configuring MaxMind GeoIP\n'
            //}
        }
    }
}

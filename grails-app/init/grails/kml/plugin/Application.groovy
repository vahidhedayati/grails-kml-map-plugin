package grails.kml.plugin

import com.maxmind.geoip.LookupService
import grails.boot.*
import grails.boot.config.GrailsAutoConfiguration
import grails.plugins.metadata.*
import grails.util.Holders
import org.springframework.context.annotation.Bean
import org.springframework.web.context.request.RequestContextListener

@PluginSource
class Application extends GrailsAutoConfiguration {

    @Bean
    RequestContextListener requestContextListener(){
        new RequestContextListener();
    }
    Closure doWithSpring() {
        { ->

            def conf=[:]
            conf.active = true

            conf.printStatusMessages = true

            conf.data= [
                    cache : LookupService.GEOIP_MEMORY_CACHE | LookupService.GEOIP_CHECK_CACHE
            ]
            conf.path= (Holders.grailsApplication.config.kmplugin.geoMap?:"/opt/site_kmlplugin/_map/GeoLiteCity.dat")
            boolean printStatusMessages = (conf.printStatusMessages instanceof Boolean) ? conf.printStatusMessages : true
            if (printStatusMessages) {
            }

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

            if (printStatusMessages) {
                log.info '... finished configuring MaxMind GeoIP\n'
            }
        }
    }
    static void main(String[] args) {
        GrailsApp.run(Application, args)
    }
}
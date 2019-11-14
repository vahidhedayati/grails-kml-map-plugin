package grails.kml.plugin


import grails.boot.GrailsApp
import grails.boot.config.GrailsAutoConfiguration
import grails.plugins.metadata.PluginSource
import org.springframework.context.annotation.Bean
import org.springframework.web.context.request.RequestContextListener

@PluginSource
class Application extends GrailsAutoConfiguration {

    @Bean
    RequestContextListener requestContextListener(){
        new RequestContextListener();
    }

    static void main(String[] args) {
        GrailsApp.run(Application, args)
    }
}
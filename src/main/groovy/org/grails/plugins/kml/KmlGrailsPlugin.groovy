package org.grails.plugins.kml


import grails.plugins.Plugin

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


}

package org.grails.plugins.kml

/**
 * Countries that have KML Maps enabled - this is defined by when the site starts up
 *
 *
 *     //2 char country code of where your _default.kml belongs to so we can look up area names
 *     KML_COUNTRY='UK'
 *
 *     If you decided to support more than 1 country in this app, you would need to modify this value and physically
 *     define the country as you run the KmlParse feature which may also need you to backup the contents of what had been parsed
 *     previously by your previous run and starting a fresh folder in this location
 *         KML_LOC="/opt/kmlplugin/_map/KML/"
 *
 *     When entire process of parsing etc is done - the files from old parsed data and this lot can be copied into 1 folder
 *     when site starts up it should load in all files from both countries -
 *
 *     remember
 *     1. The kml data  is currently read and loaded into  memory - the more files the more mem consumption
 *     2. The parsing process seems to work for this file I have provided but not for official gov site versions
 *     & needs work - if anyone wishes to help feel free to fork and send PR Request
 */
class SupportedCountries {

    String countryCode

    static constraints = {
        countryCode(nullable: false,unique: true)
    }
}

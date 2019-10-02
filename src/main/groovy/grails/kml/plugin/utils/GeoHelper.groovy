package grails.kml.plugin.utils

import grails.util.Holders
import groovy.time.TimeCategory
import groovy.time.TimeDuration
import groovy.util.logging.Slf4j
import groovyx.net.http.HTTPBuilder
import groovyx.net.http.HttpResponseException
import groovyx.net.http.Method

import static groovyx.net.http.ContentType.JSON
import static groovyx.net.http.Method.GET

/**
 * GeoHelper is a fall back class if postcode validation could not find users post/zip code.
 * It uses google api and passes in country code + postcode and returns required information to then
 * add it locally to our db. Next attempt of same postcode will load up locally.
 * This way we can get it to auto generate postcodes as more users get added in
 *
 * try it:
 *    http://maps.googleapis.com/maps/api/geocode/json?components=country:CH|postal_code:9400
 *    http://maps.google.com/maps/api/geocode/json?components=country%3aAU%7Cpostal_code:2340&sensor=false
 *
 */
@Slf4j
class GeoHelper {
  //  private static  final Logger log = LoggerFactory.getLogger(getClass().name)

    //TODO they must sign up to google maps api and generate a key
    private static final String API_KEY= (Holders.grailsApplication.config.kmlplugin?.GOOGLE_API_KEY)?:''

    private static Date invalidationTime = null



    private static String ec(code){
        return URLEncoder.encode(code, 'UTF-8')
    }

    static LinkedHashMap resolveCommunity(String countryName, String cityName, String language='en') {
        try {
            LinkedHashMap geometry
            def address_url = URLEncoder.encode('country:'+countryName)
            def encCity = URLEncoder.encode(cityName)
            def url = "https://maps.googleapis.com/maps/api/geocode/json?components=${address_url}&address=${encCity}"
           // if (API_KEY) {
               url+="&key=${API_KEY}"
            //}
            def api = new HTTPBuilder(url)
            api.request(GET, JSON) { req ->
                response.success = { resp, json ->
                    json.results.each {
                        geometry = [
                                name: it.formatted_address,
                                latitude: it.geometry.location.lat,
                                longitude: it.geometry.location.lng,
                                nelat : it.geometry.bounds?.northeast?.lat,
                                nelng : it.geometry.bounds?.northeast?.lng,
                                swlat : it.geometry.bounds?.southwest?.lat,
                                swlng : it.geometry.bounds?.southwest?.lng,
                                shortCity: it.address_components?.short_name[1],
                                longCity: it.address_components?.long_name[1]

                        ]
                    }
                }
                response.failure = { resp, json ->
                    log.error "Unexpected error: ${resp.status} : ${resp.error_message}"
                    resp.headers.each { log.error "${it.name} : ${it.value}" }
                }
            }
            return geometry
        } catch (Throwable e) {
            log.error "${e.message}",e
            //println e.toString()
        }
    }

    static Map resolveCity(String countryName, String cityName, String language='en') {
        //String encoded = [cityName, countryName].collect {URLEncoder.encode(it, 'UTF-8')}.join(',')
        def http = new HTTPBuilder('https://maps.googleapis.com/maps/api/geocode/')
        def encCity = URLEncoder.encode(cityName)
        def lookup=[address:encCity,country:countryName, sensor: false, language:language]
        //if (API_KEY) {
        lookup.key=API_KEY
        //}
        def resp = http.get(
                path: 'json',
                query: lookup
        )

        switch (resp.status) {
            case 'OK':
                //if ($city == "" && ($type == "sublocality_level_1" || $type == "locality") ) {
               /*
                -- [[address_components:[[long_name:London, short_name:London, types:[locality, political]],
                [long_name:London, short_name:London, types:[postal_town]],
                [long_name:Greater London, short_name:Greater London, types:[administrative_area_level_2, political]],
                [long_name:England, short_name:England, types:[administrative_area_level_1, political]],
                 [long_name:United Kingdom, short_name:GB, types:[country, political]]],
                  formatted_address:London, UK, geometry:[bounds:[northeast:[lat:51.6723432, lng:0.148271], southwest:[lat:51.38494009999999, lng:-0.3514683]],
                  location:[lat:51.5073509, lng:-0.1277583], location_type:APPROXIMATE, viewport:[northeast:[lat:51.6723432, lng:0.148271],
                  southwest:[lat:51.38494009999999, lng:-0.3514683]]], place_id:ChIJdd4hrwug2EcRmSrV3Vo6llI, types:[locality, political]]]
                 */

                def lat = new BigDecimal(resp.results.geometry.location.lat.find { it }?:0)
                def lng = new BigDecimal(resp.results.geometry.location.lng.find { it }?:0)
                String name = resp.results.address_components[0].long_name.find{it}
                def components = resp.results[0].address_components
                def citiName=getLongComponent(components, 'administrative_area_level_1')

                if (lat && lng) {
                    return [lat: lat, lng: lng, name:name, cityElement:name==cityName ]
                } else {
                    return null
                }
                break
            case 'OVER_QUERY_LIMIT':
                invalidationTime = new Date()
                return null
                break
            default:
                invalidationTime = null
                return null;
        }
    }

    static Map decodeLatLong(Double lat, Double lng,String postcode, boolean withKey=true) {
        def http = new HTTPBuilder('https://maps.googleapis.com/maps/api/geocode/')
        def lookup = [latlng:"$lat,$lng".toString(), sensor: false]
        if (withKey) {
            lookup.key=API_KEY
        }
        //println " $lookup"
        def resp = http.get(
                path: 'json',
                query: lookup
        )
        switch (resp.status) {
            case 'OK':
               // def components1 = resp?.results?.address_components.find{k-> k.find{it.short_name==postcode}}
                def components = resp.results[0].address_components
                resp?.results?.address_components?.each { k ->
                    if (k.find{it.short_name==postcode}) {
                        components=k
                    }
                }
                if (!components) {
                    components = resp.results[0].address_components
                }

                //def components = resp.results.address_components.find{it==postcode}
                //def boroughName = resp.results[5]?.address_components[0]?.short_name
                if (!getComponent(components, 'country')) {
                    return null
                }
                if (!getComponent(components, 'postal_code')) {
                    return null
                }
                //if (!getComponent(components, 'locality')) {
                    //return null
                //}
                invalidationTime = null
                return [
                        //      borough: "${boroughName}",
                        //streetNumber: getComponent(components, 'street_number'),
                        streetName  : getComponent(components, 'route'),
                        city        : getComponent(components, 'locality')?:'',
                        state       : getComponent(components, 'administrative_area_level_1'),
                        country     : getComponent(components, 'country'),
                        zip         : getComponent(components, 'postal_code'),
                ]
                break
            case 'OVER_QUERY_LIMIT':
                invalidationTime = new Date()
                return null
                break
            default:
                invalidationTime = null
                return null;
        }
    }

    static Map decodeLatLong(Double lat, Double lng) {
        def http = new HTTPBuilder('https://maps.googleapis.com/maps/api/geocode/')
        def resp = http.get(
                path: 'json',
                query: [latlng:"$lat,$lng".toString(), sensor: false,]
        )
        switch (resp.status) {
            case 'OK':
                def components = resp.results[0].address_components

                //def boroughName = resp.results[5]?.address_components[0]?.short_name
               // println "---------  $boroughName"
                if (!getComponent(components, 'country')) {
                    return null
                }
                if (!getComponent(components, 'postal_code')) {
                    return null
                }
                if (!getComponent(components, 'locality')) {
                    return null
                }
                invalidationTime = null
                return [
                  //      borough: "${boroughName}",
                        //streetNumber: getComponent(components, 'street_number'),
                        streetName  : getComponent(components, 'route'),
                        city        : getComponent(components, 'locality'),
                        state       : getComponent(components, 'administrative_area_level_1'),
                        country     : getComponent(components, 'country'),
                        zip         : getComponent(components, 'postal_code'),
                ]
                break
            case 'OVER_QUERY_LIMIT':
                invalidationTime = new Date()
                return null
                break
            default:
                invalidationTime = null
                return null;
        }
    }

    private static String getComponent(json, String type) {
       json.find {
            it.types.contains(type)
        }?.short_name
    }

    private static String getLongComponent(json, String type) {
        json.find {
            it.types.contains(type)
        }?.long_name
    }

    boolean isValid() {
        if (invalidationTime) {
            TimeDuration duration = TimeCategory.minus(new Date(), invalidationTime)
            TimeDuration reference = new TimeDuration(1, 0, 0, 0)

            if (duration > reference) {
                invalidationTime = null
            }

            return !invalidationTime
        }
        return true
    }
    static Map resolveCountry(String countryCode) {
        def result=[:]
        if (countryCode) {
            String url="/maps/api/geocode/json?components=country%3a${countryCode}&key="+API_KEY
            String server="https://maps.googleapis.com"
            // String url="/maps/api/geocode/json?components=country%3a${countryCode}%7Cpostal_code:${code}&sensor=false"
            URL url1 = new URL(server+url)
            if (url1) {
                try {
                    def http = new HTTPBuilder(url1)
                    http.request(Method.GET) { req ->
                        response.success = { resp, json ->
                            def location = json?.results?.geometry?.location
                            def names = (json?.results?.address_components?.long_name)[0] ?: []
                            if (location) {
                                result.lat = location.lat[0]
                                result.lng = location.lng[0]
                            }
                            if (names) {
                                result.country = names[0]
                            }
                            if (result.lat && result.lng) {
                                log.info "Google latlong service: ${resp.status}  ${code} found ${result}"
                            } else {
                                log.info "Google latlong service: ${resp.status}  ${code} not found"
                            }
                        }
                        response.failure = { resp ->
                            log.error "Process URL failed with status ${resp.status}"
                        }
                    }
                }
                catch (HttpResponseException e) {
                    log.error "Failed error: $e.statusCode"
                }
            }
        }
        return result
    }

    static Map resolveCountryPostCode(String countryCode, String code,boolean withKey=false) {
        def result=[:]
        if (countryCode && code) {
            //def encCity=code
            //if (encode) {
              def  encCity = URLEncoder.encode(code)
            //}
            String url="/maps/api/geocode/json?components=country%3a${countryCode}%7Cpostal_code:${encCity}"//
            if (withKey) {
                url+="&key="+API_KEY
            }

            String server="https://maps.googleapis.com"

            // String url="/maps/api/geocode/json?components=country%3a${countryCode}%7Cpostal_code:${code}&sensor=false"
            URL url1 = new URL(server+url)
            if (url1) {
                try {
                    def http = new HTTPBuilder(url1)
                    http.request(Method.GET) { req ->

                        response.success = { resp, json ->
                            def location = json?.results?.geometry?.location
                            def names = (json?.results?.address_components?.short_name)[0] ?: []
                            def lat, lng
                            String postCode,cityName,county,state
                            if (location) {
                                result.lat = location.lat[0]
                                result.lng = location.lng[0]

                            }
                            if (names) {
                                result.postCode = names[0]
                                result.cityName = names[1]
                                result.county = names[2]
                                result.state = names[3]
                            }
                            if (result.lat && result.lng) {
                                log.info "Google latlong service: ${resp.status}  ${code} found withKey=${withKey}"
                            } else {
                                result.failed=true
                                log.info "Google latlong service: ${resp.status}  ${code} not found withKey=${withKey}"
                            }

                        }
                        response.failure = { resp ->
                           log.error "Process URL failed with status ${resp.status}"
                        }
                    }
                }
                catch (HttpResponseException e) {
                   log.error "Failed error: $e.statusCode"
                }
            }
        }
        return result
    }


}

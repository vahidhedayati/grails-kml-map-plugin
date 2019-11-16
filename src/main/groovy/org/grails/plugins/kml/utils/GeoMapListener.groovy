package org.grails.plugins.kml.utils

import groovy.util.logging.Slf4j

import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.ConcurrentMap

/**
 * This will contain a live available map of all of the geo location boundaries of the site and will be then
 * able to pass search a given postcode to given boundaries and work out what is best.
 *
 *
 */
@Slf4j
class GeoMapListener {

    private static final ConcurrentMap<String, GeoPlaceMarks> PLACEMARKS = new ConcurrentHashMap<String, GeoPlaceMarks>()
    private static final ConcurrentMap<String, GeoPlaceMarks> PLACEMARKS_HISTORY = new ConcurrentHashMap<String, GeoPlaceMarks>()

 //   public static Logger log = LoggerFactory.getLogger(getClass().name)
    GeoMapListener() {
        log.info "starting up  ${getClass().simpleName}"
    }

    public static void removeMark(String name) {
        if (name) {
            def r = PLACEMARKS.get(name)
            if (r) {
                PLACEMARKS.remove(name)
            }
        }
    }
    /**
     * This is run on top of updateHistory to take contents off the original file name and rename it to be the key
     * of history file name
     * @param name
     * @param original
     */
    public static void changeHistory(String name,String  original) {
        def r = PLACEMARKS_HISTORY.get(original)
        if (r) {
            def rr = PLACEMARKS_HISTORY.get(name)
            if (rr) {
                PLACEMARKS_HISTORY.remove(name)

            }
            PLACEMARKS_HISTORY.put(name, r)
            PLACEMARKS_HISTORY.remove(original)
        }
    }

    /**
     * This is triggered by KML Helper during file reading. It is stored as actual name of file
     * that it originated from
     * @param name
     * @param results
     */
    public static void updateHistory(String name, List results) {
        def r = PLACEMARKS_HISTORY.get(name)
        if (!r) {
            GeoPlaceMarks marks = new GeoPlaceMarks(name,results)
            PLACEMARKS_HISTORY.put(name, marks)
        }
    }

    public static void update(String name, List results) {
        //println "working on $name"
        log.info "Update ${name}"
        if (name != 'TOBESET') {
            def r = PLACEMARKS.get(name)
            if (!r) {
                GeoPlaceMarks marks = new GeoPlaceMarks(name,results)
                PLACEMARKS.put(name, marks)
            }
        }

    }
    public static void createUpdate(String name, List results) {
        log.info "createUpdate ${name}"
        def r = PLACEMARKS.get(name)
        GeoPlaceMarks marks = new GeoPlaceMarks(name,results)
        if (!r) {
            PLACEMARKS.put(name, marks)
        } else {
            PLACEMARKS.remove(name)
            PLACEMARKS.put(name, marks)
        }
    }
    public static List loadElements() {
        def lst=[]
        GeoMapListener.PLACEMARKS.values().each{
            lst << [name:it.name  ,longi:it.longitudes, lati: it.latitudes]
        }
        return lst
    }

    public static Map kmlMaps() {
        def lst=[]
        GeoMapListener.PLACEMARKS.each{k,v->
            lst << [name:it.name  ,longi:it.longitudes, lati: it.latitudes]
        }
        return lst
    }
}

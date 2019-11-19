package org.grails.plugins.kml.utils

import de.micromata.opengis.kml.v_2_2_0.*
import org.grails.plugins.kml.AreaService
import org.grails.plugins.kml.utils.beans.AreaBoundaryBean
import org.grails.plugins.kml.utils.beans.KmlUser
import grails.util.Holders
import groovy.util.logging.Slf4j
import org.apache.commons.io.IOUtils
import org.apache.commons.io.LineIterator
import org.springframework.web.multipart.MultipartFile


/**
 *  KmlHelper : notes
 *      1. The kml data  is currently read and loaded into  memory - the more files the more mem consumption
 *      2. The parsing process seems to work for this file I have provided but not for official gov site versions
 *      & needs work - if anyone wishes to help feel free to fork and send PR Request
 *
 *  @author Vahid hedayati
 */
@Slf4j
class KmlHelper {

    public static final String DIGEST_ALGORITHM='SHA-1'
    public static final long ENTRIES_PER_DIRECTORY=2000
    public static final long MAX_UPLOAD_SIZE=10*1024*1024

   // public static List  COLLECTED_NAMES=[]

 //   public static Logger log = LoggerFactory.getLogger(getClass().name)
    static String ROOT_PATH= Holders.grailsApplication.config.kmlplugin.KML_LOC ?:'/opt/kmlplugin/_map/KML/'
    static String KML_HISTORY= Holders.grailsApplication.config.kmlplugin.KML_HISTORY?:'/opt/kmlplugin/_map/KML_HISTORY/'
    static String DEFAULT_KML= Holders.grailsApplication.config.kmlplugin.KML_DEFAULT?:"_default.kml"
    static String COUNTRY_CODE= Holders.grailsApplication.config.kmlplugin.KML_COUNTRY?:"UK"
    static boolean KML_RESET_FROM_DEFAULT= Holders.grailsApplication.config.kmlplugin.KML_RESET_FROM_DEFAULT?:false


    public static List getHistory(String name) {
        def files = Helper.ls(KML_HISTORY+name,'kml')
        List list=[]
        files?.each {
            list<<[name:it,label:it]
        }
    }

    public static String generateHistoryKml(String original, String name) {
        InputStream is = new FileInputStream(KML_HISTORY+original+"/"+name)
        if (is) {
            Kml kml = Kml.unmarshal(is)
            parseFeature(kml.feature,false,true)
            GeoMapListener.changeHistory(name, original)
        }
    }

    /**
     * This starts the process and reads in the uk file
     */
    public static void parseKml() {
        //configuration override to run the default kml file

        if (KML_RESET_FROM_DEFAULT) {
            InputStream is = new FileInputStream(ROOT_PATH+DEFAULT_KML)
            Kml kml = Kml.unmarshal(is)
            parseFeature(kml.feature,true)
            //if (COLLECTED_NAMES) {
            //    Holders.grailsApplication.mainContext.areaService.addAreas(COUNTRY_CODE,COLLECTED_NAMES)
             //   COLLECTED_NAMES=[]
            //}
        } else {
            //Unless told to reset it will check to see if the default file has been expanded
            //if not will do similar to above (first time round)
            //next restart it will realise more files exist and read those
            def files = Helper.ls(ROOT_PATH,'kml')
            //The default
            if (!files||files.size()==0) {
                log.error "No KML Files found - will not be able to map communities to specific boundaries - please ensure you upload  ${ROOT_PATH+DEFAULT_KML} "
            } else {
                if (files.size()==1) {
                    //We only have our default KML File
                    log.info "Starting first time with ${ROOT_PATH+DEFAULT_KML} files will be generated inside ${ROOT_PATH} "
                    InputStream is = new FileInputStream(ROOT_PATH+DEFAULT_KML)
                    Kml kml = Kml.unmarshal(is)
                    parseFeature(kml.feature,true)
                   // if (COLLECTED_NAMES) {
                     //   Holders.grailsApplication.mainContext.areaService.addAreas(COUNTRY_CODE,COLLECTED_NAMES)
                    //    COLLECTED_NAMES=[]
                    //}
                } else {
                    files.each { f->
                        if (f!=DEFAULT_KML) {
                            log.info "Loading KML FILE ${f}"
                            InputStream is = new FileInputStream(ROOT_PATH+f)
                            Kml kml = Kml.unmarshal(is)
                            parseFeature(kml.feature)
                        }
                    }
                }
            }
        }
    }

    /**
     * This is step 2 of the process it figures out if it has a direct placemark mapping on kml
     * or if this is part of some big folder structure
     * @param feature
     */
    public static void parseFeature(Feature feature, boolean storeFile=false,boolean historyItem=false, String communityName=null) {
        if(feature) {
            if(feature instanceof Document) {
                feature?.feature?.each { documentFeature->
                    if(documentFeature instanceof Placemark) {
                        getPlacemark((Placemark) documentFeature,storeFile,historyItem,communityName)
                    } else if (documentFeature instanceof Folder) {
                        getFeatureList(documentFeature.feature,storeFile,historyItem,communityName)
                    }
                }
            } else if(feature instanceof Placemark) {
                getPlacemark((Placemark) feature,storeFile,historyItem,communityName)

            }
        }
    }

    /**
     * This iterates over itself over and over again to gain access to placemarks within folders
     * The uk map boundary was nested folders within folders
     * @param features
     * @return
     */
    public static List<Feature> getFeatureList(List<Feature> features, boolean storeFile=false,boolean historyItem=false, String communityName=null) {
        features?.each { Feature  f ->
            if (f instanceof Folder) {
                getFeatureList(f.getFeature(),storeFile,historyItem,communityName)
            } else if (f instanceof Placemark) {
                getPlacemark((Placemark) f,storeFile,historyItem,communityName)
            }
        }
    }

    /**
     * This in short kicks off looking at a placemark it's name then parsing through each of its geometry points
     * This controls the listener content or should I say builds it up from within this helper
     * @param placemark
     */
    public static void getPlacemark(Placemark placemark, boolean storeFile=false,boolean historyItem=false, String communityName=null) {
        Geometry geometry = placemark.getGeometry()
        List results = parseGeometry(geometry)
         log.info "- getPlacemark Placemark working on ${placemark.name}"
        if (storeFile) {
            //this.COLLECTED_NAMES.add(communityName?:placemark.name)
            Holders.grailsApplication.mainContext.areaService.addArea(COUNTRY_CODE,communityName?:placemark.name)
            log.info "storing ${communityName?:placemark.name}"

            writeKml(communityName?communityName:placemark.name, results)
        }
        if (historyItem) {
            GeoMapListener.updateHistory(communityName?communityName:placemark.name, results)
        } else {
            log.info "Updating ${communityName?communityName:placemark.name}"
            if (communityName) {
                GeoMapListener.createUpdate(communityName, results)
            } else {
                if (placemark && placemark.name) {
                    GeoMapListener.update(placemark.name, results)
                }

            }

        }

    }
    public static void deleteFile(String name,String username) {
        File file1 = new File(ROOT_PATH+name.toUpperCase()+".kml")
        if (file1.exists()) {
            log.info "deleting ${file1.name}"
            Helper.copyDeleteFile(file1,KML_HISTORY, name,username)
            GeoMapListener.removeMark(name)
        }
    }

    public static void uploadFile(MultipartFile file, String username, String communityName=null) {

            File file1 = new File(ROOT_PATH+(communityName?communityName.toUpperCase():file.name.toUpperCase())+".kml")
            if (file1.exists()) {
                log.info "deleting ${file1.name}"
                Helper.copyDeleteFile(file1,KML_HISTORY, (communityName?communityName.toUpperCase():file.name.toUpperCase()),username)
            }




        Helper.calculateAndCopy(DIGEST_ALGORITHM, file.getInputStream(),file1.newOutputStream())
        InputStream is = new FileInputStream(file1)
        LineIterator lt=IOUtils.lineIterator(is, "utf-8");
        StringBuilder sb = new StringBuilder()
        while(lt.hasNext()) {
            sb.append(lt.nextLine())
        }
        String text = sb.toString()
        InputStream targetStream = new ByteArrayInputStream(text.getBytes());
        IOUtils.closeQuietly(is)
        Kml kml = Kml.unmarshal(targetStream)
        if (kml) {
            parseFeature(kml.feature,true,false,communityName)
        }
    }

    public static void  writeBoundary(AreaBoundaryBean bean) {
        if (!bean.coords) {
            deleteFile(bean.name, 'admin')
        } else {
            Kml kml = KmlFactory.createKml();
            def placeMarkPoint =kml.createAndSetPlacemark()
                    .withName(bean.name)
                    .withVisibility(true)
                    .withOpen(false)
                    .withDescription(bean.name)
                    .withStyleUrl("styles.kml#jugh_style")
                    .createAndSetPoint()

            placeMarkPoint.withExtrude(false)
            placeMarkPoint.withAltitudeMode(AltitudeMode.CLAMP_TO_GROUND)
            bean.coords?.each { t->
                placeMarkPoint.addToCoordinates(t.longitude,t.latitude,0)
            }

            File file1 = new File(ROOT_PATH+bean.name.toUpperCase()+".kml")
            if (file1.exists()) {
                log.info "deleting ${file1.name}"
                Helper.copyDeleteFile(file1,KML_HISTORY, bean.name,'admin')
            }

            List results=[]
            bean.coords?.each {
                results<<[latitude:it.latitude,longitude:it.longitude]
            }
            GeoMapListener.createUpdate(bean.name,results)
            log.info "Creating file  ${file1.name}"
            kml.marshal(file1)

            if (bean.oldName && bean.oldName!=bean.name) {
                File file2 = new File(ROOT_PATH+bean.oldName.toUpperCase()+".kml")
                if (file2) {
                    log.info "deleting ${file1.name}"
                    Helper.copyDeleteFile(file2,KML_HISTORY, bean.name,'admin')
                }
                GeoMapListener.removeMark(bean.oldName)
            }

        }
    }

    private static void  writeKml(String name, List results) {
        /*Kml kml = new Kml()
        def aa = kml.createAndSetPlacemark().withName(name).withOpen(Boolean.TRUE).createAndSetPoint()
        results?.each { coordinate->
            aa.addToCoordinates(coordinate.longitude,coordinate.latitude,coordinate.altitude)
        }
*/
        Kml kml = KmlFactory.createKml();
        def placeMarkPoint =kml.createAndSetPlacemark()
                .withName(name)
                .withVisibility(true)
                .withOpen(false)
                .withDescription(name)
                .withStyleUrl("styles.kml#jugh_style")
                .createAndSetPoint()

        placeMarkPoint.withExtrude(false)
        placeMarkPoint.withAltitudeMode(AltitudeMode.CLAMP_TO_GROUND)
        results?.each { t->
            placeMarkPoint.addToCoordinates(t.longitude,t.latitude,t.altitude)
        }

        File file1 = new File(ROOT_PATH+(name?.toUpperCase()?:'TOBESET')+".kml")
        if (!file1.exists()) {
            log.info "Creating ${file1.name}"
            kml.marshal(file1)
        }
    }

    private static List parseGeometry(Geometry geometry) {
        List results=[]
        if(geometry != null) {
            if(geometry instanceof Polygon) {
                Polygon polygon = (Polygon) geometry;
                Boundary outerBoundaryIs = polygon.getOuterBoundaryIs();
                if(outerBoundaryIs != null) {
                    LinearRing linearRing = outerBoundaryIs.getLinearRing();
                    if(linearRing != null) {
                        List<Coordinate> coordinates = linearRing.getCoordinates();
                        if(coordinates != null) {
                            for(Coordinate coordinate : coordinates) {
                                results << parseCoordinate(coordinate)
                            }
                        }
                    }
                }
            } else  if (geometry instanceof LineString) {
                LineString lineString = (LineString) geometry
                List<Coordinate> coordinates = lineString.getCoordinates()
                if (coordinates != null) {
                    for (Coordinate coordinate : coordinates) {
                        results <<  parseCoordinate(coordinate)
                    }
                }
            } else  if (geometry instanceof Point) {
                List<Coordinate> coordinates = geometry.getCoordinates()
                if (coordinates != null) {
                    for (Coordinate coordinate : coordinates) {
                        results <<  parseCoordinate(coordinate)
                    }
                }
            }
        }
        return results
    }

    private static Map parseCoordinate(Coordinate coordinate) {
        Map results=[:]
        if(coordinate) {
            results.longitude= coordinate.longitude
            results.latitude= coordinate.latitude
            results.altitude= coordinate.altitude
        }
        return results
    }

    public static double PI = 3.14159265;
    public static double TWOPI = 2*PI;

    public static boolean coordinate_is_inside_polygon(double latitude, double longitude, ArrayList<Double> lat_array, ArrayList<Double> long_array) {
        int i
        double angle=0
        double point1_lat
        double point1_long
        double point2_lat
        double point2_long
        int n = lat_array.size()

        for (i=0;i<n;i++) {
            point1_lat = lat_array.get(i) - latitude
            point1_long = long_array.get(i) - longitude
            point2_lat = lat_array.get((i+1)%n) - latitude
            //you should have paid more attention in high school geometry.
            point2_long = long_array.get((i+1)%n) - longitude
            angle += Angle2D(point1_lat,point1_long,point2_lat,point2_long)
        }

        if (Math.abs(angle) < PI)
            return false
        else
            return true
    }

    public static double Angle2D(double y1, double x1, double y2, double x2) {
        double dtheta,theta1,theta2

        theta1 = Math.atan2(y1,x1)
        theta2 = Math.atan2(y2,x2)
        dtheta = theta2 - theta1
        while (dtheta > PI)
            dtheta -= TWOPI
        while (dtheta < -PI)
            dtheta += TWOPI

        return(dtheta)
    }

    public static boolean is_valid_gps_coordinate(double latitude, double longitude) {
        //This is a bonus function, it's unused, to reject invalid lat/longs.
        if (latitude > -90 && latitude < 90 && longitude > -180 && longitude < 180) {
            return true
        }
        return false
    }

    //https://stackoverflow.com/questions/7014746/java-marshalling-object-removing-extra-ns2-annotation-in-xml
    private static void writeKml(Double longi, Double lat,String name,String writeTo ) {
        Kml kml = new Kml()
        kml.createAndSetPlacemark().withName(name).withOpen(Boolean.TRUE).createAndSetPoint().addToCoordinates(longi,lat)
        kml.marshal(new File(writeTo))
        final Placemark placemark = (Placemark) kml.getFeature()
        Point point = (Point) placemark.getGeometry()
        List<Coordinate> coordinates = point.getCoordinates()
        for (Coordinate coordinate : coordinates) {
            System.out.println(coordinate.getLatitude())
            System.out.println(coordinate.getLongitude())
            System.out.println(coordinate.getAltitude())
        }
    }


    public static String generateKml(String name) {
        def rr = GeoMapListener.PLACEMARKS.keySet().find{it.toUpperCase()==name.toUpperCase()}
        def r
        if (rr) {
            r = GeoMapListener.PLACEMARKS.get(rr)
        }
        if (r){
            return generateKml(name, r)
        }

    }
    public static String generateKml(String name, GeoPlaceMarks r) {
        Kml kml = KmlFactory.createKml();
        def placeMarkPoint =kml.createAndSetPlacemark()
                .withName(name)
                .withVisibility(true)
                .withOpen(false)
                .withDescription(name)
                .withStyleUrl("styles.kml#jugh_style")
                .createAndSetPoint()
        placeMarkPoint.withExtrude(false)
        placeMarkPoint.withAltitudeMode(AltitudeMode.CLAMP_TO_GROUND)
        r.results?.each { t->
            placeMarkPoint.addToCoordinates(t.longitude,t.latitude,0)
        }

        //                return kml.marshal(System.out)
        StringWriter sw = new StringWriter()
        kml.marshal(sw)
        return sw.toString()
    }
}

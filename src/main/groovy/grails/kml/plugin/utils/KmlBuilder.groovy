package grails.kml.plugin.utils

import de.micromata.opengis.kml.v_2_2_0.*
import grails.kml.plugin.Area
import grails.kml.plugin.utils.beans.KmlArea
import grails.kml.plugin.utils.beans.KmlUser

/**
 *
 * This class is used typically to build up a user on map
 *
 *
 */
public class KmlBuilder {

    private Kml m_kml
    private Document m_doc
    private Folder m_folder
    private Style m_defaultStyle
    private Map<String, GeoCoordinates> m_refToCoordMap
    private List<Long> addedUsers=[]

    public  KmlBuilder(String kmlName) {
        m_kml = new Kml();
        m_doc = m_kml.createAndSetDocument().withName(kmlName).withOpen(true);
        m_folder = m_doc.createAndAddFolder();
        m_defaultStyle = m_doc.createAndAddStyle();
        m_defaultStyle.withId("style_default")
                .createAndSetIconStyle().withScale(10.0);
        m_defaultStyle.createAndSetLabelStyle().withColor("000000").withScale(10.0);
        m_defaultStyle.createAndSetLineStyle()
                .withColor("760000ff")
                .withWidth(3.0d);
        m_refToCoordMap = new HashMap<String, GeoCoordinates>()
    }

    public void placeIndividual(KmlUser indi, friendlyName) {
        GeoCoordinates gmp = getCoordinates(indi)
        addPlacemarkWithLabel(gmp, friendlyName)
    }





    public  Placemark addPlacemarkWithLabel(GeoCoordinates coords, String label) {
        Placemark placemark = m_folder.createAndAddPlacemark();
        placemark.withName(label)
                .withStyleUrl("#style_default")
                .withDescription(label)
                .createAndSetLookAt().withLongitude(coords.longitude).withLatitude(coords.latitude).withAltitude(0).withRange(12000000);
        placemark.createAndSetPoint().addToCoordinates(coords.longitude, coords.latitude)
        return placemark
    }

    public  void linkPlacemarks(String linkName, GeoCoordinates coords0, GeoCoordinates coords1) {
        if(coords0 == null || coords1 == null) return;

        Placemark placemark = m_folder.createAndAddPlacemark();
        placemark.withName(linkName)
                .withStyleUrl("#style_default")
                .withDescription("placemark link");
        placemark.createAndSetLineString().withExtrude(true).withTessellate(true)
                .addToCoordinates(coords0.toString())
                .addToCoordinates(coords1.toString())
    }

    public  void linkCommunity(KmlUser user) {
        if (user.area) {
            linkCommunity(user.area)
        }

    }

    public  void linkCommunity(Area area) {

        GeoCoordinates communityRecord = getCoordinates(area)
        area?.members?.each{ KmlUser s ->
            GeoCoordinates communityMemberRecord = getCoordinates(s)
            if (communityMemberRecord.longitude && communityRecord.longitude && !addedUsers.contains(s.id)) {
                addedUsers<<s.id
                linkPlacemarks("<a href='/area/show/${institution.id}' target='${institution?.name}'><i class='fa fa-institution'></i>  "+area.name+'</a>'+s.friendlyName, communityMemberRecord, communityRecord)
                addPlacemarkWithLabel(communityMemberRecord, s.friendlyName)
            }
        }

    }


    public  void linkFamilies(Set<KmlUser> families) {
        families?.each { KmlUser u ->


            u.siblings?.each { KmlUser s ->
                GeoCoordinates brecord = getCoordinates( s)
                        GeoCoordinates childRecord = getCoordinates(s)
                        if (childRecord.longitude && childRecord.longitude) {
                            addedUsers<<s.id
                            linkPlacemarks("<a href='/profile/?profileUser.id=${s.id}' target='${s.friendlyName}'><i class='fa fa-user'></i> "+u.friendlyName+'</a> ~ '+s.friendlyName, childRecord, brecord)
                            addPlacemarkWithLabel(childRecord, s.friendlyName)
                        }
                    }



            GeoCoordinates userRecord = getCoordinates(u)
            if (!addedUsers.contains(u.id)) {
                addedUsers<<u.id

                addPlacemarkWithLabel(userRecord, u.friendlyName)
            }

            if (u.father) {
                GeoCoordinates fatherRecord = getCoordinates(u.father)
                if (fatherRecord.longitude && userRecord.longitude && !addedUsers.contains(u.father.id)) {
                    addedUsers<<u.father.id
                    linkPlacemarks("<a href='/profile/?profileUser.id=${u.father.id}' target='${u.father.username}'><i class='fa fa-user'></i> "+u.father.friendlyName+'</a> ~ '+u.friendlyName,fatherRecord, userRecord)
                    addPlacemarkWithLabel(fatherRecord, u.father.friendlyName)
                }
            }
            if (u.mother) {
                GeoCoordinates motherRecord = getCoordinates(u.mother)
                if (motherRecord.longitude && userRecord.longitude&& !addedUsers.contains(u.mother.id)) {
                    addedUsers<<u.mother.id
                    linkPlacemarks("<a href='/profile/?profileUser.id=${u.mother.id}' target='${u.mother.username}'><i class='fa fa-user'></i> "+u.mother.friendlyName+'</a> ~ '+u.friendlyName,motherRecord, userRecord)
                    addPlacemarkWithLabel(motherRecord, u.mother.friendlyName)
                }
            }
        }
    }
    private  GeoCoordinates getCoordinates(KmlUser u) {
        GeoCoordinates gmp = new GeoCoordinates()
        gmp.name = u.friendlyName
        if (u.areaName) {
            gmp.areaName = u.areaName
        } else {
            GeoMapListener.loadElements()?.each {
                boolean found = KmlHelper.coordinate_is_inside_polygon(Double.valueOf(u.latitude as String),Double.valueOf(u?.longitude as String),it.lati,it.longi)
                if (found && !cont) {
                    cont=true
                    gmp.areaName=it.name
                }
            }
        }


        gmp.longitude = u?.longitude
        gmp.latitude = u?.latitude
        m_refToCoordMap.put(u.id, gmp)
        return gmp
    }



    public String marshal(String fileName=null) {
        if (fileName) {
            marshal(new File(fileName))
            return ''
        }
        StringWriter sw = new StringWriter()
        m_kml.marshal(sw)
        return sw.toString()

    }

    public void marshal(File file) {
        try {
            m_kml.marshal(file);
        } catch(Exception e) {
        }
    }

}

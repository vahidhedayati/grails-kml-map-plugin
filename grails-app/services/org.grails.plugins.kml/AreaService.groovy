package org.grails.plugins.kml

import grails.core.GrailsApplication
import grails.core.support.GrailsApplicationAware
import grails.gorm.transactions.Transactional
import org.grails.plugins.kml.Area
import org.grails.plugins.kml.utils.CalcLatLong
import org.grails.plugins.kml.utils.GeoMapListener

class AreaService implements GrailsApplicationAware {

        GrailsApplication grailsApplication
        def config



        @Transactional
        List getActualCommunities(Double longitude, Double latitude,int distance=0, Long communityId=0L) {
            Map map = bindPostCode(longitude,latitude,distance,measureTypes)
            String queryAddon=map.queryAddon as String
            String orderAddon=map.orderAddon as String
            String where = map.where
            String query="""
              select new map (cm.name as areaName, cm.id as id, cm as cm  ${queryAddon}) from Area cm
        """
            Map wp=[:]
            if (communityId)  {
                where+=" and cm.id != :communityId"
                wp.communityId=communityId
            }

            query=query+where+"  order by ${orderAddon} "
            return Area.executeQuery(query, wp, [readOnly:true])?.cm
        }


        List getArea(Double longitude, Double latitude,int distance=0,String measureTypes='MILES', Long communityId=0L) {
            Map map = bindPostCode(longitude,latitude,distance,measureTypes)
            String queryAddon=map.queryAddon as String
            String orderAddon=map.orderAddon as String
            String where = map.where
            String query="""
            select new map (cm.name as communityName, cm.id as id  ${queryAddon}) from Area cm
        """
            Map wp=[:]
            if (communityId)  {
                where+=" and cm.id != :communityId"
                wp.communityId=communityId
            }

            query=query+where+"  order by ${orderAddon} "
            def areaList=[]
            Area.withTransaction {
                areaList=Area.executeQuery(query, wp, [readOnly:true])
            }

          //  communityList?.each {
              //  it.members=it.cm.areaMembers
           // }
            return areaList
        }

    def bindBoundary() {

        List validEntries=[]
        GeoMapListener.PLACEMARKS?.sort{it.key}?.each {
            validEntries << [name:it.key, label:it.key]
        }

        return [validEntries:validEntries]
    }

        Map bindPostCode(Double longitude,Double latitude,int distance=0,String measureTypes='MILES') {
            CalcLatLong cl = new CalcLatLong()
            int searchRange = 3659  //Miles
            if (measureTypes=='KM'){
                searchRange = 6371 //Km
            }
            if (distance==0) {
                distance=defaultDistance
            }

            String where=''
            Map values = cl.parse(distance, longitude, latitude)
            where = addClause(where, """
            (cm.latitude between ${values.latmin} and ${values.latmax} and
            cm.longitude between ${values.lonmin} and ${values.lonmax})
            """)

            String queryAddon= """ ,  round(
        ( ${searchRange} * acos( cos( radians(${latitude}) )
        * cos( radians( cm.latitude ) )
        * cos( radians( cm.longitude ) - radians(${longitude}) )
        + sin( radians(${latitude}) )
        * sin( radians( cm.latitude) ) ) )
        , 2)  AS distance
        """
            String orderAddon='distance'

            return [queryAddon:queryAddon,orderAddon:orderAddon,where:where]
        }

        int getDefaultDistance() {
            if (config) {
                return ((config as Map)?.find{k,v-> k=='MAX_DISTANCE'}?.value as int ?: 60)
            } else {
                return 60
            }
        }

        static String addClause(String where,String clause) {
            return (where ? where + ' and ' : 'where ') + clause
        }

        void setGrailsApplication(GrailsApplication ga) {
            config = ga.config.kmlplugin
        }
    }



/*
where = addClause(where, """
    (
    (cm.latitude between ${values.latmin} and ${values.latmax} and cm.longitude between ${values.lonmin} and ${values.lonmax})
    or
    (cm.neLatitude between ${values.latmin} and ${values.latmax} and cm.neLongitude between ${values.lonmin} and ${values.lonmax})
    or
    (cm.swLatitude between ${values.latmin} and ${values.latmax} and cm.swLongitude between ${values.lonmin} and ${values.lonmax})
    )
""")

String queryAddon= """ ,  round(
( ${searchRange} * acos( cos( radians(${latitude}) )
* cos( radians( cm.latitude ) )
* cos( radians( cm.longitude ) - radians(${longitude}) )
+ sin( radians(${latitude}) )
* sin( radians( cm.latitude) ) ) )
, 2)  AS distance
"""
queryAddon+= """ ,  round(
( ${searchRange} * acos( cos( radians(${latitude}) )
* cos( radians( cm.neLatitude ) )
* cos( radians( cm.neLongitude ) - radians(${longitude}) )
+ sin( radians(${latitude}) )
* sin( radians( cm.neLongitude) ) ) )
, 2)  AS distance1
"""
queryAddon+= """ ,  round(
( ${searchRange} * acos( cos( radians(${latitude}) )
* cos( radians( cm.swLatitude ) )
* cos( radians( cm.swLongitude ) - radians(${longitude}) )
+ sin( radians(${latitude}) )
* sin( radians( cm.swLongitude) ) ) )
, 2)  AS distance2
"""
String orderAddon='distance,distance1,distance2 '
*/


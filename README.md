# grails-kml-plugin

### This is a very powerful plugin that does multiple things:
A plugin to read raw kml file in - load google maps and overlay kml boundaries over map geo locations, international postcode lookup &amp; resolve address from postcode feature


#### 1. Post/Zip code lookup globally and resolves as much of address as possible

#### 2. If map enabled draws out 
##### 2.1 Boundary / area if exists 
##### 2.2 places geo location of location on map

### 3. Provides KML Utils:
##### 3.1 Parsing utils (Google Map overlay) - read below
##### 3.2 Edit KML Files via plugin and update a boundary 

## Please refer to YouTube video to understand all of above a bit better


#### How to install:  Dependency Grails 3 (build.gradle):
 ```
 compile "org.grails.plugins.kml:kml:0.2"
```

> #### [Demo project (grails 3.3.8)](https://github.com/vahidhedayati/grailskml-test)
 
> ### YouTube videos  
  [Part 1 Walk through urls and simple usage of plugin - very basic](https://youtu.be/m4ecgmGn4UA)
  
  [Part 2 Walk through of how to build on new grails project from scratch](https://youtu.be/PA_O4xLGEkc)
  
  [Part 3 Talk through code process / steps](https://youtu.be/DQPkME4uGRs)
  
  
> ### [Java docs for classes](https://vahidhedayati.github.io/grails-kml-map-plugin/)

#### Configuration values for your application.yml application.groovy in my case:

```
kmlplugin{
    //TO USE MAP API FEATURE NEEDS TO BE ENABLED
    GOOGLE_API_KEY='YOUR GOOGLE API KEY'
    //This is total amount of local areas to collect for editing KML  
    MAX_AREAS=30

    //How far to look for local areas in miles
    MAX_DISTANCE=30

    //This defines to enable map
    ENABLE_MAP_LOOKUP=true

    // If you don't have API feature enabled on key disable this you get a developer map instead
    MAP_HAS_API_ENABLED=false

    //Physical location of geoLitCity file  - create and ensure web user has access
    geoMap="/opt/kmlplugin/_map/GeoLite2-City.mmdb"

    //2 char country code of where your _default.kml belongs to so we can look up area names
    KML_COUNTRY='UK'

    // Internal folder to manage KML files - create and ensure web user has access
    KML_LOC="/opt/kmlplugin/_map/KML/"
    KML_HISTORY="/opt/kmlplugin/_map/KML_HISTORY/"

    //Drop this file in KML_LOC root folder - refer to notes below
    KML_DEFAULT="_default.kml"

    //This will re-run - recreate entries from _default.kml
    //if you are running in dev on h2 db - it is worth enabling this to add areas to db upon boot
    KML_RESET_FROM_DEFAULT=false
}
```


#### Upon Start Available urls:

##### 1. Lookup service : http://localhost:8080/lookup

This provides a page that given country / postcode will attempt to:
 >1.1: Lookup postcode and return as much of address as possible 

 >1.2. If `ENABLE_MAP_LOOKUP` is set to true and `GOOGLE_API_KEY` has valid API access 
    Will load map, put postcode on map 
    & if KML boundaries loaded and matches will load in the area overlay on the map.
    
    There is also a taglib call `<map:lookup/>` I havent really messed around with this
    
##### Map overlay editor :  http://localhost:8080/map

This provides an interface to edit and modify existing kml boundaries on the fly. 
It provides raw kml extracted file, has feature to upload, hasn't been tested.




Instructions / Notes 
----------
Under:
1.  `/opt/kmlplugin/_map/` -> https://geolite.maxmind.com/download/geoip/database/GeoLite2-City.tar.gz
Override `config.kmplugin.geoMap` or put file into
Place this under `/opt/kmlplugin/_map/GeoLiteCity.dat`




2. `/opt/kmlplugin/_map/KML/` ->

Place a file for the given country. This will be KML file you get hold of that contains typically all the official boroughs/councils of a given country in the case of UK we found:

[was here](http://www.nemezisproject.co.uk/2012/05/20/google-maps-api-uk-local-council-overlay-boundaries-kml/)
Site appears to no longer work. You can get hold of [file from here](https://github.com/vahidhedayati/grailskml-test/tree/master/DOWNLOADS)  

This file was then stored in this folder as 

_default.kml


/opt/kmlplugin/_map/KML/_default.kml


### To parse KML Files  Add this to BootStrap.groovy

```
 KmlHelper.parseKml()
```


 
When the site starts up for the very first time, it will attempt to read through this file and inside the same folder it will expand out all the found boroughs.

```bash
$ ls -rtml /opt/kmlplugin/_map/KML/|more
total 9876
-rw-rw-r-- 1 mx1 mx1 7394653 Nov 29 17:08 _default.kml
-rw-rw-r-- 1 mx1 mx1   19199 Dec  1 19:36 BEDFORDSHIRE.kml
-rw-rw-r-- 1 mx1 mx1   31337 Dec  1 19:36 BUCKINGHAMSHIRE.kml
-rw-rw-r-- 1 mx1 mx1   24338 Dec  1 19:36 CAMBRIDGESHIRE.kml
-rw-rw-r-- 1 mx1 mx1     584 Dec  1 19:36 CHESHIRE.kml
-rw-rw-r-- 1 mx1 mx1     584 Dec  1 19:36 CORNWALL.kml
-rw-rw-r-- 1 mx1 mx1     582 Dec  1 19:36 CUMBRIA.kml
```

At this point it has loaded up each borough and also split each borough/community into its own specific file.

This process happens only once and can be redone by clearing out and dropping in as above a _default.kml file.

This triggers an internal process to do what has been demonstrated.

Once it has been generated. The site will from there on refer to all created files to load up each community.

This means you can now edit each of the generated files for a given community and re-save it – a saved version and application restart will then ensure the site is using whatever latest content each community has.

Upon start up you will need to visit the  map regions and it will show what has been produced.

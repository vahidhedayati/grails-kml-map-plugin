# grails-kml-map-plugin
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

 



### Youtube video
[Demo of plugin - very basic ](https://youtu.be/aG5Pj5Ggok4)

##### Configuration values for your application.yml application.groovy in my case:

```
kmlplugin{
    //TO USE MAP API FEATURE NEEDS TO BE ENABLED
    GOOGLE_API_KEY='YOUR GOOGLE API KEY'  
    MAX_AREAS=30

    ENABLE_MAP_LOOKUP=true

    geoMap="/opt/kmlplugin/_map/GeoLite2-City.mmdb"

    KML_LOC="/opt/kmlplugin/_map/KML/"
    KML_HISTORY="/opt/kmlplugin/_map/KML_HISTORY/"
    KML_DEFAULT="_default.kml"
    KML_RESET_FROM_DEFAULT=false
}
```
Under:
1.  `/opt/kmlplugin/_map/` -> https://geolite.maxmind.com/download/geoip/database/GeoLite2-City.tar.gz
Override `config.kmplugin.geoMap` or put file into
Place this under `/opt/kmlplugin/_map/GeoLiteCity.dat`




2. `/opt/kmlplugin/_map/KML/` ->


Place a file for the given country. This will be KML file you get hold of that contains typically all the official boroughs/councils of a given country in the case of UK we found:

http://www.nemezisproject.co.uk/2012/05/20/google-maps-api-uk-local-council-overlay-boundaries-kml/

This file was then stored in this folder as 

_default.kml


/opt/kmlplugin/_map/KML/_default.kml


### Please note above  site appears to no longer work 
You can get hold of [above file from here](https://github.com/vahidhedayati/grailskml-test/tree/master/DOWNLOADS)  

### To parse KML Files  Add this to BootStrap.groovy

```
 KmlHelper.parseKml()
```

```
./gradlew wrapper --gradle-version 4.4.1
 ./gradlew publishToMavenLocal
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

This means you can now edit each of the generated files for a given community and resave it – a saved version and application restart will then ensure the site is using whatever latest content each community has.

Upon start up you will need to visit the  map regions and it will show what has been produced.

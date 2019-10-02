# grails-kml-map-plugin
A plugin to read raw kml file in - load google maps and overlay kml boundaries over map geo locations, international postcode lookup &amp; resolve address from postcode feature



I will be putting together existing work that never went live for another project, the plugin will cover parsing of a huge KML file, or smaller specific files, split into the boundaries provided. 

It will provide a live KML editor as part of the plugin, to update existing KML files meaning you can redesign a given area let's say London or even more detailed, `Islington` a borough within London, and redraw those boundaries to be smaller or bigger.

Once set, the postcode resolving system that will also be provided will resolve a given postcode and using google provide the end address upto it's door number. Tested internationally and worked fine.

The user's actual boundary will also be defined based on a calculation of where they sit in the boundary of your KML file, ie provide the borough or boundary name they reside in.


Its a lot of work I need to strip out and put together, will keep me busy in the evenings for next few months

Notes
----


There is already an existing location which holds the GEO location IP lookup map. 
This location has now been extends to cover KML aspects of the site.

Under:

/opt/site_content/_map/KML/

Place a file for the given country. This will be KML file you get hold of that contains typically all the official boroughs/councils of a given country in the case of UK we found:

http://www.nemezisproject.co.uk/2012/05/20/google-maps-api-uk-local-council-overlay-boundaries-kml/

This file was then stored in this folder as 

_default.kml


/opt/site_content/_map/KML/_default.kml


When the site starts up for the very first time, it will attempt to read through this file and inside the same folder it will expand out all the found boroughs.

```bash
$ ls -rtml /opt/site_content/_map/KML/|more
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

Upon start up you will need to visit the doost map regions and it will show what has been produced.

![sample image](https://raw.githubusercontent.com/vahidhedayati/grails-kml-map-plugin/master/documentation/map-region-editor.png)
![sample image](https://raw.githubusercontent.com/vahidhedayati/grails-kml-map-plugin/master/documentation/map-region-editor-edit.png)

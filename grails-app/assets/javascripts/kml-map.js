function KmlMap() {

    var jsfromserver = [];

    this.setJsFromServer = function (t) {
        jsfromserver = t
    };

    var markerImage='';
    this.setMarkerImage=function(t) {
        markerImage=t;
    };

    var googleMapString;
    this.setGoogleMapString=function(t) {
        googleMapString=t
    }
    var mkStyle='';
    this.setmkStyle=function(t) {
        mkStyle=t
    }



    function gob(e) {
        if (typeof (e) == 'object') return (e);
        if (document.getElementById) return (document.getElementById(e));
        return (eval(e))
    };

    var map;//= new google.maps.Map();
    var overlayname = new Array();
    this.setOverlayName=function(t) {
        overlayname.push(t)
    };

    var description = new Array();
    this.setDescription=function(t) {
        description.push(t)
    };
    var thisshape = new Array();

    this.setShape=function(t) {
        thisshape.push(t);
    };

    var markers = [];
    var midmarkers = [];
    var shapenumbers;
    var shapesignal = "line";
    var pointsArray = [];
    var pointsArrayKml = [];
    var polyShape;
    var prevPoints;
    var prevpoint;
    var prevnumber;
    var cur = 0;
    var orgShape;
    var lineShape = new Array();
    var polygonShape = new Array();
    var editing = false;
    var polyPoints = new Array();
    var lineColor = "#FF0000"; // red line
    var opacity = .5;
    var lineWeight = 2;
    var fillColor = "#0000FF";


    var markerShape;
    //var oldDirMarkers = [];
    //var tmpPolyLine;
    var drawnShapes = [];
    var holeShapes = [];
    var startMarker;
    var nemarker;
    var tinyMarker;

    //var markerlistener1;
    //var markerlistener2;
    var rectangle;
    var circle;
    var southWest;
    var northEast;
    var centerPoint;
    var radiusPoint;
    var calc;
    var startpoint;
    var adder = 0;
    var dynamicLayers = 0
    var dynamicNames = []
    var dirpointstart = null;
    //var dirpointend = 0;
    var dirline;
    var waypts = [];
    //var waypots = [];

    var markersArray = [];
    var addresssArray = [];

    var markersArrayKml = [];
    var toolID = 1;
    var codeID = 1;
    var shapeId = 0;
    var step = 0;
    var plmcur = 0;
    var lcur = 0;
    var pcur = 0;
    //var rcur = 0;
    var ccur = 0;
    var mcur = 0;
    var outerPoints = [];
    var holePolyArray = [];
    var outerShape;
    var anotherhole = false;
    /*var stylecount;
     var stylename = new Array();
     var styletype = new Array();
     var linecolourkml = new Array();
     var fillcolourkml = new Array();
     var stroke = new Array();
     var placemarkstyles = new Array();*/


    var notext = false;
    var textsignal = 0;
    var map='';
    var kmlcode = ""; // Used as signal for have been logged
    var javacode = ""; // Used as signal for have been logged
    var polylineDecColorCur = "255,0,0";
    var polygonDecColorCur = "255,0,0";
    var docuname = "My document";
    var docudesc = "Content";
    var polylinestyles = [];
    var polygonstyles = [];
    //var rectanglestyles = [];
    var circlestyles = [];
    var markerstyles = [];
    var geocoder; // = new google.maps.Geocoder();
    //var startLocation;
    var endLocation;
    //var dircount;
    var dircountstart;
    var firstdirclick = 0;
    var dirmarknum = 1;
    var directionsDisplay;
    var directionsService = new google.maps.DirectionsService();
    var directionsYes = 0;
    var destinations = [];
    var removedirectionleg = 0;
    var placemarks = [];
    var nav = [];
    var jsCustom = [];
    var imgNormal='';


    var imageNormal;
    var imageHover;
    var imageNormalMidpoint;

    this.setImgNormal=function(t) {
        imgNormal=t;
        imageNormal = new google.maps.MarkerImage(
            t,
            new google.maps.Size(11, 11),
            new google.maps.Point(0, 0),
            new google.maps.Point(6, 6)
        );
    };
    this.setImgHover=function(t) {
        imageHover = new google.maps.MarkerImage(
            t,
            new google.maps.Size(11, 11),
            new google.maps.Point(0, 0),
            new google.maps.Point(6, 6)
        );
    };
    this.setImgNormalMid=function(t) {
        imageNormalMidpoint = new google.maps.MarkerImage(
            t,
            new google.maps.Size(11, 11),
            new google.maps.Point(0, 0),
            new google.maps.Point(6, 6)
        );
    }
    //var currentDirections = null;
    //var oldpoint = null;


    var presentationguide = "Ready to edit.\n" +
        "Play with the example shape. Import a kml-file. " +
        "Polygons are shown not filled - as polylines. " +
        "Click 'Edit lines' and dragable points will be shown. " +
        "The coordinates will be presented here in the text area.\n" +
        "To edit a line or shape, mouse over it and drag the points. Click on a point to delete it.\n" +
        "The imported kml-file will not be affected. Copy and paste the new coordinates in the local kml-file. " +
        "Upload the edited local kml-file.";
    // converting from php to javascript
    shapenumbers = 1;
    //stylecount = ;
    var tmpPolyLine = new google.maps.Polyline({
        strokeColor: "#00FF00",
        strokeOpacity: 0.8,
        strokeWeight: 2
    });
    var tmpPolyLine1 = new google.maps.Polyline({
        strokeColor: "#00FF00",
        strokeOpacity: 0.8,
        strokeWeight: 2
    });
    var tinyIcon = new google.maps.MarkerImage(
        markerImage,
        new google.maps.Size(12, 20),
        new google.maps.Point(0, 0),
        new google.maps.Point(6, 16)
        )
    ;
    /*var tinyShadow = new google.maps.MarkerImage(
     'icons/marker_20_shadow.png',
     new google.maps.Size(22,20),
     new google.maps.Point(6,20),
     new google.maps.Point(5,1)
     );*/


    Array.prototype.pushIfNotExist = function (element, comparer) {
        if (!this.inArray(comparer)) {
            this.push(element);
        }
    };

    //text overlays
    function TxtOverlay(pos, txt, cls, map) {

        // Now initialize all properties.
        this.pos = pos;
        this.txt_ = txt;
        this.cls_ = cls;
        this.map_ = map;

        // We define a property to hold the image's
        // div. We'll actually create this div
        // upon receipt of the add() method so we'll
        // leave it null for now.
        this.div_ = null;

        // Explicitly call setMap() on this overlay
        this.setMap(map);
    }

    TxtOverlay.prototype = new google.maps.OverlayView();


    TxtOverlay.prototype.onAdd = function () {

        // Note: an overlay's receipt of onAdd() indicates that
        // the map's panes are now available for attaching
        // the overlay to the map via the DOM.

        // Create the DIV and set some basic attributes.
        var div = document.createElement('DIV');
        div.className = this.cls_;

        div.innerHTML = this.txt_;

        // Set the overlay's div_ property to this DIV
        this.div_ = div;
        var overlayProjection = this.getProjection();
        var position = overlayProjection.fromLatLngToDivPixel(this.pos);
        div.style.left = position.x + 'px';
        div.style.top = position.y + 'px';
        // We add an overlay to a map via one of the map's panes.

        var panes = this.getPanes();
        panes.floatPane.appendChild(div);
    }
    TxtOverlay.prototype.draw = function () {


        var overlayProjection = this.getProjection();

        // Retrieve the southwest and northeast coordinates of this overlay
        // in latlngs and convert them to pixels coordinates.
        // We'll use these coordinates to resize the DIV.
        var position = overlayProjection.fromLatLngToDivPixel(this.pos);


        var div = this.div_;
        div.style.left = position.x + 'px';
        div.style.top = position.y + 'px';


    }
    //Optional: helper methods for removing and toggling the text overlay.
    TxtOverlay.prototype.onRemove = function () {
        this.div_.parentNode.removeChild(this.div_);
        this.div_ = null;
    }
    TxtOverlay.prototype.hide = function () {
        if (this.div_) {
            this.div_.style.visibility = "hidden";
        }
    }

    TxtOverlay.prototype.show = function () {
        if (this.div_) {
            this.div_.style.visibility = "visible";
        }
    }

    TxtOverlay.prototype.toggle = function () {
        if (this.div_) {
            if (this.div_.style.visibility == "hidden") {
                this.show();
            } else {
                this.hide();
            }
        }
    }

    TxtOverlay.prototype.toggleDOM = function () {
        if (this.getMap()) {
            this.setMap(null);
        } else {
            this.setMap(this.map_);
        }
    }


    this.loadCommunity=function (url) {
        $.get(url, function (data) {
            //html = "";
            //loop through placemarks tags
            $(data).find("Placemark").each(function (index, value) {
                coords = $(this).find("coordinates").text();
                place = $(this).find("name").text();
                var array = coords.split(' ');
                //map.route = [];
                $.each(array, function (i, e) {
                    var c = e.split(",");
                    //nav.push(new google.maps.LatLng(c[1], c[0]))
                    panToPoint = new google.maps.LatLng(c[1], c[0])
                    map.panTo(panToPoint);

                    var infowindow = new google.maps.InfoWindow({
                        position: panToPoint,
                        map: map,
                        icon: tinyIcon,
                        content: place
                    });
                    tinyMarker = new google.maps.Marker({
                        position: panToPoint,
                        map: map,
                        icon: tinyIcon,
                        title:place
                    });
                    infowindow.open(map, tinyMarker);
                    //customTxt = "<div class='question-box'>"+place+"</div>"
                    //txt = new TxtOverlay(panToPoint, customTxt, "customBox", map)

                })
            })
        })
    };
    function loadCommunityMap(name,kmlurl, url) {
        //Ensure we load the layer once only - regardless of how many times the user clicks it
        var check=true;
        //if (id) {
        ///      check=overlayname.indexOf(id) === -1
        // } else {
        check=overlayname.indexOf(name) === -1
        // }
        if (check) {
            nav = [];


            $.get(url, function (data) {
                //html = "";
                //loop through placemarks tags
                $(data).find("Placemark").each(function (index, value) {
                    //get coordinates and place name
                    coords = $(this).find("coordinates").text();
                    place = $(this).find("name").text();
                    var array = coords.split(' ');
                    //map.route = [];
                    $.each(array, function (i, e) {
                        var c = e.split(",")
                        nav.push(new google.maps.LatLng(c[1], c[0]))
                    })
                })
                /*
                 This adds the dynamic form content for a specific dynamic content added
                 again due to conflicts for now all removed
                 $('#dynamicFormContent').append('<input type="text" name="combined['+overlayname.length+'].name" class="form-control" value="'+name+'"]>' +
                 '<input type="hidden" name="combined['+overlayname.length+'].oldName" value="'+name+'"]>' +
                 '<textarea name="combined['+overlayname.length+'].coordinations" id="coords'+overlayname.length+'"  class="form-control"></textarea>'
                 )
                 */
                //if (id) {
                   // overlayname.push(id);
               // } else {
                    overlayname.push(name);
                //}
                thisshape.push("Polygon");
                jsCustom = [nav]
                tmpPolyLine1.setMap(map);
                addOverlayFromKML1(kmlurl)
                polyPoints = new google.maps.MVCArray(); // collects coordinates
                tmpPolyLine1.setMap(map);
                createplacemarkobject();
                createlinestyleobject();
                createpolygonstyleobject();
                createcirclestyleobject();
                createmarkerstyleobject();
                preparePolyline(); // create a Polyline object
                //google.maps.event.addListener(map, 'click', addLatLng);
                google.maps.event.addListener(map, 'zoom_changed', mapzoom);
                //cursorposition(map);
            });
        }
    }

    this.loadCommunityMap=function(name,kmlurl, url) {
        //Ensure we load the layer once only - regardless of how many times the user clicks it
        var check=true;
        //if (id) {
      ///      check=overlayname.indexOf(id) === -1
       // } else {
            check=overlayname.indexOf(name) === -1
       // }
        if (check) {
            nav = [];


            $.get(url, function (data) {
                //html = "";
                //loop through placemarks tags
                $(data).find("Placemark").each(function (index, value) {
                    //get coordinates and place name
                    coords = $(this).find("coordinates").text();
                    place = $(this).find("name").text();
                    var array = coords.split(' ');
                    //map.route = [];
                    $.each(array, function (i, e) {
                        var c = e.split(",")
                        nav.push(new google.maps.LatLng(c[1], c[0]))
                    })
                })
                /*
                 This adds the dynamic form content for a specific dynamic content added
                 again due to conflicts for now all removed
                 $('#dynamicFormContent').append('<input type="text" name="combined['+overlayname.length+'].name" class="form-control" value="'+name+'"]>' +
                 '<input type="hidden" name="combined['+overlayname.length+'].oldName" value="'+name+'"]>' +
                 '<textarea name="combined['+overlayname.length+'].coordinations" id="coords'+overlayname.length+'"  class="form-control"></textarea>'
                 )
                 */
                //if (id) {
                //    overlayname.push(id);
                //} else {
                    overlayname.push(name);
                //}
                thisshape.push("Polygon");
                jsCustom = [nav]
                tmpPolyLine1.setMap(map);
                addOverlayFromKML1(kmlurl)
                polyPoints = new google.maps.MVCArray(); // collects coordinates
                tmpPolyLine1.setMap(map);
                createplacemarkobject();
                createlinestyleobject();
                createpolygonstyleobject();
                createcirclestyleobject();
                createmarkerstyleobject();
                preparePolyline(); // create a Polyline object
                //google.maps.event.addListener(map, 'click', addLatLng);
                google.maps.event.addListener(map, 'zoom_changed', mapzoom);
                //cursorposition(map);
            });
        }
    }


    this.loadmap = function (url) {
        geocoder = new google.maps.Geocoder();
        //var myLatlng = new google.maps.LatLng(-7,-38);
        var myLatlng =googleMapString;
        var myOptions = {
            zoom: 10,
            center: myLatlng,
            draggableCursor: 'default',
            draggingCursor: 'pointer',
            disableDoubleClickZoom: true,
            scrollwheel: false,
            scaleControl: true,
            mapTypeControl: true,
            // mapTypeControlOptions: {mapTypeIds: mapTypeIds},
            mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles: [{featureType: 'poi', stylers: [{visibility: 'off'}]}],
            streetViewControl: false
        };
        //map = new google.maps.Map(gob('map_canvas'),myOptions);
        map = new google.maps.Map(document.getElementById("map"), myOptions);
        /*
        var myOptions = {
            zoom: 10,
            center: myLatlng,
            mapTypeControl: true,
            mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
            navigationControl: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById("map"), myOptions);
        */
        tmpPolyLine.setMap(map);
        addOverlayFromKML(myLatlng,url);
        document.getElementById("coords").value = presentationguide;
        google.maps.event.addListener(map, 'mousemove', function (point) {
            var LnglatStr6 = point.latLng.lng().toFixed(6) + ', ' + point.latLng.lat().toFixed(6);
            var latLngStr6 = point.latLng.lat().toFixed(6) + ', ' + point.latLng.lng().toFixed(6);
            gob('over').options[0].text = LnglatStr6;
            gob('over').options[1].text = latLngStr6;
        });
        google.maps.event.addListener(map, 'zoom_changed', mapzoom);

        polyPoints = new google.maps.MVCArray(); // collects coordinates
        tmpPolyLine.setMap(map);

        createplacemarkobject();
        createlinestyleobject();
        createpolygonstyleobject();
        createcirclestyleobject();
        createmarkerstyleobject();
        preparePolyline(); // create a Polyline object

        google.maps.event.addListener(map, 'click', addLatLng);
        google.maps.event.addListener(map, 'zoom_changed', mapzoom);
        cursorposition(map);
    }

    // Called by initmap, addLatLng, drawRectangle, drawCircle, drawpolywithhole
    function cursorposition(mapregion) {
        google.maps.event.addListener(mapregion, 'mousemove', function (point) {
            var LnglatStr6 = point.latLng.lng().toFixed(6) + ', ' + point.latLng.lat().toFixed(6);
            var latLngStr6 = point.latLng.lat().toFixed(6) + ', ' + point.latLng.lng().toFixed(6);
            gob('over').options[0].text = LnglatStr6;
            gob('over').options[1].text = latLngStr6;
        });
    }

    function updateCopyrights() {
        if (map.getMapTypeId() == "OSM") {
            copyrightNode.innerHTML = "OSM map data @<a target=\"_blank\" href=\"http://www.openstreetmap.org/\"> OpenStreetMap</a>-contributors,<a target=\"_blank\" href=\"http://creativecommons.org/licenses/by-sa/2.0/legalcode\"> CC BY-SA</a>";
        } else {
            copyrightNode.innerHTML = "";
        }
    }

    function addLatLng(point) {
        // In v2 I can give a shape an ID and have that ID revealed, with the map listener, when the shape is clicked on
        // I can't do that in v3. Instead I put a listener on the shape in addpolyShapelistener
        if (tinyMarker) tinyMarker.setMap(null);
        if (directionsYes == 1) {
            drawDirections(point.latLng);
            return;
        }
        if (plmcur != placemarks.length - 1) {
            nextshape();

        }

        // Rectangle and circle can't collect points with getPath. solved by letting Polyline collect the points and then erase Polyline
        polyPoints = polyShape.getPath();
        // This codeline does the drawing on the map
        polyPoints.insertAt(polyPoints.length, point.latLng); // or: polyPoints.push(point.latLng)
        if (polyPoints.length == 1) {
            startpoint = point.latLng;
            placemarks[plmcur].point = startpoint; // stored because it's to be used when the shape is clicked on as a stored shape
            setstartMarker(startpoint);
            if (toolID == 5) {
                drawMarkers(startpoint);
            }
        }
        if (polyPoints.length == 2 && toolID == 3) createrectangle(point);
        if (polyPoints.length == 2 && toolID == 4) createcircle(point);
        if (polyPoints.length == 2 && toolID == 7) createcircle(point);
        if (polyPoints.length == 2 && toolID == 8) createcircle(point);
        if (toolID == 1 || toolID == 2) { // if polyline or polygon
            var stringtobesaved = point.latLng.lat().toFixed(6) + ',' + point.latLng.lng().toFixed(6);
            var kmlstringtobesaved = point.latLng.lng().toFixed(6) + ',' + point.latLng.lat().toFixed(6);
            //Cursor position, when inside polyShape, is registered with this listener
            cursorposition(polyShape);
            if (adder == 0) { //shape with no hole
                pointsArray.push(stringtobesaved); // collect textstring for presentation in textarea
                pointsArrayKml.push(kmlstringtobesaved); // collect textstring for presentation in textarea
                if (polyPoints.length == 1 && toolID == 2) closethis('polygonstuff');
                if (codeID == 1 && toolID == 1) logCode1(); // write kml for polyline
                if (codeID == 1 && toolID == 2) logCode2(); // write kml for polygon
                if (codeID == 2) logCode4(); // write Google javascript
            }
            if (adder == 1) { // adder is increased in function holecreator
                outerArray.push(stringtobesaved);
                outerArrayKml.push(kmlstringtobesaved);
            }
            if (adder == 2) {
                innerArray.push(stringtobesaved);
                innerArrayKml.push(kmlstringtobesaved);
            }
        }
    }

    function setstartMarker(point) {
        startMarker = new google.maps.Marker({
            position: point,
            map: map
        });
        startMarker.setTitle("#" + polyPoints.length);
    }

    function createrectangle(point) {
        // startMarker is southwest point. now set northeast
        nemarker = new google.maps.Marker({
            position: point.latLng,
            draggable: true,
            raiseOnDrag: false,
            title: "Draggable",
            map: map
        });
        google.maps.event.addListener(startMarker, 'dragend', drawRectangle);
        google.maps.event.addListener(nemarker, 'dragend', drawRectangle);
        startMarker.setDraggable(true);
        //startMarker.setAnimation(null);
        startMarker.setTitle("Draggable");
        startMarker.setOptions({raiseOnDrag: false});
        polyShape.setMap(null); // remove the Polyline that has collected the points
        polyPoints = [];
        drawRectangle();
    }

    function drawRectangle() {
        gob('editButton').disabled = 'disabled';
        southWest = startMarker.getPosition(); // used in logCode6()
        northEast = nemarker.getPosition(); // used in logCode6()
        var latLngBounds = new google.maps.LatLngBounds(
            southWest,
            northEast
        );
        rectangle.setBounds(latLngBounds);
        //Cursor position, when inside rectangle, is registered with this listener
        cursorposition(rectangle);
        // the Rectangle was created in activateRectangle(), called from newstart(), which may have been called from setTool()
        var northWest = new google.maps.LatLng(southWest.lat(), northEast.lng());
        var southEast = new google.maps.LatLng(northEast.lat(), southWest.lng());
        polyPoints = [];
        pointsArray = [];
        pointsArrayKml = [];
        /*polyPoints.push(southWest);
         polyPoints.push(northWest);
         polyPoints.push(northEast);
         polyPoints.push(southEast);*/
        var stringtobesaved = southWest.lng().toFixed(6) + ',' + southWest.lat().toFixed(6);
        pointsArrayKml.push(stringtobesaved);
        stringtobesaved = southWest.lng().toFixed(6) + ',' + northEast.lat().toFixed(6);
        pointsArrayKml.push(stringtobesaved);
        stringtobesaved = northEast.lng().toFixed(6) + ',' + northEast.lat().toFixed(6);
        pointsArrayKml.push(stringtobesaved);
        stringtobesaved = northEast.lng().toFixed(6) + ',' + southWest.lat().toFixed(6);
        pointsArrayKml.push(stringtobesaved);
        stringtobesaved = southWest.lat().toFixed(6) + ',' + southWest.lng().toFixed(6);
        pointsArray.push(stringtobesaved);
        stringtobesaved = northEast.lat().toFixed(6) + ',' + southWest.lng().toFixed(6);
        pointsArray.push(stringtobesaved);
        stringtobesaved = northEast.lat().toFixed(6) + ',' + northEast.lng().toFixed(6);
        pointsArray.push(stringtobesaved);
        stringtobesaved = southWest.lat().toFixed(6) + ',' + northEast.lng().toFixed(6);
        pointsArray.push(stringtobesaved);
        southWest = northEast = null;
        if (codeID == 2) logCode6();
        if (codeID == 1) logCode2();
    }

    function createcircle(point) {
        // startMarker is center point. now set radius
        nemarker = new google.maps.Marker({
            position: point.latLng,
            draggable: true,
            raiseOnDrag: false,
            title: "Draggable",
            map: map
        });
        google.maps.event.addListener(startMarker, 'drag', drawCircle);
        google.maps.event.addListener(nemarker, 'drag', drawCircle);
        startMarker.setDraggable(true);
        startMarker.setAnimation(null);
        startMarker.setTitle("Draggable");
        //drawCircle();
        //polyShape.setMap(null); // remove the Polyline that has collected the points
        //polyPoints = [];
        if (toolID == 4) {
            drawCircle();
        } else {
            drawCircleExtra();
        }
    }

    function drawCircleExtra() {
        polyShape.setMap(null);
        polyPoints = [];
        centerPoint = startMarker.getPosition();
        radiusPoint = nemarker.getPosition();
        radius = google.maps.geometry.spherical.computeDistanceBetween(centerPoint, radiusPoint) / 1609;
        var d = radius / 3963.189;
        // radians
        var lat1 = (Math.PI / 180) * centerPoint.lat();
        var lng1 = (Math.PI / 180) * centerPoint.lng();
        for (var a = 0; a < 360 + 1; a += 10) {
            var tc = (Math.PI / 180) * a;
            var y = Math.asin(Math.sin(lat1) * Math.cos(d) + Math.cos(lat1) * Math.sin(d) * Math.cos(tc));
            var dlng = Math.atan2(Math.sin(tc) * Math.sin(d) * Math.cos(lat1), Math.cos(d) - Math.sin(lat1) * Math.sin(y));
            var x = ((lng1 - dlng + Math.PI) % (2 * Math.PI)) - Math.PI;
            // MOD function
            var point = new google.maps.LatLng(parseFloat(y * (180 / Math.PI), 10), parseFloat(x * (180 / Math.PI), 10));
            polyPoints.push(point);
            var stringtobesaved = point.lat().toFixed(6) + ',' + point.lng().toFixed(6);
            pointsArray.push(stringtobesaved);
            var kmlstringtobesaved = point.lng().toFixed(6) + ',' + point.lat().toFixed(6);
            pointsArrayKml.push(kmlstringtobesaved);
        }
        if (toolID == 7) preparePolyline();
        if (toolID == 8) preparePolygon();
        polyShape.setPath(polyPoints);
        //Cursor position, when inside circle, is registered with this listener
        cursorposition(polyShape);
        pointsArray.pop();
        pointsArrayKml.pop();
        if (toolID == 7) logCode1();
        if (toolID == 8) logCode2();
    }

    function drawCircle() {
        polyShape.setMap(null); // remove the Polyline that has collected the points
        polyPoints = [];
        centerPoint = startMarker.getPosition();
        radiusPoint = nemarker.getPosition();
        circle.bindTo('center', startMarker, 'position');
        calc = distance(centerPoint.lat(), centerPoint.lng(), radiusPoint.lat(), radiusPoint.lng());
        circle.setRadius(calc);
        //Cursor position, when inside circle, is registered with this listener
        cursorposition(circle);
        codeID = gob('codechoice').value = 2;
        logCode7();
    }

    // calculate distance between two coordinates
    function distance(lat1, lon1, lat2, lon2) {
        var R = 6371000; // earth's radius in meters
        var dLat = (lat2 - lat1) * Math.PI / 180;
        var dLon = (lon2 - lon1) * Math.PI / 180;
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d;
    }

    function drawMarkers(point) {
        if (startMarker) startMarker.setMap(null);
        if (polyShape) polyShape.setMap(null);
        var id = plmcur;
        placemarks[plmcur].jscode = point.lat().toFixed(6) + ',' + point.lng().toFixed(6);
        placemarks[plmcur].kmlcode = point.lng().toFixed(6) + ',' + point.lat().toFixed(6);
        activateMarker();
        markerShape.setPosition(point);
        var marker = markerShape;
        tinyMarker = new google.maps.Marker({
            position: placemarks[plmcur].point,
            map: map,
            icon: tinyIcon
        });
        google.maps.event.addListener(marker, 'click', function (event) {
            plmcur = id;
            markerShape = marker;
            var html = "<b>" + placemarks[plmcur].name + "</b> <br/>" + placemarks[plmcur].desc;
            infowindow.setContent(html);
            if (tinyMarker) tinyMarker.setMap(null);
            tinyMarker = new google.maps.Marker({
                position: placemarks[plmcur].point,
                map: map,
                icon: tinyIcon
            });
            if (toolID != 5) toolID = gob('toolchoice').value = 5;
            if (codeID == 1) logCode9();
            if (codeID == 2) logCode8();
            infowindow.open(map, marker);
        });
        drawnShapes.push(markerShape);
        if (codeID == 2) logCode8();
        if (codeID == 1) logCode9();
    }

    function drawDirections(point) {
        if (firstdirclick > 2) {
            //if(oldpoint) waypts.push({location:oldpoint, stopover:true});
            var request = {
                origin: dirpointstart,
                destination: point,
                waypoints: waypts,
                travelMode: google.maps.DirectionsTravelMode.DRIVING
            };
            //oldpoint = point;
            waypts.push({location: point, stopover: true});
            destinations.push(request.destination);
            calcRoute(request);
        }
        if (firstdirclick == 2) {
            request = {
                origin: dirpointstart,
                destination: point,
                travelMode: google.maps.DirectionsTravelMode.DRIVING
            };
            //oldpoint = point;
            waypts.push({location: point, stopover: true});
            destinations.push(request.destination);
            calcRoute(request);
        }
        if (dirpointstart == null) {
            dirpointstart = point;
            firstdirclick = 1;
            //increaseplmcur(); // not necessary?
            dirline = plmcur;
            placemarks[dirline].shape = polyShape; // created in preparePolyline(), initiated in newstart() called from setTool()
            placemarks[dirline].point = dirpointstart;
            directionsDisplay = new google.maps.DirectionsRenderer({
                suppressMarkers: true,
                preserveViewport: true
            });
            request = {
                origin: dirpointstart,
                destination: point,
                travelMode: google.maps.DirectionsTravelMode.DRIVING
            };
            //destinations.push(request.destination);
            calcRoute(request);

            //dirpointend = 1;
            dircountstart = dirline + 1;
        }
    }

    //}
    function calcRoute(request) {
        directionsDisplay.setOptions({
            polylineOptions: {
                strokeColor: polylinestyles[lcur].color,
                strokeOpacity: polylinestyles[lcur].lineopac,
                strokeWeight: polylinestyles[lcur].width
            }
        });
        if (firstdirclick == 1) directionsDisplay.setMap(map);
        firstdirclick++;
        directionsService.route(request, RenderCustomDirections);
    }

    function RenderCustomDirections(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            //var m = step + 1;
            //if(removedirectionleg == 1) m = m - 1;
            directionsDisplay.setDirections(response);
            var result = directionsDisplay.getDirections().routes[0];
            var legs = response.routes[0].legs;
            polyPoints = [];
            pointsArray = [];
            pointsArrayKml = [];
            /*if(firstdirclick > 2) {
             result.overview_path.shift();
             }*/
            for (var i = 0; i < result.overview_path.length; i++) {
                polyPoints.push(result.overview_path[i]);
                pointsArray.push(result.overview_path[i].lat().toFixed(6) + ',' + result.overview_path[i].lng().toFixed(6));
                pointsArrayKml.push(result.overview_path[i].lng().toFixed(6) + ',' + result.overview_path[i].lat().toFixed(6));
            }
            polyShape.setPath(polyPoints);
            endLocation = new Object();
            if (step == 0) {
                createdirMarker(legs[step].start_location, legs[step].start_address);
                markersArray.push(legs[step].start_location.lat().toFixed(6) + ',' + legs[step].start_location.lng().toFixed(6));
                markersArrayKml.push(legs[step].start_location.lng().toFixed(6) + ',' + legs[step].start_location.lat().toFixed(6));
                addresssArray.push(legs[step].start_address);
                //placemarks[plmcur].name = "Marker "+dirmarknum;
            }
            if (step > 0 && removedirectionleg == 0) {
                endLocation.latlng = legs[step - 1].end_location;
                endLocation.address = legs[step - 1].end_address;
                createdirMarker(endLocation.latlng, endLocation.address);
                markersArray.push(endLocation.latlng.lat().toFixed(6) + ',' + endLocation.latlng.lng().toFixed(6));
                markersArrayKml.push(endLocation.latlng.lng().toFixed(6) + ',' + endLocation.latlng.lat().toFixed(6));
                addresssArray.push(endLocation.address);
                //placemarks[plmcur].name = "Marker "+dirmarknum;
            }
            removedirectionleg = 0;
            //logCode1a();
            //dirmarknum++;
            step++;
            //placemarks[plmcur].desc = addresssArray[addresssArray.length-1];
            docudetails();
            //showthis('toppers');
        } else alert(status);
    }

    function createdirMarker(latlng, html) {
        if (tinyMarker) tinyMarker.setMap(null);
        createplacemarkobject();
        plmcur++; // plmcur = placemarks.length -1;
        activateMarker();
        placemarks[plmcur].name = "Marker " + dirmarknum;
        markerShape.setTitle(placemarks[plmcur].name + "\n" + html);
        markerShape.setPosition(latlng);
        placemarks[plmcur].jscode = latlng.lat().toFixed(6) + ',' + latlng.lng().toFixed(6);
        placemarks[plmcur].kmlcode = latlng.lng().toFixed(6) + ',' + latlng.lat().toFixed(6);
        placemarks[plmcur].desc = html;
        placemarks[plmcur].point = latlng;
        placemarks[plmcur].style = markerstyles[mcur].name;
        placemarks[plmcur].stylecur = mcur;
        placemarks[plmcur].shape = markerShape;
        drawnShapes.push(markerShape);
        dirmarknum++;
        var marker = markerShape;
        var thisshape = plmcur;
        google.maps.event.addListener(marker, 'click', function (event) {
            markerShape = marker;
            plmcur = thisshape;
            //var htm = "<b>" + placemarks[thisshape].name + "</b> <br/>" + placemarks[thisshape].desc;
            if (polyPoints == 0) {
                //infowindow.setContent(htm);
                if (tinyMarker) tinyMarker.setMap(null);
                tinyMarker = new google.maps.Marker({
                    position: placemarks[plmcur].point,
                    map: map,
                    icon: tinyIcon
                });
                if (toolID != 5) {
                    toolID = gob('toolchoice').value = 5;
                    directionsYes = 0;
                }
                if (codeID == 1) logCode9();
                if (codeID == 2) logCode8();
                //infowindow.open(map,marker);
            }
        });
        drawnShapes.push(markerShape);
    }

    // Called from deleteLastPoint() initiated by click on button
    function undo() {
        if (drawnShapes.length > 1) {
            drawnShapes[drawnShapes.length - 1].setMap(null);
            destinations.pop();
            var point = destinations[destinations.length - 1];
            waypts.pop();
            var request = {
                origin: dirpointstart,
                destination: point,
                waypoints: waypts,
                travelMode: google.maps.DirectionsTravelMode.DRIVING
            };
            placemarks.pop();
            markersArray.pop();
            markersArrayKml.pop();
            addresssArray.pop();
            firstdirclick = firstdirclick - 1;
            step = step - 1;
            dirmarknum = dirmarknum - 1;
            plmcur = plmcur - 1;
            removedirectionleg = 1;
            calcRoute(request);
        }
    }

    // Not used
    function setDirectionsMarker(point) {
        var image = new google.maps.MarkerImage(imgNormal);


        var marker = new google.maps.Marker({
            position: point,
            map: map,
            icon: image
        });
        /*var shadow = new google.maps.MarkerImage('http://maps.google.com/intl/en_us/mapfiles/ms/micons/msmarker.shadow.png',
         new google.maps.Size(37,32),
         new google.maps.Point(16,0),
         new google.maps.Point(0,32));
         var title = "#" + markers.length;
         var id = plmcur;
         placemarks[plmcur].point = point;
         placemarks[plmcur].coord = point.lng().toFixed(6) + ', ' + point.lat().toFixed(6);*/
        /*var marker = new google.maps.Marker({
         position: point,
         map: map,
         draggable: true,
         icon: image,
         shadow: shadow});*/
        //marker.setTitle(title);
        //markers.push(marker);
    }
    this.setToolID=function(f) {
        toolID=f
    }
    this.setTool=function (tid) {

        if (tid!=undefined) {
            toolID=tid;
        }
        if (polyPoints.length == 0 && kmlcode == "" && javacode == "") {
            newstart();
        } else {
            if (toolID == 1) { // polyline
                // change to polyline draw mode not allowed
                /*if(outerArray.length > 0) { //indicates polygon with hole
                 toolID = 2;
                 nextshape();
                 toolID = 1;
                 newstart();
                 return;
                 }
                 if(rectangle) {
                 toolID = 3;
                 nextshape();
                 toolID = 1;
                 newstart();
                 return;
                 }
                 if(circle) {
                 toolID = 4;
                 nextshape();
                 toolID = 1;
                 newstart();
                 return;
                 }
                 if(markerShape) {
                 toolID = 5;
                 nextshape();
                 toolID = 1;
                 newstart();
                 return;
                 }
                 if(directionsYes == 1) {
                 toolID = 6;
                 nextshape();
                 directionsYes = 0;
                 toolID = 1;
                 newstart();
                 return;
                 }*/
                placemarks[plmcur].style = polylinestyles[polylinestyles.length - 1].name;
                placemarks[plmcur].stylecur = polylinestyles.length - 1;
                if (polyShape) polyShape.setMap(null);
                preparePolyline(); //if a polygon exists, it will be redrawn as polylines
                if (codeID == 1) logCode1(); // KML
                if (codeID == 2) logCode4(); // Javascipt
            }
            if (toolID == 2) { // polygon
                /*if(rectangle) {
                 toolID = 3;
                 nextshape();
                 toolID = 2;
                 newstart();
                 return;
                 }
                 if(circle) {
                 toolID = 4;
                 nextshape();
                 toolID = 2;
                 newstart();
                 return;
                 }
                 if(markerShape) {
                 toolID = 5;
                 nextshape();
                 toolID = 2;
                 newstart();
                 return;
                 }
                 if(directionsYes == 1) {
                 toolID = 6;
                 nextshape();
                 directionsYes = 0;
                 toolID = 2;
                 newstart();
                 return;
                 }*/
                placemarks[plmcur].style = polygonstyles[polygonstyles.length - 1].name;
                placemarks[plmcur].stylecur = polygonstyles.length - 1;
                if (polyShape) polyShape.setMap(null);
                preparePolygon(); //if a polyline exists, it will be redrawn as a polygon
                if (codeID == 1) logCode2(); // KML
                if (codeID == 2) logCode4(); // Javascript
            }
            if (toolID == 3 || toolID == 4 || toolID == 5 || toolID == 6 || toolID == 7 || toolID == 8) {
                if (polyShape) polyShape.setMap(null);
                if (circle) circle.setMap(null);
                if (rectangle) rectangle.setMap(null);
                directionsYes = 0;
                newstart();
            }
        }
    }

    function setCode(id) {
        if (id !=undefined) {
            codeID=id
        }
        if (toolID == 4) { // circle
            codeID = gob('codechoice').value = 2; // javascript
            return;
        }
        if (toolID == 6) { // directions
            codeID = gob('codechoice').value = 1; // KML
            return;
        }
        if (polyPoints.length !== 0 || kmlcode !== "" || javacode !== "") {
            if (codeID == 1 && toolID == 1) logCode1();
            if (codeID == 1 && toolID == 2 && outerArray.length == 0) logCode2();
            if (codeID == 1 && toolID == 2 && outerArray.length > 0) logCode3();
            if (codeID == 2 && toolID == 1) logCode4(); // write Google javascript
            if (codeID == 2 && toolID == 2 && outerArray.length == 0) logCode4();
            if (codeID == 2 && toolID == 2 && outerArray.length > 0) logCode5();
            if (toolID == 3) { // rectangle
                if (codeID == 1) logCode2();
                if (codeID == 2) logCode6();
            }
            if (toolID == 5) { // marker
                if (codeID == 1) logCode9();
                if (codeID == 2) logCode8();
            }
        }
    }
    this.setCode=function (id) {
        if (id !=undefined) {
            codeID=id
        }
        if (toolID == 4) { // circle
            codeID = gob('codechoice').value = 2; // javascript
            return;
        }
        if (toolID == 6) { // directions
            codeID = gob('codechoice').value = 1; // KML
            return;
        }
        if (polyPoints.length !== 0 || kmlcode !== "" || javacode !== "") {
            if (codeID == 1 && toolID == 1) logCode1();
            if (codeID == 1 && toolID == 2 && outerArray.length == 0) logCode2();
            if (codeID == 1 && toolID == 2 && outerArray.length > 0) logCode3();
            if (codeID == 2 && toolID == 1) logCode4(); // write Google javascript
            if (codeID == 2 && toolID == 2 && outerArray.length == 0) logCode4();
            if (codeID == 2 && toolID == 2 && outerArray.length > 0) logCode5();
            if (toolID == 3) { // rectangle
                if (codeID == 1) logCode2();
                if (codeID == 2) logCode6();
            }
            if (toolID == 5) { // marker
                if (codeID == 1) logCode9();
                if (codeID == 2) logCode8();
            }
        }
    }

    function increaseplmcur() {
        if (placemarks[plmcur].plmtext != "") {
            if (toolID == 1 || toolID == 2 || toolID == 7 || toolID == 8 && directionsYes == 0) {
                placemarks[plmcur].shape = polyShape;
                addpolyShapelistener();
                createplacemarkobject();
                plmcur = placemarks.length - 1;
            }
            if (markerShape && directionsYes == 0) {
                placemarks[plmcur].shape = markerShape;
                createplacemarkobject();
                plmcur = placemarks.length - 1;
            }
            if (toolID == 3 && directionsYes == 0) {
                placemarks[plmcur].shape = rectangle;
                addpolyShapelistener();
                createplacemarkobject();
                plmcur = placemarks.length - 1;
            }
            //Set a listener on the directions line (path)
            if (directionsYes == 1) {
                placemarks[plmcur].shape = polyShape;
                plmcur = dirline;
                addpolyShapelistener();
                createplacemarkobject();
                plmcur = placemarks.length - 1;
            }
        }
    }

    function nextshape() {
        gob('editButton').disabled = '';
        if (editing == true) stopediting();
        //If a saved shape has been inspected, set a new listener on it
        if (plmcur < placemarks.length - 1) {
            addpolyShapelistener();
            plmcur = placemarks.length - 1;
        }
        //Set listener on current shape. Create new placemark object.
        //Increase counter for placemark
        increaseplmcur();
        if (polyShape) drawnShapes.push(polyShape); // used in clearMap, to have it removed from the map, drawnShapes[i].setMap(null)
        if (outerShape) drawnShapes.push(outerShape);
        if (circle) drawnShapes.push(circle);
        if (rectangle) drawnShapes.push(rectangle);
        if (tinyMarker) drawnShapes.push(tinyMarker);
        // markerShape has been pushed in drawMarkers and createdirMarker
        polyShape = null;
        outerShape = null;
        rectangle = null;
        circle = null;
        markerShape = null;
        newstart();
    }
    //Saving of data for current shape on the map will be completed and a listener set on it
    //Then all variables will be nulled in newstart
    this.nextshape=function () {
        gob('editButton').disabled = '';
        if (editing == true) stopediting();
        //If a saved shape has been inspected, set a new listener on it
        if (plmcur < placemarks.length - 1) {
            addpolyShapelistener();
            plmcur = placemarks.length - 1;
        }
        //Set listener on current shape. Create new placemark object.
        //Increase counter for placemark
        increaseplmcur();
        if (polyShape) drawnShapes.push(polyShape); // used in clearMap, to have it removed from the map, drawnShapes[i].setMap(null)
        if (outerShape) drawnShapes.push(outerShape);
        if (circle) drawnShapes.push(circle);
        if (rectangle) drawnShapes.push(rectangle);
        if (tinyMarker) drawnShapes.push(tinyMarker);
        // markerShape has been pushed in drawMarkers and createdirMarker
        polyShape = null;
        outerShape = null;
        rectangle = null;
        circle = null;
        markerShape = null;
        newstart();
    }

    function addpolyShapelistener() {
        var thisshape = plmcur;
        // In v2 I can give a shape an ID and have that ID revealed, with the map listener, when the shape is clicked on
        // I can't do that in v3. Instead I put a listener on the shape
        if (toolID == 1 || toolID == 2 || toolID == 7 || toolID == 8) {
            google.maps.event.addListener(polyShape, 'click', function (point) {
                if (tinyMarker) tinyMarker.setMap(null);
                if (startMarker) startMarker.setMap(null);
                directionsYes = 0;
                polyShape = placemarks[thisshape].shape;
                plmcur = thisshape;
                polyPoints = polyShape.getPath();
                if (placemarks[plmcur].poly == "pl") {
                    pointsArray = placemarks[plmcur].jscode;
                    pointsArrayKml = placemarks[plmcur].kmlcode;
                    toolID = gob('toolchoice').value = 1;
                    lcur = placemarks[plmcur].stylecur;
                    if (codeID == 1) logCode1();
                    if (codeID == 2) logCode4(); // write Google javascript
                }
                if (placemarks[plmcur].poly == "pg") {
                    pointsArray = placemarks[plmcur].jscode;
                    pointsArrayKml = placemarks[plmcur].kmlcode;
                    toolID = gob('toolchoice').value = 2;
                    pcur = placemarks[plmcur].stylecur;
                    if (codeID == 1) logCode2();
                    if (codeID == 2) logCode4(); // write Google javascript
                }
                if (placemarks[plmcur].poly == "pgh") {
                    outerArrayKml = placemarks[plmcur].kmlcode;
                    innerArraysKml = placemarks[plmcur].kmlholecode;
                    /*var polly = polyShape.getPaths();
                     polyPoints = polly.getAt(0);
                     var points = polly.getAt(0);
                     //alert(point.lng().toFixed(6));
                     for(var i = 0; i<points.length-1; i++) {
                     outerArray.push(points.getAt(i).lat().toFixed(6) + ',' + points.getAt(i).lng().toFixed(6));
                     outerArrayKml.push(points.getAt(i).lng().toFixed(6) + ',' + points.getAt(i).lat().toFixed(6));
                     }
                     for(i = 1; i<polly.length; i++) {
                     points = polly.getAt(i);
                     if(i == polly.length-1) {
                     for(var j = 0; j<points.length; j++) {
                     innerArray.push(points.getAt(j).lat().toFixed(6) + ',' + points.getAt(j).lng().toFixed(6));
                     innerArrayKml.push(points.getAt(j).lng().toFixed(6) + ',' + points.getAt(j).lat().toFixed(6));
                     }
                     }else{
                     for(var j = 0; j<points.length-1; j++) {
                     innerArray.push(points.getAt(j).lat().toFixed(6) + ',' + points.getAt(j).lng().toFixed(6));
                     innerArrayKml.push(points.getAt(j).lng().toFixed(6) + ',' + points.getAt(j).lat().toFixed(6));
                     }
                     }
                     innerArrays.push(innerArray);
                     innerArraysKml.push(innerArrayKml);
                     innerArray = [];
                     innerArrayKml = [];
                     }*/
                    toolID = gob('toolchoice').value = 2;
                    pcur = placemarks[plmcur].stylecur;
                    if (codeID == 1) logCode3();
                    if (codeID == 2) logCode5(); // write Google javascript
                }
                tinyMarker = new google.maps.Marker({
                    position: placemarks[plmcur].point,
                    map: map,
                    icon: tinyIcon
                });
                closethis('polygonstuff');
            });
        }
        if (toolID == 3) {
            google.maps.event.addListener(rectangle, 'click', function (point) {
                gob('editButton').disabled = 'disabled';
                if (tinyMarker) tinyMarker.setMap(null);
                if (startMarker) startMarker.setMap(null);
                if (nemarker) nemarker.setMap(null);
                directionsYes = 0;
                rectangle = placemarks[thisshape].shape;
                plmcur = thisshape;
                pointsArray = placemarks[plmcur].jscode;
                pointsArrayKml = placemarks[plmcur].kmlcode;
                toolID = gob('toolchoice').value = 3;
                pcur = placemarks[plmcur].stylecur;
                var latlongs = rectangle.getBounds();
                var southwest = latlongs.getSouthWest();
                var northeast = latlongs.getNorthEast();
                startMarker = new google.maps.Marker({
                    position: southwest,
                    draggable: true,
                    raiseOnDrag: false,
                    title: "Draggable",
                    map: map
                });
                nemarker = new google.maps.Marker({
                    position: northeast,
                    draggable: true,
                    raiseOnDrag: false,
                    title: "Draggable",
                    map: map
                });
                google.maps.event.addListener(startMarker, 'dragend', drawRectangle);
                google.maps.event.addListener(nemarker, 'dragend', drawRectangle);
                if (codeID == 1) logCode2();
                if (codeID == 2) logCode6(); // write Google javascript
                closethis('polygonstuff');
            });
        }
    }

    // Clear current Map
    this.clearMap=function () {
        $('#communityName,#oldName').val('');
        if (editing == true) stopediting();
        if (polyShape) polyShape.setMap(null); // polyline or polygon
        if (outerShape) outerShape.setMap(null);
        if (rectangle) rectangle.setMap(null);
        if (circle) circle.setMap(null);
        if (drawnShapes.length > 0) {
            for (var i = 0; i < drawnShapes.length; i++) {
                drawnShapes[i].setMap(null);
            }
        }
        polyShape = null;
        outerShape = null;
        rectangle = null;
        circle = null;
        markerShape = null;
        plmcur = 0;
        dirmarknum = 1;
        newstart();
        placemarks = [];
        createplacemarkobject();
    }

    function newstart() {
        polyPoints = [];
        outerPoints = [];
        pointsArray = [];
        markersArray = [];
        pointsArrayKml = [];
        markersArrayKml = [];
        addresssArray = [];
        outerArray = [];
        innerArray = [];
        outerArrayKml = [];
        innerArrayKml = [];
        holePolyArray = [];
        innerArrays = [];
        innerArraysKml = [];
        waypts = [];
        destinations = [];
        adder = 0;
        dirpointstart = null;
        dirline = null;
        firstdirclick = 0;
        //dirmarknum = 1;
        step = 0;
        if (directionsYes == 1 && toolID != 6) directionsYes = 0;
        closethis('polylineoptions');
        closethis('polygonoptions');
        closethis('circleoptions');
        if (toolID != 2) closethis('polygonstuff');
        if (directionsDisplay) directionsDisplay.setMap(null);
        if (startMarker) startMarker.setMap(null);
        if (nemarker) nemarker.setMap(null);
        if (tinyMarker) tinyMarker.setMap(null);
        if (toolID == 1) {
            placemarks[plmcur].style = polylinestyles[polylinestyles.length - 1].name;
            placemarks[plmcur].stylecur = polylinestyles.length - 1;
            preparePolyline();
            polylineintroduction();
        }
        if (toolID == 2) {
            showthis('polygonstuff');
            gob('stepdiv').innerHTML = "Step 0";
            placemarks[plmcur].style = polygonstyles[polygonstyles.length - 1].name;
            placemarks[plmcur].stylecur = polygonstyles.length - 1;
            preparePolygon();
            polygonintroduction();
        }
        if (toolID == 3) {
            placemarks[plmcur].style = polygonstyles[polygonstyles.length - 1].name;
            placemarks[plmcur].stylecur = polygonstyles.length - 1;
            preparePolyline(); // use Polyline to collect clicked point
            activateRectangle();
            rectangleintroduction();
        }
        if (toolID == 4) {
            placemarks[plmcur].style = circlestyles[circlestyles.length - 1].name;
            placemarks[plmcur].stylecur = circlestyles.length - 1;
            preparePolyline(); // use Polyline to collect clicked point
            activateCircle();
            circleintroduction();
            codeID = gob('codechoice').value = 2; // javascript, no KML for circle
        }
        if (toolID == 5) {
            placemarks[plmcur].style = markerstyles[markerstyles.length - 1].name;
            placemarks[plmcur].stylecur = markerstyles.length - 1;
            preparePolyline();
            markerintroduction();
        }
        if (toolID == 6) {
            directionsYes = 1;
            /*if(dirline != null) {
             placemarks[plmcur].style = placemarks[dirline].style;
             placemarks[plmcur].stylecur = placemarks[dirline].stylecur;
             }else{*/
            placemarks[plmcur].style = polylinestyles[polylinestyles.length - 1].name;
            placemarks[plmcur].stylecur = polylinestyles.length - 1;
            //}
            preparePolyline();
            directionsintroduction();
            codeID = gob('codechoice').value = 1;
        }
        if (toolID == 7) {
            placemarks[plmcur].style = polylinestyles[polylinestyles.length - 1].name;
            placemarks[plmcur].stylecur = polylinestyles.length - 1;
            preparePolyline();
            circleintroduction();
        }
        if (toolID == 8) {
            placemarks[plmcur].style = polygonstyles[polygonstyles.length - 1].name;
            placemarks[plmcur].stylecur = polygonstyles.length - 1;
            preparePolygon();
            circleintroduction();
        }
        kmlcode = "";
        javacode = "";
    }

    this.deleteLastPoint=function () {
        if (polyPoints.length < 2) return;
        if (directionsYes == 1) {
            if (destinations.length == 1) return;
            undo();
            return;
        }
        if (toolID == 1) {
            if (polyShape) {
                polyPoints = polyShape.getPath();
                if (polyPoints.length > 0) {
                    polyPoints.removeAt(polyPoints.length - 1);
                    pointsArrayKml.pop();
                    pointsArray.pop();
                    if (codeID == 1) logCode1();
                    if (codeID == 2) logCode4();
                }
            }
        }
        if (toolID == 2) {
            if (innerArrayKml.length > 0) {
                innerArrayKml.pop();
                innerArray.pop();
                polyPoints.removeAt(polyPoints.length - 1);
            }
            if (outerArrayKml.length > 0 && innerArrayKml.length == 0) {
                outerArrayKml.pop();
                outerArray.pop();
                //polyPoints.removeAt(polyPoints.length-1);
            }
            if (outerPoints.length === 0) {
                if (polyShape) {
                    polyPoints = polyShape.getPath();
                    if (polyPoints.length > 0) {
                        polyPoints.removeAt(polyPoints.length - 1);
                        pointsArrayKml.pop();
                        pointsArray.pop();
                        if (adder == 0) {
                            if (codeID == 1) logCode2();
                            if (codeID == 2) logCode4();
                        }
                    }
                }
            }
        }
        if (polyPoints.length === 0) nextshape();
    }

    function counter(num) {
        return adder = adder + num;
    }

    function holecreator() {
        var holestep = counter(1); // adder is increased here
        if (holestep == 1) {
            if (gob('stepdiv').innerHTML == "Finished") {
                adder = 0;
                return;
            } else {
                if (startMarker) startMarker.setMap(null);
                if (polyShape) polyShape.setMap(null);
                polyPoints = [];
                preparePolyline();
                gob('stepdiv').innerHTML = "Step 1";
                gob('coords').value = 'You may now draw the outer boundary. When finished, click Hole to move on to the next step.'
                    + ' Remember, you do not have to let start and end meet.'
                    + ' The API will close the shape in the finished polygon.';
            }
        }
        if (holestep == 2) {
            // innerArray and innerArrayKml will be collected in function addLatLng
            if (anotherhole == false) {
                // outer line is finished, in Polyline draw mode
                polyPoints.insertAt(polyPoints.length, startpoint); // let start and end for outer line meet
                outerPoints = polyPoints; // store polyPoints in outerPoints. polyPoints will be reused for inner lines
                holePolyArray.push(outerPoints); // this will be the points array for polygon with hole when the points for inner lines are added
                outerShape = polyShape; // store polyShape in outerShape. polyShape will be reused for inner lines
            }
            gob('stepdiv').innerHTML = "Step 2";
            gob('coords').value = 'You may now draw an inner boundary. If you have drawn outer boundary ' +
                'clockwise, you must draw inner boundary counterclockwise. Click Hole again to see the finished polygon. ' +
                'You may draw more than one hole: Click Next hole and draw before you click Hole.';
            if (anotherhole == true) { // set to true in nexthole
                // a hole has been drawn, another is about to be drawn
                if (polyShape && polyPoints.length == 0) {
                    polyShape.setMap(null);
                    gob('coords').value = 'Oops! Not programmed yet, but you may continue drawing holes. ' +
                        'Everything you have created will show up when you click Hole again.';
                } else {
                    polyPoints.insertAt(polyPoints.length, startpoint);
                    holePolyArray.push(polyPoints);
                    if (innerArray.length > 0) innerArrays.push(innerArray);
                    if (innerArrayKml.length > 0) innerArraysKml.push(innerArrayKml);
                    holeShapes.push(polyShape);
                    innerArray = [];
                    innerArrayKml = [];
                }
            }
            polyPoints = [];
            preparePolyline();
            if (startMarker) startMarker.setMap(null);
        }
        if (holestep == 3) {
            if (startMarker) startMarker.setMap(null);
            if (outerShape) outerShape.setMap(null);
            if (polyShape) polyShape.setMap(null);
            if (polyPoints.length > 0) holePolyArray.push(polyPoints);
            if (innerArray.length > 0) innerArrays.push(innerArray);
            if (innerArrayKml.length > 0) innerArraysKml.push(innerArrayKml);
            drawpolywithhole();
            gob('stepdiv').innerHTML = "Finished";
            adder = 0;
            if (codeID == 1) logCode3();
            if (codeID == 2) logCode5();
        }
    }
    // Called from link 'Hole' in div 'polygonstuff'
    this.holecreator=function () {
        var holestep = counter(1); // adder is increased here
        if (holestep == 1) {
            if (gob('stepdiv').innerHTML == "Finished") {
                adder = 0;
                return;
            } else {
                if (startMarker) startMarker.setMap(null);
                if (polyShape) polyShape.setMap(null);
                polyPoints = [];
                preparePolyline();
                gob('stepdiv').innerHTML = "Step 1";
                gob('coords').value = 'You may now draw the outer boundary. When finished, click Hole to move on to the next step.'
                    + ' Remember, you do not have to let start and end meet.'
                    + ' The API will close the shape in the finished polygon.';
            }
        }
        if (holestep == 2) {
            // innerArray and innerArrayKml will be collected in function addLatLng
            if (anotherhole == false) {
                // outer line is finished, in Polyline draw mode
                polyPoints.insertAt(polyPoints.length, startpoint); // let start and end for outer line meet
                outerPoints = polyPoints; // store polyPoints in outerPoints. polyPoints will be reused for inner lines
                holePolyArray.push(outerPoints); // this will be the points array for polygon with hole when the points for inner lines are added
                outerShape = polyShape; // store polyShape in outerShape. polyShape will be reused for inner lines
            }
            gob('stepdiv').innerHTML = "Step 2";
            gob('coords').value = 'You may now draw an inner boundary. If you have drawn outer boundary ' +
                'clockwise, you must draw inner boundary counterclockwise. Click Hole again to see the finished polygon. ' +
                'You may draw more than one hole: Click Next hole and draw before you click Hole.';
            if (anotherhole == true) { // set to true in nexthole
                // a hole has been drawn, another is about to be drawn
                if (polyShape && polyPoints.length == 0) {
                    polyShape.setMap(null);
                    gob('coords').value = 'Oops! Not programmed yet, but you may continue drawing holes. ' +
                        'Everything you have created will show up when you click Hole again.';
                } else {
                    polyPoints.insertAt(polyPoints.length, startpoint);
                    holePolyArray.push(polyPoints);
                    if (innerArray.length > 0) innerArrays.push(innerArray);
                    if (innerArrayKml.length > 0) innerArraysKml.push(innerArrayKml);
                    holeShapes.push(polyShape);
                    innerArray = [];
                    innerArrayKml = [];
                }
            }
            polyPoints = [];
            preparePolyline();
            if (startMarker) startMarker.setMap(null);
        }
        if (holestep == 3) {
            if (startMarker) startMarker.setMap(null);
            if (outerShape) outerShape.setMap(null);
            if (polyShape) polyShape.setMap(null);
            if (polyPoints.length > 0) holePolyArray.push(polyPoints);
            if (innerArray.length > 0) innerArrays.push(innerArray);
            if (innerArrayKml.length > 0) innerArraysKml.push(innerArrayKml);
            drawpolywithhole();
            gob('stepdiv').innerHTML = "Finished";
            adder = 0;
            if (codeID == 1) logCode3();
            if (codeID == 2) logCode5();
        }
    }

    function drawpolywithhole() {
        if (holeShapes.length > 0) {
            for (var i = 0; i < holeShapes.length; i++) {
                holeShapes[i].setMap(null);
            }
        }
        var Points = new google.maps.MVCArray(holePolyArray);
        var polyOptions = {
            paths: Points,
            strokeColor: polygonstyles[pcur].color,
            strokeOpacity: polygonstyles[pcur].lineopac,
            strokeWeight: polygonstyles[pcur].width,
            fillColor: polygonstyles[pcur].fill,
            fillOpacity: polygonstyles[pcur].fillopac
        };
        polyShape = new google.maps.Polygon(polyOptions);
        polyShape.setMap(map);
        //Cursor position, when inside polyShape, is registered with this listener
        cursorposition(polyShape);
        anotherhole = false;
        if (startMarker) startMarker.setMap(null);
        startMarker = new google.maps.Marker({
            position: outerPoints.getAt(0),
            map: map
        });
        startMarker.setTitle("Polygon with hole");
        placemarks[plmcur].point = outerPoints.getAt(0);
    }

    // Called from button 'Next hole' in div 'polygonstuff'
    this.nexthole=function () {
        if (gob('stepdiv').innerHTML != "Finished") {
            if (outerPoints.length > 0) {
                adder = 1;
                anotherhole = true;
                drawnShapes.push(polyShape);
                holecreator();
            }
        }
    }

    function stopediting() {
        editing = false;
        gob('editButton').value = 'Edit lines';
        closethis('RegretButton');
        if (outerArray.length > 0) {
            polyShape.setEditable(false);
            outerArray = [];
            outerArrayKml = [];
            innerArray = [];
            innerArrays = [];
            innerArrayKml = [];
            innerArraysKml = [];
            var polly = polyShape.getPaths();
            polyPoints = polly.getAt(0);
            var points = polly.getAt(0);
            //alert(point.lng().toFixed(6));
            for (var i = 0; i < points.length - 1; i++) {
                outerArray.push(points.getAt(i).lat().toFixed(6) + ',' + points.getAt(i).lng().toFixed(6));
                outerArrayKml.push(points.getAt(i).lng().toFixed(6) + ',' + points.getAt(i).lat().toFixed(6));
            }
            for (i = 1; i < polly.length; i++) {
                points = polly.getAt(i);
                if (i == polly.length - 1) {
                    for (var j = 0; j < points.length; j++) {
                        innerArray.push(points.getAt(j).lat().toFixed(6) + ',' + points.getAt(j).lng().toFixed(6));
                        innerArrayKml.push(points.getAt(j).lng().toFixed(6) + ',' + points.getAt(j).lat().toFixed(6));
                    }
                } else {
                    for (var j = 0; j < points.length - 1; j++) {
                        innerArray.push(points.getAt(j).lat().toFixed(6) + ',' + points.getAt(j).lng().toFixed(6));
                        innerArrayKml.push(points.getAt(j).lng().toFixed(6) + ',' + points.getAt(j).lat().toFixed(6));
                    }
                }
                innerArrays.push(innerArray);
                innerArraysKml.push(innerArrayKml);
                innerArray = [];
                innerArrayKml = [];
            }
            toolID = gob('toolchoice').value = 2;
            //closethis('polygonstuff');
            pcur = placemarks[plmcur].stylecur;
            if (codeID == 1) logCode3();
            if (codeID == 2) logCode5(); // write Google javascript
        } else {
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
            }
            for (var i = 0; i < midmarkers.length; i++) {
                midmarkers[i].setMap(null);
            }
            polyPoints = polyShape.getPath();
            markers = [];
            midmarkers = [];
            if (plmcur != placemarks.length - 1) {
                placemarks[plmcur].shape = polyShape;
                drawnShapes.push(polyShape);
                addpolyShapelistener();
            }
            //setstartMarker(polyPoints.getAt(0));
        }
    }

    this.regret=function () {
        if (polyPoints.length == 0) return;
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
        for (var i = 0; i < midmarkers.length; i++) {
            midmarkers[i].setMap(null);
        }
        polyPoints.insertAt(prevnumber, prevpoint);
        polyShape.setPath(polyPoints);
        //editing = false;
        stopediting();
        editlines();
    }

    // Called from editlines and listener set in setmidmarkers
    function setmarkers(point) {
        var marker = new google.maps.Marker({
            position: point,
            map: map,
            icon: imageNormal,
            raiseOnDrag: false,
            draggable: true
        });
        google.maps.event.addListener(marker, "mouseover", function () {
            marker.setIcon(imageHover);
        });
        google.maps.event.addListener(marker, "mouseout", function () {
            marker.setIcon(imageNormal);
        });
        google.maps.event.addListener(marker, "drag", function () {
            for (var i = 0; i < markers.length; i++) {
                if (markers[i] == marker) {
                    prevpoint = marker.getPosition();
                    prevnumber = i;
                    polyShape.getPath().setAt(i, marker.getPosition());
                    movemidmarker(i);
                    break;
                }
            }
            polyPoints = polyShape.getPath();
            var stringtobesaved = marker.getPosition().lat().toFixed(6) + ',' + marker.getPosition().lng().toFixed(6);
            var kmlstringtobesaved = marker.getPosition().lng().toFixed(6) + ',' + marker.getPosition().lat().toFixed(6);
            pointsArray.splice(i, 1, stringtobesaved);
            pointsArrayKml.splice(i, 1, kmlstringtobesaved);
            logCode1();
        });
        google.maps.event.addListener(marker, "click", function () {
            for (var i = 0; i < markers.length; i++) {
                if (markers[i] == marker && markers.length != 1) {
                    prevpoint = marker.getPosition();
                    prevnumber = i;
                    marker.setMap(null);
                    markers.splice(i, 1);
                    polyShape.getPath().removeAt(i);
                    removemidmarker(i);
                    break;
                }
            }
            polyPoints = polyShape.getPath();
            if (markers.length > 0) {
                pointsArray.splice(i, 1);
                pointsArrayKml.splice(i, 1);
                logCode1();
            }
        });
        return marker;
    }

    // Called from editlines and listener set in this function
    function setmidmarkers(point, prevpoint) {
        //var prevpoint = markers[markers.length-2].getPosition();
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(
                point.lat() - (0.5 * (point.lat() - prevpoint.lat())),
                point.lng() - (0.5 * (point.lng() - prevpoint.lng()))
            ),
            map: map,
            icon: imageNormalMidpoint,
            raiseOnDrag: false,
            draggable: true
        });
        google.maps.event.addListener(marker, "mouseover", function () {
            marker.setIcon(imageHover);
        });
        google.maps.event.addListener(marker, "mouseout", function () {
            marker.setIcon(imageNormalMidpoint);
        });
        google.maps.event.addListener(marker, "dragstart", function () {
            for (var i = 0; i < midmarkers.length; i++) {
                if (midmarkers[i] == marker) {
                    var tmpPath = tmpPolyLine.getPath();
                    tmpPath.push(markers[i].getPosition());
                    tmpPath.push(midmarkers[i].getPosition());
                    tmpPath.push(markers[i + 1].getPosition());
                    break;
                }
            }
        });
        google.maps.event.addListener(marker, "drag", function () {
            for (var i = 0; i < midmarkers.length; i++) {
                if (midmarkers[i] == marker) {
                    tmpPolyLine.getPath().setAt(1, marker.getPosition());
                    break;
                }
            }
        });
        google.maps.event.addListener(marker, "dragend", function () {
            for (var i = 0; i < midmarkers.length; i++) {
                if (midmarkers[i] == marker) {
                    var newpos = marker.getPosition();
                    var startMarkerPos = markers[i].getPosition();
                    var firstVPos = new google.maps.LatLng(
                        newpos.lat() - (0.5 * (newpos.lat() - startMarkerPos.lat())),
                        newpos.lng() - (0.5 * (newpos.lng() - startMarkerPos.lng()))
                    );
                    var endMarkerPos = markers[i + 1].getPosition();
                    var secondVPos = new google.maps.LatLng(
                        newpos.lat() - (0.5 * (newpos.lat() - endMarkerPos.lat())),
                        newpos.lng() - (0.5 * (newpos.lng() - endMarkerPos.lng()))
                    );
                    var newVMarker = setmidmarkers(secondVPos, startMarkerPos);
                    newVMarker.setPosition(secondVPos);//apply the correct position to the midmarker
                    var newMarker = setmarkers(newpos);
                    markers.splice(i + 1, 0, newMarker);
                    polyShape.getPath().insertAt(i + 1, newpos);
                    marker.setPosition(firstVPos);
                    midmarkers.splice(i + 1, 0, newVMarker);
                    tmpPolyLine.getPath().removeAt(2);
                    tmpPolyLine.getPath().removeAt(1);
                    tmpPolyLine.getPath().removeAt(0);
                    /*newpos = null;
                     startMarkerPos = null;
                     firstVPos = null;
                     endMarkerPos = null;
                     secondVPos = null;
                     newVMarker = null;
                     newMarker = null;*/
                    break;
                }
            }
            polyPoints = polyShape.getPath();
            var stringtobesaved = newpos.lat().toFixed(6) + ',' + newpos.lng().toFixed(6);
            var kmlstringtobesaved = newpos.lng().toFixed(6) + ',' + newpos.lat().toFixed(6);
            pointsArray.splice(i + 1, 0, stringtobesaved);
            pointsArrayKml.splice(i + 1, 0, kmlstringtobesaved);
            logCode1();
        });
        return marker;
    }

    // Called from listener set in setmarkers
    function movemidmarker(index) {
        var newpos = markers[index].getPosition();
        if (index != 0) {
            var prevpos = markers[index - 1].getPosition();
            midmarkers[index - 1].setPosition(new google.maps.LatLng(
                newpos.lat() - (0.5 * (newpos.lat() - prevpos.lat())),
                newpos.lng() - (0.5 * (newpos.lng() - prevpos.lng()))
            ));
            //prevpos = null;
        }
        if (index != markers.length - 1) {
            var nextpos = markers[index + 1].getPosition();
            midmarkers[index].setPosition(new google.maps.LatLng(
                newpos.lat() - (0.5 * (newpos.lat() - nextpos.lat())),
                newpos.lng() - (0.5 * (newpos.lng() - nextpos.lng()))
            ));
            //nextpos = null;
        }
        //newpos = null;
        //index = null;
    }

    // Called from listener set in setmarkers
    function removemidmarker(index) {
        if (markers.length > 0) {//clicked marker has already been deleted
            if (index != markers.length) {
                midmarkers[index].setMap(null);
                midmarkers.splice(index, 1);
            } else {
                midmarkers[index - 1].setMap(null);
                midmarkers.splice(index - 1, 1);
            }
        }
        if (index != 0 && index != markers.length) {
            var prevpos = markers[index - 1].getPosition();
            var newpos = markers[index].getPosition();
            midmarkers[index - 1].setPosition(new google.maps.LatLng(
                newpos.lat() - (0.5 * (newpos.lat() - prevpos.lat())),
                newpos.lng() - (0.5 * (newpos.lng() - prevpos.lng()))
            ));
            //prevpos = null;
            //newpos = null;
        }
        //index = null;
    }

    function showKML() {
        if (codeID != 1) {
            codeID = gob('codechoice').value = 1; // set KML
            setCode();
        }
        gob('coords').value = kmlheading();
        for (var i = 0; i < placemarks.length; i++) {
            gob('coords').value += placemarks[i].plmtext;
        }
        gob('coords').value += kmlend();
    }

    this.showAddress=function(kmlurl,url,address) {
        geocoder.geocode({'address': address}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var pos = results[0].geometry.location;
                map.setCenter(pos);
                tinyMarker = new google.maps.Marker({
                    position: pos,
                    map: map,
                    icon: tinyIcon
                });
                drawnShapes.push(tinyMarker);
                loadCommunityByGeo(kmlurl,url,pos.lat(), pos.lng())
                if (directionsYes == 1) drawDirections(pos);
                if (toolID == 5) drawMarkers(pos);
            } else {
                alert("Geocode was not successful for the following reason: " + status);
            }
        });
    }

    function loadCommunityByGeo(kmlurl,url,lat, lng) {
        $.ajax({
            type: 'POST',
            url: url+"/?lat=" + lat + "&lng=" + lng,
            data: $('#search').serialize(),
            success: function (data) {
                loadCommunityMap(data.name,kmlurl,data.name)
            }
        })
    }

    function activateDirections() {
        directionsYes = 1;
        directionsintroduction();
    }

    this.closethis=function(name) {
        gob(name).style.visibility = 'hidden';
    }

    function closethis(name) {
        gob(name).style.visibility = 'hidden';
    }

    function showthis(name) {
        gob(name).style.visibility = 'visible';
    }

    function docudetails() {
        if (directionsYes == 1) {
            if (dirline == null) dirline = plmcur;
            gob("dirplm1").value = placemarks[dirline].name;
            gob("dirplm2").value = placemarks[dirline].desc;
            gob("dirplm3").value = placemarks[dirline].tess;
            gob("dirplm4").value = placemarks[dirline].alt;
            if (plmcur > dirline) {
                gob("dirplm5").value = placemarks[plmcur].name;
                gob("dirplm6").value = placemarks[plmcur].desc;
            }
            gob("dirdoc1").value = docuname;
            gob("dirdoc2").value = docudesc;
            if (plmcur == dirline) {
                gob("dirplm5").disabled = true;
                gob("dirplm6").disabled = true;
            }
            showthis('dirtoppers');
            savedocudetails();
        } else {
            gob("plm1").value = placemarks[plmcur].name;
            gob("plm2").value = placemarks[plmcur].desc;
            gob("plm3").value = placemarks[plmcur].tess;
            gob("plm4").value = placemarks[plmcur].alt;
            gob("doc1").value = docuname;
            gob("doc2").value = docudesc;
            showthis('toppers');
        }
    }

    function savedocudetails() {
        if (directionsYes == 1) {
            placemarks[dirline].name = gob("dirplm1").value;
            placemarks[dirline].desc = gob("dirplm2").value;
            placemarks[dirline].tess = gob("dirplm3").value;
            placemarks[dirline].alt = gob("dirplm4").value;
            if (plmcur > dirline) {
                gob("dirplm5").disabled = false;
                gob("dirplm6").disabled = false;
                placemarks[plmcur].name = gob("dirplm5").value;
                placemarks[plmcur].desc = gob("dirplm6").value;
                markerShape.setTitle(placemarks[plmcur].name + "\n" + placemarks[plmcur].desc);
            }
            docuname = gob("dirdoc1").value;
            docudesc = gob("dirdoc2").value;
            logCode1a();
        } else {
            docuname = gob("doc1").value;
            docudesc = gob("doc2").value;
            placemarks[plmcur].name = gob("plm1").value;
            placemarks[plmcur].desc = gob("plm2").value;
            placemarks[plmcur].tess = gob("plm3").value;
            placemarks[plmcur].alt = gob("plm4").value;
            if (placemarks[plmcur].poly == "pl") logCode1();
            if (placemarks[plmcur].poly == "pg") logCode2();
        }
    }

    this.savedocudetails=function () {
        if (directionsYes == 1) {
            placemarks[dirline].name = gob("dirplm1").value;
            placemarks[dirline].desc = gob("dirplm2").value;
            placemarks[dirline].tess = gob("dirplm3").value;
            placemarks[dirline].alt = gob("dirplm4").value;
            if (plmcur > dirline) {
                gob("dirplm5").disabled = false;
                gob("dirplm6").disabled = false;
                placemarks[plmcur].name = gob("dirplm5").value;
                placemarks[plmcur].desc = gob("dirplm6").value;
                markerShape.setTitle(placemarks[plmcur].name + "\n" + placemarks[plmcur].desc);
            }
            docuname = gob("dirdoc1").value;
            docudesc = gob("dirdoc2").value;
            logCode1a();
        } else {
            docuname = gob("doc1").value;
            docudesc = gob("doc2").value;
            placemarks[plmcur].name = gob("plm1").value;
            placemarks[plmcur].desc = gob("plm2").value;
            placemarks[plmcur].tess = gob("plm3").value;
            placemarks[plmcur].alt = gob("plm4").value;
            if (placemarks[plmcur].poly == "pl") logCode1();
            if (placemarks[plmcur].poly == "pg") logCode2();
        }
    }

    function mapzoom() {
        var mapZoom = map.getZoom();
        gob("myzoom").value = mapZoom;
    }



    this.mapcenter=function () {
        var mapCenter = map.getCenter();
        var wrapped = new google.maps.LatLng(mapCenter.lat(), mapCenter.lng());
        var latLngStr = wrapped.lat().toFixed(6) + ', ' + wrapped.lng().toFixed(6);
        //var latLngStr = mapCenter.lat().toFixed(6) + ', ' + mapCenter.lng().toFixed(6);
        gob("centerofmap").value = latLngStr;
    }

    function showCodeintextarea() {
        if (notext === false) {
            gob("presentcode").checked = false;
            notext = true;
        } else {
            gob("presentcode").checked = true;
            notext = false;
            if (polyPoints.length > 0) {
                if (toolID == 1) { // Polyline
                    if (codeID == 1) logCode1();
                    if (codeID == 2) logCode4();
                }
                if (toolID == 2) { // Polygon
                    if (adder !== 0) { // with hole
                        adder = 0;
                        if (codeID == 1) logCode3();
                        if (codeID == 2) logCode5();
                    } else {
                        if (codeID == 1) logCode2();
                        if (codeID == 2) logCode4();
                    }
                }
                if (toolID == 3) { // Rectangle
                    if (codeID == 2) logCode6();
                    if (codeID == 1) logCode2();
                }
                if (toolID == 5) {  // Marker
                    if (codeID == 1) logCode9();
                }
                if (toolID == 6) { // Directions
                    if (codeID == 1) logCode1a();
                }
            }
            if (toolID == 4) { // Circle
                if (codeID == 2) logCode7();
            }
        }
    }

    // the copy part may not work with all web browsers
    this.copyTextarea=function () {
        gob('coords').focus();
        gob('coords').select();
        copiedTxt = document.selection.createRange();
        copiedTxt.execCommand("Copy");
    }

    function color_html2kml(color) {
        var newcolor = "FFFFFF";
        if (color.length == 7) newcolor = color.substring(5, 7) + color.substring(3, 5) + color.substring(1, 3);
        return newcolor;
    }

    function color_hex2dec(color) {
        var deccolor = "255,0,0";
        var dec1 = parseInt(color.substring(1, 3), 16);
        var dec2 = parseInt(color.substring(3, 5), 16);
        var dec3 = parseInt(color.substring(5, 7), 16);
        if (color.length == 7) deccolor = dec1 + ',' + dec2 + ',' + dec3;
        return deccolor;
    }

    function getopacityhex(opa) {
        var hexopa = "66";
        if (opa == 0) hexopa = "00";
        if (opa == .0) hexopa = "00";
        if (opa >= .1) hexopa = "1A";
        if (opa >= .2) hexopa = "33";
        if (opa >= .3) hexopa = "4D";
        if (opa >= .4) hexopa = "66";
        if (opa >= .5) hexopa = "80";
        if (opa >= .6) hexopa = "9A";
        if (opa >= .7) hexopa = "B3";
        if (opa >= .8) hexopa = "CD";
        if (opa >= .9) hexopa = "E6";
        if (opa == 1.0) hexopa = "FF";
        if (opa == 1) hexopa = "FF";
        return hexopa;
    }

    function iconoptions(chosenicon) {
        gob("st2").value = chosenicon;
        gob("currenticon").innerHTML = '<img src="' + chosenicon + '" alt="" />';
    }

    this.iconoptions=function (chosenicon) {
        gob("st2").value = chosenicon;
        gob("currenticon").innerHTML = '<img src="' + chosenicon + '" alt="" />';
    }

    // Called from button 'Style Options'
    this.styleprep=function () {
        // if(gob('toolchoice').value == 6)
        toolID = $('#toolchoice').val();
        styleoptions();
    }

    // Called from styleprep, stepstyles and links in div directionstyles
    // If coming from directionstyles, toolID=6 has been changed to 1 or 5

    function styleoptions() {
        closethis('polylineoptions');
        closethis('polygonoptions');
        //closethis('rectang');
        closethis('circleoptions');
        closethis('markeroptions');
        closethis('directionstyles');
        if (toolID == 1 || toolID == 7) {
            showthis('polylineoptions'); // Edit style or create new style if sent to polylinestyle()
            //if(plmcur<placemarks.length-1) lcur = placemarks[plmcur].stylecur;
            gob('polylineinput1').value = polylinestyles[lcur].color;
            gob('polylineinput2').value = polylinestyles[lcur].lineopac;
            gob('polylineinput3').value = polylinestyles[lcur].width;
            gob('polylineinput4').value = polylinestyles[lcur].name;
            gob("stylenumberl").innerHTML = (lcur + 1) + ' ';
        }
        if (toolID == 2 || toolID == 3 || toolID == 8) {
            showthis('polygonoptions');
            //if(plmcur<placemarks.length-1) pcur = placemarks[plmcur].stylecur;
            gob('polygoninput1').value = polygonstyles[pcur].color;
            gob('polygoninput2').value = polygonstyles[pcur].lineopac;
            gob('polygoninput3').value = polygonstyles[pcur].width;
            gob('polygoninput4').value = polygonstyles[pcur].fill;
            gob('polygoninput5').value = polygonstyles[pcur].fillopac;
            gob('polygoninput6').value = polygonstyles[pcur].name;
            gob("stylenumberp").innerHTML = (pcur + 1) + ' ';
        }
        if (toolID == 4) {
            showthis('circleoptions');
            gob('circinput1').value = circlestyles[ccur].color;
            gob('circinput2').value = circlestyles[ccur].lineopac;
            gob('circinput3').value = circlestyles[ccur].width;
            gob('circinput4').value = circlestyles[ccur].fill;
            gob('circinput5').value = circlestyles[ccur].fillopac;
            gob('circinput6').value = circlestyles[ccur].name;
            gob("stylenumberc").innerHTML = (ccur + 1) + ' ';
        }
        if (toolID == 5) {
            showthis('markeroptions');
            gob('st1').value = markerstyles[mcur].name;
            iconoptions(markerstyles[mcur].icon);
            gob("stylenumberm").innerHTML = (mcur + 1) + ' ';
        }
        if (toolID == 6) {
            showthis('directionstyles');
        }
    }

    this.styleoptions=function() { //present current style in ..options
        closethis('polylineoptions');
        closethis('polygonoptions');
        //closethis('rectang');
        closethis('circleoptions');
        closethis('markeroptions');
        closethis('directionstyles');
        if (toolID == 1 || toolID == 7) {
            showthis('polylineoptions'); // Edit style or create new style if sent to polylinestyle()
            //if(plmcur<placemarks.length-1) lcur = placemarks[plmcur].stylecur;
            gob('polylineinput1').value = polylinestyles[lcur].color;
            gob('polylineinput2').value = polylinestyles[lcur].lineopac;
            gob('polylineinput3').value = polylinestyles[lcur].width;
            gob('polylineinput4').value = polylinestyles[lcur].name;
            gob("stylenumberl").innerHTML = (lcur + 1) + ' ';
        }
        if (toolID == 2 || toolID == 3 || toolID == 8) {
            showthis('polygonoptions');
            //if(plmcur<placemarks.length-1) pcur = placemarks[plmcur].stylecur;
            gob('polygoninput1').value = polygonstyles[pcur].color;
            gob('polygoninput2').value = polygonstyles[pcur].lineopac;
            gob('polygoninput3').value = polygonstyles[pcur].width;
            gob('polygoninput4').value = polygonstyles[pcur].fill;
            gob('polygoninput5').value = polygonstyles[pcur].fillopac;
            gob('polygoninput6').value = polygonstyles[pcur].name;
            gob("stylenumberp").innerHTML = (pcur + 1) + ' ';
        }
        if (toolID == 4) {
            showthis('circleoptions');
            gob('circinput1').value = circlestyles[ccur].color;
            gob('circinput2').value = circlestyles[ccur].lineopac;
            gob('circinput3').value = circlestyles[ccur].width;
            gob('circinput4').value = circlestyles[ccur].fill;
            gob('circinput5').value = circlestyles[ccur].fillopac;
            gob('circinput6').value = circlestyles[ccur].name;
            gob("stylenumberc").innerHTML = (ccur + 1) + ' ';
        }
        if (toolID == 5) {
            showthis('markeroptions');
            gob('st1').value = markerstyles[mcur].name;
            iconoptions(markerstyles[mcur].icon);
            gob("stylenumberm").innerHTML = (mcur + 1) + ' ';
        }
        if (toolID == 6) {
            showthis('directionstyles');
        }
    }

    // Called from links in polylineoptions. If Directionsmode, toolID will be changed back to 6
    this.polylinestyle=function (e) { //save style
        if (e == 1) {
            createlinestyleobject();
            lcur++;
        }
        polylinestyles[lcur].name = gob('polylineinput4').value;
        if (e == 1) {
            if (polylinestyles[lcur].name == polylinestyles[lcur - 1].name) {
                lcur--;
                polylinestyles.pop();
                alert("Give the new style a new name");
                return;
            }
        }
        polylinestyles[lcur].color = gob('polylineinput1').value;
        polylineDecColorCur = color_hex2dec(polylinestyles[lcur].color);
        polylinestyles[lcur].lineopac = gob('polylineinput2').value;
        if (polylinestyles[lcur].lineopac < 0 || polylinestyles[lcur].lineopac > 1) return alert('Opacity must be between 0 and 1');
        polylinestyles[lcur].width = gob('polylineinput3').value;
        if (polylinestyles[lcur].width < 0 || polylinestyles[lcur].width > 20) return alert('Numbers below zero and above 20 are not accepted');
        polylinestyles[lcur].kmlcolor = getopacityhex(polylinestyles[lcur].lineopac) + color_html2kml("" + polylinestyles[lcur].color);
        if (directionsYes == 1) {
            placemarks[dirline].style = polylinestyles[lcur].name;
            placemarks[dirline].stylecur = lcur;
        } else {
            placemarks[plmcur].style = polylinestyles[lcur].name;
            placemarks[plmcur].stylecur = lcur;
        }
        gob("stylenumberl").innerHTML = (lcur + 1) + ' ';
        if (polyShape) polyShape.setMap(null);
        preparePolyline();
        if (directionsYes == 1) {
            toolID = 6;
        }
        if (polyPoints.length > 0) {
            if (toolID == 6) {
                logCode1a();
            } else {
                if (codeID == 1) logCode1();
                if (codeID == 2) logCode4();
            }
        } else {
            alert("SAVED!");
        }
    }

    this.polygonstyle=function (e) {
        if (e == 1) {
            createpolygonstyleobject();
            pcur++;
        }
        polygonstyles[pcur].name = gob('polygoninput6').value;
        if (e == 1) {
            if (polygonstyles[pcur].name == polygonstyles[pcur - 1].name) {
                pcur--;
                polygonstyles.pop();
                alert("Give the new style a new name");
                return;
            }
        }
        polygonstyles[pcur].color = gob('polygoninput1').value;
        polygonDecColorCur = color_hex2dec(polygonstyles[pcur].color);
        polygonstyles[pcur].lineopac = gob('polygoninput2').value;
        if (polygonstyles[pcur].lineopac < 0 || polygonstyles[pcur].lineopac > 1) return alert('Opacity must be between 0 and 1');
        polygonstyles[pcur].width = gob('polygoninput3').value;
        if (polygonstyles[pcur].width < 0 || polygonstyles[pcur].width > 20) return alert('Numbers below zero and above 20 are not accepted');
        polygonstyles[pcur].fill = gob('polygoninput4').value;
        polygonFillDecColorCur = color_hex2dec(polygonstyles[pcur].fill);
        polygonstyles[pcur].fillopac = gob('polygoninput5').value;
        if (polygonstyles[pcur].fillopac < 0 || polygonstyles[pcur].fillopac > 1) return alert('Opacity must be between 0 and 1');
        polygonstyles[pcur].kmlcolor = getopacityhex(polygonstyles[pcur].lineopac) + color_html2kml("" + polygonstyles[pcur].color);
        polygonstyles[pcur].kmlfill = getopacityhex(polygonstyles[pcur].fillopac) + color_html2kml("" + polygonstyles[pcur].fill);
        placemarks[plmcur].style = polygonstyles[pcur].name;
        placemarks[plmcur].stylecur = pcur;
        gob("stylenumberp").innerHTML = (pcur + 1) + ' ';
        if (polyShape) polyShape.setMap(null);
        if (outerShape) outerShape.setMap(null);
        if (holePolyArray.length > 0) {
            drawpolywithhole();
            if (codeID == 1) logCode3();
            if (codeID == 2) logCode5();
        }
        if (holePolyArray.length == 0) {
            preparePolygon();
            if (polyPoints.length > 0) {
                if (codeID == 1) logCode2();
                if (codeID == 2) logCode4();
            } else {
                alert("SAVED!");
            }
        }
    }

    this.circlestyle=function (e) {
        if (e == 1) {
            createcirclestyleobject();
            ccur++;
        }
        circlestyles[ccur].name = gob('circinput6').value;
        if (e == 1) {
            if (circlestyles[ccur].name == circlestyles[ccur - 1].name) {
                ccur--;
                circlestyles.pop();
                alert("Give the new style a new name");
                return;
            }
        }
        circlestyles[ccur].color = gob('circinput1').value;
        circlestyles[ccur].lineopac = gob('circinput2').value;
        if (circlestyles[ccur].lineopac < 0 || circlestyles[ccur].lineopac > 1) return alert('Opacity must be between 0 and 1');
        circlestyles[ccur].width = gob('circinput3').value;
        circlestyles[ccur].fill = gob('circinput4').value;
        circlestyles[ccur].fillopac = gob('circinput5').value;
        if (circlestyles[ccur].fillopac < 0 || circlestyles[ccur].fillopac > 1) return alert('Opacity must be between 0 and 1');
        placemarks[plmcur].style = circlestyles[ccur].name;
        placemarks[plmcur].stylecur = ccur;
        gob("stylenumberc").innerHTML = (ccur + 1) + ' ';
        if (circle) circle.setMap(null);
        activateCircle();
        if (radiusPoint) {
            drawCircle();
            logCode7();
        } else {
            alert("SAVED!");
        }
    }

    function markerstyle(e) {
        if (e == 1) {
            createmarkerstyleobject();
            mcur++;
        }
        markerstyles[mcur].name = gob('st1').value;
        if (e == 1) {
            if (markerstyles[mcur].name == markerstyles[mcur - 1].name) {
                mcur--;
                markerstyles.pop();
                alert("Give the new style a new name");
                return;
            }
        }
        markerstyles[mcur].icon = gob('st2').value;
        placemarks[plmcur].style = markerstyles[mcur].name;
        placemarks[plmcur].stylecur = mcur;
        gob("stylenumberm").innerHTML = (mcur + 1) + ' ';
        if (directionsYes == 1) toolID = 6;
        if (markerShape) {
            markerShape.setIcon(markerstyles[mcur].icon);
            if (toolID == 6) {
                logCode1a();
            } else {
                if (codeID == 1) logCode9();
                if (codeID == 2) logCode8();
            }
            alert("SAVED!");
        }
    }

    this.stepstyles=function (a) {
        if (directionsYes == 1) {
            if (gob('polylineoptions').style.visibility == 'visible') {
                toolID = 1;
            } else {
                toolID = 5;
            }
        }
        if (toolID == 1) {
            if (a == -1) {
                if (lcur > 0) {
                    lcur--;
                    gob("stylenumberl").innerHTML = (lcur + 1) + ' ';
                    styleoptions();
                }
            }
            if (a == 1) {
                if (lcur < polylinestyles.length - 1) {
                    lcur++;
                    gob("stylenumberl").innerHTML = (lcur + 1) + ' ';
                    styleoptions();
                }
            }
            if (directionsYes == 1) {
                placemarks[dirline].style = polylinestyles[lcur].name;
                placemarks[dirline].stylecur = lcur;
            } else {
                placemarks[plmcur].style = polylinestyles[lcur].name;
                placemarks[plmcur].stylecur = lcur;
            }
            if (polyShape) polyShape.setMap(null);
            preparePolyline();
            if (directionsYes == 1) {
                toolID = 6;
            }
            if (polyPoints.length > 0) {
                if (toolID == 6) {
                    logCode1a();
                } else {
                    if (codeID == 1) logCode1();
                    if (codeID == 2) logCode4();
                }
            }
        }
        if (toolID == 2 || toolID == 3) {
            if (a == -1) {
                if (pcur > 0) {
                    pcur--;
                    gob("stylenumberp").innerHTML = (pcur + 1) + ' ';
                    tyleoptions();
                }
            }
            if (a == 1) {
                if (pcur < polygonstyles.length - 1) {
                    pcur++;
                    gob("stylenumberp").innerHTML = (pcur + 1) + ' ';
                    styleoptions();
                }
            }
            placemarks[plmcur].style = polygonstyles[pcur].name;
            placemarks[plmcur].stylecur = pcur;
            if (polyShape) {
                //alert("polyShape");
                polyShape.setMap(null);
                preparePolygon();
                if (polyPoints.length) {
                    if (codeID == 1) logCode2();
                    if (codeID == 2) logCode4();
                }
            }
            /*if(rectangle) {
             //alert("polyShape");
             rectangle.setMap(null);
             activateRectangle();
             if(polyPoints.length) {
             if(codeID == 1) logCode2();
             if(codeID == 2) logCode4();
             }
             }*/
        }
        if (toolID == 4) {
            if (a == -1) {
                if (ccur > 0) {
                    ccur--;
                    gob("stylenumberc").innerHTML = (ccur + 1) + ' ';
                    styleoptions();
                }
            }
            if (a == 1) {
                if (ccur < circlestyles.length - 1) {
                    ccur++;
                    gob("stylenumberc").innerHTML = (ccur + 1) + ' ';
                    styleoptions();
                }
            }
            placemarks[plmcur].style = circlestyles[ccur].name;
            placemarks[plmcur].stylecur = ccur;
            if (circle) circle.setMap(null);
            activateCircle();
            if (radiusPoint) {
                logCode7();
            }
        }
        if (toolID == 5) {
            if (a == -1) {
                if (mcur > 0) {
                    mcur--;
                    gob("stylenumberm").innerHTML = (mcur + 1) + ' ';
                    styleoptions();
                }
            }
            if (a == 1) {
                if (mcur < markerstyles.length - 1) {
                    mcur++;
                    gob("stylenumberm").innerHTML = (mcur + 1) + ' ';
                    styleoptions();
                }
            }
            placemarks[plmcur].style = markerstyles[mcur].name;
            placemarks[plmcur].stylecur = mcur;
            if (directionsYes == 1) toolID = 6;
            if (markerShape) {
                markerShape.setIcon(markerstyles[mcur].icon);
                if (toolID == 6) {
                    logCode1a();
                } else {
                    if (codeID == 1) logCode9();
                    if (codeID == 2) logCode8();
                }
            }
        }
    }

    function kmlheading() {
        var heading = "";
        var styleforpolygon = "";
        var styleforrectangle = "";
        var styleforpolyline = "";
        var styleformarker = "";
        var i;
        heading = '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<kml xmlns="http://www.opengis.net/kml/2.2">\n' +
            '<Document><name>' + docuname + '</name>\n' +
            '<description>' + docudesc + '</description>\n';
        for (i = 0; i < polygonstyles.length; i++) {
            styleforpolygon += '<Style id="' + polygonstyles[i].name + '">\n' +
                '<LineStyle><color>' + polygonstyles[i].kmlcolor + '</color><width>' + polygonstyles[i].width + '</width></LineStyle>\n' +
                '<PolyStyle><color>' + polygonstyles[i].kmlfill + '</color></PolyStyle>\n' +
                '</Style>\n';
        }
        for (i = 0; i < polylinestyles.length; i++) {
            styleforpolyline += '<Style id="' + polylinestyles[i].name + '">\n' +
                '<LineStyle><color>' + polylinestyles[i].kmlcolor + '</color><width>' + polylinestyles[i].width + '</width></LineStyle>\n' +
                '</Style>\n';
        }
        for (i = 0; i < markerstyles.length; i++) {
            styleformarker += '<Style id="' + markerstyles[i].name + '">\n' +
                '<IconStyle><Icon><href>\n' + markerstyles[i].icon + '\n</href></Icon></IconStyle>\n' +
                '</Style>\n';
        }
        return heading + styleforpolygon + styleforpolyline + styleformarker;
    }

    function kmlend() {
        var ending;
        return ending = '</Document>\n</kml>';
    }

    // write kml for polyline in text area
    function logCode1() {
        if (notext === true) return;
        logCode();
        var code = ""; // placemarks[plmcur].style = polylinestyles[lcur].name
        var kmltext1 = '<Placemark><name>' + placemarks[plmcur].name + '</name>\n' +
            '<description>' + placemarks[plmcur].desc + '</description>\n' +
            '<styleUrl>#' + placemarks[plmcur].style + '</styleUrl>\n' +
            '<LineString>\n<tessellate>' + placemarks[plmcur].tess + '</tessellate>\n' +
            '<altitudeMode>' + placemarks[plmcur].alt + '</altitudeMode>\n<coordinates>\n';
        for (var i = 0; i < pointsArrayKml.length; i++) {
            code += pointsArrayKml[i] + ',0.0 \n';
        }
        kmltext2 = '</coordinates>\n</LineString>\n</Placemark>\n';
        placemarks[plmcur].plmtext = kmlcode = kmltext1 + code + kmltext2;
        placemarks[plmcur].poly = "pl";
        placemarks[plmcur].jscode = pointsArray;
        placemarks[plmcur].kmlcode = pointsArrayKml;
        gob('coords1').value = kmlheading() + kmltext1 + code + kmltext2 + kmlend();

    }

    // write kml for Directions in text area
    function logCode1a() {
        if (notext === true) return;
        logCode();
        gob('coords1').value = "";
        var code = "";
        //var kmlMarker = "";
        //var kmlMarkers = "";
        var kmltext1 = '<Placemark><name>' + placemarks[dirline].name + '</name>\n' +
            '<description>' + placemarks[dirline].desc + '</description>\n' +
            '<styleUrl>#' + placemarks[dirline].style + '</styleUrl>\n' +
            '<LineString>\n<tessellate>' + placemarks[dirline].tess + '</tessellate>\n' +
            '<altitudeMode>' + placemarks[dirline].alt + '</altitudeMode>\n<coordinates>\n';
        if (pointsArrayKml.length != 0) {
            for (var i = 0; i < pointsArrayKml.length; i++) {
                code += pointsArrayKml[i] + ',0.0 \n';
            }
            placemarks[dirline].jscode = pointsArray;
            placemarks[dirline].kmlcode = pointsArrayKml;
        }
        kmltext2 = '</coordinates>\n</LineString>\n</Placemark>\n';
        placemarks[dirline].plmtext = kmltext1 + code + kmltext2;
        placemarks[dirline].poly = "pl";
        gob('coords1').value = kmlheading() + kmltext1 + code + kmltext2;
        if (markersArrayKml.length != 0) {
            for (i = 0; i < markersArrayKml.length; i++) {
                var kmlMarker = "";
                var m = dirline + 1;
                kmlMarker += '<Placemark><name>' + placemarks[m + i].name + '</name>\n' +
                    '<description>' + addresssArray[i] + '</description>\n' +
                    '<styleUrl>#' + placemarks[m + i].style + '</styleUrl>\n' +
                    '<Point>\n<coordinates>';
                kmlMarker += markersArrayKml[i] + ',0.0';
                kmlMarker += '</coordinates>\n</Point>\n</Placemark>\n';
                placemarks[m + i].jscode = markersArray[i];
                placemarks[m + i].kmlcode = markersArrayKml[i];
                placemarks[m + i].plmtext = kmlMarker;
                gob('coords1').value += kmlMarker;
            }
        }
        //placemarks[dirline].plmtext = kmlcode = kmltext1+code+kmltext2+kmlMarkers;
        gob('coords1').value += kmlend();
    }

    // write kml for polygon in text area
    function logCode2() {
        if (notext === true) return;
        logCode();
        var code = "";
        var kmltext1 = '<Placemark><name>' + placemarks[plmcur].name + '</name>\n' +
            '<description>' + placemarks[plmcur].desc + '</description>\n' +
            '<styleUrl>#' + placemarks[plmcur].style + '</styleUrl>\n' +
            '<Polygon>\n<tessellate>' + placemarks[plmcur].tess + '</tessellate>\n' +
            '<altitudeMode>' + placemarks[plmcur].alt + '</altitudeMode>\n' +
            '<outerBoundaryIs><LinearRing><coordinates>\n';
        if (pointsArrayKml.length != 0) {
            for (var i = 0; i < pointsArrayKml.length; i++) {
                code += pointsArrayKml[i] + ',0.0 \n';
            }
            code += pointsArrayKml[0] + ',0.0 \n';
            placemarks[plmcur].jscode = pointsArray;
            placemarks[plmcur].kmlcode = pointsArrayKml;
        }
        kmltext2 = '</coordinates></LinearRing></outerBoundaryIs>\n</Polygon>\n</Placemark>\n';
        placemarks[plmcur].plmtext = kmlcode = kmltext1 + code + kmltext2;
        placemarks[plmcur].poly = "pg";
        gob('coords1').value = kmlheading() + kmltext1 + code + kmltext2 + kmlend();
    }

    // write kml for polygon with hole
    function logCode3() {
        if (notext === true) return;
        logCode();
        var code = "";
        var kmltext = '<Placemark><name>' + placemarks[plmcur].name + '</name>\n' +
            '<description>' + placemarks[plmcur].desc + '</description>\n' +
            '<styleUrl>#' + placemarks[plmcur].style + '</styleUrl>\n' +
            '<Polygon>\n<tessellate>' + placemarks[plmcur].tess + '</tessellate>\n' +
            '<altitudeMode>' + placemarks[plmcur].alt + '</altitudeMode>\n' +
            '<outerBoundaryIs><LinearRing><coordinates>\n';
        for (var i = 0; i < outerArrayKml.length; i++) {
            kmltext += outerArrayKml[i] + ',0.0 \n';
            code += outerArrayKml[i] + ',0.0 \n';
        }
        kmltext += outerArrayKml[0] + ',0.0 \n';
        code += outerArrayKml[0] + ',0.0 \n';
        placemarks[plmcur].jscode = pointsArray;
        placemarks[plmcur].kmlcode = outerArrayKml;
        placemarks[plmcur].kmlholecode = innerArraysKml;
        placemarks[plmcur].poly = "pgh";
        kmltext += '</coordinates></LinearRing></outerBoundaryIs>\n';
        for (var m = 0; m < innerArraysKml.length; m++) {
            kmltext += '<innerBoundaryIs><LinearRing><coordinates>\n';
            for (var i = 0; i < innerArraysKml[m].length; i++) {
                kmltext += innerArraysKml[m][i] + ',0.0 \n';
            }
            kmltext += innerArraysKml[m][0] + ',0.0 \n';
            kmltext += '</coordinates></LinearRing></innerBoundaryIs>\n';
        }
        kmltext += '</Polygon>\n</Placemark>\n';
        placemarks[plmcur].plmtext = kmlcode = kmltext;
        gob('coords1').value = kmlheading() + kmltext + kmlend();
    }

    // write javascript
    function logCode4() {
        if (notext === true) return;
        logCode();
        gob('coords1').value = 'var myCoordinates = [\n';
        for (var i = 0; i < pointsArray.length; i++) {
            if (i == pointsArray.length - 1) {
                gob('coords1').value += 'new google.maps.LatLng(' + pointsArray[i] + ')\n';
            } else {
                gob('coords1').value += 'new google.maps.LatLng(' + pointsArray[i] + '),\n';
            }
        }
        if (toolID == 1) {
            gob('coords1').value += '];\n';
            var options = 'var polyOptions = {\n'
                + 'path: myCoordinates,\n'
                + 'strokeColor: "' + polylinestyles[lcur].color + '",\n'
                + 'strokeOpacity: ' + polylinestyles[lcur].lineopac + ',\n'
                + 'strokeWeight: ' + polylinestyles[lcur].width + '\n'
                + '}\n';
            gob('coords1').value += options;
            gob('coords1').value += 'var it = new google.maps.Polyline(polyOptions);\n'
                + 'it.setMap(map);\n';
            placemarks[plmcur].poly = "pl";
        }
        if (toolID == 2) {
            gob('coords1').value += '];\n';
            var options = 'var polyOptions = {\n'
                + 'path: myCoordinates,\n'
                + 'strokeColor: "' + polygonstyles[pcur].color + '",\n'
                + 'strokeOpacity: ' + polygonstyles[pcur].lineopac + ',\n'
                + 'strokeWeight: ' + polygonstyles[pcur].width + ',\n'
                + 'fillColor: "' + polygonstyles[pcur].fill + '",\n'
                + 'fillOpacity: ' + polygonstyles[pcur].fillopac + '\n'
                + '}\n';
            gob('coords1').value += options;
            gob('coords1').value += 'var it = new google.maps.Polygon(polyOptions);\n'
                + 'it.setMap(map);\n';
            placemarks[plmcur].poly = "pg";
        }
        javacode = gob('coords').value;
    }

    // write javascript for polygon with hole
    function logCode5() {
        if (notext === true) return;
        logCode();
        var hstring = "";
        gob('coords1').value = 'var outerPoints = [\n';
        for (var i = 0; i < outerArray.length; i++) {
            if (i == outerArray.length - 1) {
                gob('coords1').value += 'new google.maps.LatLng(' + outerArray[i] + ')\n'; // without trailing comma
            } else {
                gob('coords1').value += 'new google.maps.LatLng(' + outerArray[i] + '),\n';
            }
        }
        gob('coords1').value += '];\n';
        for (var m = 0; m < innerArrays.length; m++) {
            gob('coords1').value += 'var innerPoints' + m + ' = [\n';
            var holestring = 'innerPoints' + m;
            if (m < innerArrays.length - 1) holestring += ',';
            hstring += holestring;
            for (i = 0; i < innerArrays[m].length; i++) {
                if (i == innerArrays[m].length - 1) {
                    gob('coords1').value += 'new google.maps.LatLng(' + innerArrays[m][i] + ')\n';
                } else {
                    gob('coords1').value += 'new google.maps.LatLng(' + innerArrays[m][i] + '),\n';
                }
            }
            gob('coords1').value += '];\n';
        }
        gob('coords1').value += 'var myCoordinates = [outerPoints,' + hstring + '];\n';
        gob('coords1').value += 'var polyOptions = {\n'
            + 'paths: myCoordinates,\n'
            + 'strokeColor: "' + polygonstyles[pcur].color + '",\n'
            + 'strokeOpacity: ' + polygonstyles[pcur].lineopac + ',\n'
            + 'strokeWeight: ' + polygonstyles[pcur].width + ',\n'
            + 'fillColor: "' + polygonstyles[pcur].fill + '",\n'
            + 'fillOpacity: ' + polygonstyles[pcur].fillopac + '\n'
            + '};\n'
            + 'var it = new google.maps.Polygon(polyOptions);\n'
            + 'it.setMap(map);\n';
        placemarks[plmcur].poly = "pgh";
        javacode = gob('coords1').value;
    }

    // write javascript or kml for rectangle
    function logCode6() {
        if (notext === true) return;
        logCode();
        //placemarks[plmcur].style = polygonstyles[pcur].name;
        if (codeID == 2) { // javascript
            gob('coords1').value = 'var rectangle = new google.maps.Rectangle({\n'
                + 'map: map,\n'
                + 'fillColor: ' + polygonstyles[pcur].fill + ',\n'
                + 'fillOpacity: ' + polygonstyles[pcur].fillopac + ',\n'
                + 'strokeColor: ' + polygonstyles[pcur].color + ',\n'
                + 'strokeOpacity: ' + polygonstyles[pcur].lineopac + ',\n'
                + 'strokeWeight: ' + polygonstyles[pcur].width + '\n'
                + '});\n';
            gob('coords1').value += 'var sWest = new google.maps.LatLng(' + southWest.lat().toFixed(6) + ',' + southWest.lng().toFixed(6) + ');\n'
                + 'var nEast = new google.maps.LatLng(' + northEast.lat().toFixed(6) + ',' + northEast.lng().toFixed(6) + ');\n'
                + 'var bounds = new google.maps.LatLngBounds(sWest,nEast);\n'
                + 'rectangle.setBounds(bounds);\n';
            gob('coords1').value += '\n\\\\ Code for polyline rectangle\n';
            gob('coords1').value += 'var myCoordinates = [\n';
            gob('coords1').value += southWest.lat().toFixed(6) + ',' + southWest.lng().toFixed(6) + ',\n' +
                southWest.lat().toFixed(6) + ',' + northEast.lng().toFixed(6) + ',\n' +
                northEast.lat().toFixed(6) + ',' + northEast.lng().toFixed(6) + ',\n' +
                northEast.lat().toFixed(6) + ',' + southWest.lng().toFixed(6) + ',\n' +
                southWest.lat().toFixed(6) + ',' + southWest.lng().toFixed(6) + '\n';
            gob('coords1').value += '];\n';
            var options = 'var polyOptions = {\n'
                + 'path: myCoordinates,\n'
                + 'strokeColor: "' + polygonstyles[pcur].color + '",\n'
                + 'strokeOpacity: ' + polygonstyles[pcur].lineopac + ',\n'
                + 'strokeWeight: ' + polygonstyles[pcur].width + '\n'
                + '}\n';
            gob('coords1').value += options;
            gob('coords1').value += 'var it = new google.maps.Polyline(polyOptions);\n'
                + 'it.setMap(map);\n';
            javacode = gob('coords').value;
        }
        if (codeID == 1) { // kml
            var kmltext = '<Placemark><name>' + placemarks[plmcur].name + '</name>\n' +
                '<description>' + placemarks[plmcur].desc + '</description>\n' +
                '<styleUrl>#' + placemarks[plmcur].style + '</styleUrl>\n' +
                '<Polygon>\n<tessellate>' + placemarks[plmcur].tess + '</tessellate>\n' +
                '<altitudeMode>' + placemarks[plmcur].alt + '</altitudeMode>\n' +
                '<outerBoundaryIs><LinearRing><coordinates>\n';
            kmltext += southWest.lng().toFixed(6) + ',' + southWest.lat().toFixed(6) + ',0.0 \n' +
                southWest.lng().toFixed(6) + ',' + northEast.lat().toFixed(6) + ',0.0 \n' +
                northEast.lng().toFixed(6) + ',' + northEast.lat().toFixed(6) + ',0.0 \n' +
                northEast.lng().toFixed(6) + ',' + southWest.lat().toFixed(6) + ',0.0 \n' +
                southWest.lng().toFixed(6) + ',' + southWest.lat().toFixed(6) + ',0.0 \n';
            kmltext += '</coordinates></LinearRing></outerBoundaryIs>\n</Polygon>\n</Placemark>\n';
            placemarks[plmcur].plmtext = kmlcode = kmltext;
            gob('coords1').value = kmlheading() + kmltext + kmlend();
        }
    }

    function logCode7() { // javascript for circle
        if (notext === true) return;
        logCode();

        //placemarks[plmcur].style = circlestyles[ccur].name;
        gob('coords1').value = 'var circle = new google.maps.Circle({\n'
            + 'map: map,\n'
            + 'center: new google.maps.LatLng(' + centerPoint.lat().toFixed(6) + ',' + centerPoint.lng().toFixed(6) + '),\n'
            + 'fillColor: ' + circlestyles[ccur].fill + ',\n'
            + 'fillOpacity: ' + circlestyles[ccur].fillopac + ',\n'
            + 'strokeColor: ' + circlestyles[ccur].color + ',\n'
            + 'strokeOpacity: ' + circlestyles[ccur].lineopac + ',\n'
            + 'strokeWeight: ' + circlestyles[ccur].width + '\n'
            + '});\n';
        gob('coords1').value += 'circle.setRadius(' + calc + ');\n';
        javacode = gob('coords1').value;
    }

    function logCode8() { //javascript for Marker
        if (notext === true) return;
        logCode();
        var text = 'var image = \'' + markerstyles[mcur].icon + '\';\n'
            + 'var marker = new google.maps.Marker({\n'
            + 'position: ' + placemarks[plmcur].point + ',\n'
            + 'map: map, //global variable \'map\' from opening function\n'
            + 'icon: image\n'
            + '});\n'
            + '//Your content for the infowindow\n'
            + 'var html = \'<b>' + placemarks[plmcur].name + '</b> <br/>' + placemarks[plmcur].desc + '\';';
        gob('coords1').value = text;
        javacode = gob('coords1').value;
    }

    function logCode9() { //KML for marker
        if (notext === true) return;
        gob('coords1').value = "";
        logCode();
        var kmlMarkers = "";
        kmlMarkers += '<Placemark><name>' + placemarks[plmcur].name + '</name>\n' +
            '<description>' + placemarks[plmcur].desc + '</description>\n' +
            '<styleUrl>#' + placemarks[plmcur].style + '</styleUrl>\n' +
            '<Point>\n<coordinates>';
        kmlMarkers += placemarks[plmcur].kmlcode + ',0.0';
        kmlMarkers += '</coordinates>\n</Point>\n</Placemark>\n';
        //placemarks[plmcur].poly = "pl";
        placemarks[plmcur].plmtext = kmlcode = kmlMarkers;
        gob('coords1').value = kmlheading() + kmlMarkers + kmlend();
    }

    function directionsintroduction() {
        gob('coords').value = 'Ready for Directions. Create a route along roads with markers at chosen locations.\n'
            + 'Click on the map, or enter an address and click "Search", to place a marker.\n'
            + 'Lines will be drawn along roads from marker to marker.\n'
            + 'Use "Delete Last Point" if you want to undo.\n'
            + 'Styles and KML input may be managed before, during and after.\n'
            + 'If after, click on the shape you want to edit.\n'
            + 'Click "Next shape" before each edit.';
    }

    function markerintroduction() {
        gob('coords').value = 'Ready for Marker. Click on the map, or enter an address and click "Search", to place a marker.\n'
            + 'You may enter your content for the infowindow with "KML input" even if your code choice is Javascript.\n'
            + 'Click "Next shape" before each additional marker.';
    }

    function polylineintroduction() {
        gob('coords').value = 'Ready for Polyline. Click on the map. The code for the shape you create will be presented here.\n\n'
            + 'When finished with a shape, click Next shape and draw another shape, if you wish.\n'
            + '\nIf you want to edit a saved polyline or polygon, click on it. Then click Edit lines. '
            + 'When editing, you may remove a point with a click on it.\n'
            + '\nThe complete KML code for what you have created, is always available with Show KML.';
    }

    function polygonintroduction() {
        gob('coords').value = 'Ready for Polygon. Click on the map. The code for the shape you create will be presented here. '
            + 'The Maps API will automatically "close" any polygons by drawing a stroke connecting the last coordinate back to the '
            + 'first coordinate for any given paths. If you draw the polygon in polyline mode, it will be closed when you switch to polygon mode.\n'
            + '\nTo create a polygon with hole(-s), click "Hole" before you start the drawing. '
            + 'If you draw outer boundary clockwise, you must draw inner boundary counterclockwise.\n'
            + '\nWhen finished with a shape, click Next shape and draw another shape, if you wish.\n'
            + '\nIf you want to edit a saved polyline or polygon, click on it. Then click Edit lines. '
            + 'When editing, you may remove a point with a click on it.\n'
            + '\nThe complete KML code for what you have created, is always available with Show KML.';
    }

    function rectangleintroduction() {
        gob('coords').value = 'Ready for Rectangle. Click two times on the map - first for the southwest and ' +
            'then for the northeast corner. You may resize and move ' +
            'the rectangle with the two draggable markers you then have.\n\n' +
            'The v3 Rectangle is a polygon. But in Javascript code mode an extra code for ' +
            'polyline is presented here in the text area.\n' +
            'If you want to resize a saved rectangle, click on it.';
    }

    function circleintroduction() {
        gob('coords').value = 'Ready for Circle. Click for center. Then click for radius distance. ' +
            'You may resize and move the circle with the two draggable markers you then have.\n\n' +
            'KML code is not available for Circle.\n' +
            'Polylinecircle is a Polyline (open circle). KML available.\n' +
            'Polygoncircle is a Polygon (filled circle). KML available.';
    }

    function addOverlayFromKML1(url) {

        lineShape[shapenumbers] = new google.maps.Polyline({
            path: jsCustom[0],
            strokeColor: lineColor,
            strokeOpacity: opacity,
            strokeWeight: lineWeight
        });

        lineShape[shapenumbers].setMap(map);
        polygonShape[shapenumbers] = new google.maps.Polygon({
            path: jsCustom[0],
            strokeColor: lineColor,
            strokeOpacity: opacity,
            strokeWeight: lineWeight,
            fillColor: fillColor
        });
        polygonShape[shapenumbers].setMap(map);

        /*
        var labelOptions = {
            content: label,
            boxStyle: {
                textAlign: "center",
                fontSize: "8pt",
                width: "50px"
            },
            disableAutoPan: true,
            pixelOffset: new google.maps.Size(-25, 0),
            position: this.my_getBounds(gpoints).getCenter(),
            closeBoxURL: "",
            isHidden: false,
            pane: "mapPane",
            enableEventPropagation: true
        };

        var polygonLabel = new InfoBox(labelOptions);
        */

        $.ajax({
            type: 'POST',
            url: url,
            data: $('#search').serialize(),
            success: function(data,textStatus){
                tinyMarker = new google.maps.Marker({
                    position: new google.maps.LatLng(data.lat,data.lon),
                    map: map,
                    icon: tinyIcon,
                    label: { color: '#000', fontWeight: 'bold', fontSize: '14px', text: name, display:'block', background:'#FFF' }
                });
            },
            error: function() {
                tinyMarker = new google.maps.Marker({
                    position: jsCustom[0],
                    map: map,
                    icon: tinyIcon,
                    label: { color: '#000', fontWeight: 'bold', fontSize: '14px', text: name, display:'block', background:'#FFF' }
                });
            }
        });

        //}
        polyShape = lineShape[shapenumbers];
        jsCustom = [];
        shapenumbers++
        //shapesignal = "line";
    }

    //]]>
    function addOverlayFromKML(firstgoogleMapString,url) {
        //var linepoints = [];
        for (var i = 0; i < shapenumbers; i++) {
            /*linepoints = jsfromserver[i];
             if(linepoints[0] != linepoints[linepoints.length-1]){
             linepoints.push(linepoints[0]);

             }else{
             jsfromserver.pop();
             }
             if(linepoints[0] == linepoints[linepoints.length-1]){
             linepoints.pop();
             }
             */

            lineShape[i] = new google.maps.Polyline({
                path: jsfromserver[i],
                strokeColor: lineColor,
                strokeOpacity: opacity,
                strokeWeight: lineWeight
            });
            //polyPoints = jsfromserver[i];
            //lineShape[i].setPath(polyPoints);
            lineShape[i].setMap(map);
            polygonShape[i] = new google.maps.Polygon({
                path: jsfromserver[i],
                strokeColor: lineColor,
                strokeOpacity: opacity,
                strokeWeight: lineWeight,
                fillColor: fillColor
            });
            //polygonShape[i].setMap(map);
            google.maps.event.addListener(polygonShape[i], 'click', function (point) {
                infowindow.setContent(description[cur]);
                infowindow.setPosition(point.latLng);
                infowindow.open(map);
            });
        }

        $.ajax({
            type: 'POST',
            url: url,
            data: $('#search').serialize(),
            success: function (data) {
                tinyMarker = new google.maps.Marker({
                    position: new google.maps.LatLng(data.lat, data.lon),
                    map: map,
                    icon: tinyIcon,
                    label: {
                        color: '#000',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        text: name,
                        display: 'block',
                        background: '#FFF'
                    }
                });
            },
            error: function () {
                tinyMarker = new google.maps.Marker({
                    position: firstgoogleMapString,
                    map: map,
                    icon: tinyIcon,
                    label: {
                        color: '#000',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        text: name,
                        display: 'block',
                        background: '#FFF'
                    }
                });
            }
        });


        polyShape = lineShape[i];
        jsfromserver = [];
        //shapesignal = "line";
    }

    function stopediting() {
        editing = false;
        gob('editButton').value = 'Edit lines';
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
        for (var i = 0; i < midmarkers.length; i++) {
            midmarkers[i].setMap(null);
        }
        polyPoints = polyShape.getPath();
        //polyPoints.insertAt(polyPoints.length, polyPoints.getAt(0));
        markers = [];
        midmarkers = [];
        pointsArrayKml = [];
    }

    // the "Edit lines" button has been pressed
    function editlines() {
        if (shapesignal == "") {
            polyShape.setMap(null);
            polyShape = lineShape[cur];
            polyShape.setMap(map);
            shapesignal = "line";
        }
        if (editing == true) {
            stopediting();
            $('#communityName').attr('readonly', true);
            $('#saveCommunity').hide();
        } else {
            $('#communityName').prop('readonly', false);
            $('#saveCommunity').show();
            polyShape = lineShape[cur];
            polyPoints = polyShape.getPath();
            if (polyPoints.length > 0) {
                //polyPoints.removeAt(polyPoints.length-1);
                drawandlog();
                editing = true;
                gob('editButton').value = 'Stop edit';
            }
        }
    }
    this.editlines=function() {
        if (shapesignal == "") {
            polyShape.setMap(null);
            polyShape = lineShape[cur];
            polyShape.setMap(map);
            shapesignal = "line";
        }
        if (editing == true) {
            stopediting();
            $('#communityName').attr('readonly', true);
            $('#saveCommunity').hide();
        } else {
            $('#communityName').prop('readonly', false);
            $('#saveCommunity').show();
            polyShape = lineShape[cur];
            polyPoints = polyShape.getPath();
            if (polyPoints.length > 0) {
                //polyPoints.removeAt(polyPoints.length-1);
                drawandlog();
                editing = true;
                gob('editButton').value = 'Stop edit';
            }
            /*
                Edit all dynamic maps - this part conflicts possibly if required return later
            for(var i = 0; i < overlayname.length; i++) {
                console.log('lineshape '+i)
                polyShape = lineShape[i];
                polyPoints = polyShape.getPath();
                if(polyPoints.length > 0){
                    //polyPoints.removeAt(polyPoints.length-1);
                    drawandlog();
                    editing = true;
                    gob('editButton').value = 'Stop edit';
                }
            }
            */

        }
    }
    function drawandlog() {
        for (var i = 0; i < polyPoints.length; i++) {
            var marker = setmarkers(polyPoints.getAt(i));
            markers.push(marker);
            var kmlstringtobesaved = polyPoints.getAt(i).lng().toFixed(6) + ',' + polyPoints.getAt(i).lat().toFixed(6);
            pointsArrayKml.splice(i, 1, kmlstringtobesaved);
        }
        //markers[i-1].setMap(null);
        logCode();
        for (var i = 1; i < polyPoints.length; i++) {
            var previous = polyPoints.getAt(i - 1);
            var midmarker = setmidmarkers(polyPoints.getAt(i), previous);
            midmarkers.push(midmarker);
        }
    }



    function logCode() {
        var code = "";
        gob('coords').value = "";
        var text1 = "";
        var text2 = "";
        var lakeflag = [0];
        var coastlineflag = [0];
        if (lakeflag == 1) {
            text1 = "Clockwise: \n";
            text2 = "\nCounterclockwise: \n";
        }
        if (coastlineflag == 1) {
            text1 = "Forward: \n";
            text2 = "\nBackwards: \n";
        }
        document.getElementById("coords").value = text1;
        for (var i = 0; i < pointsArrayKml.length; i++) {
            code += pointsArrayKml[i] + ',0.0\n';
        }
        gob('coords').value = code;
        if (lakeflag == 1 || coastlineflag == 1) {
            document.getElementById("coords").value += text2;
            for (i = polyPoints.length - 1; i > -1; i--) {
                document.getElementById("coords").value += pointsArrayKml[i] + ',0.0\n';
            }
        }
    }

    function polystyle() {
        this.name = "Lump";
        this.kmlcolor = "CD0000FF";
        this.kmlfill = "9AFF0000";
        this.color = "#FF0000";
        this.fill = "#0000FF";
        this.width = 2;
        this.lineopac = 0.8;
        this.fillopac = 0.6;
    }

    function linestyle() {
        this.name = "Path";
        this.kmlcolor = "FF0000FF";
        this.color = "#FF0000";
        this.width = 3;
        this.lineopac = 1;
    }

    function circstyle() {
        this.name = "Circ";
        this.color = "#FF0000";
        this.fill = "#0000FF";
        this.width = 2;
        this.lineopac = 0.8;
        this.fillopac = 0.6;
    }

    function markerstyleobject() {
        this.name = "markerstyle";
        this.icon = mkStyle;
    }

    function placemarkobject() {
        this.name = "NAME";
        this.desc = "YES";
        this.style = "Path";
        this.stylecur = 0;
        this.tess = 1;
        this.alt = "clampToGround";
        this.plmtext = ""; // KLM text from <Placemark> to </Placemark>
        this.jstext = "";
        this.jscode = [];
        this.kmlcode = []; // coordinatepairs lng lat
        this.kmlholecode = []; // coordinatepairs lng lat
        this.poly = "pl";
        this.shape = null;
        this.point = null;
        this.toolID = 1;
        this.hole = 0;
        this.ID = 0;
    }

    function createplacemarkobject() {
        var thisplacemark = new placemarkobject();
        placemarks.push(thisplacemark);
    }

    function createpolygonstyleobject() {
        var polygonstyle = new polystyle();
        polygonstyles.push(polygonstyle);
    }

    function createlinestyleobject() {
        var polylinestyle = new linestyle();
        polylinestyles.push(polylinestyle);
    }

    function createcirclestyleobject() {
        var cirstyle = new circstyle();
        circlestyles.push(cirstyle);
    }

    function createmarkerstyleobject() {
        var thisstyle = new markerstyleobject();
        markerstyles.push(thisstyle);
    }

    function preparePolyline() {
        var polyOptions = {
            path: polyPoints,
            strokeColor: polylinestyles[lcur].color,
            strokeOpacity: polylinestyles[lcur].lineopac,
            strokeWeight: polylinestyles[lcur].width
        };
        polyShape = new google.maps.Polyline(polyOptions);
        polyShape.setMap(map);
        /*var tmpPolyOptions = {
         strokeColor: polylinestyles[lcur].color,
         strokeOpacity: polylinestyles[lcur].lineopac,
         strokeWeight: polylinestyles[lcur].width
         };
         tmpPolyLine = new google.maps.Polyline(tmpPolyOptions);
         tmpPolyLine.setMap(map);*/
    }

    function preparePolygon() {
        var polyOptions = {
            path: polyPoints,
            strokeColor: polygonstyles[pcur].color,
            strokeOpacity: polygonstyles[pcur].lineopac,
            strokeWeight: polygonstyles[pcur].width,
            fillColor: polygonstyles[pcur].fill,
            fillOpacity: polygonstyles[pcur].fillopac
        };
        polyShape = new google.maps.Polygon(polyOptions);
        polyShape.setMap(map);
    }

    function activateRectangle() {
        rectangle = new google.maps.Rectangle({
            map: map,
            strokeColor: polygonstyles[pcur].color,
            strokeOpacity: polygonstyles[pcur].lineopac,
            strokeWeight: polygonstyles[pcur].width,
            fillColor: polygonstyles[pcur].fill,
            fillOpacity: polygonstyles[pcur].fillopac
        });
    }

    function activateCircle() {
        circle = new google.maps.Circle({
            map: map,
            fillColor: circlestyles[ccur].fill,
            fillOpacity: circlestyles[ccur].fillopac,
            strokeColor: circlestyles[ccur].color,
            strokeOpacity: circlestyles[ccur].lineopac,
            strokeWeight: circlestyles[ccur].width
        });
    }

    function activateMarker() {
        markerShape = new google.maps.Marker({
            map: map,
            icon: markerstyles[mcur].icon
        });
    }

    function chooseshape(index) {
        //polyShape = lineShape[index];
        if (shapesignal == "") {
            polyShape.setMap(null);
            polyShape = lineShape[cur];
            polyShape.setMap(map);
            shapesignal = "line";
        }
        if (editing == true) {
            stopediting();
            polyShape = lineShape[index];
            cur = index;
            editlines();
        }
        polyShape = lineShape[index];
        cur = index;
    }

    this.toggleshape=function () {
        if (editing == true) {
            stopediting();
        }
        polyShape.setMap(null);
        if (shapesignal == "line") {
            if (polygonShape[cur] != null) {
                polyShape = polygonShape[cur];
                shapesignal = "";
            }
        } else {
            polyShape = lineShape[cur];
            shapesignal = "line";
        }
        polyShape.setMap(map);
    }
}
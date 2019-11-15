

<div class="col-sm-7">
    <div class="row">
        <div id="log"></div>

        <div class="col-xs-4">
            <div class='form-group'>
                <label for="countrysearch"  class="maxWidth control-label">
                    <g:message code="country.label"/>
                </label>

                <g:field type="search" autocomplete="off"  name="countrysearch"
                         class="form-control " required="true"
                         value="${instance?.countrysearch}"/>
                <g:hiddenField
                        value="${instance?.countryCode}"
                        name="countryCode"/>

            </div>
        </div>

        <div class="col-xs-4">
            <div class='form-group'>
                <span id="postcodeContainer" >
                    <label for="postcode"  class="maxWidth control-label">
                        <g:message code="postcode.label"/>
                    </label>
                    <g:field type="text"  class="form-control "

                             value="${instance?.postcode ?: ''}"
                             required="true"
                             name="postcode" />
                </span>
                <span id="postcodeError"></span>
            </div>
        </div>


    </div>
    <div class="row">

        <div class="col-sm-4">
            <div class='form-group'>
                <span class=" ${hasErrors(bean: instance, field: 'building', 'has-error')}">
                    <label for="building" ><g:message code="building.label"/></label>
                    <g:field name="building" class="form-control" id="building"
                             maxlength="100"
                             value="${instance?.building?:''}"  type="text"
                    />
                </span>
            </div>
        </div>
        <div class="col-sm-4">
            <div class='form-group'>
                <span class=" ${hasErrors(bean: instance, field: 'street', 'has-error')}">
                    <label for="street" ><g:message code="street.label"/></label>
                    <g:field name="street" id="street" class="form-control "
                             maxlength="100"  required="true"
                             value="${instance?.street?:''}"  type="text"
                    />
                </span>
            </div>
        </div>
    </div>
    <div class="row">


        <div class="col-xs-4">
            <div class='form-group'>
                <span id="cityContent">
                    <label for="city">
                        <div class="maxWidth">
                            <span id="cityContainer" >
                                <g:message code="city.label"/>
                            </span>
                        </div>
                    </label>
                    <g:field type="text"  list="cityresults"
                             value="${instance?.city ?: ''}"
                             id="city"
                             class="form-control" name="city" />
                    <datalist id="cityresults"></datalist>
                    <span id="cityError"></span>
                </span>
            </div>
        </div>
        <div class="col-xs-4">
            <div class='form-group'>
                <label for="state">
                    <div class="maxWidth">
                        <g:message code="state.label"/>
                    </div>
                </label>
                <g:field type="text"
                         value="${instance?.state ?: ''}"
                         id="state"
                         class="form-control" name="state" />

            </div>
        </div>
        <div class="col-xs-4">
            <div class='form-group'>
                <label for="communitySearch"  class="maxWidth control-label">
                    <g:message code="communitySearch.label"/>
                </label>
                <g:field type="text"  class="form-control "
                         value="${instance?.communitySearch ?: ''}"
                         name="communitySearch" />

            </div>
        </div>

        <div class="col-xs-4">
            <div class='form-group'>
                <label for="latitude"  class="maxWidth control-label">
                    <g:message code="latitude.label"/>
                </label>
                <g:field type="text"  class="form-control "
                         value="${instance?.latitude ?: ''}"
                         name="latitude" />

            </div>
        </div>

        <div class="col-xs-4">
            <div class='form-group'>
                <label for="longitude"  class="maxWidth control-label">
                    <g:message code="longitude.label"/>
                </label>
                <g:field type="text"  class="form-control "
                         value="${instance?.longitude ?: ''}"
                         name="longitude" />

            </div>
        </div>
    </div>
</div>
<div class="col-sm-4">

    <div id="resizable2" style="height:20em; margin-top:0;">
        <div id="map" style="width: 100%; height: 100%;" ></div>
        <g:render template="/googleMaps"/>
    </div>

</div>
</div>


<script>


    $(function() {

        var overlayArray=[];
        var map;
        var nav=[];
        function gob(e){if(typeof(e)=='object')return(e);if(document.getElementById)return(document.getElementById(e));return(eval(e))}
        var map;
        var overlayname = new Array();
        var description = new Array();
        var thisshape = new Array();
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
        function logCode1() {

        }
        // Called from links in polylineoptions. If Directionsmode, toolID will be changed back to 6
        function polylinestyle(e){ //save style
            if(e == 1) {
                createlinestyleobject();
                lcur++;
            }
            polylinestyles[lcur].name = gob('polylineinput4').value;
            if(e == 1) {
                if(polylinestyles[lcur].name == polylinestyles[lcur-1].name) {
                    lcur--;
                    polylinestyles.pop();
                    alert("Give the new style a new name");
                    return;
                }
            }
            polylinestyles[lcur].color = gob('polylineinput1').value;
            polylineDecColorCur = color_hex2dec(polylinestyles[lcur].color);
            polylinestyles[lcur].lineopac = gob('polylineinput2').value;
            if(polylinestyles[lcur].lineopac<0 || polylinestyles[lcur].lineopac>1) return alert('Opacity must be between 0 and 1');
            polylinestyles[lcur].width = gob('polylineinput3').value;
            if(polylinestyles[lcur].width<0 || polylinestyles[lcur].width>20) return alert('Numbers below zero and above 20 are not accepted');
            polylinestyles[lcur].kmlcolor = getopacityhex(polylinestyles[lcur].lineopac) + color_html2kml(""+polylinestyles[lcur].color);
            if(directionsYes == 1) {
                placemarks[dirline].style = polylinestyles[lcur].name;
                placemarks[dirline].stylecur = lcur;
            }else{
                placemarks[plmcur].style = polylinestyles[lcur].name;
                placemarks[plmcur].stylecur = lcur;
            }
            gob("stylenumberl").innerHTML = (lcur+1)+' ';
            if(polyShape) polyShape.setMap(null);
            preparePolyline();
            if(directionsYes == 1) {
                toolID = 6;
            }
            if(polyPoints.length > 0) {
                if(toolID == 6) {
                    logCode1a();
                }else{
                    if(codeID == 1) logCode1();
                    if(codeID == 2) logCode4();
                }
            }else{
                alert("SAVED!");
            }
        }
        function polygonstyle(e) {
            if(e == 1) {
                createpolygonstyleobject();
                pcur++;
            }
            polygonstyles[pcur].name = gob('polygoninput6').value;
            if(e == 1) {
                if(polygonstyles[pcur].name == polygonstyles[pcur-1].name) {
                    pcur--;
                    polygonstyles.pop();
                    alert("Give the new style a new name");
                    return;
                }
            }
            polygonstyles[pcur].color = gob('polygoninput1').value;
            polygonDecColorCur = color_hex2dec(polygonstyles[pcur].color);
            polygonstyles[pcur].lineopac = gob('polygoninput2').value;
            if(polygonstyles[pcur].lineopac<0 || polygonstyles[pcur].lineopac>1) return alert('Opacity must be between 0 and 1');
            polygonstyles[pcur].width = gob('polygoninput3').value;
            if(polygonstyles[pcur].width<0 || polygonstyles[pcur].width>20) return alert('Numbers below zero and above 20 are not accepted');
            polygonstyles[pcur].fill = gob('polygoninput4').value;
            polygonFillDecColorCur = color_hex2dec(polygonstyles[pcur].fill);
            polygonstyles[pcur].fillopac = gob('polygoninput5').value;
            if(polygonstyles[pcur].fillopac<0 || polygonstyles[pcur].fillopac>1) return alert('Opacity must be between 0 and 1');
            polygonstyles[pcur].kmlcolor = getopacityhex(polygonstyles[pcur].lineopac) + color_html2kml(""+polygonstyles[pcur].color);
            polygonstyles[pcur].kmlfill = getopacityhex(polygonstyles[pcur].fillopac) + color_html2kml(""+polygonstyles[pcur].fill);
            placemarks[plmcur].style = polygonstyles[pcur].name;
            placemarks[plmcur].stylecur = pcur;
            gob("stylenumberp").innerHTML = (pcur+1)+' ';
            if(polyShape) polyShape.setMap(null);
            if(outerShape) outerShape.setMap(null);
            if(holePolyArray.length > 0) {
                drawpolywithhole();
                if(codeID == 1) logCode3();
                if(codeID == 2) logCode5();
            }
            if(holePolyArray.length == 0) {
                preparePolygon();
                if(polyPoints.length > 0) {
                    if(codeID == 1) logCode2();
                    if(codeID == 2) logCode4();
                }else{
                    alert("SAVED!");
                }
            }
        }

        function circlestyle(e) {
            if(e == 1) {
                createcirclestyleobject();
                ccur++;
            }
            circlestyles[ccur].name = gob('circinput6').value;
            if(e == 1) {
                if(circlestyles[ccur].name == circlestyles[ccur-1].name) {
                    ccur--;
                    circlestyles.pop();
                    alert("Give the new style a new name");
                    return;
                }
            }
            circlestyles[ccur].color = gob('circinput1').value;
            circlestyles[ccur].lineopac = gob('circinput2').value;
            if(circlestyles[ccur].lineopac<0 || circlestyles[ccur].lineopac>1) return alert('Opacity must be between 0 and 1');
            circlestyles[ccur].width = gob('circinput3').value;
            circlestyles[ccur].fill = gob('circinput4').value;
            circlestyles[ccur].fillopac = gob('circinput5').value;
            if(circlestyles[ccur].fillopac<0 || circlestyles[ccur].fillopac>1) return alert('Opacity must be between 0 and 1');
            placemarks[plmcur].style = circlestyles[ccur].name;
            placemarks[plmcur].stylecur = ccur;
            gob("stylenumberc").innerHTML = (ccur+1)+' ';
            if(circle) circle.setMap(null);
            activateCircle();
            if(radiusPoint) {
                drawCircle();
                logCode7();
            }else{
                alert("SAVED!");
            }
        }
        function addLatLng(point){
            // In v2 I can give a shape an ID and have that ID revealed, with the map listener, when the shape is clicked on
            // I can't do that in v3. Instead I put a listener on the shape in addpolyShapelistener
            if(tinyMarker) tinyMarker.setMap(null);
            if(directionsYes == 1) {
                drawDirections(point.latLng);
                return;
            }
            if(plmcur != placemarks.length-1) {
                nextshape();
            }

            // Rectangle and circle can't collect points with getPath. solved by letting Polyline collect the points and then erase Polyline
            polyPoints = polyShape.getPath();
            // This codeline does the drawing on the map
            polyPoints.insertAt(polyPoints.length, point.latLng); // or: polyPoints.push(point.latLng)
            if(polyPoints.length == 1) {
                startpoint = point.latLng;
                placemarks[plmcur].point = startpoint; // stored because it's to be used when the shape is clicked on as a stored shape
                setstartMarker(startpoint);
                if(toolID == 5) {
                    drawMarkers(startpoint);
                }
            }
            if(polyPoints.length == 2 && toolID == 3) createrectangle(point);
            if(polyPoints.length == 2 && toolID == 4) createcircle(point);
            if(polyPoints.length == 2 && toolID == 7) createcircle(point);
            if(polyPoints.length == 2 && toolID == 8) createcircle(point);
            if(toolID == 1 || toolID == 2) { // if polyline or polygon
                var stringtobesaved = point.latLng.lat().toFixed(6) + ',' + point.latLng.lng().toFixed(6);
                var kmlstringtobesaved = point.latLng.lng().toFixed(6) + ',' + point.latLng.lat().toFixed(6);
                //Cursor position, when inside polyShape, is registered with this listener
                cursorposition(polyShape);
                if(adder == 0) { //shape with no hole
                    pointsArray.push(stringtobesaved); // collect textstring for presentation in textarea
                    pointsArrayKml.push(kmlstringtobesaved); // collect textstring for presentation in textarea
                    if(polyPoints.length == 1 && toolID == 2) closethis('polygonstuff');
                    if(codeID == 1 && toolID == 1) logCode1(); // write kml for polyline
                    if(codeID == 1 && toolID == 2) logCode2(); // write kml for polygon
                    if(codeID == 2) logCode4(); // write Google javascript
                }
                if(adder == 1) { // adder is increased in function holecreator
                    outerArray.push(stringtobesaved);
                    outerArrayKml.push(kmlstringtobesaved);
                }
                if(adder == 2) {
                    innerArray.push(stringtobesaved);
                    innerArrayKml.push(kmlstringtobesaved);
                }
            }
        }
        function setstartMarker(point){
            startMarker = new google.maps.Marker({
                position: point,
                map: map});
            startMarker.setTitle("#" + polyPoints.length);
        }
        function createrectangle(point) {
            // startMarker is southwest point. now set northeast
            nemarker = new google.maps.Marker({
                position: point.latLng,
                draggable: true,
                raiseOnDrag: false,
                title: "Draggable",
                map: map});
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
            gob('EditButton').disabled = 'disabled';
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
            var stringtobesaved = southWest.lng().toFixed(6)+','+southWest.lat().toFixed(6);
            pointsArrayKml.push(stringtobesaved);
            stringtobesaved = southWest.lng().toFixed(6)+','+northEast.lat().toFixed(6);
            pointsArrayKml.push(stringtobesaved);
            stringtobesaved = northEast.lng().toFixed(6)+','+northEast.lat().toFixed(6);
            pointsArrayKml.push(stringtobesaved);
            stringtobesaved = northEast.lng().toFixed(6)+','+southWest.lat().toFixed(6);
            pointsArrayKml.push(stringtobesaved);
            stringtobesaved = southWest.lat().toFixed(6)+','+southWest.lng().toFixed(6);
            pointsArray.push(stringtobesaved);
            stringtobesaved = northEast.lat().toFixed(6)+','+southWest.lng().toFixed(6);
            pointsArray.push(stringtobesaved);
            stringtobesaved = northEast.lat().toFixed(6)+','+northEast.lng().toFixed(6);
            pointsArray.push(stringtobesaved);
            stringtobesaved = southWest.lat().toFixed(6)+','+northEast.lng().toFixed(6);
            pointsArray.push(stringtobesaved);
            southWest = northEast = null;
            if(codeID == 2) logCode6();
            if(codeID == 1) logCode2();
        }
        function createcircle(point) {
            // startMarker is center point. now set radius
            nemarker = new google.maps.Marker({
                position: point.latLng,
                draggable: true,
                raiseOnDrag: false,
                title: "Draggable",
                map: map});
            google.maps.event.addListener(startMarker, 'drag', drawCircle);
            google.maps.event.addListener(nemarker, 'drag', drawCircle);
            startMarker.setDraggable(true);
            startMarker.setAnimation(null);
            startMarker.setTitle("Draggable");
            //drawCircle();
            //polyShape.setMap(null); // remove the Polyline that has collected the points
            //polyPoints = [];
            if (toolID == 4){
                drawCircle();
            }else{
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
            for (var a = 0; a < 360 + 1; a+=10) {
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
            if (toolID == 7)logCode1();
            if (toolID == 8)logCode2();
        }
        function drawCircle() {
            polyShape.setMap(null); // remove the Polyline that has collected the points
            polyPoints = [];
            centerPoint = startMarker.getPosition();
            radiusPoint = nemarker.getPosition();
            circle.bindTo('center', startMarker, 'position');
            calc = distance(centerPoint.lat(),centerPoint.lng(),radiusPoint.lat(),radiusPoint.lng());
            circle.setRadius(calc);
            //Cursor position, when inside circle, is registered with this listener
            cursorposition(circle);
            codeID = gob('codechoice').value = 2;
            logCode7();
        }
        // calculate distance between two coordinates
        function distance(lat1,lon1,lat2,lon2) {
            var R = 6371000; // earth's radius in meters
            var dLat = (lat2-lat1) * Math.PI / 180;
            var dLon = (lon2-lon1) * Math.PI / 180;
            var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180 ) * Math.cos(lat2 * Math.PI / 180 ) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            var d = R * c;
            return d;
        }

        function drawMarkers(point) {
            if(startMarker) startMarker.setMap(null);
            if(polyShape) polyShape.setMap(null);
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
            google.maps.event.addListener(marker, 'click', function(event){
                plmcur = id;
                markerShape = marker;
                var html = "<b>" + placemarks[plmcur].name + "</b> <br/>" + placemarks[plmcur].desc;
                infowindow.setContent(html);
                if(tinyMarker) tinyMarker.setMap(null);
                tinyMarker = new google.maps.Marker({
                    position: placemarks[plmcur].point,
                    map: map,
                    icon: tinyIcon
                });
                if(toolID != 5) toolID = gob('toolchoice').value = 5;
                if(codeID == 1)logCode9();
                if(codeID == 2)logCode8();
                infowindow.open(map,marker);
            });
            drawnShapes.push(markerShape);
            if(codeID == 2) logCode8();
            if(codeID == 1) logCode9();
        }
        function drawDirections(point) {
            if(firstdirclick > 2) {
                //if(oldpoint) waypts.push({location:oldpoint, stopover:true});
                var request = {
                    origin: dirpointstart,
                    destination: point,
                    waypoints: waypts,
                    travelMode: google.maps.DirectionsTravelMode.DRIVING
                };
                //oldpoint = point;
                waypts.push({location:point, stopover:true});
                destinations.push(request.destination);
                calcRoute(request);
            }
            if(firstdirclick == 2) {
                request = {
                    origin: dirpointstart,
                    destination: point,
                    travelMode: google.maps.DirectionsTravelMode.DRIVING
                };
                //oldpoint = point;
                waypts.push({location:point, stopover:true});
                destinations.push(request.destination);
                calcRoute(request);
            }
            if(dirpointstart == null) {
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
                dircountstart = dirline+1;
            }
        }
        //}
        function calcRoute(request) {
            directionsDisplay.setOptions({polylineOptions: {
                    strokeColor: polylinestyles[lcur].color,
                    strokeOpacity: polylinestyles[lcur].lineopac,
                    strokeWeight: polylinestyles[lcur].width}});
            if(firstdirclick == 1) directionsDisplay.setMap(map);
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
                for(var i = 0; i < result.overview_path.length; i++) {
                    polyPoints.push(result.overview_path[i]);
                    pointsArray.push(result.overview_path[i].lat().toFixed(6) + ',' + result.overview_path[i].lng().toFixed(6));
                    pointsArrayKml.push(result.overview_path[i].lng().toFixed(6) + ',' + result.overview_path[i].lat().toFixed(6));
                }
                polyShape.setPath(polyPoints);
                endLocation = new Object();
                if (step == 0) {
                    createdirMarker(legs[step].start_location,legs[step].start_address);
                    markersArray.push(legs[step].start_location.lat().toFixed(6) + ',' + legs[step].start_location.lng().toFixed(6));
                    markersArrayKml.push(legs[step].start_location.lng().toFixed(6) + ',' + legs[step].start_location.lat().toFixed(6));
                    addresssArray.push(legs[step].start_address);
                    //placemarks[plmcur].name = "Marker "+dirmarknum;
                }
                if(step>0 && removedirectionleg==0) {
                    endLocation.latlng = legs[step-1].end_location;
                    endLocation.address = legs[step-1].end_address;
                    createdirMarker(endLocation.latlng,endLocation.address);
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
            }
            else alert(status);
        }
        function createdirMarker(latlng, html) {
            if(tinyMarker) tinyMarker.setMap(null);
            createplacemarkobject();
            plmcur++; // plmcur = placemarks.length -1;
            activateMarker();
            placemarks[plmcur].name = "Marker "+dirmarknum;
            markerShape.setTitle(placemarks[plmcur].name+"\n"+html);
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
            google.maps.event.addListener(marker, 'click', function(event){
                markerShape = marker;
                plmcur = thisshape;
                //var htm = "<b>" + placemarks[thisshape].name + "</b> <br/>" + placemarks[thisshape].desc;
                if(polyPoints == 0) {
                    //infowindow.setContent(htm);
                    if(tinyMarker) tinyMarker.setMap(null);
                    tinyMarker = new google.maps.Marker({
                        position: placemarks[plmcur].point,
                        map: map,
                        icon: tinyIcon
                    });
                    if(toolID != 5) {
                        toolID = gob('toolchoice').value = 5;
                        directionsYes = 0;
                    }
                    if(codeID == 1) logCode9();
                    if(codeID == 2) logCode8();
                    //infowindow.open(map,marker);
                }
            });
            drawnShapes.push(markerShape);
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
            this.icon = "http://maps.google.com/intl/en_us/mapfiles/ms/micons/red-dot.png";
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
        var dirpointstart = null;
        //var dirpointend = 0;
        var dirline;
        var waypts = [];
        //var waypots = [];

        var markersArray = [];
        var addresssArray = [];

        var markersArrayKml = [];
        var toolID = 6;
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
        var nav=[];
        var jsCustom = []

        function addOverlayFromKML1() {
            //var linepoints = [];
            for (var i = 0; i<shapenumbers; i++) {
                /*linepoints = jsfromphp[i];
                 if(linepoints[0] != linepoints[linepoints.length-1]){
                 linepoints.push(linepoints[0]);

                 }else{
                 jsfromphp.pop();
                 }
                 if(linepoints[0] == linepoints[linepoints.length-1]){
                 linepoints.pop();
                 }
                 */

                //console.log(' - '+jsfromphp[i])
                lineShape[i] = new google.maps.Polyline({
                    path: jsCustom[i],
                    strokeColor: lineColor,
                    strokeOpacity: opacity,
                    strokeWeight: lineWeight
                });

                lineShape[i].setMap(map);
                polygonShape[i] = new google.maps.Polygon({
                    path: jsCustom[i],
                    strokeColor: lineColor,
                    strokeOpacity: opacity,
                    strokeWeight: lineWeight,
                    fillColor: fillColor
                });


            }
            polyShape = lineShape[i];
            jsCustom = [];
            //shapesignal = "line";
        }


        var tinyIcon = new google.maps.MarkerImage(
            '${asset.assetPath(src:'/map/marker_20_red.png')}',
            new google.maps.Size(12,20),
            new google.maps.Point(0,0),
            new google.maps.Point(6,16)
        );
        function loadMap() {
            $.get("${g.createLink(controller:'map', action:'loadOverlay')}/?street="+$('#street').val()+"&city="+$('#city').val()+"&postcode="+$('#postcode').val()+"&longitude="+$('#longitude').val()+"&latitude="+$('#latitude').val(), function (data) {
                $(data).find("Placemark").each(function (index, value) {
                    coords = $(this).find("coordinates").text();
                    place = $(this).find("name").text();
                    var array = coords.split(' ');
                    $.each(array, function (i, e) {
                        var c = e.split(",")
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
                    })
                })
            })
        }
        function loadOverlay(inc) {
            var overlay = new google.maps.KmlLayer(inc,{preserveViewport:true});
            overlay.setMap(map);
            overlayArray.push(overlay);
        }

        function initialize_gmap(long,lat) {
            var myLatlng = new google.maps.LatLng(lat, long);
            var myOptions = {
                zoom: 8,
                center: myLatlng,
                mapTypeControl: true,
                mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
                navigationControl: true,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }
            map = new google.maps.Map(document.getElementById("map"), myOptions);
        }

        $( "#resizable" ).resizable();
        function loadCommunityMap(name) {
            nav=[];
            $.get("${g.createLink(controller:'map', action:'loadCommunityMap')}/?name="+name, function(data){
                $(data).find("Placemark").each(function(index, value){
                    coords = $(this).find("coordinates").text();
                    place = $(this).find("name").text();
                    var array = coords.split(' ');
                    $.each(array, function (i, e) {
                        var c = e.split(",")
                        nav.push(new google.maps.LatLng(c[1],c[0]))
                    })
                })
                overlayname.push(name);
                thisshape.push("Polygon");
                jsCustom=[nav]
                var myOptions = {
                    zoom: 10,
                    center: nav[0],
                    mapTypeControl: true,
                    mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
                    navigationControl: true,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                }
                map = new google.maps.Map(document.getElementById("map${user?.id}"), myOptions);
                tmpPolyLine.setMap(map);
                addOverlayFromKML1();


                polyPoints = new google.maps.MVCArray(); // collects coordinates
                tmpPolyLine.setMap(map);

                createplacemarkobject();
                createlinestyleobject();
                createpolygonstyleobject();
                createcirclestyleobject();
                createmarkerstyleobject();
                preparePolyline(); // create a Polyline object
            });
            function mapzoom(){
                var mapZoom = map.getZoom();
                gob("myzoom").value = mapZoom;
            }
            function cursorposition(mapregion){
                google.maps.event.addListener(mapregion,'mousemove',function(point){
                    var LnglatStr6 = point.latLng.lng().toFixed(6) + ', ' + point.latLng.lat().toFixed(6);
                    var latLngStr6 = point.latLng.lat().toFixed(6) + ', ' + point.latLng.lng().toFixed(6);
                    gob('over').options[0].text = LnglatStr6;
                    gob('over').options[1].text = latLngStr6;
                });
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
            function preparePolyline(){
                var polyOptions = {
                    path: polyPoints,
                    strokeColor: polylinestyles[lcur].color,
                    strokeOpacity: polylinestyles[lcur].lineopac,
                    strokeWeight: polylinestyles[lcur].width};
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

            function preparePolygon(){
                var polyOptions = {
                    path: polyPoints,
                    strokeColor: polygonstyles[pcur].color,
                    strokeOpacity: polygonstyles[pcur].lineopac,
                    strokeWeight: polygonstyles[pcur].width,
                    fillColor: polygonstyles[pcur].fill,
                    fillOpacity: polygonstyles[pcur].fillopac};
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
        }
        function updateAddress(addressType,building,street,cityName,countryName,countryCode,postcode,state) {
            $('#building').val(building);
            $('#postcode').val(postcode);
            $('#city').val(cityName);
            $('#state').val(state);
            $('#countrysearch').val(countryName);
            $('#countryCode').val(countryCode);
            $('#street').val(street);
            $('#addressType option[value="'+addressType+'"]').attr('selected', 'selected');
            $('#addressType').addClass('btn btn-danger').effect( "shake", {  times: 40, distance: 10}, 200);
            setTimeout(function() { $('#addressType').removeClass('btn btn-danger'); },200);
            $('#postcode').trigger('blur');
        }

        function log( message ) {
            $( "<div>" ).text( message ).prependTo( "#log" );
            $( "#log" ).scrollTop( 0 );
        }
        $( "#countrysearch" ).autocomplete({
            source: '${g.createLink(controller: 'lookup', action: 'searchCountry')}',
            minLength: 3,
            select: function( event, ui ) {

                $('#countryCode').val(ui.item.code)


            },
            open: function() {
                //     $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
            },
            close: function() {
                //   $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
            }
        })


        $("#postcode").on('blur', function() {
            $("#postcode").val(($("#postcode").val()).toUpperCase());
            verifyCode($(this).val(),$('#countryCode').val())
        });
        function verifyCode(code,countryCode) {
            $.ajax({
                type: 'POST',
                url: "${g.createLink(controller: 'lookup', action:'postcodeDetails')}",
                data: {code: code, countryCode: countryCode},
                success: function (data) {
                    if (!data.lat && !data.lng) {
                        $("#postcodeError").show().html('${g.message(code:'issueResolve.label')}').addClass('has-warning').delay(10).fadeIn('normal', function () {
                            $(this).delay(1500).fadeOut();
                        }).hide();
                    }
                    if (data.streetName) {
                        $('#street').val(data.streetName);
                    }
                    $('#city').val(data.city ? data.city : data.county);
                    //$('#postcode').val(data.zip);
                    //$('#countryCode').val(data.countryCode);
                    //$('#countrysearch').val(data.countryName);
                    if (data.state){
                        $('#state').val(data.state);
                    }
                    initialize_gmap(data.lng,data.lat);

                    $('#longitude').val( data.lng);
                    $('#latitude').val( data.lat);

                    if (data.comunityName) {
                        $('#communitySearch').val( data.comunityName);
                        loadCommunityMap(data.comunityName);
                    }

                    //$('#log').html(JSON.stringify(data))

                    setTimeout(function(){loadMap();},3000);
                },
                error: function (xhr, textStatus, error) {
                    $('#street').val('');
                    $('#city').val('');
                    $('#postcode').val('');
                    // $('#countryCode').val('');
                    //$('#countrysearch').val('');
                    $('#state').val('');
                }
            });
        }
    });
</script>
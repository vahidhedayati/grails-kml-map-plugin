<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?sensor=false"></script>
<style type="text/css">
body {
    font-family: "Trebuchet MS", Arial,Helvetica,Sans Serif;
    font-size: 10pt;
}
#map {
    width: 500px;
    height: 500px;
    border: 1px solid gray;
    margin-top: 1px;
    margin-left: 1px;
}
.centertable {
    width: 740px;
    margin: 0px auto;
}
</style>


<script type="text/javascript">
    //<![CDATA[

    // This application is provided by Kjell Scharning
    //  Licensed under the Apache License, Version 2.0;
    //  http://www.apache.org/licenses/LICENSE-2.0
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
    /*var stylecount;
     var stylename = new Array();
     var styletype = new Array();
     var linecolourkml = new Array();
     var fillcolourkml = new Array();
     var stroke = new Array();
     var placemarkstyles = new Array();*/
    var infowindow = new google.maps.InfoWindow();
    var tmpPolyLine = new google.maps.Polyline({
        strokeColor: "#00FF00",
        strokeOpacity: 0.8,
        strokeWeight: 2
    });
    var presentationguide = "Ready to edit.\n" +
            "Play with the example shape. Import a kml-file. " +
            "Polygons are shown not filled - as polylines. " +
            "Click 'Edit lines' and dragable points will be shown. " +
            "The coordinates will be presented here in the text area.\n" +
            "To edit a line or shape, mouse over it and drag the points. Click on a point to delete it.\n" +
            "The imported kml-file will not be affected. Copy and paste the new coordinates in the local kml-file. " +
            "Upload the edited local kml-file.";
    var imageNormal = new google.maps.MarkerImage(
            "images/square.png",
            new google.maps.Size(11, 11),
            new google.maps.Point(0, 0),
            new google.maps.Point(6, 6)
    );
    var imageHover = new google.maps.MarkerImage(
            "images/square_over.png",
            new google.maps.Size(11, 11),
            new google.maps.Point(0, 0),
            new google.maps.Point(6, 6)
    );
    var imageNormalMidpoint = new google.maps.MarkerImage(
            "images/square_transparent.png",
            new google.maps.Size(11, 11),
            new google.maps.Point(0, 0),
            new google.maps.Point(6, 6)
    );
    // converting from php to javascript
    shapenumbers = 1;
    //stylecount = ;
    // converting php arrays to javascript arrays
    overlayname.push("Greater Rhea distribution");
    thisshape.push("Polygon");
    description.push('');
    jsfromphp = [[new google.maps.LatLng(-7,-38),new google.maps.LatLng(-5.26601,-44.29688),new google.maps.LatLng(-17.64402,-47.46094),new google.maps.LatLng(-15.2,-59.5),new google.maps.LatLng(-40,-68),new google.maps.LatLng(-40.6,-62.2),new google.maps.LatLng(-38.75408,-62.40234),new google.maps.LatLng(-38.16911,-57.87598),new google.maps.LatLng(-38.09998,-57.70020),new google.maps.LatLng(-36.73888,-56.51367),new google.maps.LatLng(-34.27084,-58.31543),new google.maps.LatLng(-34.70549,-54.88770),new google.maps.LatLng(-27.87793,-48.69141),new google.maps.LatLng(-23.60426,-48.03223),new google.maps.LatLng(-21.45307,-42.49512),new google.maps.LatLng(-7,-38)]]; // php string is pasted here and becomes javascript array

    function loadmap() {
        var myLatlng = new google.maps.LatLng(-7,-38); // value comes from php script
        var myOptions = {
            zoom: 3,
            center: myLatlng,
            mapTypeControl: true,
            mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
            navigationControl: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        map = new google.maps.Map(document.getElementById("map"), myOptions);
        tmpPolyLine.setMap(map);
        addOverlayFromKML();
        document.getElementById("coords").value = presentationguide;
        google.maps.event.addListener(map,'mousemove',function(point){
            var LnglatStr6 = point.latLng.lng().toFixed(6) + ', ' + point.latLng.lat().toFixed(6);
            var latLngStr6 = point.latLng.lat().toFixed(6) + ', ' + point.latLng.lng().toFixed(6);
            gob('over').options[0].text = LnglatStr6;
            gob('over').options[1].text = latLngStr6;
        });
        google.maps.event.addListener(map,'zoom_changed',mapzoom);
    }

    // jsfromphp array and counter generated in php script
    // the php function simplexml_load_file() is used to load and read the kml-file
    function addOverlayFromKML() {
        //var linepoints = [];
        for (var i = 0; i<shapenumbers; i++) {
            /*linepoints = jsfromphp[i];
             if(linepoints[0] != linepoints[linepoints.length-1]){
             linepoints.push(linepoints[0]);
             }else{
             jsfromphp.pop();
             }*/
            //if(linepoints[0] == linepoints[linepoints.length-1]){
            //linepoints.pop();
            //}
            lineShape[i] = new google.maps.Polyline({
                path: jsfromphp[i],
                strokeColor: lineColor,
                strokeOpacity: opacity,
                strokeWeight: lineWeight
            });
            //polyPoints = jsfromphp[i];
            //lineShape[i].setPath(polyPoints);
            lineShape[i].setMap(map);
            polygonShape[i] = new google.maps.Polygon({
                path: jsfromphp[i],
                strokeColor: lineColor,
                strokeOpacity: opacity,
                strokeWeight: lineWeight,
                fillColor: fillColor
            });
            //polygonShape[i].setMap(map);
            google.maps.event.addListener(polygonShape[i],'click',function(point){
                infowindow.setContent(description[cur]);
                infowindow.setPosition(point.latLng);
                infowindow.open(map);
            });
        }
        polyShape = lineShape[0];
        jsfromphp = [];
        //shapesignal = "line";
    }
    function stopediting(){
        editing = false;
        gob('EditButton').value = 'Edit lines';
        for(var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
        for(var i = 0; i < midmarkers.length; i++) {
            midmarkers[i].setMap(null);
        }
        polyPoints = polyShape.getPath();
        //polyPoints.insertAt(polyPoints.length, polyPoints.getAt(0));
        markers = [];
        midmarkers = [];
        pointsArrayKml = [];
    }
    // the "Edit lines" button has been pressed
    function editlines(){
        if(shapesignal == ""){
            polyShape.setMap(null);
            polyShape = lineShape[cur];
            polyShape.setMap(map);
            shapesignal = "line";
        }
        if(editing == true){
            stopediting();
        }else{
            polyShape = lineShape[cur];
            polyPoints = polyShape.getPath();
            if(polyPoints.length > 0){
                //polyPoints.removeAt(polyPoints.length-1);
                drawandlog();
                editing = true;
                gob('EditButton').value = 'Stop edit';
            }
        }
    }
    function drawandlog(){
        for(var i = 0; i < polyPoints.length; i++) {
            var marker = setmarkers(polyPoints.getAt(i));
            markers.push(marker);
            var kmlstringtobesaved = polyPoints.getAt(i).lng().toFixed(6) + ',' + polyPoints.getAt(i).lat().toFixed(6);
            pointsArrayKml.splice(i,1,kmlstringtobesaved);
        }
        //markers[i-1].setMap(null);
        logCode();
        for(var i = 1; i < polyPoints.length; i++){
            var previous = polyPoints.getAt(i-1);
            var midmarker = setmidmarkers(polyPoints.getAt(i),previous);
            midmarkers.push(midmarker);
        }
    }
    function setmarkers(point) {
        var marker = new google.maps.Marker({
            position: point,
            map: map,
            icon: imageNormal,
            raiseOnDrag: false,
            draggable: true
        });
        google.maps.event.addListener(marker, "mouseover", function() {
            marker.setIcon(imageHover);
        });
        google.maps.event.addListener(marker, "mouseout", function() {
            marker.setIcon(imageNormal);
        });
        google.maps.event.addListener(marker, "drag", function() {
            for (var i = 0; i < markers.length; i++) {
                if (markers[i] == marker) {
                    prevpoint = marker.getPosition();
                    prevnumber = i;
                    polyPoints.setAt(i, marker.getPosition());
                    movemidmarker(i);
                    break;
                }
            }
            polyPoints = polyShape.getPath();
            var kmlstringtobesaved = marker.getPosition().lng().toFixed(6) + ',' + marker.getPosition().lat().toFixed(6);
            pointsArrayKml.splice(i,1,kmlstringtobesaved);
            logCode();
        });
        google.maps.event.addListener(marker, "click", function() {
            for (var i = 0; i < markers.length; i++) {
                if (markers[i] == marker && markers.length != 1) {
                    prevpoint = marker.getPosition();
                    prevnumber = i;
                    marker.setMap(null);
                    markers.splice(i, 1);
                    polyPoints.removeAt(i);
                    removemidmarker(i);
                    break;
                }
            }
            polyPoints = polyShape.getPath();
            if(markers.length > 0) {
                pointsArrayKml.splice(i,1);
                logCode();
            }
        });
        return marker;
    }
    function setmidmarkers(point,prevpoint) {
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
        google.maps.event.addListener(marker, "mouseover", function() {
            marker.setIcon(imageHover);
        });
        google.maps.event.addListener(marker, "mouseout", function() {
            marker.setIcon(imageNormalMidpoint);
        });
        google.maps.event.addListener(marker, "dragstart", function() {
            for (var m = 0; m < midmarkers.length; m++) {
                if (midmarkers[m] == marker) {
                    var tmpPath = tmpPolyLine.getPath();
                    tmpPath.push(markers[m].getPosition());
                    tmpPath.push(midmarkers[m].getPosition());
                    tmpPath.push(markers[m+1].getPosition());
                    break;
                }
            }
        });
        google.maps.event.addListener(marker, "drag", function() {
            for (var i = 0; i < midmarkers.length; i++){
                if (midmarkers[i] == marker){
                    tmpPolyLine.getPath().setAt(1, marker.getPosition());
                    break;
                }
            }
        });
        google.maps.event.addListener(marker, "dragend", function() {
            for (var i = 0; i < midmarkers.length; i++) {
                if (midmarkers[i] == marker) {
                    var newpos = marker.getPosition();
                    var startMarkerPos = markers[i].getPosition();
                    var firstVPos = new google.maps.LatLng(
                            newpos.lat() - (0.5 * (newpos.lat() - startMarkerPos.lat())),
                            newpos.lng() - (0.5 * (newpos.lng() - startMarkerPos.lng()))
                    );
                    var endMarkerPos = markers[i+1].getPosition();
                    var secondVPos = new google.maps.LatLng(
                            newpos.lat() - (0.5 * (newpos.lat() - endMarkerPos.lat())),
                            newpos.lng() - (0.5 * (newpos.lng() - endMarkerPos.lng()))
                    );
                    var newVMarker = setmidmarkers(secondVPos,startMarkerPos);
                    newVMarker.setPosition(secondVPos);//apply the correct position to the midmarker
                    var newMarker = setmarkers(newpos);
                    markers.splice(i+1, 0, newMarker);
                    polyPoints.insertAt(i+1, newpos);
                    marker.setPosition(firstVPos);
                    midmarkers.splice(i+1, 0, newVMarker);
                    tmpPolyLine.getPath().removeAt(2);
                    tmpPolyLine.getPath().removeAt(1);
                    tmpPolyLine.getPath().removeAt(0);
                    break;
                }
            }
            polyPoints = polyShape.getPath();
            var kmlstringtobesaved = newpos.lng().toFixed(6) + ',' + newpos.lat().toFixed(6);
            pointsArrayKml.splice(i+1,0,kmlstringtobesaved);
            logCode();
        });
        return marker;
    }
    function movemidmarker(index) {
        var newpos = markers[index].getPosition();
        if (index != 0) {
            var prevpos = markers[index-1].getPosition();
            midmarkers[index-1].setPosition(new google.maps.LatLng(
                    newpos.lat() - (0.5 * (newpos.lat() - prevpos.lat())),
                    newpos.lng() - (0.5 * (newpos.lng() - prevpos.lng()))
            ));
        }
        if (index != markers.length - 1) {
            var nextpos = markers[index+1].getPosition();
            midmarkers[index].setPosition(new google.maps.LatLng(
                    newpos.lat() - (0.5 * (newpos.lat() - nextpos.lat())),
                    newpos.lng() - (0.5 * (newpos.lng() - nextpos.lng()))
            ));
        }
    }
    function removemidmarker(index) {
        if (markers.length > 0) {//clicked marker has already been deleted
            if (index != markers.length) {
                midmarkers[index].setMap(null);
                midmarkers.splice(index, 1);
            } else {
                midmarkers[index-1].setMap(null);
                midmarkers.splice(index-1, 1);
            }
        }
        if (index != 0 && index != markers.length) {
            var prevpos = markers[index-1].getPosition();
            var newpos = markers[index].getPosition();
            midmarkers[index-1].setPosition(new google.maps.LatLng(
                    newpos.lat() - (0.5 * (newpos.lat() - prevpos.lat())),
                    newpos.lng() - (0.5 * (newpos.lng() - prevpos.lng()))
            ));
        }
    }
    function logCode(){
        var code = "";
        gob('coords').value = "";
        var text1 = "";
        var text2 = "";
        var lakeflag = [0];
        var coastlineflag = [0];
        if (lakeflag==1){
            text1 = "Clockwise: \n";
            text2 = "\nCounterclockwise: \n";
        }
        if (coastlineflag==1){
            text1 = "Forward: \n";
            text2 = "\nBackwards: \n";
        }
        document.getElementById("coords").value = text1;
        for(var i = 0; i < pointsArrayKml.length; i++) {
            code += pointsArrayKml[i] + ',0.0\n';
        }
        gob('coords').value = code;
        if (lakeflag==1 || coastlineflag==1){
            document.getElementById("coords").value += text2;
            for (i = polyPoints.length-1; i>-1; i--) {
                document.getElementById("coords").value += pointsArrayKml[i] + ',0.0\n';
            }
        }
    }
    function regret(){
        for(var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
        for(var i = 0; i < midmarkers.length; i++) {
            midmarkers[i].setMap(null);
        }
        polyPoints.insertAt(prevnumber, prevpoint);
        polyShape.setPath(polyPoints);
        stopediting();
        editlines();
    }
    function chooseshape(index){
        //polyShape = lineShape[index];
        if(shapesignal == ""){
            polyShape.setMap(null);
            polyShape = lineShape[cur];
            polyShape.setMap(map);
            shapesignal = "line";
        }
        if(editing == true){
            stopediting();
            polyShape = lineShape[index];
            cur = index;
            editlines();
        }
        polyShape = lineShape[index];
        cur = index;
    }
    function toggleshape(){
        if(editing == true){
            stopediting();
        }
        polyShape.setMap(null);
        if(shapesignal == "line"){
            if(polygonShape[cur] != null){
                polyShape = polygonShape[cur];
                shapesignal = "";
            }
        }else{
            polyShape = lineShape[cur];
            shapesignal = "line";
        }
        polyShape.setMap(map);
    }
    function mapzoom(){
        var mapZoom = map.getZoom();
        document.getElementById("myzoom").value = mapZoom;
    }
    function mapcenter(){
        var mapCenter = map.getCenter();
        var latLngStr = mapCenter.lat().toFixed(6) + ', ' + mapCenter.lng().toFixed(6);
        document.getElementById("centerofmap").value = latLngStr;
    }
    // the copy part may not work with all web browsers
    function copyTextarea(){
        document.getElementById("coords").focus();
        document.getElementById("coords").select();
        copiedTxt = document.selection.createRange();
        copiedTxt.execCommand("Copy");
    }
    //]]>
</script>

</head>
<body onload="loadmap()">

<table cellpadding="5" cellspacing="0" border="0">
    <tr>
        <td>
            <h4>Edit tool for Google maps polyline and polygon (with version 3)</h4>
        </td>
    </tr>
</table>

<table cellpadding="5" cellspacing="10" border="0">
    <tr valign="top">
        <td>
            <select id="over" style="width:280px;" >
                <option selected >Longitude Latitude mousemove</option>
                <option>Latitude Longitude mousemove</option>
            </select><br />
            <input type="button" onclick="mapcenter();" value="Mapcenter"/>
            <input type="text" style="width:140px; border: 1px solid #000000;" id="centerofmap" />
        </td>
        <td>
            <form name="reload" action="editkmlfilev3.php" method="get">
                <input type=hidden name="template" value="http://www.birdtheme.org/kml/2.txt"><input type="submit" value="Erase edits and reload overlay">
                <input type="button" onclick="toggleshape();" value="Toggle polyline/polygon" id="ToggleButton"/>
            </form>
        </td>
        <td>
            <form action="#">
                <input type="button" onclick="copyTextarea();" value="Select and copy text"/>
                <input type="button" onclick="editlines();" value="Edit lines" id="EditButton"/><br />
                <input type="button" onclick="regret();" value="Regret deleted point" id="RegretButton"/>
                Zoom level:<input type="text" size="5" name="myzoom" id="myzoom" value="" style="width:15px; border: 1px solid #000000;" />
            </form>
        </td>
        <td>
            <select id="placemarks" style="width:280px;" onchange="shapeid=parseInt(this.options[this.selectedIndex].value);chooseshape(shapeid);">
                <option value="0">Greater Rhea distribution</option>
            </select>
        </td>
    </tr>
</table>

<table cellpadding="0" cellspacing="0" border="0">
    <tr>
        <td valign="top">
            <div id="map"></div>
        </td>
        <td valign="top">
            <div id="status" style="width:500px; height: 500px;">
                <form action="#">
                    <textarea id="coords" cols="70" rows="30">
                    </textarea>
                </form>
            </div>
        </td>
    </tr></table>
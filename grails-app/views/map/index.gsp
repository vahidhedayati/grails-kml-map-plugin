
<%@ page import="org.grails.plugins.kml.utils.LoadMapTypes; org.grails.plugins.kml.utils.GeoMapListener" %>
<!doctype html>
<html>
<head>
    <meta name="layout" content="main" />
    <asset:stylesheet href="jquery-ui.min.css" />
    <asset:stylesheet href="font-awesome.min.css" />
    <asset:stylesheet href="kmlMap.css" />
    <asset:javascript src="jquery-ui.min.js" />
    <asset:javascript src="kml-map.js" />

    <g:set var="entityName" value="${message(code: 'map.label', args:[currentEntry?.name])}" scope="request" />
    <title><g:message code="editEntry.label" args="[entityName]" /></title>

</head>
<body>

<g:render template="/googleMaps"/>

<div class="panel-body">

    <div class="label-outline2 label-warning">
        <div  class="h3">
            <div class="row">
                <span class="col-sm-12">
                    <i class="fa fa-globe"></i>
                    <g:message code="map.label" args="${[currentEntry?.name]}"/>
                </span>
            </div>
        </div>
    </div>
    <map:selectBoundary name="${instance.name}"/>
    <div class="panel-body">
        <g:render template="heading"/>
    </div>
    <g:form action="saveBoundary">
        <table class="table table-responsive">
            <tr>
                <td>
                    <span id="combineComm" onclick="toggleBlock('#listAvailable');" class="btn btn-info btn-xs"><g:message code="combineCommunities.label"/></span>

                    <g:if test="${instance.foundArea && !instance.foundArea?.longitude}">
                        <span id="noGeo" class="btn btn-danger btn-xs"><g:message code="noGeo.label"/></span>
                    </g:if>
                    <g:if test="${instance.areas}">
                        <span id="localComms" onclick="toggleBlock('#listLocal');" class="btn btn-info btn-xs"><g:message code="localCommunities.label"/></span>
                    </g:if>

                </td></td>

            </tr>

        </table>

        <table>
            <tr style="display: none;" id="listAvailable">
                <td colspan="6">
                    <g:each in="${org.grails.plugins.kml.utils.GeoMapListener.PLACEMARKS?.sort{it.key}}" var="p">
                        <span class="maP${p?.value?.area?.id}  btn btn-xs btn-${p.value.area?'default':'danger'}">
                            ${p.key}

                            <span  class="dropdown maxZindex">
                                <button  class="btn btn-default9 btn-danger2 btn-xs dropdown-toggle actionButton"
                                         data-name="${p.key}"
                                         data-id="${p?.value?.area?.id}"
                                         type="button"  data-toggle="dropdown"><i class="fa fa-user-md"></i><b class="caret"></b></button>

                            </span>
                        </span>
                    </g:each>
                </td>
            </tr>
            <g:if test="${instance.areas}">
                <tr id="listLocal"  style="display: none;">
                    <td colspan="6">
                        <g:each in="${instance.areas}" var="p">
                            <span class=" btn btn-xs btn-${p.area?'default':'danger'}" >
                                ${p.name}

                                <span  class="dropdown maxZindex">
                                    <button  class="btn btn-default9 btn-danger2 btn-xs dropdown-toggle actionButton"
                                             data-id="${p?.area?.id}" data-name="${p.name}"
                                             type="button"  data-toggle="dropdown"><i class="fa fa-user-md"></i><b class="caret"></b></button>

                                </span>
                            </span>
                        </g:each>
                    </td>
                </tr>
            </g:if>
        </table>
        <table cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr>
                <td valign="top">
                    <g:hiddenField name="oldName" value="${currentEntry?.name}" class="form-control" readonly="true"/>
                    <div class="col-sm-6">
                        <input type="text" name="name" id="communityName" value="${currentEntry?.name}" class="form-control" readonly="true"/>
                    </div>
                    <div class="col-sm-2">
                        <span class="btn btn-danger btn-xs"  id="editButton">${g.message(code:'edit.label')}</span>
                    </div>
                    <div class="col-sm-2">
                        <span id="saveCommunity" style="display:none;">
                            <g:submitButton name="${g.message(code:'save.label')}" class="btn btn-primary btn-xs" />
                        </span>
                    </div>
                    <div class="col-sm-4">
                        <g:set var="historyElements" value="${org.grails.plugins.kml.utils.KmlHelper.getHistory(currentEntry?.name)}"/>
                        <g:if test="${historyElements}">
                            <div class="col-sm-2"><g:select name="history" from="${historyElements}" noSelection="['':'']"/></div>
                        </g:if>
                    </div>
                    <div class="clearfix"></div>
                    <div id="dynamicFormContent">

                        <ul class="navigation">
                        </ul>
                        <div class="col-sm-12" id="map" style="height: 40em;">

                        </div>
                        <ul class="navigation">
                        </ul>
                    </div>

                </td>

                <div valign="top" class="hidden">


                    <div id="status"  >
                        <g:textArea id="coords" name="coordinations" class="form-control"/>
                        <g:textArea id="coords1" name="coordinationsKml" class="form-control"/>
                    </div>
                </div>

            </tr>
        </table>

        <ul id="contextMenu" class="dropdown-menu userMenu " role="menu" >
            <li><a id="loadMap"><g:message code="loadMap.label" args="['']"/></a></li>
            <li id="delKml"><a id="deleteKml"><g:message code="delete.label" args="['']"/></a></li>
        </ul>

    </g:form>
</div>
<script type="text/javascript">


    var KmlMap = new KmlMap();
    KmlMap.setImgNormal("${asset.assetPath(src:'/map/square.png')}");
    KmlMap.setImgHover("${asset.assetPath(src:'/map/square_over.png')}")
    KmlMap.setImgNormalMid("${asset.assetPath(src:'/map/square_transparent.png')}");
    KmlMap.setmkStyle("${asset.assetPath(src:'/map/red-dot.png')}")

    KmlMap.setMarkerImage("${asset.assetPath(src:'/map/marker_20_red.png')}")
    KmlMap.setOverlayName("${currentEntry.name}");
    // var myLatlng = ${currentEntry.firstgoogleMapString};
    // var myLatlng1 = new google.maps.LatLng(-7,-38);

    KmlMap.setShape("Polygon");
    KmlMap.setDescription('');
    KmlMap.setJsFromServer([[${currentEntry.googleMapString}]])

    function toggleBlock(called) {
        $(called).slideToggle("fast");
    }

    function loadMapButton(name) {
        KmlMap.loadCommunityMap(name,"${g.createLink(controller: 'map',action:'index')}?name="+name,"${g.createLink(controller:'map', action:'loadCommunityMap')}/?name="+name);
        $('#listAvailable,#listLocal').hide();
    }
    function loadUserButton(id) {
        if (id!='') {
            KmlMap.loadCommunity("${g.createLink(controller:'map', action:'loadCommunityUserMap')}/?community.id=" + id);
        }
        $('#listAvailable,#listLocal').hide();
    }

    function doDelete(id) {
        if (confirm('${message(code: 'deleteWarning.message')}')) {
            ajaxCall('D',id)
        }
    }
    function ajaxCall(method,id) {
        var url
        if (method=='D') {
            url="${createLink(controller:'map', action: 'delete')}/"+id;
        }
        $.ajax({
            type: 'POST',
            url: url,
            data: $('#search').serialize(),
            success: function(data){
                reloadPage();
            }
        });
    }
    function reloadPage() {
        location.reload()
    }

    $('#noGeo').on('click', function() {
        mapcenter();
        $.post("${g.createLink(controller:'map', action:'addGeo')}/?name=${currentEntry?.name}&coordinations=" +  $('#centerofmap').val(), function (data) {
            location.reload();
        })
    })


    $(function() {

        KmlMap.setGoogleMapString(${currentEntry?.googleMapString})

        KmlMap.loadmap("${g.createLink(controller: 'map',action:'index')}?name=${currentEntry?.name}");

        function expand(item){
            $('.table-responsive').css('padding-bottom', 155);
        }
        function shrink() {
            $('.table-responsive').css({'padding-bottom': '', 'overflow': ''});
        }
        function changeRow(item) {
            expand(item)
            $('table.server-sort tr').removeClass('clicked').removeClass('successUpdate').removeClass('failUpdate');
            item.parents('tr').addClass('clicked');
        }
        function resetRow(){
            $('table.server-sort tr').removeClass('clicked').removeClass('bold').removeClass('successUpdate').removeClass('failUpdate');
            shrink()
        }

        $dropdown = $("#contextMenu");
        $(window).click(function() {
            resetRow();
        });
        var editUrl="${createLink(action: 'editName')}"
        var title="${g.message(code:'edit.label', args:[''])}"
        var formUrl="${createLink(action: 'saveName')}"
        $(".actionButton").click(function(event) {
            changeRow($(this));
            var id = $(this).attr('data-id');
            var system = $(this).attr('data-system')=='true';
            var name = $(this).data('name');
            $(this).after($dropdown);
            $dropdown.find("#loadMap").attr("onclick", "loadMapButton('"+name+"');");
            $dropdown.find("#loadUsers").attr("onclick", "loadUserButton('"+id+"');");
            $dropdown.find("#deleteKml").attr("onclick", "doDelete('"+name+"');");
            $(this).dropdown();
            $('#delKml')[(id=='') ?'show':'hide']();
        });

        $('#editButton').on('click', function() {
            KmlMap.editlines();
        })


        $('.loadUserCommunity').on('click', function() {
            var communityId=$(this).data('id');
            KmlMap.loadCommunity("${g.createLink(controller:'map', action:'loadCommunityUserMap')}/?community.id=" + communityId)
        });
        $('.loadMap').on('click', function() {
            loadMapButton($(this).data('name'))
        });

        $('#addressInput').on('change', function() {
            var v=$('#addressInput').val();
            if (v!='') {
                $('#toolchoice option[value="6"]').attr('selected', 'selected');
            }
        });
        $('#searchAddress').on('click', function() {
            var name=$('#communityName').val()
            KmlMap.showAddress( "${g.createLink(controller: 'map',action:'index')}?name="+name,"${g.createLink(controller: 'map',action:'communityFromGeo')}",$('#addressInput').val());
        });

        $('#history').on('click', function() {
            if ($(this).val()!='' ) {
                location.href="${g.createLink(controller:'map', action:'loadHistory')}/?original=${currentEntry?.name}&name="+$(this).val()
            }
        });
    });

    /*var imageHoverMidpoint = new google.maps.MarkerImage(
     "square_transparent_over.png",
     new google.maps.Size(11, 11),
     new google.maps.Point(0, 0),
     new google.maps.Point(6, 6)
     );*/


    //jsfromserver = [[new google.maps.LatLng(-7,-38),new google.maps.LatLng(-5.26601,-44.29688),new google.maps.LatLng(-17.64402,-47.46094),new google.maps.LatLng(-15.2,-59.5),new google.maps.LatLng(-40,-68),new google.maps.LatLng(-40.6,-62.2),new google.maps.LatLng(-38.75408,-62.40234),new google.maps.LatLng(-38.16911,-57.87598),new google.maps.LatLng(-38.09998,-57.70020),new google.maps.LatLng(-36.73888,-56.51367),new google.maps.LatLng(-34.27084,-58.31543),new google.maps.LatLng(-34.70549,-54.88770),new google.maps.LatLng(-27.87793,-48.69141),new google.maps.LatLng(-23.60426,-48.03223),new google.maps.LatLng(-21.45307,-42.49512),new google.maps.LatLng(-7,-38)]]; // php string is pasted here and becomes javascript array


</script>

</body>
</html>
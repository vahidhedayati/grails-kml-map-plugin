<asset:stylesheet href="jquery-ui.min.css" />
<asset:javascript src="jquery-ui.min.js" />
<asset:javascript src="addressMap.js" />
<div class="col-sm-7" style="height:40em !important">
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
                             value="${instance?.building?:''}"  type="text"/>
                </span>
            </div>
        </div>
        <div class="col-sm-4">
            <div class='form-group'>
                <span class=" ${hasErrors(bean: instance, field: 'street', 'has-error')}">
                    <label for="street" ><g:message code="street.label"/></label>
                    <g:if test="${streetRequired}">
                        <g:field name="street" id="street" class="form-control " maxlength="100"  required="true"
                                 value="${instance?.street?:''}"  type="text"/>
                    </g:if>
                    <g:else>
                        <g:field name="street" id="street" class="form-control " maxlength="100"
                                 value="${instance?.street?:''}"  type="text"/>
                    </g:else>

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
        <g:if test="${showState}">
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
        </g:if>
        <g:if test="${showArea}">
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
        </g:if>
        <g:if test="${showLatLong}">
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
        </g:if>
    </div>
</div>
<g:if test="${grailsApplication.config.kmlplugin.ENABLE_MAP_LOOKUP && Boolean.valueOf(grailsApplication.config.kmlplugin.ENABLE_MAP_LOOKUP)}">
    <div class="col-sm-4" id="resizable2" style="height:40em; margin-top:0;">
        <div id="map" style="width: 100%; height: 100%;" ></div>
        <g:render template="/googleMaps"/>
    </div>
</g:if>
</div>
<script>

    var AddressMap = new AddressMap();
    $(function() {
        <g:if test="${instance?.countryCode && instance?.postcode && !instance.latitude}">
        console.log('verify')
        verifyCode('${instance?.postcode}','${instance?.countryCode}')
        </g:if>
        <g:if test="${instance?.countryCode && instance?.postcode && instance.latitude &&
        instance.longitude &&grailsApplication.config.kmlplugin.ENABLE_MAP_LOOKUP &&
        Boolean.valueOf(grailsApplication.config.kmlplugin.ENABLE_MAP_LOOKUP)}">
        console.log('other thing')
        AddressMap.setMarker("${asset.assetPath(src:'/map/marker_20_red.png')}")
        AddressMap.initialize_gmap('${instance.longitude}','${instance.latitude}');
        <g:if test="${instance?.communitySearch}">
        AddressMap.loadCommunityMap("${g.createLink(controller:'map', action:'loadCommunityMap')}/?name=${instance?.communitySearch}");
        </g:if>
        setTimeout(function(){  AddressMap.loadMap("${g.createLink(controller:'map', action:'loadOverlay')}/?street=" + $('#street').val() + "&city=" + $('#city').val() + "&postcode=" + $('#postcode').val() + "&longitude=" + $('#longitude').val() + "&latitude=" + $('#latitude').val());},3000);
        $("#resizable").resizable();
        </g:if>
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
                    $('#longitude').val( data.lng);
                    $('#latitude').val( data.lat);

                    <g:if test="${grailsApplication.config.kmlplugin.ENABLE_MAP_LOOKUP && Boolean.valueOf(grailsApplication.config.kmlplugin.ENABLE_MAP_LOOKUP)}">
                    AddressMap.setMarker("${asset.assetPath(src:'/map/marker_20_red.png')}")
                    AddressMap.initialize_gmap(data.lng,data.lat);
                    if (data.comunityName) {
                        AddressMap.loadCommunityMap("${g.createLink(controller:'map', action:'loadCommunityMap')}/?name="+data.comunityName);
                    }
                    setTimeout(function(){  AddressMap.loadMap("${g.createLink(controller:'map', action:'loadOverlay')}/?street=" + $('#street').val() + "&city=" + $('#city').val() + "&postcode=" + $('#postcode').val() + "&longitude=" + $('#longitude').val() + "&latitude=" + $('#latitude').val());},3000);
                    $("#resizable").resizable();
                    </g:if>



                    //if (data.comunityName) {
                    $('#communitySearch').val( data.comunityName);
                    //}
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
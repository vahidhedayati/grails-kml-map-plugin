


<div class="row">


    <div id="log"></div>


    <div class="col-xs-4">
        <div class='form-group'>
            <span id="postcodeContainer" >
                <label for="postcode"  class="maxWidth control-label">
                    <g:message code="postcode.label"/>
                </label>
                <g:field type="text"  class="form-control "
                         id="postcode"
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
            <label for="countrysearch"  class="maxWidth control-label">
                <g:message code="country.label"/>
            </label>

                <g:field type="search" autocomplete="off" id="countrysearch" name="countrysearch"
                             class="form-control " required="true" 
                             value="${instance?.countrysearch}"/>
                <g:hiddenField id="countryCode"
                               value="${instance?.countryCode}"
                               name="countryCode"/>

        </div>
    </div>

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

</div>


<script>
    $(function() {

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
        })

        $( "#country33search" ).autocomplete({
            /*source: function( request, response ) {
                $.ajax({
                    url: '${g.createLink(controller: 'lookup', action: 'searchCountry')}',
                    dataType: "json",
                    data: {
                        term: request.term
                    },
                    success: function( data ) {
                        response( data );
                        //console.log(JSON.stringify(data))
                    }
                });
            },
            */
            source: '${g.createLink(controller: 'lookup', action: 'searchCountry')}',
            minLength: 3,
                select: function( event, ui ) {

                log( ui.item ?
                    "Selected: " + ui.item.label :
                    "Nothing selected, input was " + this.value);
            },
            open: function() {
           //     $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
            },
            close: function() {
             //   $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
            }
        });


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

                    if (data.communityId) {
                        //$('#commId').val(data.communityId);
                        //$('#communitySearch').val(data.communitySearch);
                        $('#communitySearch').addClass('btn btn-danger').effect( "shake", {  times: 40, distance: 10}, 200);
                        setTimeout(function() { $('#communitySearch').removeClass('btn btn-danger'); },200);
                        $('#communitySearch').autocomplete('search', data.communitySearch);

                        // $('#communitySearch').data('uiAutocomplete')._trigger('select');
                        //var ui={"item" :{"label":data.communitySearch, "id": data.communityId,"code":"null"}}

                        //$('#communitySearch').data('ui-autocomplete')._trigger('select', 'autocompleteselect',ui);
                    }
                 
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
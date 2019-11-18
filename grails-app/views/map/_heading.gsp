<div id="mapHeading">

    <div id="buttonrow">
        <div class="topbutton">
            <form id="tools"   method="post" onsubmit="return false">
                <select id="toolchoice" name="toolchoice" style="border:1px solid #000000;"
                        onchange="setTool(parseInt(this.options[this.selectedIndex].value));">
                    <option selected="selected" value="1"><g:message code="polyLine.label"/></option>
                    <option value="2"><g:message code="polygon.label"/></option>
                    <option value="3"><g:message code="rectangle.label"/></option>
                    <option value="4"><g:message code="circle.label"/></option>
                    <option value="5"><g:message code="marker.label"/></option>

                    <option value="6"><g:message code="directions.label"/></option>

                    <option value="7"><g:message code="polylinecircle.label"/></option>
                    <option value="8"><g:message code="polygoncircle.label"/></option>

                </select>
            </form>
        </div>
        <div class="topbutton">
            <select id="codechoice" name="codechoice" style="border:1px solid #000000;width:60px;"
                    onchange="setCode(parseInt(this.options[this.selectedIndex].value));">
                <option selected="selected" value="1"><g:message code="kml.label" args="${['']}"/></option>
                <option value="2"><g:message code="javaScript.label"/></option>
            </select>
        </div>
        <div class="topbutton">
            <form action="#">
                <select id="over" style="width:180px; border:1px solid #000000;">
                    <option><g:message code="longLatMove.label"/></option>
                    <option selected="selected"><g:message code="latLongMove.label"/></option>
                </select>
                <input type="button" onclick="mapcenter();" value="Mapcenter"/>
                <input type="text" style="width:95px; border: 1px solid #000000;" id="centerofmap" />
                <g:message code="zoom.level"/>:
                <input type="text" class="btn btn-xs" size="5" name="myzoom" id="myzoom" value="" class="form-control"/>

            </form>
        </div>
        <div class="topbutton">
            <span class="btn btn-warning btn-xs"><i class="fa fa-refresh"></i> <g:message code="refresh.label"/></span>
        </div>
        <div class="topbutton">
            <g:link controller="map" action="upload" class="btn btn-primary btn-xs">
                <i class="fa fa-upload"></i> <g:message code="upload.label"/></g:link>
        </div>


        <div class="topbutton">
            <span class="btn btn-info btn-xs">
                <g:link controller="map" action="communityXml" params="${[name:currentEntry?.name]}" target="newWin">
                    <i class="fa fa-file-powerpoint-o"></i> <g:message code="kml.label" args="${[currentEntry.name]}"/>
                </g:link>
            </span>
        </div>

        <div class="topbutton">
            <span class="btn btn-warning btn-xs" onclick="toggleshape();">${g.message(code:'toggleShape.label')}</span>
        </div>
        <div class="topbutton">
            <span class="btn btn-default btn-xs" onclick="nextshape()" >${g.message(code:'nextShape.label')}</span>
        </div>
        <div class="topbutton">
            <span class="btn btn-danger btn-xs" onclick="clearMap()" >${g.message(code:'clearMap.label')}</span>
        </div>
        <div class="topbutton">
            <span class="btn btn-warning btn-xs" onclick="deleteLastPoint()" >${g.message(code:'delLastPoint.label')}</span>
        </div>
        <div class="topbutton">
            <span class="btn btn-default btn-xs" onclick="styleprep()" >${g.message(code:'styleOpt.label')}</span>
        </div>
        <div class="topbutton">
            <span class="btn btn-primary btn-xs" onclick="copyTextarea();" >${g.message(code:'selectCopy.label')}</span>
        </div>
        <div class="topbutton">
            <span class="btn btn-success btn-xs" onclick="regret();" id="RegretButton">${g.message(code:'undo.label')}</span>
        </div>

        <div class="topbutton">
            <input type="text" style="border: 1px solid #000000;" size="30" name="address"
                   id="addressInput" placeholder="${g.message(code:'address.label')}" >
            <span id="searchAddress" class=" btn btn-default btn-xs"><g:message code="search.label"/></span>
        </div>

    </div>
    <div id="polylineoptions">
        <div style="padding-top:5px; margin-bottom:10px;">
            <div style="float:left;" class="styletitle"><g:message code="polyLine.label"/></div>
            <div style="float:right;"><a class="closebutton" onclick="closethis('polylineoptions');">X</a></div>
        </div>
        <div class="clear"></div>
        <div style="float:left; padding-left:5px; width:230px">
            <form id="style1" style="padding-bottom:1px;"  method="post" onsubmit="return false">
                <div class="label"><g:message code="strokeColor.label"/></div>
                <input class="input" type="text" name="color" id="polylineinput1" />
                <div class="clear"></div>
                <div class="label"><g:message code="strokeOpacity.label"/></div>
                <input class="input" type="text" name="opacity" id="polylineinput2" />
                <div class="clear"></div>
                <div class="label"><g:message code="strokeWeight.label"/></div>
                <input class="input" type="text" name="weight" id="polylineinput3" />
                <div class="clear"></div>
                <div class="label"><g:message code="styleId.label"/></div>
                <input class="inputlong" type="text" name="styleid" id="polylineinput4" />
            </form>
        </div>
        <div class="clear"></div>
        <div>
            <a class="oklink" onclick="polylinestyle(0);"><g:message code="saveChanges.label"/></a>
        </div>
        <div style="margin-top:5px">
            <a class="oklink" onclick="polylinestyle(1);"><g:message code="saveNewStyle.label"/></a>
        </div>
        <div style="width:100%; text-align:center; margin-top:5px">
            <input type="button" class="buttons" name="backwards" id="backwards"
                   value="${g.message(code:'previous.label')}" onclick="stepstyles(-1);"/>
            <g:message code="style.label"/> <span id="stylenumberl">1 </span>
            <input type="button" class="buttons" name="forwards" id="forwards"
                   value="${g.message(code:'next.label')}" onclick="stepstyles(1);"/>
        </div>
    </div>
    <div id="polygonoptions">
        <div style="padding-top:5px; margin-bottom:10px;">
            <div style="float:left;" class="styletitle"><g:message code="polygon.label"/></div>
            <div style="float:right;"><a class="closebutton"
                                         onclick="closethis('polygonoptions');">X</a></div>
        </div>
        <div class="clear"></div>
        <div style="float:left; padding-left:5px; width:230px">
            <form id="style2" style="padding-bottom:1px;" action="./" method="post" onsubmit="return false">
                <div class="label"><g:message code="strokeColor.label"/></div>
                <input class="input" type="text" name="color" id="polygoninput1" />
                <div class="clear"></div>
                <div class="label"><g:message code="strokeOpacity.label"/></div>
                <input class="input" type="text" name="opacity" id="polygoninput2" />
                <div class="clear"></div>
                <div class="label"><g:message code="strokeWeight.label"/></div>
                <input class="input" type="text" name="weight" id="polygoninput3" />
                <div class="clear"></div>
                <div class="label"><g:message code="fillColor.label"/></div>
                <input class="input" type="text" name="fillcolor" id="polygoninput4" />
                <div class="clear"></div>
                <div class="label"><g:message code="fillOpacity.label"/></div>
                <input class="input" type="text" name="fillopacity" id="polygoninput5" />
                <div class="clear"></div>
                <div class="label"><g:message code="styleId.label"/></div>
                <input class="inputlong" type="text" name="styleid" id="polygoninput6" />
            </form>
        </div>
        <div class="clear"></div>
        <div>
            <a class="oklink" onclick="polygonstyle(0)"><g:message code="saveChanges.label"/></a>
        </div>
        <div style="margin-top:5px">
            <a class="oklink" onclick="polygonstyle(1)"><g:message code="saveNewStyle.label"/></a>
        </div>
        <div style="width:100%; text-align:center; margin-top:5px">
            <input type="button" class="buttons" name="backwards" id="backwards"
                   value="${g.message(code:'previous.label')}" onclick="stepstyles(-1);"/>
            Style <span id="stylenumberp">1 </span>
            <input type="button" class="buttons" name="forwards" id="forwards"
                   value="${g.message(code:'next.label')}" onclick="stepstyles(1);"/>
        </div>
    </div>

    <div id="circleoptions">
        <div style="padding-top:5px; margin-bottom:10px;">
            <div style="float:left;" class="styletitle"><g:message code="circle.label"/></div>
            <div style="float:right;"><a class="closebutton"  onclick="closethis('circleoptions');">X</a></div>
        </div>
        <div class="clear"></div>
        <div style="float:left; padding-left:5px; width:250px">
            <form id="rect" style="padding-bottom:1px;" action="./" method="post" onsubmit="return false">
                <div class="label"><g:message code="strokeColor.label"/></div>
                <input class="input" type="text" name="color" id="circinput1" />
                <div class="clear"></div>
                <div class="label"><g:message code="strokeOpacity.label"/></div>
                <input class="input" type="text" name="opacity" id="circinput2" />
                <div class="clear"></div>
                <div class="label"><g:message code="strokeWeight.label"/></div>
                <input class="input" type="text" name="weight" id="circinput3" />
                <div class="clear"></div>
                <div class="label"><g:message code="fillColor.label"/></div>
                <input class="input" type="text" name="fillcolor" id="circinput4" />
                <div class="clear"></div>
                <div class="label"><g:message code="fillOpacity.label"/></div>
                <input class="input" type="text" name="fillopacity" id="circinput5" />
                <div class="clear"></div>
                <div class="label"><g:message code="styleId.label"/></div>
                <input class="inputlong" type="text" name="styleid" id="circinput6" />
            </form>
        </div>
        <div class="clear"></div>
        <div>
            <a class="oklink" onclick="circlestyle(0)"><g:message code="saveChanges.label"/></a>
        </div>
        <div style="margin-top:5px">
            <a class="oklink" onclick="circlestyle(1)"><g:message code="saveNewStyle.label"/></a>
        </div>
        <div style="width:100%; text-align:center; margin-top:5px">
            <input type="button" class="buttons" name="backwards" id="backwards"
                   value="${g.message(code:'previous.label')}" onclick="stepstyles(-1);"/>
            Style <span id="stylenumberc">1 </span>
            <input type="button" class="buttons" name="forwards" id="forwards"
                   value="${g.message(code:'next.label')}" onclick="stepstyles(1);"/>
        </div>
    </div>
    <div id="markeroptions">
        <div id="iconimages">
            <table>
                <tr>
                    <td><asset:image src="/map/red-dot.png"/></td>
                    <td><asset:image src="/map/orange-dot.png"/></td>
                    <td><asset:image src="/map/yellow-dot.png"/></td>
                    <td><asset:image src="/map/green-dot.png"/></td>
                    <td><asset:image src="/map/blue-dot.png"/></td>
                    <td><asset:image src="/map/purple-dot.png"/></td>
                    <td><asset:image src="/map/red.png"/></td>
                    <td><asset:image src="/map/orange.png"/></td>
                    <td><asset:image src="/map/yellow.png"/></td>
                    <td><asset:image src="/map/green.png"/></td>
                    <td><asset:image src="/map/blue.png"/></td>
                    <td><asset:image src="/map/purple.png"/></td>
                </tr>
                <tr>
                    <td><input type="button" name="button" value="${g.message(code:'use.label')}"
                               onclick='iconoptions("${asset.image(src: "/map/red-dot.png")}");' />
                    </td>
                    <td><input type="button" name="button" value="${g.message(code:'use.label')}"
                               onclick='iconoptions("${asset.image(src: "/map/orange-dot.png")}");' />
                    </td>
                    <td><input type="button" name="button" value="${g.message(code:'use.label')}"
                               onclick='iconoptions("${asset.image(src: "/map/yellow-dot.png")}");' />
                    </td>
                    <td><input type="button" name="button" value="${g.message(code:'use.label')}"
                               onclick='iconoptions("${asset.image(src: "/map/green-dot.png")}");' />
                    </td>
                    <td><input type="button" name="button" value="${g.message(code:'use.label')}"
                               onclick='iconoptions("${asset.image(src: "/map/blue-dot.png")}");' />
                    </td>
                    <td><input type="button" name="button" value="${g.message(code:'use.label')}"
                               onclick='iconoptions("${asset.image(src: "/map/purple-dot.png")}");' />
                    </td>
                    <td><input type="button" name="button" value="${g.message(code:'use.label')}"
                               onclick='iconoptions("${asset.image(src: "/map/red.png")}");' />
                    </td>
                    <td><input type="button" name="button" value="${g.message(code:'use.label')}"
                               onclick='iconoptions("${asset.image(src: "/map/orange.png")}");' />
                    </td>
                    <td><input type="button" name="button" value="${g.message(code:'use.label')}"
                               onclick='iconoptions("${asset.image(src: "/map/yellow.png")}");' />
                    </td>
                    <td><input type="button" name="button" value="${g.message(code:'use.label')}"
                               onclick='iconoptions("${asset.image(src: "/map/green.png")}");' />
                    </td>
                    <td><input type="button" name="button" value="${g.message(code:'use.label')}"
                               onclick='iconoptions("${asset.image(src: "/map/blue.png")}");' />
                    </td>
                    <td><input type="button" name="button" value="${g.message(code:'use.label')}"
                               onclick='iconoptions("${asset.image(src: "/map/purple.png")}");' />
                    </td>
                </tr>
                <tr>
                    <td><asset:image src="/map/dd-start.png"/></td>
                    <td><asset:image src="/map/dd-end.png"/></td>
                    <td><asset:image src="/map/markerA.png"/></td>
                    <td><asset:image src="/map/marker_orangeA.png"/></td>
                    <td><asset:image src="/map/marker_yellowA.png"/></td>
                    <td><asset:image src="/map/marker_greenA.png"/></td>
                    <td><asset:image src="/map/marker_brownA.png"/></td>
                    <td><asset:image src="/map/marker_purpleA.png"/></td>
                    <td><asset:image src="/map/marker_blackA.png"/></td>
                    <td><asset:image src="/map/marker_greyA.png"/></td>
                    <td><asset:image src="/map/marker_whiteA.png"/></td>
                </tr>
                <tr>
                    <td><input type="button" name="button" value="${g.message(code:'use.label')}"
                               onclick='iconoptions("${asset.image(src: "/map/dd-start.png")}");' />
                    </td>
                    <td><input type="button" name="button" value="${g.message(code:'use.label')}"
                               onclick='iconoptions("${asset.image(src: "/map/dd-end.png")}");' />
                    </td>
                    <td><input type="button" name="button" value="${g.message(code:'use.label')}"
                               onclick='iconoptions("${asset.image(src: "/map/markerA.png")}");' />
                    </td>
                    <td><input type="button" name="button" value="${g.message(code:'use.label')}"
                               onclick='iconoptions("${asset.image(src: "/map/marker_orangeA.png")}");' />
                    </td>
                    <td><input type="button" name="button" value="${g.message(code:'use.label')}"
                               onclick='iconoptions("${asset.image(src: "/map/marker_yellowA.png")}");' />
                    </td>
                    <td><input type="button" name="button" value="${g.message(code:'use.label')}"
                               onclick='iconoptions("${asset.image(src: "/map/marker_greenA.png")}");' />
                    </td>
                    <td><input type="button" name="button" value="${g.message(code:'use.label')}"
                               onclick='iconoptions("${asset.image(src: "/map/marker_brownA.png")}");' />
                    </td>
                    <td><input type="button" name="button" value="${g.message(code:'use.label')}"
                               onclick='iconoptions("${asset.image(src: "/map/marker_purpleA.png")}");' />
                    </td>
                    <td><input type="button" name="button" value="${g.message(code:'use.label')}"
                               onclick='iconoptions("${asset.image(src: "/map/marker_blackA.png")}");' />
                    </td>
                    <td><input type="button" name="button" value="${g.message(code:'use.label')}"
                               onclick='iconoptions("${asset.image(src: "/map/marker_greyA.png")}");' />
                    </td>
                    <td><input type="button" name="button" value="${g.message(code:'use.label')}"
                               onclick='iconoptions("${asset.image(src: "/map/marker_whiteA.png")}");'  />
                    </td>
                </tr>
            </table>
            <table>
                <tr>
                    <td><asset:image src="/map/marker_20_red.png"/></td>
                    <td><asset:image src="/map/marker_20_orange.png"/></td>
                    <td><asset:image src="/map/marker_20_yellow.png"/></td>
                    <td><asset:image src="/map/marker_20_green.png"/></td>
                    <td><asset:image src="/map/marker_20_brown.png"/></td>
                    <td><asset:image src="/map/marker_20_blue.png"/></td>
                    <td><asset:image src="/map/marker_20_purple.png"/></td>
                    <td><asset:image src="/map/marker_20_black.png"/></td>
                    <td><asset:image src="/map/marker_20_white.png"/></td>
                </tr>
                <tr>
                    <td><input type="button" name="button" value="${g.message(code:'use.label')}"
                               onclick='iconoptions("${asset.image(src: "/map/marker_20_red.png")}");'  />
                    </td>
                    <td><input type="button" name="button" value="${g.message(code:'use.label')}"
                               onclick='iconoptions("${asset.image(src: "/map/marker_20_orange.png")}");' />
                    </td>
                    <td><input type="button" name="button" value="${g.message(code:'use.label')}"
                               onclick='iconoptions("${asset.image(src: "/map/marker_20_yellow.png")}");'  />
                    </td>
                    <td><input type="button" name="button" value="${g.message(code:'use.label')}"
                               onclick='iconoptions("${asset.image(src: "/map/marker_20_green.png")}");' />
                    </td>
                    <td><input type="button" name="button" value="${g.message(code:'use.label')}"
                               onclick='iconoptions("${asset.image(src: "/map/marker_20_brown.png")}");'  />
                    </td>
                    <td><input type="button" name="button" value="${g.message(code:'use.label')}"
                               onclick='iconoptions("${asset.image(src: "/map/marker_20_blue.png")}");'  />
                    </td>
                    <td><input type="button" name="button" value="${g.message(code:'use.label')}"
                               onclick='iconoptions("${asset.image(src: "/map/marker_20_purple.png")}");'  />
                    </td>
                    <td><input type="button" name="button" value="${g.message(code:'use.label')}"
                               onclick='iconoptions("${asset.image(src: "/map/marker_20_black.png")}");' />
                    </td>
                    <td><input type="button" name="button" value="${g.message(code:'use.label')}"
                               onclick='iconoptions("${asset.image(src: "/map/marker_20_white.png")}");'  />
                    </td>
                </tr>
            </table>
            <table>
                <tr>
                    <td><asset:image src="/map/bar.png"/></td>
                    <td><asset:image src="/map/restaurant.png"/></td>
                    <td><asset:image src="/map/lodging.png"/></td>
                    <td><asset:image src="/map/golfer.png"/></td>
                    <td><asset:image src="/map/sportvenue.png"/></td>
                    <td><asset:image src="/map/planecrash.png"/></td>
                    <td><asset:image src="/map/square-compass.png"/></td>
                </tr>
                <tr>
                    <td>
                        <span class="btn btn-default btn-xs"
                              onclick='iconoptions("${asset.image(src: "/map/bar.png")}");'>
                            <g:message code="use.label"/></span>
                    </td>
                    <td> <span class="btn btn-default btn-xs"
                               onclick='iconoptions("${asset.image(src: "/map/restaurant.png")}");'>
                        <g:message code="use.label"/></span>
                    </td>
                    <td> <span class="btn btn-default btn-xs"
                               onclick='iconoptions("${asset.image(src: "/map/lodging.png")}");'>
                        <g:message code="use.label"/></span>
                    </td>
                    <td> <span class="btn btn-default btn-xs"
                               onclick='iconoptions("${asset.image(src: "/map/golfer.png")}");'>
                        <g:message code="use.label"/></span>
                    </td>
                    <td> <span class="btn btn-default btn-xs"
                               onclick='iconoptions("${asset.image(src: "/map/sportvenue.png")}");'>
                        <g:message code="use.label"/></span>
                    </td>
                    <td> <span class="btn btn-default btn-xs"
                               onclick='iconoptions("${asset.image(src: "/map/planecrash.png")}");'>
                        <g:message code="use.label"/></span>
                    </td>
                    <td> <span class="btn btn-default btn-xs"
                               onclick='iconoptions("${asset.image(src: "/map/square-compass.png")}");'>
                        <g:message code="use.label"/></span>
                    </td>
                </tr>
            </table>
        </div>
        <div id="stylestext">
            <form action="#" style="padding-top:3px; margin-top:-5px">
                <div style="float:left;" class="styletitle"><g:message code="marker.label"/></div>
                <div style="float:right;"><a class="closebutton"  onclick="closethis('markeroptions');">X</a></div>
                <div class="clear"></div>
                <div><br />
                    &lt;<g:message code="styleId.label"/> =<input type="text" id="st1" value="markerstyle" style="width:100px; border: 2px solid #ccc;" /><br />
                    &nbsp;&nbsp;&lt;Icon&gt;&lt;href&gt;
                    <input type="text" id="st2" value="${asset.assetPath(src: "/map/red-dot.png")}" style="width:380px; border: 2px solid #ccc;" /><br />
                    <span id="currenticon" style="height: 35px"><asset:image src="/map/red-dot.png" /></span>
                    <g:message code="defaultIconChart.label"/>
                    <input style="width:120px; margin-left:8px" type="button" name="button" value="${g.message(code:'back.label')}"
                           onclick='iconoptions("${asset.image(src: "/map/red-dot.png")}");' />
                    <br /><br />
                </div>
                <div style="margin-top:5px">
                    <a class="oklink" onclick="markerstyle(0)"><g:message code="saveChanges.label"/></a>
                    <a class="oklink" onclick="markerstyle(1)"><g:message code="saveNewStyle.label"/></a>
                </div>
                <div style="width:100%; text-align:center; margin-top:5px">
                    <input type="button" class="buttons" name="backwards" value="${g.message(code:'previous.label')}" onclick="stepstyles(-1);"/>
                    <g:message code="style.label"/> <span id="stylenumberm">1 </span>
                    <input type="button" class="buttons" name="forwards" value="${g.message(code:'next.label')}" onclick="stepstyles(1);"/>
                </div>
            </form>
        </div>
    </div>
    <div id="directionstyles">
        <div style="float:right;"><a class="closebutton" onclick="closethis('directionstyles');">X</a></div>
        <div class="clear"></div>
        <div style="width:100%; text-align:center; padding-top:40px">
            <input type="button" class="buttons" name="markerbutton" value="Markerstyles" onclick="styleoptions(5);"/>
        </div>
        <div style="width:100%; text-align:center; padding-top:15px">
            <input type="button" class="buttons" name="linebutton" value="Linestyles" onclick="styleoptions(1);"/>
        </div>
    </div>
    <div id="toppers">
        <form action="#">
            &lt;<g:message code="document.label"/>&gt;<br />
            &nbsp;&nbsp;&lt;<g:message code="name.label"/>&gt;<input type="text" id="doc1" value="${g.message(code:'myDoc.label')}" style="width:345px; border:2px solid #ccc;" /><br />
            &nbsp;&nbsp;&lt;<g:message code="description.label"/>&gt;<input type="text" id="doc2" value="${g.message(code:'content.label')}" style="width:312px; border:2px solid #ccc;" /><br /><br />
            &lt;<g:message code="placemark.label"/>&gt;<br />
            &nbsp;&nbsp;&lt;<g:message code="name.label"/>&gt;<input type="text" id="plm1" value="${g.message(code:'name.label')}" style="width:345px; border:2px solid #ccc;" /><br />
            &nbsp;&nbsp;&lt;<g:message code="description.label"/>&gt;<input type="text" id="plm2" value="${g.message(code:'yes.label')}" style="width:312px; border:2px solid #ccc;" /><br />
            &nbsp;&nbsp;&lt;<g:message code="styleUrl.label"/>&gt;<em> current style</em><br />
            &nbsp;&nbsp;&lt;<g:message code="tessellate.label"/>&gt;<input type="text" id="plm3" value="1" style="width:20px; border:2px solid #ccc;" />&lt;/tessellate&gt;
        &lt;<g:message code="altitudeMode.label"/>&gt;<input type="text" id="plm4" value="clampToGround" style="width:100px; border:2px solid #ccc;" /><br /><br />
            <g:message code="styleOptCr.label"/><br />
            <g:message code="pressNow.label"/><br /><br />
            <input type="button" name="docu" id="docu" value="${g.message(code:'save.label')}"
                   onclick='savedocudetails();document.getElementById("toppers").style.visibility = "hidden";'/>
            <input type="button" value="${g.message(code:'close.label')}"
                   onclick='document.getElementById("toppers").value="";document.getElementById("toppers").style.visibility = "hidden";'/>
        </form>
    </div>
    <div id="dirtoppers">
        <form action="#" class="panel-body">
            &lt;<g:message code="document.label"/>&gt;<br />
            &nbsp;&nbsp;&lt;<g:message code="name.label"/>&gt;<input type="text" id="dirdoc1"
                                                                     value="${g.message(code:'myDoc.label')}" style="width:345px; border:2px solid #ccc;" /><br />
            &nbsp;&nbsp;&lt;<g:message code="description.label"/>&gt;<input type="text" id="dirdoc2" value="${g.message(code:'content.label')}" style="width:312px; border:2px solid #ccc;" /><br /><br />
            &lt;<g:message code="placemark.label"/>&gt;&nbsp;for line<br />
            &nbsp;&nbsp;&lt;<g:message code="name.label"/>&gt;<input type="text" id="dirplm1" value="${g.message(code:'name.label')}" style="width:345px; border:2px solid #ccc;" /><br />
            &nbsp;&nbsp;&lt;<g:message code="description.label"/>&gt;<input type="text" id="dirplm2" value="${g.message(code:'yes.label')}" style="width:312px; border:2px solid #ccc;" /><br />
            &nbsp;&nbsp;&lt;<g:message code="styleUrl.label"/>&gt;<em> current style</em><br />
            &nbsp;&nbsp;&lt;<g:message code="tessellate.label"/>&gt;<input type="text" id="dirplm3" value="1" style="width:20px; border:2px solid #ccc;" />&lt;/tessellate&gt;
        &lt;<g:message code="altitudeMode.label"/>&gt;<input type="text" id="dirplm4" value="clampToGround" style="width:100px; border:2px solid #ccc;" /><br /><br />
            &lt;<g:message code="placemark.label"/>&gt;&nbsp;for marker<br />
            &nbsp;&nbsp;&lt;<g:message code="name.label"/>&gt;<input type="text" id="dirplm5" value="NAME" style="width:345px; border:2px solid #ccc;" /><br />
            &nbsp;&nbsp;&lt;<g:message code="description.label"/>&gt;<input type="text" id="dirplm6" value="YES" style="width:312px; border:2px solid #ccc;" /><br />
            &nbsp;&nbsp;&lt;<g:message code="styleUrl.label"/>&gt;<em> current style</em><br />
            <g:message code="styleOptCr.label"/><br />
            <g:message code="pressNow.label"/><br /><br />
            <input type="button" name="docu" id="docu" value="${g.message(code:'save.label')}"
                   onclick='savedocudetails();document.getElementById("dirtoppers").style.visibility = "hidden";'/>
            <input type="button" value="${g.message(code:'close.label')}"
                   onclick='document.getElementById("dirtoppers").value="";document.getElementById("dirtoppers").style.visibility = "hidden";'/>
        </form>
        <div class="clearfix"></div>
    </div>
    <div id="polygonstuff">
        <div>
            <a style="padding-left:5px; color: #ffffff;"  onclick="holecreator();" >Hole</a>
        </div>
        <div id="stepdiv" style="padding-left:5px">
            Step 0
        </div>
        <div>
            <input id="multipleholes" type="button" onclick="nexthole();" value="Next hole"/>
        </div>
    </div>
    <div class="clear"></div>
</div>







<script>

    function toggleshape() {
        KmlMap.toggleshape()
    }
    function setCode(k) {
        KmlMap.setCode(k)
    }
    function circlestyle(k) {
        KmlMap.circlestyle(k)
    }
    function polygonstyle(k) {
        KmlMap.polygonstyle(k)
    }
    function nexthole() {
        KmlMap.nexthole()
    }
    function holecreator() {
        KmlMap.holecreator()
    }
    function deleteLastPoint() {
        KmlMap.deleteLastPoint()
    }
    function nextshape() {
        KmlMap.nextshape()
    }
    function clearMap() {
        KmlMap.clearMap()
    }
    function regret() {
        KmlMap.regret()
    }
    function copyTextarea() {
        KmlMap.copyTextarea()
    }
    function styleprep() {
        KmlMap.styleprep()
    }
    function polylinestyle(f) {
        KmlMap.polylinestyle(f)
    }
    function closethis(f) {
        KmlMap.closethis(f)
    }
    function markerstyle(f) {
        KmlMap.markerstyle(f)
    }

    function savedocudetails() {
        KmlMap.savedocudetails()
    }
    function stepstyles(k) {
        KmlMap.stepstyles(k)
    }

    function mapcenter() {
        KmlMap.mapcenter()
    }
    function styleoptions(k) {
        KmlMap.styleoptions(k)
    }
    function iconoptions(k) {
        KmlMap.iconoptions(k)
    }
    function  setTool(k) {
        KmlMap.setTool(k)
    }
</script>


<%@ page import="org.grails.plugins.kml.utils.GeoMapListener" %>
<!doctype html>
<html>
<head>

    <meta name="layout" content="main" />
    <g:set var="entityName" value="${message(code: 'map.label')}" scope="request" />
    <title><g:message code="list.label" args="[entityName]" /></title>
</head>
<g:set var="tabIndex" value="${1}"/>
<body>
<g:render template="/googleMaps"/>

<div class="well">

    <div class="label-outline2 label-warning">
        <div  class="h3">
            <div class="row">
                <span class="col-sm-4 text-right">
                    <i class="fa fa-globe"></i>
                    <g:message code="map.label" args="${['']}"/>
                </span>
            </div>
        </div>
    </div>



    <g:form action="saveBoundary">
        <label><g:message code="previous.label" args="${[instance.oldName]}"/></label><br/>
        <label><g:message code="new.label" args="${[instance.name]}"/></label><br/>
        <g:hiddenField name="oldName" value="${instance.oldName}"/>
        <g:hiddenField name="name" value="${instance.name}"/>
        <g:hiddenField name="coordinations" value="${instance.coordinations}"/>
        <g:hiddenField name="override" value="${true}"/>
        <g:submitButton name="${g.message(code:'confirmSave.label')}" class="btn btn-danger btn-xs" />

    </g:form>
</body>
</html>
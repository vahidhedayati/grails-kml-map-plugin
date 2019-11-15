<!doctype html>
<html>
<head>
    <meta name="layout" content="main" />
    <asset:stylesheet href="jquery-ui.min.css" />
    <asset:javascript src="jquery-ui.min.js" />
    <g:set var="entityName" value="${message(code: 'address.label')}" scope="request" />
    <title><g:message code="lookup.label" args="[entityName]" /></title>
</head>
<body>
<div class="container">
    <div class="well">
        <g:render template="address"/>
    </div>
</div>
</body>
</html>
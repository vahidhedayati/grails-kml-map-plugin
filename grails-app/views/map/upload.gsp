<!doctype html>
<html>
<head>
<meta name="layout" content="main" />
	<g:set var="entityName" value="${message(code: 'uploadKml.label')}" scope="request" />
<title><g:message code="importType.label" args="${[g.message(code:'kml.label', args:[g.message(code:'area.label')])]}"/></title>
</head>
<body>


	<div class="nav" role="main">
		<h4><g:message code="uploadKml.label"/></h4>
		<g:uploadForm controller="map" action="uploadKml" enctype="multipart/form-data" acceptcharset="UTF-8" >
			<div class="col-sm-3">
			<input type="file" name="filename" class="form-control"/>
			</div>
			<div class="col-sm-3">
			<g:textField name="communityName" class="form-control"
						 placeholder="${g.message(code:'communityName.label', args:[g.message(code:'nameOf.label')])}"
						 value="${params.communityName}"  />
			</div>
			<div class="col=sm-2">
			<input id="submit" type="submit" />
			</div>
		</g:uploadForm>
	</div>
	<div id="errors">

	</div>
	<script>
		$(function() {
			$('#submit').on('click', function() {
				$('#errors').hide();
				$('#results').hide();
				$('#info').show();
			});
		});
	</script>
</body>
</html>

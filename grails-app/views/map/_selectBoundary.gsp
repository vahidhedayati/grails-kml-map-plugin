<div class="col-sm-3">
    <label><g:message code="validMapEntries.label"/></label>
    <g:select name="loadMap" from="${instance.validEntries}" value="${name}" optionKey="name" optionValue="name" class="form-control loadMap"/>
</div>

<div class="col-sm-3">
    <label><g:message code="invalidMapEntries.label"/></label>
    <g:select name="loadMap" from="${instance.invalidEntries}"  value="${name}" optionKey="name" optionValue="name" class="form-control loadMap"/>
</div>

<div class="col-sm-3">
    <label ><g:message code="missingMapEntries.label"/></label>
    <g:select name="missingMap" from="${instance.remainingEntries}" value="${name}"  optionKey="id" optionValue="name" class="form-control"/>
</div>

<div class="col-sm-3">
    <label><g:message code="missingLatLong.label"/></label>
    <g:select name="missingLatLong" from="${instance.missingLatLong}" value="${name}" optionKey="id" optionValue="name" class="form-control"/>
</div>

<script>
    $('.loadMap').on('change', function() {
        if ($(this).val()!='') {
            location.href="${g.createLink(controller: 'map', action: 'index')}/?name="+$(this).val();
        }
    })
</script>
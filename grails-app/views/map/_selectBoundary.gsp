<div class="col-sm-3">
    <label><g:message code="validMapEntries.label"/></label>
    <g:select name="loadMap" from="${instance.validEntries}" value="${name}" optionKey="name" optionValue="name" class="form-control loadMap"/>
</div>


<script>
    $('.loadMap').on('change', function() {
        if ($(this).val()!='') {
            location.href="${g.createLink(controller: 'map', action: 'index')}?name="+$(this).val();
        }
    })
</script>
<g:if test="${grailsApplication.config.kmlplugin.MAP_HAS_API_ENABLED &&
        Boolean.valueOf(grailsApplication.config.kmlplugin.MAP_HAS_API_ENABLED)==true &&
        grailsApplication.config.kmlplugin.GOOGLE_API_KEY }">
    <script src="http://maps.googleapis.com/maps/api/js?v=3.exp&key=${grailsApplication.config.kmlplugin.GOOGLE_API_KEY}"  type="text/javascript"></script>
</g:if>
<g:else>
    <!-- developer mode of google maps -->
    <script src="http://maps.googleapis.com/maps/api/js?v=3.exp"  type="text/javascript"></script>
</g:else>


<script>
    var target = document.head;
    var observer = new MutationObserver(function(mutations) {
        for (var i = 0; mutations[i]; ++i) { // notify when script to hack is added in HTML head
            if (mutations[i].addedNodes[0].nodeName == "SCRIPT" && mutations[i].addedNodes[0].src.match(/\/AuthenticationService.Authenticate?/g)) {
                var str = mutations[i].addedNodes[0].src.match(/[?&]callback=.*[&$]/g);
                if (str) {
                    if (str[0][str[0].length - 1] == '&') {
                        str = str[0].substring(10, str[0].length - 1);
                    } else {
                        str = str[0].substring(10);
                    }
                    var split = str.split(".");
                    var object = split[0];
                    var method = split[1];
                    window[object][method] = null; // remove censorship message function _xdc_._jmzdv6 (AJAX callback name "_jmzdv6" differs depending on URL)
                    //window[object] = {}; // when we removed the complete object _xdc_, Google Maps tiles did not load when we moved the map with the mouse (no problem with OpenStreetMap)
                }
                observer.disconnect();
            }
        }
    });
    var config = { attributes: true, childList: true, characterData: true }
    observer.observe(target, config);
</script>
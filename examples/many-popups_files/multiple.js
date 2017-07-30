var map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        })
    ],
    view: new ol.View({
        center: ol.proj.transform([-71.057083, 42.361145], 'EPSG:4326', 'EPSG:3857'),
        zoom: 11,
        rotation: 0
    })
});
var numPopups = 0;
var rotating;
var rotateStep = Math.PI / 80;
var allowRotate = true;
map.on('singleclick', function(evt) {
    numPopups++;
    // Create a new popup instance each time the map is clicked, set the
    // ol.Overlay `insertFirst` option to false so that each new popup is
    // appended to the DOM and hence appears above any existing popups
    var popup = new ol.Overlay.Popup({insertFirst: false});
    map.addOverlay(popup);
    var prettyCoord = ol.coordinate.toStringHDMS(ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326'), 2);
    popup.show(evt.coordinate, '<div><h2>Coordinates</h2><p>' + prettyCoord + '</p></div>');
    if (numPopups == 3) {
      rotating = window.setInterval(function() {
        if (!allowRotate) {
          return;
        }
        var view = map.getView();
        var rotation = view.getRotation();
        view.setRotation(rotation + rotateStep);
      }, 60)
    }
    if (numPopups >= 5) {
      allowRotate = false;
      window.clearInterval(rotating);
    }
});

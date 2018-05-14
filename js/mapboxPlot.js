//Map
mapboxgl.accessToken = 'pk.eyJ1IjoieW91bmdjaHVsIiwiYSI6ImNqaDM2czI0MzA2MnozMWxrdDQzNjI2aTEifQ.eHQtCVVsnBc0sMHolKE-qw';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/youngchul/cjh37njpk1tf32rpu9galkn5r'
});

map.on('load', function () {
  d3.json('data/crime_2017_filtered.geojson', function(err, data) {
    if (err) throw err;

    map.addSource('crimes', {
      'type': 'geojson',
      'data': data
    });

    map.addLayer({
      'id': 'Crime',
      'type': 'circle',
      'source': 'crimes',
      'paint': {
      'circle-color': [
        'interpolate',
        ['linear'],
        ['get', 'mag'],
        1, '#ff0808'
        ],
      'circle-opacity': 0.90,
      'circle-radius': [
        'interpolate',
        ['linear'],
        ['get', 'mag'],
        1, 2,
        ]
      }
    });
    
  })

  d3.json('data/street_lights_filtered.geojson', function(err, data) {
    if (err) throw err;

    map.addSource('street', {
      'type': 'geojson',
      'data': data
    });

    map.addLayer({
      'id': 'Streetlights',
      'type': 'circle',
      'source': 'street',
      'paint': {
      'circle-color': [
        'interpolate',
        ['linear'],
        ['get', 'mag'],
        1, '#f9f763'
        ],
      'circle-opacity': 0.02,
      'circle-radius': [
        'interpolate',
        ['linear'], 
        ['get', 'mag'],
        0, 6,
        ]
      }
    });
  })

});

var toggleableLayerIds = [ 'Crime', 'Streetlights' ];

for (var i = 0; i < toggleableLayerIds.length; i++) {
    var id = toggleableLayerIds[i];

    var link = document.createElement('a');
    link.href = '#';
    link.className = 'active';
    link.textContent = id;

    link.onclick = function (e) {
        var clickedLayer = this.textContent;
        e.preventDefault();
        e.stopPropagation();

        var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

        if (visibility === 'visible') {
            map.setLayoutProperty(clickedLayer, 'visibility', 'none');
            this.className = '';
        } else {
            this.className = 'active';
            map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
        }
    };

    var layers = document.getElementById('menu');
    layers.appendChild(link);
}
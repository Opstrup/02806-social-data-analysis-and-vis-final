var map = washingtonMap()
  .mapSvg('#map')
  .geojson('data/dc.geojson')
  .callbackList(function(){ console.log('Im a callback') })

map()
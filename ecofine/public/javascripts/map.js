// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com
mapboxgl.accessToken =
    'pk.eyJ1IjoianAwMTE2NiIsImEiOiJja240b3BlZHMxNzNmMnZvdW15ZDh6bG42In0.T39v6FBPDgOsl0sywZ9Blg';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-0.19683,51.43989],
    zoom: 7
});

map.addControl(
    new MapboxDirections({
        accessToken: mapboxgl.accessToken
    }),
    'top-left'
);
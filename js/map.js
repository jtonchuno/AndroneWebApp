// Initialize Firebase
var config = {
    apiKey: "AIzaSyCngnYmds3kumgSxI6ILWixSPBZuEnn8IE",
    authDomain: "androne-1494224644502.firebaseapp.com",
    databaseURL: "https://androne-1494224644502.firebaseio.com",
    projectId: "androne-1494224644502",
    storageBucket: "",
    messagingSenderId: "270186001542"
};
firebase.initializeApp(config);


var testData = {
    max: 8,
    data: [{lat: 24.6408, lng:46.7728, count: 3},{lat: 50.75, lng:-1.55, count: 1}, ...]
  };

  var cfg = {
    // radius should be small ONLY if scaleRadius is true (or small radius is intended)
    // if scaleRadius is false it will be the constant radius used in pixels
    "radius": 2,
    "maxOpacity": .8, 
    // scales the radius based on map zoom
    "scaleRadius": true, 
    // if set to false the heatmap uses the global maximum for colorization
    // if activated: uses the data maximum within the current map boundaries 
    //   (there will always be a red spot with useLocalExtremas true)
    "useLocalExtrema": true,
    // which field name in your data represents the latitude - default "lat"
    latField: 'lat',
    // which field name in your data represents the longitude - default "lng"
    lngField: 'lng',
    // which field name in your data represents the data value - default "value"
    valueField: 'count'
  };

  var heatmapLayer = new HeatmapOverlay(cfg);
  
//establishes the background for the map - mapbox satellite view 

var baseLayer = new L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoianRvbmNodW5vIiwiYSI6ImNqMmZxaXRqaTA3Z28yeG52ZjBtdWRnbG8ifQ.syXxENAgJ2u38pANDp7vRg', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.satellite',
    accessToken: 'pk.eyJ1IjoianRvbmNodW5vIiwiYSI6ImNqMmZxaXRqaTA3Z28yeG52ZjBtdWRnbG8ifQ.syXxENAgJ2u38pANDp7vRg'
}); 

//   var map = new L.Map('map-canvas', {
//     center: new L.LatLng(25.6586, -80.3568),
//     zoom: 4,
//     layers: [baseLayer, heatmapLayer]
//   });
  
  heatmapLayer.setData(testData);

//Sets the view for the map 
//L.mapbox.accessToken = 'pk.eyJ1IjoianRvbmNodW5vIiwiYSI6ImNqMmZxaXRqaTA3Z28yeG52ZjBtdWRnbG8ifQ.syXxENAgJ2u38pANDp7vRg';
var mymap = L.map('mapid', {
    center: new L.LatLng(25.6586, -80.3568),
    zoom: 4,
    layers: [baseLayer, heatmapLayer]
}).setView([51.505, -0.09], 13);

//create the blue marker 
var marker = L.marker([51.5, -0.09]).addTo(mymap);

//creates the red circle
var circle = L.circle([51.508, -0.11], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(mymap);

//blue triangle
var polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(mymap);

//popup object
var popup = L.popup();
//when a place on the map is clicked, the lat/long coordinates will be displayed in the popup
function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(mymap);
}

mymap.on('click', onMapClick);


var database = firebase.database();

var userDataRef = firebase.database().ref("UserData").orderByKey();
userDataRef.once("value")
    .then(function(snapshot){
        snapshot.forEach(function(childSnapshot){
            var key = childSnapshot.key;
            var childData = childSnapshot.val();
            
            var coor_val = childSnapshot.val().Coordinate;
            var name_val=childSnapshot.val().Name;
            
            $("#coordinate").append(coor_val);
            $("#name").append(id_val);
            //document.getElementById("name").innerHTML = name_val;
            //document.getElementById("id").innerHTML = id_val;
        });
    });

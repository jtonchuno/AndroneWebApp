// Map object to be initialized after page loads
// Needs to be global for popup events
var map;

// Firebase configuration
const config = {
    apiKey: "AIzaSyCngnYmds3kumgSxI6ILWixSPBZuEnn8IE",
    authDomain: "androne-1494224644502.firebaseapp.com",
    databaseURL: "https://androne-1494224644502.firebaseio.com",
    projectId: "androne-1494224644502",
    storageBucket: "",
    messagingSenderId: "270186001542"
};

// heatmap.js configuration
const cfg = {
    "radius": 2,
    "maxOpacity": .8, 
    "scaleRadius": true, 
    "useLocalExtrema": true,
    latField: 'lat',
    lngField: 'lng',
    valueField: 'count'
};

// Test JSON data
const testData = {
    max: 8,
    data: [{lat: 24.6408, lng:46.7728, count: 3},{lat: 50.75, lng:-1.55, count: 1}]
};

window.onload = function() {
    initMap(testData);
};

function initDB() {
    firebase.initializeApp(config);

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
}

function initMap(data) {
    // Create heatmap layer and add data
    var heatmapLayer = new HeatmapOverlay(cfg);
    heatmapLayer.setData(data);
    
    // Create map tiles layer
    var baseLayer = new L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoianRvbmNodW5vIiwiYSI6ImNqMmZxaXRqaTA3Z28yeG52ZjBtdWRnbG8ifQ.syXxENAgJ2u38pANDp7vRg', {
        maxZoom: 18,
        id: 'mapbox.satellite',
        accessToken: 'pk.eyJ1IjoianRvbmNodW5vIiwiYSI6ImNqMmZxaXRqaTA3Z28yeG52ZjBtdWRnbG8ifQ.syXxENAgJ2u38pANDp7vRg'
    }); 

    // Create map and set view
    map = L.map('mapid', {
        crs: L.CRS.Simple,
        // layers: [baseLayer, heatmapLayer]
    });

    var bounds = [[0,0], [1000,1000]];
    var image = L.imageOverlay('../img/kylefield.jpg', bounds).addTo(map);

    map.fitBounds(bounds);
    
    // Set up onclick event
    map.on('click', onMapClick);    
}

function onMapClick(e) {
    var popup = L.popup()
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}

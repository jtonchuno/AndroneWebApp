/* TODO:
1. Get Firebase data in here
2. Fit firebase data to heatmap form
3. Transfrom dBm data to count (logarithmic)
4. Create function to look up signal data given position data for onclick popovers
5. Fix boundaries
*/

// Map object to be initialized after page loads
// Needs to be global for popup events
var map;
var firebase_JSON = {
    max: 8,
    data:[]
};
// Authenticate Firebase
  var config = {
    apiKey: "AIzaSyCngnYmds3kumgSxI6ILWixSPBZuEnn8IE",
    authDomain: "androne-1494224644502.firebaseapp.com",
    databaseURL: "https://androne-1494224644502.firebaseio.com",
    projectId: "androne-1494224644502",
    storageBucket: "androne-1494224644502.appspot.com",
    messagingSenderId: "270186001542"
  };
//Initialize App
firebase.initializeApp(config);

//create a reference to the database
var database = firebase.database().ref("Data");

//Read entire database and output to console
database.on("value", function(snapshot){
    console.log(snapshot.val());
    firebase_JSON.data.push(snapshot.val());
}, function(error){
    console.log("Error: "+ error.code);
});

//output JSON
console.log(firebase_JSON);
firebase.database().ref('Data').once('value',function(snapshot){
    console.log(JSON.stringify(snapshot.val()))
})


//convert from one format to another
function convert(firebase_JSON){
    new_JSON = {max:8,data:[]};
    for (var coordinate in firebase_JSON.Data[0]){
        new_JSON.data.push(firebase_JSON.Data[coordinate]);
    }
    return new_JSON;
}

//output converted format to console
console.log(convert(firebase_JSON));

// heatmap.js configuration
const cfg = {
    "radius": 7,
    "maxOpacity": .5, 
    "scaleRadius": true, 
    "useLocalExtrema": true,
    latField: 'x',
    lngField: 'y',
    valueField: 'count'
};

// Test JSON data
const testData = {
    max: 8,
    data: [
            {x: 500, y: 500, count: 3},
            {x: 501, y: 500, count: 1},
            {x: 504, y: 504, count: 3},
            {x: 511, y: 503, count: 2},
            {x: 506, y: 506, count: 8},
            {x: 508, y: 512, count: 1},
            {x: 504, y: 503, count: 1},
            {x: 502, y: 504, count: 3},
            {x: 505, y: 506, count: 5},
            {x: 500, y: 508, count: 1},            
        ]
};

// Wait till page is loaded to run javascript
window.onload = function() {
    initMap(testData);
};

function initMap(data) {
    // Create heatmap layer and add data
    var heatmapLayer = new HeatmapOverlay(cfg);
    
    // Create map tiles layer
    var baseLayer = new L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoianRvbmNodW5vIiwiYSI6ImNqMmZxaXRqaTA3Z28yeG52ZjBtdWRnbG8ifQ.syXxENAgJ2u38pANDp7vRg', {
        maxZoom: 18,
        id: 'mapbox.satellite',
        accessToken: 'pk.eyJ1IjoianRvbmNodW5vIiwiYSI6ImNqMmZxaXRqaTA3Z28yeG52ZjBtdWRnbG8ifQ.syXxENAgJ2u38pANDp7vRg'
    }); 

    // Initialize map
    map = L.map('mapid', {
        crs: L.CRS.Simple,
        minZoom: -3
    });

    // Create background and bounds for custom CRS
    var bounds = [[0,0], [1000,1000]];
    var image = L.imageOverlay('../img/kylefield.jpg', bounds).addTo(map);

    map.fitBounds(bounds);

    // Add heatmap to the map
    map.addLayer(heatmapLayer);
    heatmapLayer.setData(data);
    
    // Set up onclick event
    map.on('click', onMapClick);    
}

// Clicking the map popups the lat and long of that position
// Eventually should be the signal data of that position
function onMapClick(e) {
    var popup = L.popup()
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}
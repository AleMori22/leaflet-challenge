// Datasets Observation

fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson").then(
    response => response.json()
    .then(data => {
        console.log(data);
    }).catch(error => {
        console.log("ErrorOccurred",error)
    })

)

fetch("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(
    response => response.json()
    .then(data2 => {
        console.log(data2);
    }).catch(error => {
        console.log("ErrorOccurred",error)
    })

)


let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"

let url2 ="https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

// Define the base StreetMap layer

let streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19

});

// Define the base satelliteMap layer

let satelliteMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  maxZoom: 19

});

// Define the base outdoorMap layer

let outdoorMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  maxZoom: 17

});

// Create a Leaflet map

let map = L.map("map", {
    center : [0,0],
    zoom : 3,
    layers : [streetMap,satelliteMap,outdoorMap]

});

let baseLayers = {
    "street Map" : streetMap,
    "Satellite Map" : satelliteMap,
    "Outdoor Map" : outdoorMap

};

// DepthColor Function

let colorList = ["green","yellow","orange","darkorange","red","darkred"]

function DepthColor(depth){
    if (depth <= 10){
        color = colorList[0];
    } else if (depth <= 30){
        color = colorList[1];
    } else if (depth <= 50){
        color = colorList[2];
    } else if (depth <= 70){
        color = colorList[3];
    } else if (depth <= 90){
        color = colorList[4];
    } else {
        color = colorList[5];
    }
    return color;

}

// Setting Layer Groups for Earthquakes and Tectonic Plates

let earthquakeLayer = L.layerGroup();
let tectonicPlateLayer = L.layerGroup();

// EarthQuakes Function

fetch(url)
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
          radius: feature.properties.mag * 3,
          fillColor: DepthColor(feature.geometry.coordinates[2]),
          color: "black",
          fillOpacity: 0.5
        });
      },
      onEachFeature: function (feature, layer) {
        layer.bindPopup(`Magnitude ${feature.properties.mag} <br> Location: ${feature.properties.place}`);
      }
    }).addTo(earthquakeLayer);

});


// Tettonique plaque map 

fetch(url2)
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      style: {
        color: 'blue',
        weight: 2
      }
    }).addTo(tectonicPlateLayer);

});

// Setting Overlayers

let overlayLayers = {
    "Earthquakes": earthquakeLayer,
    "Tectonic Plates": tectonicPlateLayer

};

// Layers Control setup 

L.control.layers(baseLayers, overlayLayers).addTo(map);

// Base Layer 

streetMap.addTo(map);

// Create a legend control

let legend = L.control({position: 'bottomright'});

// Add legend to the map

legend.onAdd = function (map) {
    let div = L.DomUtil.create('div', 'info legend');
    let depthRanges = ['0-10', '10-30', '30-50', '50-70', '70-90', '90+'];

    // Loop through the depth ranges and generate a label with color

    for (let i = 0; i < depthRanges.length; i++) {
        div.innerHTML +=
          '<div><span style="background:' +
          colorList[i] +
          '; width: 20px; height: 20px; display: inline-block;"></span> ' +
          depthRanges[i] +
          "</div>";

    }
    return div;

}; 

// Add legend to map 

legend.addTo(map);


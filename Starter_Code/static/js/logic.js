// Dataset Observation

fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson").then(
    response => response.json()
    .then(data => {
        console.log(data);
    }).catch(error => {
        console.log("ErrorOccurred",error)
    })
)

let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"

// Define the base StreetMap layer
let streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19
});

// Create a Leaflet map
let map = L.map("map").setView([0, 0], 2);

// Add the base StreetMap layer to the map
streetMap.addTo(map);

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

// EarthQuakes Function

function EarthQuakes(data){
    L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
              radius: feature.properties.mag * 3,
              fillColor: DepthColor(feature.geometry.coordinates[2]),
              color: "black",
              fillOpacity: 0.5
            });
        },
        onEachFeature: function(feature,layer){
            layer.bindPopup(`Magnitude ${feature.properties.mag} <br> 
            Location: ${feature.properties.place}`);
        }
    }).addTo(map);
}


d3.json(url).then(EarthQuakes).catch(function(error){
    console.log(`Error occurred ${error}`);

});



// Create a legend control
let legend = L.control({position: 'bottomright'});

// Add legend to the map
legend.onAdd = function (map) {
    let div = L.DomUtil.create('div', 'info legend');
    let labels = ['<strong>Depth</strong>'];
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
    
    legend.addTo(map);
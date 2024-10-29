// Create a map object
const map = L.map('map').setView([37.1619, -114.4504], 6); // Centered around the provided coordinates

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Function to determine marker size based on magnitude
function getMarkerSize(magnitude) {
    return magnitude * 5; // Adjust the multiplier for desired size
}

// Function to determine marker color based on depth
function getColor(depth) {
    return depth > 20 ? '#FF0000' : // Red for deep earthquakes
           depth > 10 ? '#FFA500' : // Orange for medium depth
           '#008000'; // Green for shallow earthquakes
}

// Fetch the GeoJSON data
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
    .then(response => response.json())
    .then(data => {
        // Loop through the features in the GeoJSON data
        L.geoJson(data, {
            pointToLayer: function (feature, latlng) {
                const magnitude = feature.properties.mag;
                const depth = feature.geometry.coordinates[2];
                const marker = L.circleMarker(latlng, {
                    radius: getMarkerSize(magnitude),
                    fillColor: getColor(depth),
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });

                // Add a popup with additional information
                marker.bindPopup(`<strong>Magnitude:</strong> ${magnitude}<br><strong>Depth:</strong> ${depth} km<br><strong>Location:</strong> ${feature.properties.place}`);
                return marker;
            }
        }).addTo(map);
    })
    .catch(error => console.error('Error fetching GeoJSON data:', error));
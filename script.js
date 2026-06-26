const kpuLat = 49.1326;
const kpuLng = -122.8719;

let map = L.map('map').setView([kpuLat, kpuLng], 14);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map);

let kpuMarker = L.marker([kpuLat, kpuLng])
    .addTo(map)
    .bindPopup("KPU Surrey Library")
    .openPopup();

let userMarker;
let routeLine;

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
} else {
    alert("Geolocation is not supported by this browser.");
}

function showPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    userMarker = L.marker([latitude, longitude])
        .addTo(map)
        .bindPopup("Your Current Location")
        .openPopup();

    routeLine = L.polyline([
        [latitude, longitude],
        [kpuLat, kpuLng]
    ], {
        color: "#0077ff",
        weight: 5,
        dashArray: "10, 10"
    }).addTo(map);

    let distance = calculateDistance(latitude, longitude, kpuLat, kpuLng);

    document.getElementById("distance").innerHTML =
        "Distance to KPU Surrey Library: <strong>" +
        distance.toFixed(2) +
        " km</strong>";

    let group = L.featureGroup([userMarker, kpuMarker]);
    map.fitBounds(group.getBounds().pad(0.2));
}

function showError(error) {
    alert("Unable to retrieve your location. " + error.message);
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;

    let dLat = degreesToRadians(lat2 - lat1);
    let dLon = degreesToRadians(lon2 - lon1);

    let a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(degreesToRadians(lat1)) *
        Math.cos(degreesToRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}

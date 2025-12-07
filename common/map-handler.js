function initMap() {
  const location = { lat: 17.385, lng: 78.4867 };
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: location
  });
  new google.maps.Marker({ position: location, map: map });
}

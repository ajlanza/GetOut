function watch() {
    //See if the form is submitted
    $('form').submit(event =>{
        event.preventDefault();
        let myLocation = $('#location').val();
        getEvents(myLocation);
    })
   }

function getEvents(loc) {
    const baseURL = 'https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&apikey=9ILySSY2YO4e93LLEXVkLXAO93uY4YC2';
    const newURL = baseURL.concat(`&city=${loc}`);
    fetch(newURL)
      .then(response => {
          if (response.ok) {
              return response.json();
          }
          else {
            throw new Error(response.statusText);
          }
    })
      .then(responseJson => displayResults(responseJson))
      .catch(err => alert(`That event fetch didn't seem to work. ${err.message}`));
    }

function displayResults(responseJson){
    // hits is the number of events returned from the search
     let hits = responseJson._embedded.events.length;
    // Display each of our events in a list item
    document.getElementById("events").innerHTML= `Select an event to see the venue.`;
    for (let i = 0; i < hits; i++){
        let eventId = responseJson._embedded.events[i].id;
        let eventName = responseJson._embedded.events[i].name;
        let eventLon = responseJson._embedded.events[i]._embedded.venues[0].location.longitude;
        let eventLat = responseJson._embedded.events[i]._embedded.venues[0].location.latitude;
        $("#events").append(`<li onclick="updateMap(${eventLat}, ${eventLon}); getDetails('${eventName}', '${eventId}')">${eventName}</li>`);
    }
}

// MAP JAVASCRIPT
mapboxgl.accessToken = 'pk.eyJ1IjoicmVkcnVtb3IiLCJhIjoiY2s5OTU2ZXZoMDh6bDNtbng4Mm54d3NuYSJ9.SKElWJx3uVl8sFBqvHskxA';
  let map = new mapboxgl.Map({
    container: 'map', // Container ID
    style: 'mapbox://styles/mapbox/streets-v11', // Map style to use
    center: [-122.431297, 37.773972], // Starting position [lng, lat]
    zoom: 12, // Starting zoom level
  });
// MAP MARKER
    let marker = new mapboxgl.Marker() // initialize a new marker
    .setLngLat([-122.431297, 37.773972]) // Marker [lng, lat] coordinates
    .addTo(map); // Add the marker to the map
  
function updateMap(lat, lon) {
    document.getElementById('map').innerHTML="";
        map = new mapboxgl.Map({
        container: 'map', // Container ID
        style: 'mapbox://styles/mapbox/streets-v11', // Map style to use
        center: [lon, lat], // Starting position [lng, lat]
        zoom: 14, // Starting zoom level
  });
  marker = new mapboxgl.Marker() // initialize a new marker
    .setLngLat([lon, lat]) // Marker [lng, lat] coordinates
    .addTo(map); // Add the marker to the map
}

function getDetails(name, id) {
    const baseURL = 'https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&apikey=9ILySSY2YO4e93LLEXVkLXAO93uY4YC2';
    const newURL = baseURL.concat(`&id=${id}`);
    fetch(newURL)
      .then(response => {
          if (response.ok) {
              return response.json();
          }
          else {
            throw new Error(response.statusText);
          }
    })
      .then(responseJson => displayDetails(responseJson))
      .catch(err => alert(`That id fetch didn't seem to work. ${err.message}`));
    }

function displayDetails(responseJson) {
    let venue = responseJson._embedded.events[0]._embedded.venues[0].name;
    let name = responseJson._embedded.events[0].name;
    let container = document.getElementById("details");
    container.innerHTML=`<h3>${name} will be performing at ${venue}.</h3>`;
}
$(watch);
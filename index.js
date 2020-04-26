function watch() {
    $('form').submit(event =>{
        event.preventDefault();
        const myLocation = $('#location').val();
        getEvents(myLocation);
    })
   }
// Get events from tickemaster for the location the user has chosen.
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
      .catch(err => alert(`That location didn't seem to work. Please try again with a city name. ${err.message}`));
    }

// Show the user the events returned by ticketmaster.    
function displayResults(responseJson){
    // hits is the number of events returned from the search
    const hits = responseJson._embedded.events.length;
    document.getElementById("events").innerHTML= `Select an event to see the venue.<br><br>`;
    for (let i = 0; i < hits; i++){
        let eventId = responseJson._embedded.events[i].id;
        let eventName = responseJson._embedded.events[i].name;
        let eventLon = responseJson._embedded.events[i]._embedded.venues[0].location.longitude;
        let eventLat = responseJson._embedded.events[i]._embedded.venues[0].location.latitude;
        $("#events").append(`<li onclick="updateMap(${eventLat}, ${eventLon}); getDetails('${eventName}', '${eventId}')">${eventName}</li>`);
    }
}

// Set up our map with mapbox API.
mapboxgl.accessToken = 'pk.eyJ1IjoicmVkcnVtb3IiLCJhIjoiY2s5OTU2ZXZoMDh6bDNtbng4Mm54d3NuYSJ9.SKElWJx3uVl8sFBqvHskxA';
  let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11', 
    center: [-73.756233, 42.652580], // Starting position [lng, lat]
    zoom: 12, 
  });
// Put a marker on the map.
    let marker = new mapboxgl.Marker()
    .setLngLat([-122.431297, 37.773972]) // Marker [lng, lat] coordinates
    .addTo(map); // Add the marker to the map

// Update the map with the event the user has clicked on.
function updateMap(lat, lon) {
    document.getElementById('map').innerHTML="";
        map = new mapboxgl.Map({
        container: 'map', // Container ID
        style: 'mapbox://styles/mapbox/streets-v11', // Map style to use
        center: [lon, lat], // Starting position [lng, lat]
        zoom: 14, // Starting zoom level
  });
  marker = new mapboxgl.Marker() 
    .setLngLat([lon, lat]) 
    .addTo(map);
}

// Submit a request to ticketmaster API for the event the user has chosen.
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
      .catch(err => alert(`That event didn't seem to work. Please choose a different one. ${err.message}`));
    }

// Show the user the venue the event is at and change the background image to one supplied by ticketmaster.
function displayDetails(responseJson) {
    let venue = responseJson._embedded.events[0]._embedded.venues[0].name;
    let name = responseJson._embedded.events[0].name;
    let bandImage = responseJson._embedded.events[0].images[5].url;
    let container = document.getElementById("details");
    container.innerHTML=`<h3>${name} will be performing at ${venue}.</h3>`;
    container.style.backgroundImage = `url('${bandImage}')`;
    container.style.backgroundSize = `cover`;
}

$(watch);
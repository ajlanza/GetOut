function watch() {
    //See if the form is submitted
    $('form').submit(event =>{
        event.preventDefault();
        let myLocation = $('#location').val();
        // ERROR CHECKING console.log(myLocation);
        getEvents(myLocation);
    })
    // See if an event is clicked

    var ul = document.getElementById('events');
    // ul.onclick = function(event)
    // // $('ul').on('click', function(event) 
    // {
    //     let target = getEventTarget(event);
    //     console.log("an eventResult was clicked");
    //     console.log(document.querySelector(target).dataset.latitude);
    // };

   }

function getEvents(loc) {
    const baseURL = 'https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&apikey=INSERT KEY HERE';
    const newURL = baseURL.concat(`&city=${loc}`);
    fetch(newURL)
      .then(response => {
          if (response.ok) {
              // ERROR CHECKING console.log('event fetch response was ok.')
              return response.json();
          }
          else {
            // ERROR CHECKING console.log('first event promise bad.');
            throw new Error(response.statusText);
          }
    })
      .then(responseJson => displayResults(responseJson))
      .catch(err => alert(`That event fetch didn't seem to work. ${err.message}`));
    }

function displayResults(responseJson){
    // hits is the number of events returned from the search
     let hits = responseJson._embedded.events.length;
    // ERROR CHECKING console.log(hits);
    // Display each of our events in a list item
    //
    document.getElementById("events").innerHTML='';
    for (let i = 0; i < hits; i++){
        let eventId = responseJson._embedded.events[i].id;
        let eventName = responseJson._embedded.events[i].name;
        let eventLon = responseJson._embedded.events[i]._embedded.venues[0].location.longitude;
        let eventLat = responseJson._embedded.events[i]._embedded.venues[0].location.latitude;
        $("#events").append(`<li onclick="updateMap(${eventLat}, ${eventLon}); getDetails('${eventName}', '${eventId}')">${eventName}</li>`);
       // ERROR CHECKING console.log(`Longitude is: ${eventLon} Latitude is: ${eventLat}`);
    }
    // ERROR CHECKING console.log('In displayResults function');
    // responseJson._embedded.events.forEach(event => document.getElementById('events').append("<li>" + event.name + "</li>"));
    // console.log('Events results should now be listed.');
}




// MAP JAVASCRIPT
mapboxgl.accessToken = 'INSERT KEY HERE';
  var map = new mapboxgl.Map({
    container: 'map', // Container ID
    style: 'mapbox://styles/mapbox/streets-v11', // Map style to use
    center: [-122.021797, 37.263599], // Starting position [lng, lat]
    zoom: 12, // Starting zoom level
  });

function updateMap(lat, lon) {
    document.getElementById('map').innerHTML="";
    // ERROR CHECKING console.log(`The show location is at latitude ${lat} and longitude ${lon}`);
    var map = new mapboxgl.Map({
        container: 'map', // Container ID
        style: 'mapbox://styles/mapbox/streets-v11', // Map style to use
        center: [lon, lat], // Starting position [lng, lat]
        zoom: 12, // Starting zoom level
  });
}
function getDetails(name, id) {
    // ERROR CHECKING console.log(`name is ${name} id is ${id}`);
    const baseURL = 'https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&apikey=9ILySSY2YO4e93LLEXVkLXAO93uY4YC2';
    const newURL = baseURL.concat(`&id=${id}`);
    fetch(newURL)
      .then(response => {
          if (response.ok) {
              // ERROR CHECKING console.log('id fetch was ok.')
              return response.json();
          }
          else {
            // ERROR CHECKING console.log('first id promise bad.');
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
    // ERROR CHECKING console.log(`${name} will be performing at ${venue}.`);
    container.innerHTML=`<h3>${name} will be performing at ${venue}.</h3>`;

}
$(watch);
// $(updateMap(-122.021797, 37.263599));
// Detect location automatically when page loads
window.onload = function(){
    detectLocation();
};

function detectLocation(){

    if(navigator.geolocation){

        navigator.geolocation.getCurrentPosition(showPosition, showError);

    }else{

        document.getElementById("result").innerHTML =
        "Geolocation is not supported by this browser.";

    }

}

function showPosition(position){

    let lat = position.coords.latitude;
    let lon = position.coords.longitude;

    let mapLink = `https://www.google.com/maps?q=${lat},${lon}`;

    let policeSearch =
    `https://www.google.com/maps/search/police+station+near+me/@${lat},${lon},15z`;

    let mallSearch =
    `https://www.google.com/maps/search/mall+security+near+me/@${lat},${lon},15z`;

    document.getElementById("result").innerHTML =

    "<b>Child Live Location</b><br><br>" +

    "Latitude: " + lat +
    "<br>Longitude: " + lon +

    "<br><br><a target='_blank' href='"+mapLink+"'>Open Exact Location in Google Maps</a>" +

    "<br><br><a target='_blank' href='"+mallSearch+"'>Find Nearest Mall / Security</a>" +

    "<br><br><a target='_blank' href='"+policeSearch+"'>Find Nearest Police Station</a>" +

    "<br><br><button onclick='sendSOS("+lat+","+lon+")'>Send SOS to Parents</button>";

}

function showError(error){

    let message = "";

    switch(error.code){

        case error.PERMISSION_DENIED:
        message = "Location permission denied.";
        break;

        case error.POSITION_UNAVAILABLE:
        message = "Location information unavailable.";
        break;

        case error.TIMEOUT:
        message = "Location request timed out.";
        break;

        default:
        message = "Unknown error occurred.";

    }

    document.getElementById("result").innerHTML = message;

}

// SOS Function
function sendSOS(lat,lon){

    let map = `https://maps.google.com/?q=${lat},${lon}`;

    let message =
    `EMERGENCY! Child location: ${map}`;

    window.location.href =
    `sms:9028595962,9011633804?body=${encodeURIComponent(message)}`;

}
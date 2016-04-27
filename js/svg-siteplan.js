
var request = new XMLHttpRequest();
request.open('GET', '/siteplan.json', true);

request.onload = function() {
  if (request.status >= 200 && request.status < 400) {
    var data = JSON.parse(request.responseText);
  } else {
    console.log('file not found');
  }
};

request.onerror = function() {
  // There was a connection error of some sort
};

request.send();


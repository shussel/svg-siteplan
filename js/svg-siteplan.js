
var request = new XMLHttpRequest();
request.open('GET', '/siteplan.json', true);

request.onload = function() {
  if (request.status >= 200 && request.status < 400) {
    var data = JSON.parse(request.responseText);
	init(data);
  } else {
    console.log('file not found');
  }
};

request.onerror = function() {
  // There was a connection error of some sort
};

request.send();

function init(data) {

	var spaces = Object.keys(data);

	spaces.forEach(function(space) {

		if(el = document.getElementById(space)) {
		
			var bbox = el.getBBox(); 
			var x = Math.floor(bbox.x + bbox.width/2.0);
			var y = Math.floor(bbox.y + bbox.height/2.0) + 5;

			var newText = document.createElementNS("http://www.w3.org/2000/svg","text");
			newText.setAttributeNS(null,"x",x);     
			newText.setAttributeNS(null,"y",y); 
			newText.setAttributeNS(null,"font-size","10");
			newText.setAttributeNS(null,"font-family","Arial");
			newText.setAttributeNS(null,"font-weight","bold");
			newText.setAttributeNS(null,"text-anchor","middle");			

			var textNode = document.createTextNode(data[space]["label"]);
			newText.appendChild(textNode);
			document.getElementById("Text").appendChild(newText);

			if (data[space]["available"] == true)
			{			
				el.setAttribute('fill', "#fefda0");
				el.addEventListener("mouseover", hoverAvailable);
				el.addEventListener("mouseout", dehoverAvailable);
			} else {
				el.addEventListener("mouseover", hoverOccupied);
				el.addEventListener("mouseout", dehoverOccupied);
			}
		}
	});
}

function hoverAvailable(e) {
	this.setAttribute('fill', "#ff0000");
	document.getElementById("avail").setAttribute('fill', "#ff0000");
}

function dehoverAvailable(e) {
	this.setAttribute('fill', "#fefda0");
	document.getElementById("avail").setAttribute('fill', "#fefda0");
}

function hoverOccupied(e) {
	this.setAttribute('fill', "#add8e6");
	document.getElementById("occ").setAttribute('fill', "#add8e6");
}

function dehoverOccupied(e) {
	this.setAttribute('fill', "#eeeeee");
	document.getElementById("occ").setAttribute('fill', "#eeeeee");
}

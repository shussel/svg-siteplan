
// set up plan
var siteplan = new SVGplan(window.frameElement.getAttribute('data-issmall'));

function SVGplan(isSmall) {

	this.isSmall = (isSmall === "true");

	// get plan id from custom data:id attribute of svg tag
	this.id = document.getElementsByTagName("svg")[0].getAttributeNS('plan-data', 'id');		

	// path to JSON data
	var dataPath = '/siteplan.json';

	var self = this;	
	
	// hide text in small version
	if (this.isSmall)
	{
		document.getElementById("Text").setAttributeNS(null,"visibility","hidden");
	}
	
	// load json data for this site plan
	var request = new XMLHttpRequest();
		request.open('GET', dataPath, true);

		request.onload = function() {
		  if (request.status >= 200 && request.status < 400)
		  {
			var data = JSON.parse(request.responseText);
			init(data);
		  } else {
			console.log('request error');
		  }
		};

		request.onerror = function() {
		  console.log('connection error');
		};

		request.send();

	// initialize plan with data
	var init = function(data) {

		var spaces = Object.keys(data);

		spaces.forEach(function(space) {

			// add label for space
			if (!self.isSmall)
			{
				self.label(space, data[space]["label"]);
			}

			if(el = document.getElementById(space)) {
			
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

	// add label to center of element
	this.label = function(id, label) {

		var el;

		// proceed if element id found
		if( el = document.getElementById(id) ) {

			// get center of element
			var bbox = el.getBBox(); 
			var x = Math.floor(bbox.x + bbox.width/2.0);
			var y = Math.floor(bbox.y + bbox.height/2.0) + 5;

			// create label
			var textNode = document.createTextNode(label);
			
			// create text element
			var newText = document.createElementNS("http://www.w3.org/2000/svg","text");
				newText.setAttributeNS(null,"x",x);     
				newText.setAttributeNS(null,"y",y); 
				newText.setAttributeNS(null,"font-size","10");
				newText.setAttributeNS(null,"font-family","Arial");
				newText.setAttributeNS(null,"font-weight","bold");
				newText.setAttributeNS(null,"text-anchor","middle");			
				newText.appendChild(textNode);

			// add to text group
			document.getElementById("Text").appendChild(newText);
		}
	};

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

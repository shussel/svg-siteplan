
// set up plan
var siteplan = new SVGplan(window.frameElement.getAttribute('data-issmall'), window.frameElement.getAttribute('data-space'));

function SVGplan(isSmall, space) {

	this.isSmall = (isSmall === "true");
	this.space = space;

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
			self.data = JSON.parse(request.responseText);
			init(self.data);
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

			if(el = document.getElementById(space)) {

				// add label for space
				if (!self.isSmall)
				{
					self.label(space, data[space]["label"]);
				}

				// color current space red
				if (space == "s"+self.space)
				{
					el.setAttribute('fill', "#ff0000");
				// or color available space yellow
				} else if (data[space]["available"] == true)
				{			
					el.setAttribute('fill', "#fefda0");
				}

				// add hover events
				el.addEventListener("mouseover", function() {
					self.hover(this, space);
				});

				el.addEventListener("mouseout", function() {
					self.dehover(this, space);
				});
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

	// hover space
	this.hover = function(el, space) {

		// only hover if not current space
		if (space != "s"+self.space)
		{
			if (self.data[space]["available"] == true)
			{
				var color = "#ff0000";
				var legend = "avail";
			} else {
				var color = "#add8e6";
				var legend = "occ";
			}
			el.setAttribute('fill', color);
			document.getElementById(legend).setAttribute('fill', color);
		}
	};

	// dehover space
	this.dehover = function(el, space) {

		// only hover if not current space
		if (space != "s"+self.space)
		{
			if (self.data[space]["available"] == true)
			{
				var color = "#fefda0";
				var legend = "avail";
			} else {
				var color = "#eeeeee";
				var legend = "occ";
			}
			el.setAttribute('fill', color);
			document.getElementById(legend).setAttribute('fill', color);
		}
	};

}


// set up plan
var siteplan = new SVGplan(window.frameElement.getAttribute('data-issmall'), window.frameElement.getAttribute('data-space'));

function SVGplan(isSmall, space) {

	// public properties

	// database plan id from custom data:id attribute of svg tag
	this.id = document.getElementsByTagName("svg")[0].getAttributeNS('plan-data', 'id');

	// database id of current space (if any)
	this.space = space;

	// small version omits some info
	this.isSmall = (isSmall === "true");

	// private properties	
	
	var self = this;
	var fader, data;

	// path to JSON data
	var dataPath = '/data/svgplan.php';

	var svgns = "http://www.w3.org/2000/svg";

	// colors
	var colors = {
					"current" : "#ff0000",		// red
					"available" : "#fefda0",	// yellow
					"occ" : "#eeeeee",			// grey
					"hover" : "#add8e6"			// lt. blue
				 };

	// font
	var font = {
					"size" : 10,	
					"family" : "Arial",
					"weight" : "bold"
			   };	

	// info box
	var info = {};
		info.box = document.getElementById('Infobox');
		info.title = document.getElementById('title');
		info.info1 = document.getElementById('info1');
		info.info2 = document.getElementById('info2');

	var textgroup = document.getElementById("Text");

	var legend = {};
		legend.occ = document.getElementById("occ");
		legend.avail = document.getElementById("avail");		
	
	// hide text in small version
	if (this.isSmall)
	{
		textgroup.setAttributeNS(null,"visibility","hidden");
	}
	
	// load json data for this site plan
	var request = new XMLHttpRequest();
		request.open('GET', dataPath+"?id="+this.id, true);

		request.onload = function() {
		  if (request.status >= 200 && request.status < 400)
		  {
			data = JSON.parse(request.responseText);
			init();
		  } else {
			console.log('request error');
		  }
		};

		request.onerror = function() {
		  console.log('connection error');
		};

		request.send();

	// initialize plan with data
	var init = function() {

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
					el.setAttribute('fill', colors.current);
				// or color available space yellow
				} else if (data[space]["available"] == true)
				{			
					el.setAttribute('fill', colors.available);
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
			var newText = document.createElementNS(svgns,"text");
				newText.setAttributeNS(null,"x",x);     
				newText.setAttributeNS(null,"y",y); 
				newText.setAttributeNS(null,"font-size",font.size);
				newText.setAttributeNS(null,"font-family",font.family);
				newText.setAttributeNS(null,"font-weight",font.weight);
				newText.setAttributeNS(null,"text-anchor","middle");
				newText.setAttributeNS(null,"class","label");
				newText.appendChild(textNode);

			// add to text group
			textgroup.appendChild(newText);

			// repeat hover events on labels
			newText.addEventListener("mouseover", function() {
				self.hover(el, id);
			});

			newText.addEventListener("mouseout", function() {
				self.dehover(el, id);
			});
		}
	};

	// hover space
	this.hover = function(el, space) {

		// only hover if not current space
		if (space != "s"+self.space)
		{
			if (data[space]["available"] == true)
			{
				var color = colors.current;
				var setlegend = legend.avail;
			} else {
				var color = colors.hover;
				var setlegend = legend.occ;
			}
			el.setAttribute('fill', color);
			if (!self.isSmall)
			{
				setlegend.setAttribute('fill', color);
				self.setInfo(space);
				clearInterval(fader);
				fader = setInterval(function() {
					fade(.2);
				}, 75);
			}			
		}		
	};

	// dehover space
	this.dehover = function(el, space) {

		// only hover if not current space
		if (space != "s"+self.space)
		{
			if (data[space]["available"] == true)
			{
				var color = colors.available;
				var setlegend = legend.avail;
			} else {
				var color = colors.occ;
				var setlegend = legend.occ;
			}
			el.setAttribute('fill', color);
			if (!self.isSmall)
			{
				setlegend.setAttribute('fill', color);
				clearInterval(fader);
				fader = setInterval(function() {
					fade(-.2);
				}, 50);
			}			
		}		
	};

	this.setInfo = function (space) {
		info.title.textContent = data[space]['name'];
		info.info1.textContent = data[space]['comment1'];
		info.info2.textContent = data[space]['comment2'];
	};

	var fade = function(step) {
		var opacity = parseFloat(info.box.style.opacity);
		if (1 >= opacity+step && opacity+step >= 0)
		{
			info.box.style.opacity = opacity + step;
		} else {
			clearInterval(fader);
		}
	};
}

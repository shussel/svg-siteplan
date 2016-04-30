
function initSitePlan() {

	// load svg document
	var svg = document.getElementById('svgplan').contentDocument;

	// find space list
	var spaces = document.querySelectorAll('.planlist li');

	for (i = 0; i < spaces.length; ++i) {
		
		// get data-id attribute
		if (spaceid = spaces[i].getAttribute("data-id"))
		{
			var space = "s"+spaceid;
			var el = svg.getElementById(space);

			// add hover events
			spaces[i].addEventListener("mouseover", hover(el,space));
			spaces[i].addEventListener("mouseout", dehover(el,space));
		}
	}

	function hover(el, space) {
		return function() {
			svg.defaultView.siteplan.hover(el, space);
		};
	}

	function dehover(el, space) {
		return function() {
			svg.defaultView.siteplan.dehover(el, space);
		};
	}
}

window.addEventListener("load", initSitePlan);
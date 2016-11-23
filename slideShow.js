// Slide show
function Slide(para) {

	// Data members
	this.id = para.id;
	this.items = para.items;
	this.curImgID = 0;
	this.timer = undefined;

	// Start
	this.start = function() {
		var display = {};
		var output = "";
		var that = this;

		// Get display area
		display = document.getElementById(this.id);

		// Create image block
		output += this.createImageBlock();

		// Create button
		output += this.createButton();

		// Create navbar
		output += this.createNavbar();

		// Apply content
		display.className = "slideShow main";
		display.innerHTML = output;

		// Bind events
		this.bindEvent();
	}

	// Create image block
	this.createImageBlock = function() {
		var i = 0;
		var output = "";

		// For each image
		for (i = 0; i < this.items.length; i++) {
			output += "<div";
			output += " id=\"slideImgB" + i + "\"";
			output += " class=\"slideShow image\"";
			output += ">";

			// Image
			output += "<img";
			output += " src=\"" + this.items[i] + "\"";
			output += " id=\"slideImg" + i + "\"";
			output += " class=\"slideShow\"";
			output += ">";

			output += "</div>";
		}

		return output;
	}

	// Create button
	this.createButton = function() {
		var output = "";

		// Prev button
		output += "<div";
		output += " id=\"slideBtnPrev\"";
		output += " class=\"slideShow button\"";
		output += " style=\"left: 1%\"";
		output += ">";
		output += "<img";
		output += " src=\"img/left.png\"";
		output += " style=\"width:100%;height:100%;\"";
		output += ">";
		output += "</div>";

		// Next button
		output += "<div";
		output += " id=\"slideBtnNext\"";
		output += " class=\"slideShow button\"";
		output += " style=\"right: 1%\"";
		output += ">";
		output += "<img";
		output += " src=\"img/right.png\"";
		output += " style=\"width:100%;height:100%;\"";
		output += ">";
		output += "</div>";

		return output;
	}

	// Create navbar
	this.createNavbar = function() {
		var i = 0;
		var output = "";

		output += "<div";
		output += " id=\"navbar\"";
		output += " class=\"slideShow navbar\"";
		output += ">";

		// Create a list of image box
		for (i = 0; i < this.items.length; i++) {
			output += "<div";
			output += " id=\"navbox" + i + "\"";
			output += " class=\"slideShow navbox\"";
			output += ">";

			// Images
			output += "<img";
			output += " src=\"" + this.items[i] + "\"";
			output += " id=\"navimg" + i + "\"";
			output += " class=\"slideShow\"";
			output += ">";

			output += "</div>";
		}

		output += "</div>";

		return output;
	}
	
	// Change image
	this.changeImage = function(shift) {
		var i = 0;
		var curImgB = {};
		var maxLen = this.items.length;
		var that = this;

		// Hide current image block
		curImgB = document.getElementById("slideImgB" + this.curImgID);
		curImgB.style = "display: none;";

		// Update current image ID
		this.curImgID += shift;
		if (this.curImgID < 0) this.curImgID += maxLen;
		if (this.curImgID >= maxLen) this.curImgID -= maxLen;

		// Show current image block
		curImgB = document.getElementById("slideImgB" + this.curImgID);
		curImgB.style = "display: block;";
		
		// Adjust image size
		this.adjustImageSize(this.curImgID);

		// Adjust navbar position
		this.adjustNavbarPosition();

		// Destroy timer if defined
		if (this.timer != undefined) {
			clearTimeout(this.timer);

			// Start timer again
			this.timer = window.setTimeout(function(){that.changeImage(+1);}, 3000);
		}
	}

	// Bind events
	this.bindEvent = function() {
		var that = this;

		// onload event for the whole document
		window.onload = function() {

			// Adjust navbar size
			that.adjustNavbarSize();

			// Turn on and adjust image size
			that.changeImage(0);

			// Start first timer
			that.timer = window.setTimeout(function(){that.changeImage(+1);}, 3000);
		}

		// onresize event for window
		window.onresize = function() {
			that.adjustImageSize(that.curImgID);
			that.adjustNavbarSize();
			that.adjustNavbarPosition();
		}

		// Bind prev/next buttons
		document.getElementById("slideBtnPrev").onclick = function() {
			that.changeImage(-1);
		}
		document.getElementById("slideBtnNext").onclick = function() {
			that.changeImage(+1);
		}
	}

	// Adjust image size
	this.adjustImageSize = function(imgID) {
		var imgBlk = {};
		var imgSrc = {};

		// Image block and image source
		imgBlk = document.getElementById("slideImgB" + imgID);
		imgSrc = document.getElementById("slideImg" + imgID);

		// Adjust image source to fit image block
		this.adjustToParent(imgSrc, imgBlk);
	}

	// Adjust navbar size
	this.adjustNavbarSize = function() {
		var i = 0;
		var navImg = {};
		var navBox = {};

		// Adjust navbox size
		for (i = 0; i < this.items.length; i++) {
			navBox = document.getElementById("navbox" + i);
			navBox.style.width = navBox.clientHeight + "px";

			// Adjust image to fit navbox
			navImg = document.getElementById("navimg" + i);
			this.adjustToParent(navImg, navBox);
		}
	}

	// Adjust navbar position
	this.adjustNavbarPosition = function() {
		var i = 0;
		var navbar = {};
		var navbox = {};
		var barW = 0, barH = 0, boxS = 0, gap = 0;
		var leftCnt = 0, shift = 0;
		var output = "";

		// Get size of navbar
		navbar = document.getElementById("navbar");
		barW = navbar.clientWidth;
		barH = navbar.clientHeight;

		// Get size of navbox (width == height)
		navbox = document.getElementById("navbox" + this.curImgID);
		boxS = navbox.clientWidth;

		// Gap between navboxes
		gap = barH - boxS;

		// Calculate count of navboxes on the left/right side
		leftCnt = parseInt((this.items.length - 1) / 2);

		// Adjust position of navboxes
		for (i = 0; i < leftCnt; i++) {
			curID = (this.curImgID - leftCnt + i + this.items.length) % this.items.length;
			shift = (barW - boxS) / 2 - (leftCnt - i) * (boxS + gap);
			navbox = document.getElementById("navbox" + curID);
			navbox.style.left = shift + "px";
			navbox.style.opacity = "0.3";
		}
		for (i = 0; i < this.items.length - leftCnt; i++) {
			curID = (this.curImgID + i) % this.items.length;
			shift = (barW - boxS) / 2 + i * (boxS + gap);
			navbox = document.getElementById("navbox" + curID);
			navbox.style = "left: " + shift + "px;";
			if (i != 0) {
				navbox.style.opacity = "0.3";
			}
		}
	}

	// Adjust child element to fit parent element
	this.adjustToParent = function(chd, par) {
		var pW = 0, pH = 0, cW = 0, cH = 0;
		var gap = 0;

		// Retrieve width and height
		pW = par.clientWidth;
		pH = par.clientHeight;
		cW = chd.clientWidth;
		cH = chd.clientHeight;

		// Dominated by width
		if (pW/pH < cW/cH) {
			chd.style.width = pW + "px";
			chd.style.height = "auto";

			// fix vertical center
			cH = chd.clientHeight;
			gap = (pH - cH) / 2.0;
			chd.style.top = gap + "px";

		// Dominated by height
		} else {
			chd.style.height = pH + "px";
			chd.style.width = "auto";

			// Reset top gap
			chd.style.top = "0px";
		}
	}
}

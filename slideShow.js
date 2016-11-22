// Slide show
function Slide(para) {

	// Data members
	this.id = para.id;
	this.items = para.items;
	this.curImgID = 0;
	this.timer = undefined;
	this.navbarList = [];

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
		var mod = 0;
		var nxtID = 0;

		output += "<div";
		output += " class=\"slideShow navbar\"";
		output += ">";

		// Calculate image ordering
		this.navbarList.push(this.curImgID);
		for (i = 1; i < this.items.length; i++) {
			mod = i % 2;
			if (mod > 0) {
				nxtID = this.curImgID + (i + 1) / 2;
				if (nxtID >= this.items.length) {
					nxtID -= this.items.length;
				}
				this.navbarList.push(nxtID);
			} else {
				nxtID = this.curImgID - i / 2;
				if (nxtID < 0) {
					nxtID += this.items.length;
				}
				this.navbarList.unshift(nxtID);
			}
		}

		// Create a list of image box
		for (i = 0; i < this.navbarList.length; i++) {
			output += "<div";
			output += " id=\"navbox" + this.navbarList[i] + "\"";
			output += " class=\"slideShow navbox\"";
			output += ">";

			// Images
			output += "<img";
			output += " src=\"" + this.items[this.navbarList[i]] + "\"";
			output += " id=\"navimg" + this.navbarList[i] + "\"";
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

		// TODO: adjust navbar position

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

			// Turn on and adjust image size
			that.changeImage(0);

			// Start first timer
			that.timer = window.setTimeout(function(){that.changeImage(+1);}, 3000);

			// Adjust navbar size (and position)
			that.adjustNavbarSize();

			// TODO: adjust navbar position
		}

		// onresize event for window
		window.onresize = function() {
			that.adjustImageSize(that.curImgID);
			that.adjustNavbarSize();
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

	// Adjust navbar
	this.adjustNavbarSize = function() {
		var i = 0;
		var navImg = {};
		var navBox = {};

		// Adjust navbox size
		for (i = 0; i < this.navbarList.length; i++) {
			navBox = document.getElementById("navbox" + this.navbarList[i]);
			navBox.style = "display: block;";
			navBox.style.width = navBox.clientHeight + "px";

			// Adjust image to fit navbox
			navImg = document.getElementById("navimg" + this.navbarList[i]);
			this.adjustToParent(navImg, navBox);
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

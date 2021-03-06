// Slide show
function Slide(para) {

	// Data members
	this.id = para.id;
	this.items = para.items;
	this.curImgID = 0;
	this.timer = undefined;

	// Private member
	var navOldPos = [];
	var navCurPos = [];

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
		curImgB.style.display = "none";

		// Update current image ID
		this.curImgID += shift;
		if (this.curImgID < 0) this.curImgID += maxLen;
		if (this.curImgID >= maxLen) this.curImgID -= maxLen;

		// Show current image block
		curImgB = document.getElementById("slideImgB" + this.curImgID);
		curImgB.style.display = "block";
		
		// Adjust image size
		this.adjustImageSize(this.curImgID);

		// Adjust navbar position
		this.adjustNavbarPosition(false);

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
		var i = 0;
		var obj;

		// Bind onload event for the whole document
		window.onload = function() {

			// Adjust navbar size
			that.adjustNavbarSize();

			// Turn on and adjust image size
			that.changeImage(0);

			// Start first timer
			that.timer = window.setTimeout(function(){that.changeImage(+1);}, 3000);
		}

		// Bind onresize event for window
		window.onresize = function() {
			that.adjustImageSize(that.curImgID);
			that.adjustNavbarSize();
			that.adjustNavbarPosition(true);
		}

		// Bind onlick event for prev/next buttons
		document.getElementById("slideBtnPrev").onclick = function() {
			that.changeImage(-1);
		}
		document.getElementById("slideBtnNext").onclick = function() {
			that.changeImage(+1);
		}

		// For each navbox
		for (i = 0; i < this.items.length; i++) {
			obj = document.getElementById("navbox" + i);

			// onclick
			obj.onclick = function(id) {
				return function() {
					that.changeImage(id - that.curImgID);
				}
			}(i);

			// Hover effect
			obj.onmouseover = function() {
				this.style.opacity = "1";
			}
			obj.onmouseout = function(id) {
				return function() {
					if (id != that.curImgID) {
						this.style.opacity = "0.3";
					}
				}
			}(i);
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
	this.adjustNavbarPosition = function(isDirect) {
		var i = 0;
		var navbar = {};
		var navbox = {};
		var barW = 0, barH = 0, boxS = 0, gap = 0;
		var leftCnt = 0, shift = 0, mid;
		var output = "";
		var that = this;

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

		// Clone current positions to old positions
		navOldPos = navCurPos.slice();

		// Calculate new positions
		mid = (barW - boxS) / 2;
		for (i = 0; i < leftCnt; i++) {
			curID = (this.curImgID - leftCnt + i + this.items.length) % this.items.length;
			shift = mid - (leftCnt - i) * (boxS + gap);
			navCurPos[curID] = shift;
		}
		for (i = 0; i < this.items.length - leftCnt; i++) {
			curID = (this.curImgID + i) % this.items.length;
			shift = mid + i * (boxS + gap);
			navCurPos[curID] = shift;
		}

		// Apply to navboxes
		shift = navCurPos[this.curImgID] - navOldPos[this.curImgID];
		for (i = 0; i < this.items.length; i++) {
			navbox = document.getElementById("navbox" + i);
			navbox.style.opacity = ((i == this.curImgID) ? "1" : "0.3");

			// First time or specified, update positions directly
			if (navOldPos[i] == undefined || isDirect) {
				navbox.style.left = navCurPos[i] + "px";
			} else {

				// Animation for middle boxes
				if ((navCurPos[this.curImgID] - navOldPos[this.curImgID]) * 
					(navCurPos[i] - navOldPos[i]) >= 0) {
					this.shiftAnimation(navbox, navOldPos[i], navCurPos[i], 300);

				// Animation for endpoint boxes
				} else {

					// Shift left: go left and appear at right
					// Shift right: go right and appear at left
					// Hint: no matter which direction, it's the same way as middle navbox
					this.shiftAnimation(navbox, navOldPos[i], navOldPos[i] + shift, 150, function(obj, id) {
						return function() {
							that.shiftAnimation(obj, navCurPos[id] - shift, navCurPos[id], 150);
						}
					}(navbox, i));
				}
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

	// Animation of changing positions with shifting
	this.shiftAnimation = function(obj, oldPos, newPos, msec, func) {
		var curPos = 0, shift = 0;
		var timeID = undefined;

		// Create animation
		curPos = oldPos;
		shift = (newPos - oldPos) / (msec / 20);
		timeID = setInterval(animationHelp, 20);

		// Animation help
		function animationHelp() {
			
			// Reach new position
			if (curPos == newPos) {
				clearInterval(timeID);

				// Call function if specified
				if (func != undefined) {
					func();
				}
			} else {
				curPos += shift;
				if ((curPos - oldPos) * (curPos - newPos) >= 0) {
					curPos = newPos;
				}
				obj.style.left = curPos + "px";
			}
		}
	}
}

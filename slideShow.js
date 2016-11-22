// Slide show
function Slide(para) {

	// Data members
	this.id = para.id;
	this.items = para.items;
	this.curImgID = 0;

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
		output += " width=\"100%\"";
		output += " height=\"100%\"";
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
		output += " width=\"100%\"";
		output += " height=\"100%\"";
		output += ">";
		output += "</div>";

		return output;
	}
	
	// Change image
	this.changeImage = function(shift) {
		var i = 0;
		var curImgB = {};
		var maxLen = this.items.length;

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
	}

	// Bind events
	this.bindEvent = function() {
		var that = this;

		// onload event for the whole document
		window.onload = function() {

			// Turn on and adjust image size
			that.changeImage(0);
			that.adjustImageSize(that.curImgID);
		}

		// onresize event for window
		window.onresize = function() {
			that.adjustImageSize(that.curImgID);
		}

		// Bind prev/next buttons
		document.getElementById("slideBtnPrev").onclick = function() {
			that.changeImage(-1);
			that.adjustImageSize(that.curImgID);
		}
		document.getElementById("slideBtnNext").onclick = function() {
			that.changeImage(+1);
			that.adjustImageSize(that.curImgID);
		}
	}

	// Adjust image size
	this.adjustImageSize = function(imgID) {
		var imgBlk = {};
		var imgSrc = {};
		var bW = 0, bH = 0, iW = 0, iH = 0;
		var gap = 0;

		// Retrieve image block
		imgBlk = document.getElementById("slideImgB" + imgID);
		bW = imgBlk.clientWidth;
		bH = imgBlk.clientHeight;

		// Retrieve image itself
		imgSrc = document.getElementById("slideImg" + imgID);
		iW = imgSrc.clientWidth;
		iH = imgSrc.clientHeight;

		// Dominated by width
		if (bW/bH < iW/iH) {
			imgSrc.style.width = bW + "px";
			imgSrc.style.height = "auto";

			// fix vertical center
			iH = imgSrc.clientHeight;
			gap = (bH - iH) / 2.0;
			imgSrc.style.top = gap + "px";

		// Dominated by height
		} else {
			imgSrc.style.height = bH + "px";
			imgSrc.style.width = "auto";
			imgSrc.style.top = "0px";
		}
	}
}

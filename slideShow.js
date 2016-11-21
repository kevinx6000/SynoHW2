// Slide show
function Slide(para) {

	// Data members
	this.id = para.id;
	this.items = para.items;
	this.curImgID = 0;

	// Start slide show
	this.start = function() {
		var diplay = {};
		var output = "";
		var that = this;

		// Get display area
		display = document.getElementById(this.id);

		// Create image blocks
		output += this.createImageBlock();

		// Create prev/next buttons
		output += this.createButton();
		
		// Apply slide show
		display.className = "slideShow main";
		display.innerHTML = output;

		// Turn the first image on
		this.changeImage(0);

		// Bind change function to buttons
		document.getElementById("slideBtnPrev").onclick = function() {
			that.changeImage(-1);
		}
		document.getElementById("slideBtnNext").onclick = function() {
			that.changeImage(+1);
		}
	};

	// Create image blocks
	this.createImageBlock = function() {
		var i = 0;
		var output = "";

		// For each image
		for(i = 0; i < this.items.length; i++) {

			// Image source
			output += "<img";
			output += " src=\"" + this.items[i] + "\"";
			output += " id=\"slidePic" + i + "\"";
			output += " class=\"slideShow image\"";
			output += ">";
		}

		return output;
	}

	// Create prev/next button
	this.createButton = function() {
		var output = "";

		// Prev button
		output += "<div";
		output += " id=\"slideBtnPrev\"";
		output += " class=\"slideShow button\"";
		output += " style=\"left: 5%\"";
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
		output += " style=\"right: 5%\"";
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
		var curImg = {};
		var maxLen = this.items.length;

		// Hide current image
		curImg = document.getElementById("slidePic" + this.curImgID);
		curImg.style = "display: none;";

		// Update current image ID
		this.curImgID += shift;
		if (this.curImgID < 0) this.curImgID += maxLen;
		if (this.curImgID >= maxLen) this.curImgID -= maxLen;

		// Show current image
		curImg = document.getElementById("slidePic" + this.curImgID);
		curImg.style = "display: block;";

		// Fit width and height
		if (curImg.height > curImg.width) {
			curImg.style.height = "100%";
			curImg.style.width = "auto";
		} else {
			curImg.style.width = "100%";
			curImg.style.height = "auto";
		}
	}
}

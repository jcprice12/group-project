/***********************************************************************************************************************************************************
	Load Animation Prototype
**********************************************************************************************************************************************************/
function MyLoadAnimation1(myParentContainer, mySize, myCircleSize, myNumberOfCircles, myColors){
	this.counter = 0;
	this.elementsToAnimate = [];
	this.size = mySize;
	this.radius = (mySize/2);
	this.circleSize = myCircleSize;
	this.canPlay = true;
	this.myTimer = null;
	this.colors = myColors;
	this.numberOfCircles = myNumberOfCircles;
	this.parentContainer = myParentContainer;
	this.loadContainer = null;
}

//convert degrees to radians
MyLoadAnimation1.prototype.getRadians = function(degree){
	var radian = degree *(Math.PI / 180);
	return radian;
}

//get the appropriate x coordinate based on value of cos(degree)
MyLoadAnimation1.prototype.getXCoord = function(radius, halfOfElementWidth, degree){
	var xCoord = (radius + ((radius - halfOfElementWidth) * Math.cos(this.getRadians(degree)))) - halfOfElementWidth;
	return xCoord;
}

//get the appropriate y coordinate based on value of sin(degree)
MyLoadAnimation1.prototype.getYCoord = function(radius, halfOfElementHeight, degree){
	var yCoord = (radius + ((radius - halfOfElementHeight) * Math.sin(this.getRadians(degree)))) - halfOfElementHeight;
	return yCoord;
}


//remove the loadAnimation from the parent container
MyLoadAnimation1.prototype.removeAnimation = function(){
	$(this.loadContainer).remove();
}


//build the html and css for a circle in the load animation
MyLoadAnimation1.prototype.buildCircle = function(color){
	var circle = document.createElement("div");
	$(circle).addClass("MyLoadAnimation1-Circle");
	$(circle).css("position","absolute");
	$(circle).css("width", (this.circleSize + "px"));
	$(circle).css("height", (this.circleSize + "px"));
	$(circle).css("border-radius","50%");
	$(circle).css("background-color", color +"");
	$(circle).css("display", "none");
	return circle;
}


//build the html and css for the load animation to take place in
MyLoadAnimation1.prototype.buildHTML = function(){
	var myLoadContainer = document.createElement("div");
	$(myLoadContainer).addClass("MyLoadAnimation1-LoadContainer");
	$(myLoadContainer).css("position", "absolute");
	$(myLoadContainer).css("margin", "auto");
	$(myLoadContainer).css("left", "0");
	$(myLoadContainer).css("right", "0");
	$(myLoadContainer).css("top", "0");
	$(myLoadContainer).css("bottom", "0");
	$(myLoadContainer).css("height", (this.size + "px"));
	$(myLoadContainer).css("width", (this.size + "px"));
	$(myLoadContainer).css("-webkit-transform", "rotate(270deg)");
	$(myLoadContainer).css("-moz-transform", "rotate(270deg)");
	$(myLoadContainer).css("-o-transform", "rotate(270deg)");
	$(myLoadContainer).css("-ms-transform", "rotate(270deg)");
	$(myLoadContainer).css("transform", "rotate(270deg)");
	var colorCounter = 0;
	for(var i = 0; i < this.numberOfCircles; i++){
		if(colorCounter >= this.colors.length){
			colorCounter = 0;
		}
		var circle = this.buildCircle(this.colors[colorCounter]);
		colorCounter++;
		this.elementsToAnimate.push(circle);
		$(myLoadContainer).append($(circle));
	}
	this.loadContainer = myLoadContainer;
	return this.loadContainer;
}

//stop the animation
MyLoadAnimation1.prototype.stopAnimation = function(){
	this.canPlay = false;
	clearTimeout(this.myTimer);
}

//stop the animation
MyLoadAnimation1.prototype.stopAndRemove = function(){
	this.stopAnimation();
	this.removeAnimation();
}

//main animate function
MyLoadAnimation1.prototype.animate = function(elementToAnimate, elementToAnimateWidth, elementToAnimateHeight, radiusOfContainer, degree, acceleration, moveSpeed){

	if(radiusOfContainer != 0){
		var mySelf = this;

		$(elementToAnimate).show();//just in case

		//redraw the element
		elementToAnimate.style.left = this.getXCoord(radiusOfContainer, (elementToAnimateWidth/2), degree) + "px";
		elementToAnimate.style.top = this.getYCoord(radiusOfContainer, (elementToAnimateHeight/2), degree) + "px";
		
		//update speed
		moveSpeed = moveSpeed + acceleration;
		degree = degree + moveSpeed;

		//decrease speed once halfway (sometimes won't be exact)
		if(degree >= 180){
			acceleration = acceleration * -1;
		}

		//stop if full revolution
		if(degree >= 360){
			this.counter++;
			if(this.counter == (this.elementsToAnimate.length)){
				this.counter = 0;
				setTimeout(function(){
					mySelf.startAnimation(0, mySelf.elementsToAnimate.length);
				},1000);
			}
			//prevent looping by returning
			return;
		}

		//loop to make "animation"
		if(this.canPlay){
			setTimeout(function(){
				mySelf.animate(elementToAnimate, elementToAnimateWidth, elementToAnimateHeight, radiusOfContainer, degree, acceleration, moveSpeed);
			}, 20);
		}
	}
}

//should be called when initially starting the animation
MyLoadAnimation1.prototype.startAll = function(){
	//console.log("hey");
	this.canPlay = true;
	$(this.parentContainer).append(this.buildHTML());
	this.startAnimation(0,this.elementsToAnimate.length);
}

//cascade elements in array
MyLoadAnimation1.prototype.startAnimation = function(current, stop){
	var mySelf = this;
	if(current < stop && this.canPlay){
		this.animate(this.elementsToAnimate[current], this.circleSize, this.circleSize, this.radius, 0, 0.15, 3);
		this.myTimer = setTimeout(function(){
			mySelf.startAnimation((current + 1), stop);
		}, 100);
	}
}

/********************************************************************************************************************************************
 END Load Animation Prototype
********************************************************************************************************************************************/

//var elementsToAnimate = [document.getElementById("circle1"), document.getElementById("circle2"), document.getElementById("circle3"), document.getElementById("circle4")];
//var loadAnimation1 = new MyLoadAnimation1(document.getElementById("mainContent"),75,12,4,["#2ECC71","#fdcb4e","#ff6876","#666ffd",]);
//loadAnimation1.startAll();

module.exports = {
  MyLoadAnimation1,
};
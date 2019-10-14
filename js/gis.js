var maps = []; //array to store images
var mapFocus = 0; //number in array to focus
var bindTwo = false;
var tSlider1, tSlider2;
var bSlider1, bSlider2;
var nNodeSelect;
var dim = 3;
var mode = 0; //mode 0 = edit nodes, 1 = edit distances
var imageOn = true;
var rt = 0; //rotate variable
var zoom = 1;
var nNodes = 4;
//var trans = 1.0;
var mapImages = [];
var autoRotate = false;
var worm = false;
var delaunayOn = false;
var bindDist = 180;
var connectDist = 20;
var connectLastNodes = 1; //connect last n-nodes in two map mode
var scrollLock = false;
var editMode = true;

var jitterEdgeMultiplierMagnitude = 0.01; // fractional maximum jitter multiplier per edge
var jitterVertexAbsoluteMagnitude = 1.00; // maximum jitter addition per node x or y coordinate

//these generated dynamically to fit screen
var canvaswidth = 0;
var canvasheight = 0;

var dragDiffX = 0;
var dragDiffY = 0;
var dragOffX = 0;
var dragOffY = 0;
var dragging = false;

var vrModeOn = false;
var renderer;

new p5();


//BEGIN LEFT CANVAS
//instance mode of p5.js https://github.com/processing/p5.js/wiki/p5.js-overview#instantiation--namespace

	setup = function() {
	  // create canvas
		noLoop();
	  var c = createCanvas(document.getElementById("leftCanv").offsetWidth,document.getElementById("leftCanv").offsetHeight);
		c.parent("leftCanv");
	  //colorMode('HSB',360,100,100,100)
	  background('#fff');
	  fill(0,0,0,100);
	  noStroke();
	  textSize(24);
	  textAlign('CENTER');
	  text('Drag and drop a map or other image', width/4, height/2);
	  fill(0,0,10,80);
	  noStroke();
	  textSize(14);
	  textAlign('CENTER');
	  text('  (Enfolding supports .JPG, .JPEG, .GIF, .PNG, .SVG)', width/4, height/1.87);// Add an event for when a file is dropped onto the canvas
	  c.drop(gotFile);
	  //createDiv('data: ').id('dataResults');
	};

	draw = function() {};



	gotFile = function(file) {
	  //console.log(file);
	  if (file.type === 'image') {
			// Create an image DOM element and add to maps array
			// console.log("We're currently seeing: "+file.data)
			loadImage(file.data,addMap);//callback to addMap once image loaded
			//array mapImages holds map images for three.js access
			//images also added to Map objects
			//double storage should be consolidated in future versions
			//currently unable to access img file from Map class for three.js, possible because
			//stored as a p5 filetype (using file.data might fix)
			mapImages.push(file.data);
			//console.log('map focus: ' + mapFocus);
		} else {
			console.log('Not an image file!');
	 	}
	};


	addMap = function(imgLoaded){
		var offX = 30
		if(maps.length > 0){
			offX = maps[mapFocus].img.width + 50;
		}
		append(maps,new Map('map'+maps.length,1,imgLoaded,offX, maps.length));
		mapFocus = maps.length - 1; //change focus to last uploaded map
		maps[mapFocus].makeNew();
		maps[mapFocus].reCalculate();

		//create new transparency slider for map
		var div = document.getElementById('transSliders');
		var newSlider = document.createElement("INPUT");
		newSlider.setAttribute("type", "range");
		newSlider.setAttribute("min", 0);
		newSlider.setAttribute("max", 100);
		newSlider.setAttribute("value", 100);
		newSlider.setAttribute("id",maps.length-1);
		newSlider.setAttribute("onchange","tslide(this)");
		newSlider.style.width = "150px";
		var targetDiv = document.getElementById("transSliders");
		targetDiv.innerHTML += "Opacity, map#" + maps.length + " <br />";
		targetDiv.appendChild(newSlider);
		targetDiv.innerHTML += "<br />";
	}

	deleteIns = function(){
		var allInputs = document.getElementsByClassName(maps[mapFocus].name);
		//console.log(allInputs);
		for(var i = allInputs.length-1; i >= 0; i--){
			allInputs[i].remove();
		}
	}

	addAllInputs = function(){
		maps[mapFocus].addInputs();
	}

	moveIns = function(){
		var allInputs = document.getElementsByClassName("mapIn");
		for(var i = 0; i < allInputs.length; i++){
			var ogY = parseInt(allInputs[i].dataset.ypos);
			var ogX = parseInt(allInputs[i].dataset.xpos);
			allInputs[i].style.top = ogY + dragOffY;
			allInputs[i].style.left = ogX + dragOffX;
		}
	}

	//input.attribute("data-xpos", posX);
	//input.attribute("data-ypos", posY);

	showDefaultIns = function(){
		var allInputs = document.getElementsByClassName("mapIn");
		for(var i = 0; i < allInputs.length; i++){
			allInputs[i].style.visibility = "hidden";
		}
		var allInputs = document.getElementsByClassName("defaultIn");
		for(var i = 0; i < allInputs.length; i++){
			allInputs[i].style.visibility = "visible";
		}
	}

	gridMode = function(){
		//resetMaps();
		maps[mapFocus].grid();
		gridMode = true;
		recalcMaps();
	}

	gridMode2 = function(){
		//resetMaps();
		deleteIns();
		//maps[mapFocus].reset(p);
		maps[mapFocus].grid2();
		gridMode = true;
		recalcMaps();
	}

	testNodes = function(){
		maps[mapFocus].addTestNodes();
	}

	testNodes2 = function(){
		maps[mapFocus].addTestNodes2();
	}

	mouseReleased = function(){
			if(dragging){
				moveIns();
				//showDefaultIns();
				dragging = false;
			} else {
				maps[mapFocus].selectNode(mouseX,mouseY);
			}
	};

	mousePressed = function(){
		if(editMode){
			dragDiffX = mouseX - dragOffX;
			dragDiffY = mouseY - dragOffY;
		}
	}

	mouseDragged = function(){
		dragging = true;
		//hideIns();
		if(editMode){
			dragOffX = mouseX - dragDiffX;
			dragOffY = mouseY - dragDiffY;
			displayMaps();
		}
	}

	//FUNCTION FOR ZOOMING IN ON MAPS IN EDIT MODE
	// mouseWheel = function(event){
	// 	if(!scrollLock){
	// 		maps[mapFocus].mapZoom(event.delta,p);
	// 	}
	// 	return false;
	// }

	trans1 = function(){
		transOne();
	}

	trans2 = function(){
		transTwo();
	}

	bind1 = function(){
		bindDist = bSlider1.value();
		reCalc();
	}

	bind2 = function(){
		connectDist = bSlider2.value();
		reCalc();
	}

	keyPressed = function(){

	}

//END LEFT CANVAS

//BEGIN RIGHT CANVAS, THREE.JS

window.onload = function() {
	canvaswidth = document.getElementById('leftCanv').clientWidth;
	canvasheight = document.getElementById('leftCanv').clientHeight;
	initThree();
	animateThree();
};

	var scene, camera;
	var strDownloadMime = "image/octet-stream";
	var wireframeOn = false;

	//var material = new THREE.MeshLambertMaterial( { color: 0x0000FF, transparent: true, opacity: 0.8, side: THREE.DoubleSide, wireframe:wireframeOn } );
  var slices = [];


	function initThree() {
		renderer = new THREE.WebGLRenderer({
		alpha: true,
		preserveDrawingBuffer: true
	  });
		renderer.setSize(window.innerWidth, window.innerHeight);
                document.body.appendChild(renderer.domElement);

		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(
                75,             // Field of view
                canvaswidth / canvasheight,      // Aspect ratio
                0.1,            // Near plane
                100000           // Far plane
            );
		  camera.position.set( 0, 0, canvaswidth/2 );
			camera.up = new THREE.Vector3(0,0,1);
			camera.lookAt( new THREE.Vector3(0,0,0));
	 	  scene.add(camera);

			renderer.setSize( canvaswidth, canvasheight );
			//renderer.vr.enabled = true;

			var div = document.getElementById('rightCanv');
			//console.log(div);
			div.appendChild(renderer.domElement);

			controls = new THREE.OrbitControls(camera, renderer.domElement);

			scene.add( new THREE.AmbientLight( 0xC0C0C0 ) );

			var dLight = new THREE.DirectionalLight(0xFFFFFF, 0.2);
  			dLight.position.set(5,5,-5);
  			scene.add(dLight);

  			var dLight2 = new THREE.DirectionalLight(0xFFFFFF, 0.5);
  			dLight2.position.set(0,5,-5);
  			//scene.add(dLight2);

  			var dLight3 = new THREE.DirectionalLight(0xFFFFFF, 0.5);
  			dLight3.position.set(0,0,5);
  			//scene.add(dLight3);

  			var dLight4 = new THREE.DirectionalLight(0xFFFFFF, 0.2);
  			dLight4.position.set(5,-5,5);
  			scene.add(dLight4);

  			var light = new THREE.AmbientLight( 0x404040 ); // soft white light
			//scene.add( light );

			renderer.setClearColor(0xFFFFFF, 1);
			//The X axis is red. The Y axis is green. The Z axis is blue.
				//var axesHelper = new THREE.AxesHelper( 5 );
				//scene.add( axesHelper );

            //plotTriangles(mdsArray,triangles);
		};

	function animateThree(){
			var render = function () {
				requestAnimationFrame( render );

				if(autoRotate){
					for ( var i = 0; i < slices.length; i ++ ) {
						var slice = slices[ i ];

						slice.rotation.x += 0.005;
						slice.rotation.z += -0.005;
						//console.log(slice.rotation.z);
						//slice.x += .00001;
					}
				}
				if(vrModeOn){

				}
				controls.update();
				renderer.render(scene, camera);


			};
			render();

	};


	function saveAsImage() {
	  var imgData, imgNode;

	  try {
	    var strMime = "image/jpeg";
	    imgData = renderer.domElement.toDataURL(strMime);

	    saveFile(imgData.replace(strMime, strDownloadMime), "test.jpg");

	  } catch (e) {
	    console.log(e);
	    return;
	  }

	}

	var saveFile = function(strData, filename) {
	  var link = document.createElement('a');
	  if (typeof link.download === 'string') {
	    document.body.appendChild(link);
	    link.download = filename;
	    link.href = strData;
	    link.click();
	    document.body.removeChild(link);
	  } else {
	    location.replace(uri);
	  }
	}

//END RIGHT CANVAS

//map class, contains main data structure
function Map(name, opac, img, xoff, id){
	this.name = name;
	this.opac = opac;
	this.img = img;
	this.id = id;
	this.internalNodes = [];
	this.internalEdges = [];
	this.offSetX = xoff;
	this.offSetY = 50;
	this.trias = [0];
	this.mdsMatrix = [];
	this.gridMode = false;
	this.clickCount = 0; //count clicks for long distance edges in gridMode
	this.selectNo = 0; //0 = nothing selected, 1 = first node selected
	this.selectedOne;
	this.selectedTwo;
	//this.delaunayOn = true;
	this.trans = 1.0;
	this.zoomScroll = 1.0;


  this.makeNew = function(){
		//start with 4 nodes at corners
		append(this.internalNodes, new Node(0,0));
		append(this.internalNodes, new Node(this.img.width,0));
		append(this.internalNodes, new Node(this.img.width, this.img.height));
		append(this.internalNodes, new Node(0,this.img.height));


		//and 4 edges that connect them
		append(this.internalEdges, new Edge(0,1,nodeDist(this.internalNodes[0],this.internalNodes[1])));
		append(this.internalEdges, new Edge(1,2,nodeDist(this.internalNodes[1],this.internalNodes[2])));
		append(this.internalEdges, new Edge(2,3,nodeDist(this.internalNodes[2],this.internalNodes[3])));
		append(this.internalEdges, new Edge(3,0,nodeDist(this.internalNodes[3],this.internalNodes[0])));

		for(var j = 0; j < this.internalEdges.length; j++){
			makeInput(this.internalEdges[j], this.internalNodes, j, this.offSetX, this.offSetY, this.name + " defaultIn");
		}

		strokeWeight(3);
		stroke(0,0,0,100);
		this.display();
	}

	this.display = function(){
		//scale(this.zoomScroll);
		push();
		translate(this.offSetX + dragOffX,this.offSetY + dragOffY);
		if(imageOn){
			image(this.img,0,0,this.img.width,this.img.height);
		}
		if(delaunayOn){
			if(this.trias.length % 3 == 0){
				for(var i = 0; i < this.trias.length; i+=3){
					var x1 = this.internalNodes[this.trias[i]].xpos;
					var y1 = this.internalNodes[this.trias[i]].ypos;
					var x2 = this.internalNodes[this.trias[i+1]].xpos;
					var y2 = this.internalNodes[this.trias[i+1]].ypos;
					var x3 = this.internalNodes[this.trias[i+2]].xpos;
					var y3 = this.internalNodes[this.trias[i+2]].ypos;
					stroke(255,0,0,50);
					strokeWeight(8);
					line(x1,y1,x2,y2);
					line(x2,y2,x3,y3);
					line(x3,y3,x1,y1);
				}
			}
		}
		//display nodes
		stroke(0,0,0,150);
		strokeWeight(1);
    	for(var i=0; i < this.internalNodes.length; i++){
    		// if(this.internalNodes.length-1 == i){
    		// 	stroke(255);
    		// 	strokeWeight(3);
    		// }
				//if node is selected, turn on highlight color
				if(this.internalNodes[i].nodeHL == true){
					fill(255,0,0,100);
				} else {
					fill(0,0,0,100);
				}
    		ellipse(this.internalNodes[i].xpos,this.internalNodes[i].ypos, 10, 10);
    		//text(i,this.internalNodes[i].xpos,this.internalNodes[i].ypos);
    	}
    	//display edges
    	strokeWeight(3);
   		stroke(0,0,0, 150);
    	for(var i=0; i < this.internalEdges.length; i++){
    		var x1 = this.internalNodes[this.internalEdges[i].node1].xpos;
    		var x2 = this.internalNodes[this.internalEdges[i].node2].xpos;
    		var y1 = this.internalNodes[this.internalEdges[i].node1].ypos;
    		var y2 = this.internalNodes[this.internalEdges[i].node2].ypos;
    		line(x1,y1,x2,y2);
    	}
    	pop();
	};

	this.blur = function(){
		noStroke();
		fill(255,150);
		rect(0+this.offSetX+dragOffX,0+this.offSetY+dragOffY,this.img.width+this.offSetX,this.img.height+this.offSetY);
	};

	this.returnImg = function(){
		return this.img;
	};

	this.reCalculate = function(){
		//updateData(p);
		resetThree();
		var matrices = makeMatrix(this.id);
		this.mdsMatrix = matrices[0];
		this.trias = matrices[1];
		plotTriangles(this.mdsMatrix, this.trias, this.id, false);
		displayMaps();
		//console.log("recalculate");
	};

	this.reCalculateW = function(){
		var matrices = makeMatrix(this.id);
		this.trias = matrices[1];
		displayMaps();
	};

	this.mapZoom = function(scrollVal){
		this.zoomScroll += scrollVal/30;
		displayMaps();
	}

	this.addInputs = function(){
		deleteIns();
		for(var i = 0; i < this.internalEdges.length; i++){
			makeInput(this.internalEdges[i], this.internalNodes, i, this.offSetX, this.offSetY, this.name);
		}
	}

	this.selectNode = function(mx,my){
		mx = mx-this.offSetX-dragOffX;
		my = my-this.offSetY-dragOffY;
		for(var i = 0; i < this.internalNodes.length; i++){
			if(dist(mx,my,this.internalNodes[i].xpos,this.internalNodes[i].ypos) < 10){
				if(this.selectNo == 0){
			    this.unHighlightNodes();
					this.selectedOne = i;
					this.selectNo = 1;
				} else if(this.selectNo == 1){
					this.selectedTwo = i;
					this.selectNo = 0;
					this.checkForEdge(this.selectedOne,this.selectedTwo);
				}
				this.internalNodes[i].nodeHL = true;
			}
		}
		this.display();
	}

	this.unHighlightNodes = function(){
		for(var i = 0; i < this.internalNodes.length; i++){
			this.internalNodes[i].nodeHL = false;
		}
	}
		this.checkForEdge = function(one,two){
			var foundEdge = false;
			for(var i = 0; i < this.internalEdges.length; i++){
				if(this.internalEdges[i].node1 == one && this.internalEdges[i].node2 == two){
					foundEdge = true;
					makeInput(this.internalEdges[i], this.internalNodes, i, this.offSetX, this.offSetY,this.name);
				} else if(this.internalEdges[i].node1 == two && this.internalEdges[i].node2 == one){
					makeInput(this.internalEdges[i], this.internalNodes, i, this.offSetX, this.offSetY, this.name);
					foundEdge = true;
				}
			}
			if(!foundEdge){
				alert('no edge');
			}
		}

	//called when mouseReleased
		this.addNode = function(mx,my){
		if(mx >this.offSetX && mx < this.img.width+this.offSetX && my > 0 && my <  this.img.height+this.offSetY){ //check if on map
			if(this.gridMode){
				if(this.clickCount % 2 == 0){//evens are first clicks
					this.autoAddNode(mx-this.offSetX,my-this.offSetY);
				} else {//odds complete edge
					this.autoAddNode(mx-this.offSetX,my-this.offSetY);
					var d = nodeDist(this.internalNodes[this.internalNodes.length-2], this.internalNodes[this.internalNodes.length-1]);
					append(this.internalEdges, new Edge(this.internalNodes.length-2,this.internalNodes.length-1,d)); //connect two above nodes
					makeInput(this.internalEdges[this.internalEdges.length-1], this.internalNodes, this.internalEdges.length-1, this.offSetX, this.offSetY, this.name + " defaultIn");
				}
				this.clickCount++;
			} else {
					append(this.internalNodes, new Node(mx-this.offSetX,my-this.offSetY));

					//third argument = n nearest nodes to connect to
					var nodeShort = findClosestNNodes(mx-this.offSetX,my-this.offSetY, nNodes, this.internalNodes);
					//console.log(nodeShort);
					for(var i = 0; i < nodeShort.length; i++){
						//subtract offsets from mx, my because nodes start from (0,0), then translated
						append(this.internalEdges, new Edge(nodeShort[i], this.internalNodes.length - 1, nodeDistXY(this.internalNodes[nodeShort[i]], mx-this.offSetX,my-this.offSetY)));
						makeInput(this.internalEdges[this.internalEdges.length-1], this.internalNodes, this.internalEdges.length-1, this.offSetX, this.offSetY, this.name + " defaultIn");
					}
					//console.log(this.internalEdges[this.internalEdges.length-1]);
			displayMaps();
			//updateData(p);
			}
		};
	};

	//called for grid building
		this.autoAddNode = function(mx,my){
			append(this.internalNodes, new Node(mx,my));
			var nodeShort = findClosestNNodes(mx,my, nNodes, this.internalNodes);
			for(var i = 0; i < nodeShort.length; i++){
				append(this.internalEdges, new Edge(nodeShort[i], this.internalNodes.length - 1, nodeDistXY(this.internalNodes[nodeShort[i]], mx,my)));
				//makeInput(this.internalEdges[this.internalEdges.length-1], this.internalNodes, this.internalEdges.length-1, this.offSetX, this.offSetY, this.name);
			}
			displayMaps();
	    //updateData(p);
	};

	this.reset = function(){
		dragOffX = 0;
		dragOffY = 0;
		//resetMatrix();
		this.internalNodes = [];
		this.internalEdges = [];
		this.trias = [0];

		//Following routine same as initialization--could be condensed to single function
		//start with 4 nodes at corners
		append(this.internalNodes, new Node(0,0));
		append(this.internalNodes, new Node(this.img.width,0));
		append(this.internalNodes, new Node(this.img.width, this.img.height));
		append(this.internalNodes, new Node(0,this.img.height));

		//and 4 edges that connect them
		append(this.internalEdges, new Edge(0,1,nodeDist(this.internalNodes[0],this.internalNodes[1])));
		append(this.internalEdges, new Edge(1,2,nodeDist(this.internalNodes[1],this.internalNodes[2])));
		append(this.internalEdges, new Edge(2,3,nodeDist(this.internalNodes[2],this.internalNodes[3])));
		append(this.internalEdges, new Edge(3,0,nodeDist(this.internalNodes[3],this.internalNodes[0])));

		for(var j = 0; j < this.internalEdges.length; j++){
			makeInput(this.internalEdges[j], this.internalNodes, j, this.offSetX, this.offSetY,this.name + " defaultIn");
		}
		this.gridMode = false;
		this.clickCount = 0;
		this.reCalculate();
	};

	this.grid = function(){
		this.internalNodes = [];
		this.internalEdges = [];

		var nodeCount = 0;
		var e = document.getElementById("yval");
		var n = e.options[e.selectedIndex].value;
		var f = document.getElementById("xval");
		var m = f.options[f.selectedIndex].value;
		for(var i = 0; i <= m; i++){ //height
			for(var j = 0; j <=n; j++){ //width
				append(this.internalNodes, new Node(j*img.width/n,i*img.height/m));
				//console.log('j' + j + 'i' + i);
				if(j > 0 ){ //draw horizontal lines to previous node	&& i > 0 && i < gridH
					append(this.internalEdges,new Edge(nodeCount-1,nodeCount,
						nodeDist(this.internalNodes[nodeCount-1],this.internalNodes[nodeCount])));
				}

				if(i > 0 ){ //draw vertical lines on outline && (j == 0 || j == gridW)  && j> 0 && j < gridW
					// :-/
					if(typeof this.internalNodes[nodeCount-(n+1)] !== "undefined" && typeof this.internalNodes[nodeCount] !== "undefined" ){
						append(this.internalEdges,new Edge(nodeCount-(n+1),nodeCount,
							nodeDist(this.internalNodes[nodeCount-(n+1)],this.internalNodes[nodeCount])));
					}

				}
				//console.log(this.internalNodes.length + ' ' + nodeCount);
				nodeCount++;
			}
		}

		//add nodes in center of grid squares
		for(var i = 0; i < m; i++){
			for(var j = 0; j < n; j++){
				this.autoAddNode((j*img.width/n)+(img.width/n*0.5), (i*img.height/m)+(0.5*img.height/m));
				if(j > 0 ){
					//horizontals
					append(this.internalEdges,new Edge(nodeCount-1,nodeCount,
						nodeDist(this.internalNodes[nodeCount-1],this.internalNodes[nodeCount])));
					//console.log(nodeCount);
					//console.log(nodeDist(this.internalNodes[nodeCount-1],this.internalNodes[nodeCount],p));
					//verticals
				}
				if(i > 0){
					// :-/
					if(typeof this.internalNodes[nodeCount-(n+1)] !== "undefined" && typeof this.internalNodes[nodeCount] !== "undefined" ){
						append(this.internalEdges,new Edge(nodeCount-(n),nodeCount,
							nodeDist(this.internalNodes[nodeCount-(n)],this.internalNodes[nodeCount])));
					}
				}

				nodeCount++;

			}
		}
		/*
		//define distances of outside of image
		append(this.internalEdges,new Edge(0,gridW,img.width));
		append(this.internalEdges, new Edge(gridW, (gridW+1)*(gridH+1)-1,img.height));
		append(this.internalEdges, new Edge((gridW+1)*(gridH+1)-1, (gridW+1)*(gridH+1)-1-gridW,img.width));
		append(this.internalEdges, new Edge((gridW+1)*(gridH+1)-1-gridW,0,img.height));

		//define diagonal distances across entire image
		append(this.internalEdges, new Edge(0,(gridW+1)*(gridH+1)-1,dist(0,0,this.img.width,this.img.height)));
		append(this.internalEdges, new Edge(gridW, (gridW+1)*(gridH+1)-1-gridW, dist(0,0,this.img.width, this.img.height)));
		*/
		nodeCount = 0;
		this.gridMode = true;
		//this.reCalculate();
	};

	this.grid2 = function(){

		this.internalNodes = [];
		this.internalEdges = [];

		var nodeCount = 0;
		var e = document.getElementById("yval");
		var n = e.options[e.selectedIndex].value;
		var f = document.getElementById("xval");
		var m = f.options[f.selectedIndex].value;
		//console.log(n + ' ' + m);

		for(var i = 0; i <= m; i++){ //height
			for(var j = 0; j <=n; j++){ //width
				append(this.internalNodes, new Node(j*img.width/n,i*img.height/m));
				//console.log('j' + j + 'i' + i);
				if(j > 0){ //draw horizontal lines to previous node	&& i > 0 && i < gridH
					append(this.internalEdges,new Edge(nodeCount-1,nodeCount,
						nodeDist(this.internalNodes[nodeCount-1],this.internalNodes[nodeCount])));
				}
				if(i > 0 ){
					//console.log('n:' + n);
					var cc = nodeCount-n-1;
					//console.log(cc + " " + nodeCount);
					if(typeof this.internalNodes[cc] !== "undefined" && typeof this.internalNodes[nodeCount] !== "undefined" ){
						append(this.internalEdges,new Edge(cc,nodeCount,
							nodeDist(this.internalNodes[cc],this.internalNodes[nodeCount])));
					}

				}
				nodeCount++;
			}
		}
		nodeCount = 0;
		this.gridMode = true;
		//this.reCalculate();
	};

	//add two test nodes, connect with edge and custom distance
	this.addTestNodes = function(){
		this.autoAddNode(100,100);
		this.autoAddNode(350,100);
		append(this.internalEdges, new Edge(this.internalNodes.length-2,this.internalNodes.length-1,250)); //connect two above nodes
		makeInput(this.internalEdges[this.internalEdges.length-1], this.internalNodes, this.internalEdges.length-1, this.offSetX, this.offSetY, this.name);

		//console.log(this.internalEdges[this.internalEdges.length-1]);
	};

	//add two test nodes, connect with edge and custom distance
	this.addTestNodes2 = function(){
		this.autoAddNode(100,100);
		this.autoAddNode(100,350);
		append(this.internalEdges, new Edge(this.internalNodes.length-2,this.internalNodes.length-1,250)); //connect two above nodes
		makeInput(this.internalEdges[this.internalEdges.length-1], this.internalNodes, this.internalEdges.length-1, this.offSetX, this.offSetY, this.name);
	};
}

//node class
function Node(xpos, ypos){
	this.xpos = xpos;
	this.ypos = ypos;
	this.nodeHL = false;

	this.display = function(){
		ellipse(this.xpos, this.ypos);
	};
}

//edge class, takes node pairs by order in array
function Edge(node1, node2, distance){
	this.node1 = node1;
	this.node2 = node2;
	this.distance = distance;
	this.distanceMod = distance;
}

//connect to n nearest nodes
function findClosestNNodes(mx, my, n, nodes){
	var closest = [];
	var nodeIDs = [];
	for(var i = 0; i < nodes.length; i++){
		var distN = dist(nodes[i].xpos, nodes[i].ypos, mx, my);
		if(distN != 0){ //to avoid comparing to self
			append(closest, {distance:distN, id:i});
		}
	}
	//sort by distances, lowest to highest
	closest.sort(function(a, b) {return parseFloat(a.distance) - parseFloat(b.distance);});

	//return nodeIDS for the n closest nodes
	for(var i = 0; i < n; i++){
		append(nodeIDs, closest[i].id);
	}
	//console.log(nodeIDs);
	return nodeIDs;
}

//returns distance btw two nodes
function nodeDist(nn1,nn2){
	return dist(nn1.xpos,nn1.ypos,nn2.xpos,nn2.ypos);
}

//make dist input box
function makeInput(edge, nodes, n, xOff, yOff, nm){
	input = createInput();
	var x1 = nodes[edge.node1].xpos+xOff+dragOffX;
	var x2 = nodes[edge.node2].xpos+xOff+dragOffX;
	var y1 = nodes[edge.node1].ypos+yOff+dragOffY;
	var y2 = nodes[edge.node2].ypos+yOff+dragOffY;

	//console.log(edge.node1);
	  var posX = x1+(x2-x1)/2;
		var posY = y1+(y2-y1)/2;
    input.position(posX, posY);
		if(int(edge.distance) != int(edge.distanceMod)){
    	input.value(int(edge.distanceMod)+'/'+int(edge.distance));
		} else {
			input.value(int(edge.distance));
		}
    input.id(nm + "_" + n); //adds id that refers to edge
    input.class(nm + " mapIn" ); //uses image name for class for deletion later
    input.attribute("onkeydown", "keypress(event, " + "'" + nm + "_" + n + "')");
		input.attribute("data-xpos", posX-dragOffX);
		input.attribute("data-ypos", posY-dragOffY);

}

//returns distance btw node and x,y
function nodeDistXY(nn1,mx,my){
	return dist(nn1.xpos,nn1.ypos,mx,my);
}

function jitterEdgeMatrix(matrix,jitterEdgeMultiplierMagnitude){
	// this code randomly perturbs edge distances
	// such that 'nearby' similarly-good MDS results might be found
	// e.g. symmetric mirrors.
	var jitterEdgeMatrixMultipliers = numeric.add(
		1,
		numeric.add(
			-1 * jitterEdgeMultiplierMagnitude,
			numeric.mul(
				jitterEdgeMultiplierMagnitude,
				numeric.random([matrix.length,matrix[0].length])
			)
		)
	);
	for(var y = 0; y < matrix.length; y++) {
		for(var x = 0; x < matrix[0].length; x++) {
				// do elementwise multiplication -- could be sped up.
				matrix[x][y] = matrix[x][y] * jitterEdgeMatrixMultipliers[x][y];
			};
		};
	return matrix;
}

function floatingPointClose(num1,num2,myTolerance) {
	return(abs(num1-num2) < myTolerance);
}

function jitterVertexPositionArray(vertices,jitterVertexAbsoluteMagnitude) {
	// this code randomly perturbs vertex node positions (for the Delaunay)
	// such that 'nearby' similarly-good MDS results might be found
	// e.g. symmetric mirrors.

	// Find min and max positions for x and y.
	// The principle is that no jitters occur along the edges of the maps.
	// The reason for this is that they otherwise can create very elongated delaunay triangles,
	//  which creates associated distortions in the rendering.
	var xPosArray = vertices.map(p => p[0]);
	var yPosArray = vertices.map(p => p[1]);
	var xMax = Math.max(...xPosArray);
	var yMax = Math.max(...yPosArray);
	var xMin = Math.min(...xPosArray);
	var yMin = Math.min(...yPosArray);

	for(var v = 0; v < vertices.length; v++) {
		if (
			!floatingPointClose(xMin,vertices[v][0],jitterVertexAbsoluteMagnitude) &&
			!floatingPointClose(xMax,vertices[v][0],jitterVertexAbsoluteMagnitude)
		) {
			vertices[v][0] = vertices[v][0] + 2 * (Math.random()-1) * jitterVertexAbsoluteMagnitude;
		};
		if (
			!floatingPointClose(yMin,vertices[v][1],jitterVertexAbsoluteMagnitude) &&
			!floatingPointClose(yMax,vertices[v][1],jitterVertexAbsoluteMagnitude)
		) {
		vertices[v][1] = vertices[v][1] + 2 * (Math.random()-1) * jitterVertexAbsoluteMagnitude;
	  };
  };
	return vertices;
}

//build empty matrix, run through Floyd Warshall and MDS
function makeMatrix(focus){
	//console.log(maps[mapFocus].internalNodes);
	var nodes = maps[focus].internalNodes;
	var edges = maps[focus].internalEdges;
	var triangles = maps[focus].trias;
	var matrix = [];
	var vertices = new Array(nodes.length);

	//from http://stackoverflow.com/questions/6495187/best-way-to-generate-empty-2d-array
	var matrix = (function(matrix){ while(matrix.push([]) < nodes.length); return matrix})([]);

	//populate empty matrix from edge info
	for(var i = 0; i < edges.length; i++){
		var x = edges[i].node1;
		var y = edges[i].node2;
		var dis = parseFloat(edges[i].distanceMod);
		//console.log(x + ' ' + y + ' ' + dis);
		//distances are equal in both directions
		//populates both spots n matrix by switching x/y
		matrix[x][y] = dis;
		matrix[y][x] = dis;
	}

	for(var y = 0; y < nodes.length; y++){
		//cycle through all values replacing 'undefined' with 'Infinity'
		//KLUDGE
		for(var x = 0; x < nodes.length; x++){
			if(matrix[x][y] === undefined){
				matrix[x][y] = 'Infinity';
			}
		}
		//populate vertices array for Delaunay
		vertices[y] = [nodes[y].xpos, nodes[y].ypos];
	}

	matrix = jitterEdgeMatrix(matrix,jitterEdgeMultiplierMagnitude);
	vertices = jitterVertexPositionArray(vertices,jitterVertexAbsoluteMagnitude);

	//console.log(matrix);

	//calculate Infinity entries with Floyd Warshall algo
	var shortestDists = floydWarshall(matrix);

	//uncomment to print floyd warshall matrix to console
	/*
	for(var i = 0; i < shortestDists.length; i++){
		var entries = [];
		for(var j = 0; j<shortestDists[i].length;j++){
			entries.push(shortestDists[i][j]);
		}
		console.log(entries);
	}
	*/

	//calculate MDS
	var mdsArray = mdsCoords(shortestDists,dim);
	//console.log(mdsArray);
    //delaunay triangulation from https://github.com/mapbox/delaunator
    var delaunay = new Delaunator(vertices);
    return [mdsArray, delaunay.triangles];
	//plotTriangles(mdsArray,triangles);
}

function combineMatrix(focus1, focus2){
	var nodes1 = maps[focus1].internalNodes;
	var nodes2 = maps[focus2].internalNodes;
	var edges1 = maps[focus1].internalEdges;
	var edges2 = maps[focus2].internalEdges;
	var matrix = [];

	//from http://stackoverflow.com/questions/6495187/best-way-to-generate-empty-2d-array
	var matrix = (function(matrix){ while(matrix.push([]) < (nodes1.length + nodes2.length)); return matrix})([]);


	//populate empty matrix from edge info
	for(var i = 0; i < edges1.length; i++){
		var x = edges1[i].node1;
		var y = edges1[i].node2;
		var dis = parseFloat(edges1[i].distanceMod);
		//console.log(x + ' ' + y + ' ' + dis);
		//distances are equal in both directions
		//populates both spots n matrix by switching x/y
		matrix[x][y] = dis;
		matrix[y][x] = dis;
	}

	//add second image matrix
	for(var i = 0; i < edges2.length; i++){
		var x = edges2[i].node1 + nodes1.length; //offset to avoid overlap w/first matrix
		var y = edges2[i].node2 + nodes1.length;
		var dis = parseFloat(edges2[i].distanceMod);
		//console.log(x + ' ' + y + ' ' + dis);
		//distances are equal in both directions
		//populates both spots n matrix by switching x/y
		matrix[x][y] = dis;
		matrix[y][x] = dis;
	}

	//binds all points in two maps to each other, if their grids are the same length
	if(bindTwo){
		if(nodes1.length == nodes2.length){
			for(var i = 0; i < nodes1.length; i++){
				var x = i;
				var y = i + nodes1.length; //offset to connect nodes across maps
				matrix[x][y] = bindDist;
				matrix[y][x] = bindDist;
			}
		} else {
			if(!editMode){
				alert("Error: maps must have same number of points to bind."
				+ " Map One: " + nodes1.length + " nodes " + " Map Two: " + nodes2.length+ " nodes ");
			}
			document.getElementById("bindCheck").checked=false;
			bindTwo = false;

		}
		//connection for testing (last two nodes on each connected
		for(var i = 0; i < connectLastNodes; i++){
			matrix[nodes1.length-1-i][nodes1.length+nodes2.length-1-i] = connectDist;
			matrix[nodes1.length+nodes2.length-1-i][nodes1.length-1-i] = connectDist;
		}
		// matrix[nodes1.length-1][nodes1.length+nodes2.length-1] = connectDist;
		// matrix[nodes1.length+nodes2.length-1][nodes1.length-1] = connectDist;
	} else {
		for(var i = 0; i < connectLastNodes; i++){
			matrix[nodes1.length-1-i][nodes1.length+nodes2.length-1-i] = connectDist;
			matrix[nodes1.length+nodes2.length-1-i][nodes1.length-1-i] = connectDist;
		}
		//connection for testing (last two nodes on each connected
		// matrix[nodes1.length-1][nodes1.length+nodes2.length-1] = connectDist;
		// matrix[nodes1.length+nodes2.length-1][nodes1.length-1] = connectDist;

		//matrix[nodes1.length-2][nodes1.length+nodes2.length-2] = connectDist;
		//matrix[nodes1.length+nodes2.length-2][nodes1.length-2] = connectDist;
	}

	for(var y = 0; y < nodes1.length+nodes2.length; y++){
		//cycle through all values replacing 'undefined' with 'Infinity'
		for(var x = 0; x < nodes1.length+nodes2.length; x++){
			if(matrix[x][y] === undefined){
				matrix[x][y] = 'Infinity';
			}
		}
	}

	//uncomment to print matrix
	/*
	for(var i = 0; i < matrix.length; i++){
		var entries = [];
		for(var j = 0; j<matrix[i].length;j++){
			entries.push(matrix[i][j]);
		}
		console.log(entries);
	}*/

	matrix = jitterEdgeMatrix(matrix,jitterEdgeMultiplierMagnitude);

	var shortestDists = floydWarshall(matrix);
	//uncomment to print floyd warshall matrix to console
	/*
	for(var i = 0; i < shortestDists.length; i++){
		var entries = [];
		for(var j = 0; j<shortestDists[i].length;j++){
			entries.push(shortestDists[i][j]);
		}
		console.log(entries);
	}*/

	var mdsArray = mdsCoords(shortestDists,dim);
	//console.log(mdsArray);

	//separate mdsArray to return to respective map objects
	var m1 = mdsArray.slice(0,nodes1.length);
	var m2 = mdsArray.slice(nodes1.length);

	//adds 1 pixel to z-axis to offset maps in 2D mode
	if(dim == 2){
		for(var i = 0; i < m2.length; i++){
			m2[i].push(1);
		}
	}

	//console.log(m1);
	//console.log(m2);

	maps[focus1].mdsMatrix = m1;
	maps[focus2].mdsMatrix = m2;
}

function resetThree(){
	//iterate through slices and remove all from scene
	for(var i = 0; i < slices.length; i++){
		scene.remove(slices[i]);
	}
	slices = [];
}

function plotTriangles(coords, trias, focus, outputObj){
	var triaTexture = new THREE.TextureLoader().load(mapImages[focus]);
	var material = new THREE.MeshPhongMaterial( { map: triaTexture, side: THREE.DoubleSide } );
	material.setValues({wireframe:wireframeOn});
	material.transparent = true;
	material.opacity = maps[focus].trans;
	//material.depthWrite = false;

	if(trias.length > 1){
		for(var i = 0; i < trias.length; i+=3){

			//pull out width/height of image to normalize to 1 scale of UV
			//for future versions, move outside this function
			var w = maps[focus].img.width;
			var h = maps[focus].img.height;

			var x1 = coords[trias[i]][0];
			var y1 = coords[trias[i]][1];
			var z1 = coords[trias[i]][2];
			var x2 = coords[trias[i+1]][0];
			var y2 = coords[trias[i+1]][1];
			var z2 = coords[trias[i+1]][2];
			var x3 = coords[trias[i+2]][0];
			var y3 = coords[trias[i+2]][1];
			var z3 = coords[trias[i+2]][2];

			//console.log("[" + i + "]" + "(" + x1 + "," + y1 + "," + z1 + ") " + "(" + x2 + "," + y2 + "," + z3 + ") " + "(" + x3 + "," + y3 + "," + z3 +")");

			var geo = new THREE.Geometry();
			geo.vertices.push(
				new THREE.Vector3( x1, y1, z1 ),
				new THREE.Vector3( x2, y2, z2 ),
				new THREE.Vector3( x3, y3, z3 )
			);

			var uvs = [];
			//subtract 1 on y-axis because flipped in p5.js --> three.js
			var uv1x = maps[focus].internalNodes[trias[i]].xpos/w;
			var uv1y = 1-maps[focus].internalNodes[trias[i]].ypos/h;
			var uv2x = maps[focus].internalNodes[trias[i+1]].xpos/w;
			var uv2y = 1-maps[focus].internalNodes[trias[i+1]].ypos/h;
			var uv3x = maps[focus].internalNodes[trias[i+2]].xpos/w;
			var uv3y = 1-maps[focus].internalNodes[trias[i+2]].ypos/h;

			var uvs = [];
			uvs.push(
				new THREE.Vector2(uv1x,uv1y),
				new THREE.Vector2(uv2x,uv2y),
				new THREE.Vector2(uv3x,uv3y)

			);

			geo.faces.push( new THREE.Face3( 0, 1, 2 ) );
			geo.faceVertexUvs[0].push([uvs[0],uvs[1],uvs[2]]);

			geo.computeFaceNormals();
			geo.computeVertexNormals();
			var triangle = new THREE.Mesh(geo, material);
			triangle.rotation.x = 0;
			triangle.rotation.z = 0;

			scene.add(triangle);
			slices.push(triangle);
			//console.log(x1 + ' ' + y1 + ' ' + z1);

		}

/*
		//move mesh away from origin
		if(vrModeOn){
			for(var i = 0; i < slices.length; i++){
				slices[i].position.x += 300;
			  slices[i].position.y += 300;
				slices[i].position.z += 300;
			}
			console.log('webVR on');
		}
		*/
	}

		//var material2 = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('images/texture.jpg'), side: THREE.DoubleSide } );
		//var cube = new THREE.CubeGeometry(300,300,300);
  		//var mesh = new THREE.Mesh(cube,material);
  		//scene.add(mesh);
  		//maps[focus].trias = trias;

}


function plotCoords(coords, es){
	//background(255,255,255);
	push();
  translate(0,0,2); //offset 2 pixels from triangulation graph
	for(var i = 0; i < es.length; i++){
		var x1 = coords[es[i].node1][0];
		var x2 = coords[es[i].node2][0];
		var y1 = coords[es[i].node1][1];
		var y2 = coords[es[i].node2][1];
		var z1 = coords[es[i].node1][2];
		var z2 = coords[es[i].node2][2];
		stroke(150,150,150);
		line(x1,y1,z1,x2,y2,z2);
		//console.log(x + ' ' + y);
		//ellipse(x1,y1,5,5);
		//ellipse(x2,y2,5,5);
		//line(x1,y1,x2,y2);
	}
	pop();
}

function displayMaps(){
	background('#fff');
	for (var i=0; i<maps.length; i++) {
    	maps[i].display();

    	//blur out non-focus maps
    	if(mapFocus != i){
    		maps[i].blur();
		}
  	}
  	//console.log('yes');
}

function displayGraphs(){
	for (var i=0; i<maps.length; i++) {
    	maps[i].displayGraph(maps[i].img.width+50, 0);
  	}
}

//keypress for input boxes
	function keypress(event, id){
		var key = event.keyCode;
		if (key == 13){ //trigger for enter key
			//console.log(id);
			var inputFocus = document.getElementById(id);
			var inVal = inputFocus.value;
			var idNum = id.split("_");
			//console.log(idNum[1]);
			maps[mapFocus].internalEdges[idNum[1]].distanceMod = inVal;
			//console.log(inVal);
			inputFocus.value = inVal + '/' + parseInt(maps[mapFocus].internalEdges[idNum[1]].distance);
			recalcMaps();
			}
}

window.ondblclick=function(){
	reCalc();
	recalcMaps();
}

//add data to end of page
function updateData(){
	var div = document.getElementById('dataResults');
	div.innerHTML = ''; //clear data results
	for (var i=0; i<maps.length; i++) {
		div.innerHTML = div.innerHTML + '<b>IMAGE: </b><br /> id: ' + i + ', ' + maps[i].name + ', w: ' + maps[i].img.width + ', h: ' + maps[i].img.height + '<br />';
		div.innerHTML = div.innerHTML + '<b>NODES: </b><br />';
		for(var j=0; j < maps[i].internalNodes.length; j++){
			div.innerHTML = div.innerHTML + 'id: ' + j + ', x: ' + maps[i].internalNodes[j].xpos + ', y: ' + maps[i].internalNodes[j].ypos + '<br />';
		}
		div.innerHTML = div.innerHTML + '<b>EDGES: </b><br />';
		for(var j=0; j < maps[i].internalEdges.length; j++){
			div.innerHTML = div.innerHTML + 'id: ' + j + ' distance: ' + int(maps[i].internalEdges[j].distance) + ' distanceMod: ' + int(maps[i].internalEdges[j].distanceMod) + ' node1: ' + maps[i].internalEdges[j].node1 + ' node2: ' + maps[i].internalEdges[j].node2 +   '<br />';
		}
  	}
}

function reCalc(){
	if(mode == 0){
			maps[mapFocus].addNode(mouseX-dragOffX, mouseY-dragOffY);
			//console.log(mouseX + " " + mouseY);
		}
	wormCalc();
}

function wormCalc(){
	if(worm){
			maps[mapFocus].reCalculateW();
			combineMatrix(0,1);
			resetThree();
			plotTriangles(maps[0].mdsMatrix, maps[0].trias, 0, false);
			plotTriangles(maps[1].mdsMatrix, maps[1].trias, 1, false);
		}
}

function mode0(){
	mode = 0;
	console.log('mode = 0');
}

function mode1(){
	mode = 1;
	console.log('mode = 1');
}

function recalcMaps(){
	for(var i = 0; i < maps.length; i++){
		maps[i].reCalculate();
	}
	wormCalc();
}

function transOne(pp){
	maps[0].trans = tSlider1.value()/100;
	reCalc(pp);
}

function transTwo(pp){
	maps[1].trans = tSlider2.value()/100;
	reCalc(pp);
}

function outOBJ(){
    var exporter = new THREE.OBJExporter();
		//console.log(exporter.parse(scene));
		var blob = new Blob([exporter.parse(scene)], {type: "text/plain;charset=utf-8"});
		saveAs(blob, "mesh.obj");
}

//from http://www.benfrederickson.com/multidimensional-scaling/
function mdsCoords(distances, dimensions) {
	dimensions = dimensions || 2;

	// square distances
	var M = numeric.mul(-.5, numeric.pow(distances, 2));

	// double centre the rows/columns
	function mean(A) { return numeric.div(numeric.add.apply(null, A), A.length); }
	var rowMeans = mean(M),
		colMeans = mean(numeric.transpose(M)),
		totalMean = mean(rowMeans);

	for (var i = 0; i < M.length; ++i) {
		for (var j =0; j < M[0].length; ++j) {
			M[i][j] += totalMean - rowMeans[i] - colMeans[j];
		}
	}

	// take the SVD of the double centred matrix, and return the
	// points from it
	var ret = numeric.svd(M),
		eigenValues = numeric.sqrt(ret.S);
	return ret.U.map(function(row) {
		return numeric.mul(row, eigenValues).splice(0, dimensions);
	});
};

//from https://mgechev.github.io/javascript-algorithms/graphs_shortest-path_floyd-warshall.js.html
(function (exports) {
  'use strict';
  var floydWarshall = (function () {
    /**
     * Matrix used for the algorithm.
     */
    var dist;
    /**
     * Initialize the distance matrix.
     *
     * @private
     * @param {Array} graph Distance matrix of the array.
     * @return {Array} Distance matrix used for the algorithm.
     */

    function init(graph) {
      var dist = [];
      var size = graph.length;
      for (var i = 0; i < size; i += 1) {
        dist[i] = [];
        for (var j = 0; j < size; j += 1) {
          if (i === j) {
            dist[i][j] = 0;
          } else if (!isFinite(graph[i][j])) {
            dist[i][j] = Infinity;
          } else {
            dist[i][j] = graph[i][j];
          }
        }
      }
      return dist;
    }
    /**
     * Floyd-Warshall algorithm. Finds the shortest path between
     * each two vertices.<br><br>
     * Complexity: O(|V|^3) where V is the number of vertices.
     *
     * @public
     * @module graphs/shortest-path/floyd-warshall
     * @param {Array} graph A distance matrix of the graph.
     * @return {Array} Array which contains the shortest
     *    distance between each two vertices.
     *
     * @example
     * var floydWarshall =
     * require('path-to-algorithms/src/graphs/shortest-path/floyd-warshall').floydWarshall;
     * var distMatrix =
     *    [[Infinity, 7,        9,       Infinity,  Infinity, 16],
     *     [7,        Infinity, 10,       15,       Infinity, Infinity],
     *     [9,        10,       Infinity, 11,       Infinity, 2],
     *     [Infinity, 15,       11,       Infinity, 6,        Infinity],
     *     [Infinity, Infinity, Infinity, 6,        Infinity, 9],
     *     [16,       Infinity, 2,        Infinity, 9,        Infinity]];
     *
     * // [ [ 0, 7, 9, 20, 20, 11 ],
     * //   [ 7, 0, 10, 15, 21, 12 ],
     * //   [ 9, 10, 0, 11, 11, 2 ],
     * //   [ 20, 15, 11, 0, 6, 13 ],
     * //   [ 20, 21, 11, 6, 0, 9 ],
     * //   [ 11, 12, 2, 13, 9, 0 ] ]
     * var shortestDists = floydWarshall(distMatrix);
     */
    return function (graph) {
      dist = init(graph);
      var size = graph.length;
      for (var k = 0; k < size; k += 1) {
        for (var i = 0; i < size; i += 1) {
          for (var j = 0; j < size; j += 1) {
            if (dist[i][j] > dist[i][k] + dist[k][j]) {
              dist[i][j] = dist[i][k] + dist[k][j];
            }
          }
        }
      }
      return dist;
    };
  }());
  exports.floydWarshall = floydWarshall;
})(typeof window === 'undefined' ? module.exports : window);

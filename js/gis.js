var maps = []; //array to store images
var mapFocus = 0; //number in array to focus
var buttonNodes;
var buttonDist;
var buttonMatrix;
var buttonWireframe;
var buttonRotate;
var buttonReset;
var buttonToggleImg;
var buttonDelaunay;
var buttonHideInputs;
var buttonGridMode;
var buttonGridMode2;
var buttonTestNodes;
var buttonTestNodes2;
var buttonMapFocus;
var buttonCombine;
var buttonOutOBJ;
//var buttonTrans;
var buttonDim;
var buttonBind;
var bindTwo = false;
var tSlider1, tSlider2;
var bSlider1, bSlider2;
var nNodeSelect;
var gridWSelect;
var gridHSelect;
//var gridW = 6;
//var gridH = 6;
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

//these generated dynamically to fit screen
var canvaswidth = 0;
var canvasheight = 0;

var dragDiffX = 0;
var dragDiffY = 0;
var dragOffX = 0;
var dragOffY = 0;
var dragging = false;

//BEGIN LEFT CANVAS
//instance mode of p5.js https://github.com/processing/p5.js/wiki/p5.js-overview#instantiation--namespace
var l = function(p){

	p.setup = function() {
	  // create canvas
		p.noLoop();
	  var c = p.createCanvas(canvaswidth, canvasheight);
	  //p.colorMode('HSB',360,100,100,100)
	  p.background(255,100,100,0);

/*
	  buttonDelaunay = p.createButton('TOGGLE TRIANGLES');
	  buttonDelaunay.parent(menuMaps);;
	  buttonDelaunay.mousePressed(p.delTog);
	  buttonDelaunay.style('background-color', '#C3E4F6');

	  var mF = p.createDiv('map#1').id('mFocus');
	  mF.parent(menuMaps);

	//MENU - GRIDS SECTION


		buttonGridMode2 = p.createButton('ADD GRID (SQUARE)');
	  buttonGridMode2.parent(menuGrids);
	  buttonGridMode2.mousePressed(p.gridMode2);
		buttonGridMode2.style("display","block");

		buttonInputs = p.createButton('ADD INPUT BOXES');
		buttonInputs.parent(menuGrids);
		buttonInputs.mousePressed(p.addAllInputs);
		buttonInputs.style("display","block");

		buttonHideInputs = p.createButton('DELETE INPUT BOXES');
	  buttonHideInputs.parent(menuGrids);
	  buttonHideInputs.mousePressed(p.hideIns);
		buttonInputs.style("display","block");

	  // buttonGridMode = p.createButton('ADD GRID (COMPLEX)');
	  // buttonGridMode.parent(menuGrids);
	  // buttonGridMode.mousePressed(p.gridMode);
		// buttonGridMode.style("display","block");

	//MENU - NODES SECTION
		var menuNodes = p.createDiv("");
		menuNodes.parent(mm);
		menuNodes.style("border-top","2px gray dashed");
		var titleMaps = p.createSpan("<h3>NODES</h3>");
		titleMaps.parent(menuNodes);

	  var nnDiv = p.createDiv('Double-click to add nodes, connect to:');
	  nnDiv.parent(menuNodes);
		nNodeSelect = p.createSelect();
	  nNodeSelect.parent(menuNodes);
	  nNodeSelect.option(4);
	  nNodeSelect.option(3);
	  nNodeSelect.option(2);
	  nNodeSelect.option(1);
	  nNodeSelect.option(0);
	  nNodeSelect.option(10);
	  nNodeSelect.option(9);
	  nNodeSelect.option(8);
	  nNodeSelect.option(7);
	  nNodeSelect.option(6);
	  nNodeSelect.option(5);
	  nNodeSelect.changed(nNodesChange);
	  var nnDiv2 = p.createDiv('nearest nodes');
	  nnDiv2.parent(menuNodes);


		var textCons = p.createSpan("<h3>INTER-MAP CONNECTIONS (FOR TWO MAP MODE) </h3>");
		textCons.parent(menuNodes);

		var consDiv = p.createDiv('Connect last');
	  consDiv.parent(menuNodes);
		cNodeSelect = p.createSelect();
	  cNodeSelect.parent(menuNodes);
	  cNodeSelect.option(1);
	  cNodeSelect.option(2);
	  cNodeSelect.option(3);
	  cNodeSelect.option(4);
	  cNodeSelect.option(5);
	  cNodeSelect.option(6);
	  cNodeSelect.changed(cNodesChange);
		var ccDiv2 = p.createDiv('nodes of each map');
	  ccDiv2.parent(menuNodes);

	//3D MAP CONTROLS
	  buttonDim = p.createButton('2D');
	  buttonDim.mousePressed(p.dimensionChangeTog);
	  buttonDim.style('background-color', '#FFF');
		buttonDim.parent(mm);

	  buttonWireframe = p.createButton('wireframe');
	  buttonWireframe.mousePressed(p.wireFrameModeTog);
	  buttonWireframe.style('background-color', '#FFF');
		buttonWireframe.parent(mm);

	  buttonCombine = p.createButton('two map mode');
	  buttonCombine.mousePressed(p.wormModeTog);
	  buttonCombine.style('background-color', '#FFF');
		buttonCombine.parent(mm);

	  buttonBind = p.createButton('bind two maps together');
	  buttonBind.mousePressed(p.bindMapsTog);
	  buttonBind.style('background-color', '#FFF');
		buttonBind.parent(mm);

	  var bDiv = p.createDiv('Change lattice-to-lattice distance (0-300):');
		bDiv.parent(mm);

	  bSlider1 = p.createSlider(0,300,180);
	  bSlider1.style('width', '150px');
	  bSlider1.changed(p.bind1);
		bSlider1.parent(mm);

	  var b2Div = p.createDiv('Change inter-map connection distance (0-300):');
		b2Div.parent(mm);

	  bSlider2 = p.createSlider(0,300,50);
	  bSlider2.style('width', '150px');
	  bSlider2.changed(p.bind2);
		bSlider2.parent(mm);

	  buttonRotate = p.createButton('auto-rotate');
	  buttonRotate.mousePressed(rotateMode);
	  buttonRotate.style('background-color', '#FFF');
		buttonRotate.parent(mm);

	  var opDiv = p.createDiv('Change map opacity:');
		opDiv.parent(mm);

	  tSlider1 = p.createSlider(0,200,100);
	  tSlider1.style('width', '150px');
		tSlider1.parent(mm);
	  tSlider1.changed(p.trans1);
	  tSlider2 = p.createSlider(0,100,100);
		tSlider2.parent(mm);
	  tSlider2.style('width', '150px');
	  tSlider2.changed(p.trans2);

	  /*buttonTestNodes = p.createButton('test nodes (100,100), (350,100)');
	  buttonTestNodes.position(1020,200);
	  buttonTestNodes.mousePressed(p.testNodes);

	  buttonTestNodes = p.createButton('test nodes (100,100), (100,350)');
	  buttonTestNodes.position(1020,220);
	  buttonTestNodes.mousePressed(p.testNodes2);*/

	  /*buttonDist = p.createButton('edit distances');
	  buttonDist.position(canvaswidth+120,5);
	  buttonDist.mousePressed(mode1);
	  */

	  /*buttonTrans = p.createButton('transparency on/off');
	  buttonTrans.position(1150,200);
	  buttonTrans.mousePressed(transToggle);*/

	  p.fill(0,0,0,100);
	  p.noStroke();
	  p.textSize(24);
	  p.textAlign('CENTER');
	  p.text('Drag and drop a map', p.width/4, p.height/2);
		// Add an event for when a file is dropped onto the canvas
	  c.drop(p.gotFile);
	  //p.createDiv('data: ').id('dataResults');
	};

	p.draw = function() {};

	p.gotFile = function(file) {
	  //console.log(file);
	  if (file.type === 'image') {
			// Create an image DOM element and add to maps array
			p.loadImage(file.data,p.addMap);//callback to addMap once image loaded
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

	p.addMap = function(imgLoaded){
		var offX = 30
		if(maps.length > 0){
			offX = maps[mapFocus].img.width + 50;
		}
		p.append(maps,new Map('map'+maps.length,1,imgLoaded,p, offX, maps.length));
		mapFocus = maps.length - 1; //change focus to last uploaded map
		maps[mapFocus].makeNew(p);
		maps[mapFocus].reCalculate();
		//var div = document.getElementById('mFocus');
		//div.innerHTML = 'map#' + (mapFocus + 1);
	}

	p.deleteIns = function(){
		var allInputs = document.getElementsByClassName(maps[mapFocus].name);
		//console.log(allInputs);
		for(var i = allInputs.length-1; i >= 0; i--){
			allInputs[i].remove();
		}
	}

	p.hideIns = function(){
		var allInputs = document.getElementsByClassName("mapIn");
		for(var i = 0; i < allInputs.length; i++){
			allInputs[i].style.visibility = "hidden";
		}
	}

	p.moveIns = function(){
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

	p.showDefaultIns = function(){
		var allInputs = document.getElementsByClassName("mapIn");
		for(var i = 0; i < allInputs.length; i++){
			allInputs[i].style.visibility = "hidden";
		}
		var allInputs = document.getElementsByClassName("defaultIn");
		for(var i = 0; i < allInputs.length; i++){
			allInputs[i].style.visibility = "visible";
		}
	}

	p.gridMode = function(){
		p.resetMap();
		//find and delete all input DOM elements with class name of map's image
		var allInputs = document.getElementsByClassName(maps[mapFocus].name);
		//console.log(allInputs);
		for(var i = allInputs.length-1; i >= 0; i--){
			allInputs[i].remove();
		}
		maps[mapFocus].grid(p);
		gridMode = true;
		maps[mapFocus].reCalculate(p);
	}

	p.gridMode2 = function(){
		resetMaps();
		//find and delete all input DOM elements with class name of map's image
		var allInputs = document.getElementsByClassName(maps[mapFocus].name);
		//console.log(allInputs);
		for(var i = allInputs.length-1; i >= 0; i--){
			allInputs[i].remove();
		}
		//maps[mapFocus].reset(p);
		maps[mapFocus].grid2(p);
		gridMode = true;
		maps[mapFocus].reCalculate(p);
	}

	p.testNodes = function(){
		maps[mapFocus].addTestNodes(p);
	}

	p.testNodes2 = function(){
		maps[mapFocus].addTestNodes2(p);
	}

	p.mouseReleased = function(){
			if(dragging){
				p.moveIns();
				p.showDefaultIns();
				dragging = false;
			} else {
				maps[mapFocus].selectNode(p.mouseX,p.mouseY,p);
			}
	};

	p.mousePressed = function(){
		if(editMode){
			dragDiffX = p.mouseX - dragOffX;
			dragDiffY = p.mouseY - dragOffY;
		}
	}

	p.mouseDragged = function(){
		dragging = true;
		p.hideIns();
		if(editMode){
			dragOffX = p.mouseX - dragDiffX;
			dragOffY = p.mouseY - dragDiffY;
			displayMaps(p);
		}
	}

	//FUNCTION FOR ZOOMING IN ON MAPS IN EDIT MODE
	// p.mouseWheel = function(event){
	// 	if(!scrollLock){
	// 		maps[mapFocus].mapZoom(event.delta,p);
	// 	}
	// 	return false;
	// }

	p.trans1 = function(){
		transOne(p);
	}

	p.trans2 = function(){
		transTwo(p);
	}

	p.bind1 = function(){
		bindDist = bSlider1.value();
		reCalc(p);
	}

	p.bind2 = function(){
		connectDist = bSlider2.value();
		reCalc(p);
	}

	p.keyPressed = function(){

	}

	p.wormModeTog = function(){
		wormMode();
		maps[mapFocus].reCalculate();
		wormCalc(p);
	}

	p.dimensionChangeTog = function(){
		dimensionChange();
		maps[mapFocus].reCalculate();
		wormCalc(p);
	}

	p.wireFrameModeTog = function(){
		wireFrameMode();
		maps[mapFocus].reCalculate();
		wormCalc(p);
	}

	p.bindMapsTog = function(){
		bindMaps();
		maps[mapFocus].reCalculate();
		wormCalc(p);
	}

	p.addAllInputs = function(){
		maps[mapFocus].addInputs();
	}

};
//END LEFT CANVAS

//BEGIN RIGHT CANVAS, THREE.JS
	var renderer, scene, camera;
	var wireframeOn = false;

	//var material = new THREE.MeshLambertMaterial( { color: 0x0000FF, transparent: true, opacity: 0.8, side: THREE.DoubleSide, wireframe:wireframeOn } );
    var slices = [];


	window.onload = function() {
		canvaswidth = document.getElementById('leftCanv').clientWidth;
		canvasheight = document.getElementById('leftCanv').clientHeight;
		initThree();
		animateThree();
	};

	function initThree() {
		renderer = new THREE.WebGLRenderer({ alpha: true });
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

			renderer.setClearColor(0xdffffff, 1);

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

				renderer.render(scene, camera);


			};
			render();

	};
//END RIGHT CANVAS

//map class, contains main data structure
function Map(name, opac, img, p, xoff, id){
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


  this.makeNew = function(p){
		//start with 4 nodes at corners
		p.append(this.internalNodes, new Node(0,0));
		p.append(this.internalNodes, new Node(this.img.width,0));
		p.append(this.internalNodes, new Node(this.img.width, this.img.height));
		p.append(this.internalNodes, new Node(0,this.img.height));


		//and 4 edges that connect them
		p.append(this.internalEdges, new Edge(0,1,nodeDist(this.internalNodes[0],this.internalNodes[1],p)));
		p.append(this.internalEdges, new Edge(1,2,nodeDist(this.internalNodes[1],this.internalNodes[2],p)));
		p.append(this.internalEdges, new Edge(2,3,nodeDist(this.internalNodes[2],this.internalNodes[3],p)));
		p.append(this.internalEdges, new Edge(3,0,nodeDist(this.internalNodes[3],this.internalNodes[0],p)));

		for(var j = 0; j < this.internalEdges.length; j++){
			makeInput(this.internalEdges[j], this.internalNodes, j, this.offSetX, this.offSetY,p, this.name + " defaultIn");
		}

		p.strokeWeight(3);
		p.stroke(0,0,0,100);
		this.display(p);
	}

	this.display = function(p){
		//p.scale(this.zoomScroll);
		p.push();
		p.translate(this.offSetX + dragOffX,this.offSetY + dragOffY);
		if(imageOn){
			p.image(this.img,0,0,this.img.width,this.img.height);
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
					p.stroke(255,0,0,50);
					p.strokeWeight(8);
					p.line(x1,y1,x2,y2);
					p.line(x2,y2,x3,y3);
					p.line(x3,y3,x1,y1);
				}
			}
		}
		//display nodes
		p.stroke(0,0,0,150);
		p.strokeWeight(1);
    	for(var i=0; i < this.internalNodes.length; i++){
    		// if(this.internalNodes.length-1 == i){
    		// 	p.stroke(255);
    		// 	p.strokeWeight(3);
    		// }
				//if node is selected, turn on highlight color
				if(this.internalNodes[i].nodeHL == true){
					p.fill(255,0,0,100);
				} else {
					p.fill(0,0,0,100);
				}
    		p.ellipse(this.internalNodes[i].xpos,this.internalNodes[i].ypos, 10, 10);
    		//p.text(i,this.internalNodes[i].xpos,this.internalNodes[i].ypos);
    	}
    	//display edges
    	p.strokeWeight(2);
   		p.stroke(0,0,0, 150);
    	for(var i=0; i < this.internalEdges.length; i++){
    		var x1 = this.internalNodes[this.internalEdges[i].node1].xpos;
    		var x2 = this.internalNodes[this.internalEdges[i].node2].xpos;
    		var y1 = this.internalNodes[this.internalEdges[i].node1].ypos;
    		var y2 = this.internalNodes[this.internalEdges[i].node2].ypos;
    		p.line(x1,y1,x2,y2);
    	}
    	p.pop();
	};

	this.blur = function(p){
		p.noStroke();
		p.fill(255,150);
		p.rect(0+this.offSetX+dragOffX,0+this.offSetY+dragOffY,this.img.width+this.offSetX,this.img.height+this.offSetY);
	};

	this.returnImg = function(p){
		return this.img;
	};

	this.reCalculate = function(){
		//updateData(p);
		resetThree();
		var matrices = makeMatrix(p, this.id);
		this.mdsMatrix = matrices[0];
		this.trias = matrices[1];
		plotTriangles(this.mdsMatrix, this.trias, this.id, false);
		displayMaps(p);
		//console.log("recalculate");
	};

	this.reCalculateW = function(){
		var matrices = makeMatrix(p, this.id);
		this.trias = matrices[1];
		displayMaps(p);
	};

	this.mapZoom = function(scrollVal,p){
		this.zoomScroll += scrollVal/30;
		displayMaps(p);
	}

	this.addInputs = function(){
		p.deleteIns();
		for(var i = 0; i < this.internalEdges.length; i++){
			makeInput(this.internalEdges[i], this.internalNodes, i, this.offSetX, this.offSetY,p, this.name);
		}
	}

	this.selectNode = function(mx,my,p){
		mx = mx-this.offSetX-dragOffX;
		my = my-this.offSetY-dragOffY;
		for(var i = 0; i < this.internalNodes.length; i++){
			if(p.dist(mx,my,this.internalNodes[i].xpos,this.internalNodes[i].ypos) < 10){
				if(this.selectNo == 0){
			    this.unHighlightNodes();
					this.selectedOne = i;
					this.selectNo = 1;
				} else if(this.selectNo == 1){
					this.selectedTwo = i;
					this.selectNo = 0;
					this.checkForEdge(this.selectedOne,this.selectedTwo,p);
				}
				this.internalNodes[i].nodeHL = true;
			}
		}
		this.display(p);
	}

	this.unHighlightNodes = function(){
		for(var i = 0; i < this.internalNodes.length; i++){
			this.internalNodes[i].nodeHL = false;
		}
	}
		this.checkForEdge = function(one,two,p){
			var foundEdge = false;
			for(var i = 0; i < this.internalEdges.length; i++){
				if(this.internalEdges[i].node1 == one && this.internalEdges[i].node2 == two){
					foundEdge = true;
					makeInput(this.internalEdges[i], this.internalNodes, i, this.offSetX, this.offSetY,p, this.name);
				} else if(this.internalEdges[i].node1 == two && this.internalEdges[i].node2 == one){
					makeInput(this.internalEdges[i], this.internalNodes, i, this.offSetX, this.offSetY,p, this.name);
					foundEdge = true;
				}
			}
			if(!foundEdge){
				alert('no edge');
			}
		}

	//called when mouseReleased
		this.addNode = function(mx,my,p){
		if(mx >this.offSetX && mx < this.img.width+this.offSetX && my > 0 && my <  this.img.height+this.offSetY){ //check if on map
			if(this.gridMode){
				if(this.clickCount % 2 == 0){//evens are first clicks
					this.autoAddNode(mx-this.offSetX,my-this.offSetY,p);
				} else {//odds complete edge
					this.autoAddNode(mx-this.offSetX,my-this.offSetY,p);
					var d = nodeDist(this.internalNodes[this.internalNodes.length-2], this.internalNodes[this.internalNodes.length-1],p);
					p.append(this.internalEdges, new Edge(this.internalNodes.length-2,this.internalNodes.length-1,d)); //connect two above nodes
					makeInput(this.internalEdges[this.internalEdges.length-1], this.internalNodes, this.internalEdges.length-1, this.offSetX, this.offSetY,p, this.name + " defaultIn");
				}
				this.clickCount++;
			} else {
					p.append(this.internalNodes, new Node(mx-this.offSetX,my-this.offSetY));

					//third argument = n nearest nodes to connect to
					var nodeShort = findClosestNNodes(mx-this.offSetX,my-this.offSetY, nNodes, this.internalNodes,p);
					//console.log(nodeShort);
					for(var i = 0; i < nodeShort.length; i++){
						//subtract offsets from mx, my because nodes start from (0,0), then translated
						p.append(this.internalEdges, new Edge(nodeShort[i], this.internalNodes.length - 1, nodeDistXY(this.internalNodes[nodeShort[i]], mx-this.offSetX,my-this.offSetY,p)));
						makeInput(this.internalEdges[this.internalEdges.length-1], this.internalNodes, this.internalEdges.length-1, this.offSetX, this.offSetY,p, this.name + " defaultIn");
					}
					//console.log(this.internalEdges[this.internalEdges.length-1]);
			displayMaps(p);
			//updateData(p);
			}
		};
	};

	//called for grid building
		this.autoAddNode = function(mx,my,p){
			p.append(this.internalNodes, new Node(mx,my));
			var nodeShort = findClosestNNodes(mx,my, nNodes, this.internalNodes,p);
			for(var i = 0; i < nodeShort.length; i++){
				p.append(this.internalEdges, new Edge(nodeShort[i], this.internalNodes.length - 1, nodeDistXY(this.internalNodes[nodeShort[i]], mx,my,p)));
				//makeInput(this.internalEdges[this.internalEdges.length-1], this.internalNodes, this.internalEdges.length-1, this.offSetX, this.offSetY,p, this.name);
			}
			displayMaps(p);
	    //updateData(p);
	};

	this.reset = function(p){
		dragOffX = 0;
		dragOffY = 0;
		//p.resetMatrix();
		this.internalNodes = [];
		this.internalEdges = [];
		this.trias = [0];

		//Following routine same as initialization--could be condensed to single function
		//start with 4 nodes at corners
		p.append(this.internalNodes, new Node(0,0));
		p.append(this.internalNodes, new Node(this.img.width,0));
		p.append(this.internalNodes, new Node(this.img.width, this.img.height));
		p.append(this.internalNodes, new Node(0,this.img.height));

		//and 4 edges that connect them
		p.append(this.internalEdges, new Edge(0,1,nodeDist(this.internalNodes[0],this.internalNodes[1],p)));
		p.append(this.internalEdges, new Edge(1,2,nodeDist(this.internalNodes[1],this.internalNodes[2],p)));
		p.append(this.internalEdges, new Edge(2,3,nodeDist(this.internalNodes[2],this.internalNodes[3],p)));
		p.append(this.internalEdges, new Edge(3,0,nodeDist(this.internalNodes[3],this.internalNodes[0],p)));

		for(var j = 0; j < this.internalEdges.length; j++){
			makeInput(this.internalEdges[j], this.internalNodes, j, this.offSetX, this.offSetY,p,this.name + " defaultIn");
		}
		this.gridMode = false;
		this.clickCount = 0;
		this.reCalculate();
	};

	this.grid = function(p){
		this.internalNodes = [];
		this.internalEdges = [];

		var nodeCount = 0;
		var n = gridWSelect.value();
		var m = gridHSelect.value();
		for(var i = 0; i <= m; i++){ //height
			for(var j = 0; j <=n; j++){ //width
				p.append(this.internalNodes, new Node(j*img.width/n,i*img.height/m));
				//console.log('j' + j + 'i' + i);
				if(j > 0 ){ //draw horizontal lines to previous node	&& i > 0 && i < gridH
					p.append(this.internalEdges,new Edge(nodeCount-1,nodeCount,
						nodeDist(this.internalNodes[nodeCount-1],this.internalNodes[nodeCount],p)));
				}

				if(i > 0 ){ //draw vertical lines on outline && (j == 0 || j == gridW)  && j> 0 && j < gridW
					// :-/
					if(typeof this.internalNodes[nodeCount-(n+1)] !== "undefined" && typeof this.internalNodes[nodeCount] !== "undefined" ){
						p.append(this.internalEdges,new Edge(nodeCount-(n+1),nodeCount,
							nodeDist(this.internalNodes[nodeCount-(n+1)],this.internalNodes[nodeCount],p)));
					}
					//console.log(nodeCount);
					//console.log(nodeDist(this.internalNodes[nodeCount-(n+1)],this.internalNodes[nodeCount],p));

				}
				//console.log(this.internalNodes.length + ' ' + nodeCount);
				nodeCount++;
			}
		}

		//add nodes in center of grid squares
		for(var i = 0; i < m; i++){
			for(var j = 0; j < n; j++){
				this.autoAddNode((j*img.width/n)+(img.width/n*0.5), (i*img.height/m)+(0.5*img.height/m), p);
				if(j > 0 ){
					//horizontals
					p.append(this.internalEdges,new Edge(nodeCount-1,nodeCount,
						nodeDist(this.internalNodes[nodeCount-1],this.internalNodes[nodeCount],p)));
					//console.log(nodeCount);
					//console.log(nodeDist(this.internalNodes[nodeCount-1],this.internalNodes[nodeCount],p));
					//verticals
				}
				if(i > 0){
					// :-/
					if(typeof this.internalNodes[nodeCount-(n+1)] !== "undefined" && typeof this.internalNodes[nodeCount] !== "undefined" ){
						p.append(this.internalEdges,new Edge(nodeCount-(n),nodeCount,
							nodeDist(this.internalNodes[nodeCount-(n)],this.internalNodes[nodeCount],p)));
					}
				}

				nodeCount++;

			}
		}
		/*
		//define distances of outside of image
		p.append(this.internalEdges,new Edge(0,gridW,img.width));
		p.append(this.internalEdges, new Edge(gridW, (gridW+1)*(gridH+1)-1,img.height));
		p.append(this.internalEdges, new Edge((gridW+1)*(gridH+1)-1, (gridW+1)*(gridH+1)-1-gridW,img.width));
		p.append(this.internalEdges, new Edge((gridW+1)*(gridH+1)-1-gridW,0,img.height));

		//define diagonal distances across entire image
		p.append(this.internalEdges, new Edge(0,(gridW+1)*(gridH+1)-1,p.dist(0,0,this.img.width,this.img.height)));
		p.append(this.internalEdges, new Edge(gridW, (gridW+1)*(gridH+1)-1-gridW, p.dist(0,0,this.img.width, this.img.height)));
		*/
		nodeCount = 0;
		this.gridMode = true;
		this.addInputs();
		//this.reCalculate();
	};

	this.grid2 = function(p){

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
				p.append(this.internalNodes, new Node(j*img.width/n,i*img.height/m));
				//console.log('j' + j + 'i' + i);
				if(j > 0){ //draw horizontal lines to previous node	&& i > 0 && i < gridH
					p.append(this.internalEdges,new Edge(nodeCount-1,nodeCount,
						nodeDist(this.internalNodes[nodeCount-1],this.internalNodes[nodeCount],p)));
				}
				if(i > 0 ){
					//console.log('n:' + n);
					var cc = nodeCount-n-1;
					//console.log(cc + " " + nodeCount);
					if(typeof this.internalNodes[cc] !== "undefined" && typeof this.internalNodes[nodeCount] !== "undefined" ){
						p.append(this.internalEdges,new Edge(cc,nodeCount,
							nodeDist(this.internalNodes[cc],this.internalNodes[nodeCount],p)));
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
	this.addTestNodes = function(p){
		this.autoAddNode(100,100,p);
		this.autoAddNode(350,100,p);
		p.append(this.internalEdges, new Edge(this.internalNodes.length-2,this.internalNodes.length-1,250)); //connect two above nodes
		makeInput(this.internalEdges[this.internalEdges.length-1], this.internalNodes, this.internalEdges.length-1, this.offSetX, this.offSetY,p, this.name);

		//console.log(this.internalEdges[this.internalEdges.length-1]);
	};

	//add two test nodes, connect with edge and custom distance
	this.addTestNodes2 = function(p){
		this.autoAddNode(100,100,p);
		this.autoAddNode(100,350,p);
		p.append(this.internalEdges, new Edge(this.internalNodes.length-2,this.internalNodes.length-1,250)); //connect two above nodes
		makeInput(this.internalEdges[this.internalEdges.length-1], this.internalNodes, this.internalEdges.length-1, this.offSetX, this.offSetY,p, this.name);
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
function findClosestNNodes(mx, my, n, nodes,p){
	var closest = [];
	var nodeIDs = [];
	for(var i = 0; i < nodes.length; i++){
		var distN = p.dist(nodes[i].xpos, nodes[i].ypos, mx, my);
		if(distN != 0){ //to avoid comparing to self
			p.append(closest, {distance:distN, id:i});
		}
	}
	//sort by distances, lowest to highest
	closest.sort(function(a, b) {return parseFloat(a.distance) - parseFloat(b.distance);});

	//return nodeIDS for the n closest nodes
	for(var i = 0; i < n; i++){
		p.append(nodeIDs, closest[i].id);
	}
	//console.log(nodeIDs);
	return nodeIDs;
}

//returns distance btw two nodes
function nodeDist(nn1,nn2,p){
	return p.dist(nn1.xpos,nn1.ypos,nn2.xpos,nn2.ypos);
}

//make dist input box
function makeInput(edge, nodes, n, xOff, yOff,p, nm){
	input = p.createInput();
	var x1 = nodes[edge.node1].xpos+xOff+dragOffX;
	var x2 = nodes[edge.node2].xpos+xOff+dragOffX;
	var y1 = nodes[edge.node1].ypos+yOff+dragOffY;
	var y2 = nodes[edge.node2].ypos+yOff+dragOffY;

	//console.log(edge.node1);
	  var posX = x1+(x2-x1)/2;
		var posY = y1+(y2-y1)/2;
    input.position(posX, posY);
		if(p.int(edge.distance) != p.int(edge.distanceMod)){
    	input.value(p.int(edge.distanceMod)+'/'+p.int(edge.distance));
		} else {
			input.value(p.int(edge.distance));
		}
    input.id(nm + "_" + n); //adds id that refers to edge
    input.class(nm + " mapIn" ); //uses image name for class for deletion later
    input.attribute("onkeydown", "keypress(event, " + "'" + nm + "_" + n + "')");
		input.attribute("data-xpos", posX-dragOffX);
		input.attribute("data-ypos", posY-dragOffY);

}

//returns distance btw node and x,y
function nodeDistXY(nn1,mx,my,p){
	return p.dist(nn1.xpos,nn1.ypos,mx,my);
}

//build empty matrix, run through Floyd Warshall and MDS
function makeMatrix(p, focus){
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

function combineMatrix(p, focus1, focus2){
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
	var material = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture(mapImages[focus]), side: THREE.DoubleSide } );
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

			var x1 = coords[trias[i]][0]/zoom;
			var y1 = coords[trias[i]][1]/zoom;
			var z1 = coords[trias[i]][2]/zoom;
			var x2 = coords[trias[i+1]][0]/zoom;
			var y2 = coords[trias[i+1]][1]/zoom;
			var z2 = coords[trias[i+1]][2]/zoom;
			var x3 = coords[trias[i+2]][0]/zoom;
			var y3 = coords[trias[i+2]][1]/zoom;
			var z3 = coords[trias[i+2]][2]/zoom;

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
	}
		//var material2 = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('images/texture.jpg'), side: THREE.DoubleSide } );
		//var cube = new THREE.CubeGeometry(300,300,300);
  		//var mesh = new THREE.Mesh(cube,material);
  		//scene.add(mesh);
  		//maps[focus].trias = trias;

}


function plotCoords(coords, es,p){
	//p.background(255,255,255);
	p.push();
  p.translate(0,0,2); //offset 2 pixels from triangulation graph
	for(var i = 0; i < es.length; i++){
		var x1 = coords[es[i].node1][0]/zoom;
		var x2 = coords[es[i].node2][0]/zoom;
		var y1 = coords[es[i].node1][1]/zoom;
		var y2 = coords[es[i].node2][1]/zoom;
		var z1 = coords[es[i].node1][2]/zoom;
		var z2 = coords[es[i].node2][2]/zoom;
		p.stroke(150,150,150);
		p.line(x1,y1,z1,x2,y2,z2);
		//console.log(x + ' ' + y);
		//p.ellipse(x1,y1,5,5);
		//p.ellipse(x2,y2,5,5);
		//p.line(x1,y1,x2,y2);
	}
	p.pop();
}

function displayMaps(p){
	p.background(255,255,255);
	for (var i=0; i<maps.length; i++) {
    	maps[i].display(p);

    	//blur out non-focus maps
    	if(mapFocus != i){
    		maps[i].blur(p);
		}
  	}
  	//console.log('yes');
}

function displayGraphs(p){
	for (var i=0; i<maps.length; i++) {
    	maps[i].displayGraph(maps[i].img.width+50, 0,p);
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
			maps[mapFocus].reCalculate();
			}
}

window.ondblclick=function(){
	reCalc(myp5);
	maps[mapFocus].reCalculate();
}

//add data to end of page
function updateData(p){
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
			div.innerHTML = div.innerHTML + 'id: ' + j + ' distance: ' + p.int(maps[i].internalEdges[j].distance) + ' distanceMod: ' + p.int(maps[i].internalEdges[j].distanceMod) + ' node1: ' + maps[i].internalEdges[j].node1 + ' node2: ' + maps[i].internalEdges[j].node2 +   '<br />';
		}
  	}
}

function reCalc(p){
	if(mode == 0){
			maps[mapFocus].addNode(p.mouseX-dragOffX, p.mouseY-dragOffY, p);
			//console.log(p.mouseX + " " + p.mouseY);
		}
	wormCalc(p);
}

function wormCalc(p){
	if(worm){
			maps[mapFocus].reCalculateW();
			combineMatrix(p,0,1);
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

function imgToggle(p,obj){
	if(!obj.checked){
		imageOn = false;
	} else {
		imageOn = true;
	}
	displayMaps(p);
    	//displayGraphs();
    //updateData(p);
	//makeMatrix(p);

}

function wireFrameMode(){
	if(wireframeOn){
		wireframeOn = false;
		buttonWireframe.style('background-color', '#FFF');
	} else {
		wireframeOn = true;
		buttonWireframe.style('background-color', '#C3E4F6');
	}
}

function wormMode(){
	if(worm){
		worm = false;
		buttonCombine.style('background-color', '#FFF');
	} else {
		worm = true;
		buttonCombine.style('background-color', '#C3E4F6');
	}
}

function delaunay(p,obj){
	if(!obj.checked){
		delaunayOn = false;
	} else {
		delaunayOn = true;
	}
	maps[mapFocus].reCalculate();
	wormCalc(p);
}

function resetMaps(){
	//find and delete all input DOM elements with class name of map's image
	var allInputs = document.getElementsByClassName(maps[mapFocus].name);
	//console.log(allInputs);
	for(var i = allInputs.length-1; i >= 0; i--){
		allInputs[i].remove();
	}

	//run object reset routine
	maps[mapFocus].reset(myp5);
}

/*function transToggle(){
	if(trans == 1.0){
		trans = 0.75;
	} else {
		trans = 1.0;
	}
}*/

function rotateMode(){
	if(autoRotate){
		autoRotate = false;
		buttonRotate.style('background-color', '#FFF');
	} else {
		autoRotate = true;
		buttonRotate.style('background-color', '#C3E4F6');
	}
}

function nNodesChange(){
	var item = nNodeSelect.value();
	nNodes = item;
}

function cNodesChange(){
	var item = cNodeSelect.value();
	connectLastNodes = item;
}

//these are backwards!
function gridWChange(){
	var w = gridWSelect.value();
	gridH = w;
	console.log(gridH);
}

function gridHChange(){
	var h = gridHSelect.value();
	gridW = h;
	console.log(gridW);
}

function dimensionChange(){
	if(dim == 3){
		dim = 2;
		buttonDim.style('background-color', '#C3E4F6');
	} else {
		dim = 3;
		buttonDim.style('background-color', '#FFF');
	}
}

function bindMaps(){
	if(bindTwo){
		bindTwo = false;
		buttonBind.style('background-color', '#FFF');
	} else {
		bindTwo = true;
		buttonBind.style('background-color', '#C3E4F6');
	}

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

function changeFocus(){
	mapFocus++;
	if(mapFocus > maps.length-1){
		mapFocus = 0;
	}
	displayMaps(myp5);
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

	var myp5 = new p5(l,'leftCanv');

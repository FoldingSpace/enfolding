var maps = []; //array to store images
var mapFocus = 0; //number in array to focus
var buttonNodes;
var buttonDist;
var buttonMatrix;
var buttonToggleImg;
var buttonWireframe;
var buttonRotate;
var buttonReset;
var buttonGridMode;
var buttonGridMode2;
var buttonTestNodes;
var buttonTestNodes2;
var buttonHideInputs;
var buttonMapFocus;
var nNodeSelect;
var gridWSelect;
var gridHSelect;
var gridW = 4;
var gridH = 4;
var mode = 0; //mode 0 = edit nodes, 1 = edit distances
var imageOn = true;
var delaunayOn = false;
var rt = 0; //rotate variable
var zoom = 1;
var nNodes = 4;
var mapImages = [];
var autoRotate = false;

//BEGIN LEFT CANVAS
//instance mode of p5.js https://github.com/processing/p5.js/wiki/p5.js-overview#instantiation--namespace
var l = function(p){

	p.setup = function() {
	  // create canvas
	  var c = p.createCanvas(1000, 600);
	  //p.colorMode('HSB',360,100,100,100)
	  p.background(255,255,255,0);
	  // Add an event for when a file is dropped onto the canvas
	  c.drop(p.gotFile);
  
	  buttonNodes = p.createButton('add nodes');
	  buttonNodes.position(1020,5);
	  buttonNodes.mousePressed(mode0); //must be a better way to do this
	  
	  var myDiv = p.createDiv('nearest nodes');
	  myDiv.position(1070,25);
	  nNodeSelect = p.createSelect();
	  nNodeSelect.position(1020,25);
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
	  
	  var gW = p.createDiv('rows');
	  gW.position(1070,150);
	  gridWSelect = p.createSelect();
	  gridWSelect.position(1020,150);
	  gridWSelect.option(4);
	  gridWSelect.option(2);
	  gridWSelect.option(3);
	  gridWSelect.option(5);
	  gridWSelect.option(6);
	  gridWSelect.option(7);
	  gridWSelect.option(8);
	  gridWSelect.option(9);
	  gridWSelect.option(10);
	  gridWSelect.changed(gridWChange);
	  
	  var gW = p.createDiv('columns');
	  gW.position(1070,130);
	  gridHSelect = p.createSelect();
	  gridHSelect.position(1020,130);
	  gridHSelect.option(4);
	  gridHSelect.option(2);
	  gridHSelect.option(3);
	  gridHSelect.option(5);
	  gridHSelect.option(6);
	  gridHSelect.option(7);
	  gridHSelect.option(8);
	  gridHSelect.option(9);
	  gridHSelect.option(10);
	  gridHSelect.changed(gridHChange);
	  
	  /*buttonTestNodes = p.createButton('test nodes (100,100), (350,100)');
	  buttonTestNodes.position(1020,200);
	  buttonTestNodes.mousePressed(p.testNodes);
	  
	  buttonTestNodes = p.createButton('test nodes (100,100), (100,350)');
	  buttonTestNodes.position(1020,220);
	  buttonTestNodes.mousePressed(p.testNodes2);*/
	  
	  buttonDist = p.createButton('edit distances');
	  buttonDist.position(1120,5);
	  buttonDist.mousePressed(mode1);
	
	  buttonToggleImg = p.createButton('toggle image');
	  buttonToggleImg.position(1220,5);
	  buttonToggleImg.mousePressed(p.imageTog);
	  
	  buttonWireframe = p.createButton('wireframe');
	  buttonWireframe.position(1020,550);
	  buttonWireframe.mousePressed(wireFrameMode);
	  
	  buttonRotate = p.createButton('auto-rotate');
	  buttonRotate.position(1020,570);
	  buttonRotate.mousePressed(rotateMode);
	  
	  buttonReset = p.createButton('reset');
	  buttonReset.position(1020,70);
	  buttonReset.mousePressed(p.resetMap);
	  
	  buttonGridMode = p.createButton('grid mode');
	  buttonGridMode.position(1020,90);
	  buttonGridMode.mousePressed(p.gridMode);
	  
	  buttonGridMode2 = p.createButton('grid mode 2');
	  buttonGridMode2.position(1120,90);
	  buttonGridMode2.mousePressed(p.gridMode2);
	  
	  buttonHideInputs = p.createButton('hide input boxes');
	  buttonHideInputs.position(1020,250);
	  buttonHideInputs.mousePressed(p.hideIns);
	  
	  buttonMapFocus = p.createButton('change map focus');
	  buttonMapFocus.position(1020,300);
	  buttonMapFocus.mousePressed(p.changeFocus);
	  var mF = p.createDiv('map#1').id('mFocus');
	  mF.position(1020,320);
	  
	  p.fill(0,0,0,100);
	  p.noStroke();
	  p.textSize(24);
	  p.textAlign('CENTER');
	  p.text('Drag and drop a map', p.width/4, p.height/2);
	  //p.createDiv('data: ').id('dataResults');
	};



	p.draw = function() {
	  
	};
	
	p.gotFile = function(file) {
	  //console.log(file);
	  if (file.type === 'image') {
		// Create an image DOM element and add to maps array
		var offX = 30
		if(maps.length > 0){
			offX = maps[mapFocus].img.width + 35; 
		} 	
		p.append(maps,new Map(file.name,1,p.createImg(file.data).hide(),p, offX));
		mapFocus = maps.length - 1; //change focus to last uploaded map
		//array mapImages holds map images for three.js access
		//images also added to Map objects
		//double storage should be consolidated in future versions
		//currently unable to access img file from Map class for three.js, possible because
		//stored as a p5 filetype (using file.data might fix)
		mapImages.push(file.data);
		console.log('map focus: ' + mapFocus);
		maps[mapFocus].reCalculate();
	  } else {
		console.log('Not an image file!');
	  }
	  var div = document.getElementById('mFocus');
		div.innerHTML = 'map#' + (mapFocus + 1); 
	};
	
	//calls outside function and passes 'p' instance
	p.imageTog = function(){
		imgToggle(p);
	};
	
	p.resetMap = function(){
		//find and delete all input DOM elements with class name of map's image
		var allInputs = document.getElementsByClassName(maps[mapFocus].name);
		console.log(allInputs);
		for(var i = allInputs.length-1; i >= 0; i--){
			allInputs[i].remove();	
		}
		
		//run object reset routine
		maps[mapFocus].reset(p);
	}
	
	p.hideIns = function(){
		var allInputs = document.getElementsByClassName(maps[mapFocus].name);
		console.log(allInputs);
		for(var i = allInputs.length-1; i >= 0; i--){
			allInputs[i].remove();	
		}
	}
	
	p.gridMode = function(){
		//find and delete all input DOM elements with class name of map's image
		var allInputs = document.getElementsByClassName(maps[mapFocus].name);
		console.log(allInputs);
		for(var i = allInputs.length-1; i >= 0; i--){
			allInputs[i].remove();	
		}
		maps[mapFocus].grid(p);
		gridMode = true;
	}
	
	p.gridMode2 = function(){
		//find and delete all input DOM elements with class name of map's image
		var allInputs = document.getElementsByClassName(maps[mapFocus].name);
		console.log(allInputs);
		for(var i = allInputs.length-1; i >= 0; i--){
			allInputs[i].remove();	
		}
		maps[mapFocus].reset(p);
		maps[mapFocus].grid2(p);
		gridMode = true; 
	}
	
	p.testNodes = function(){
		maps[mapFocus].addTestNodes(p);
	}
	
	p.testNodes2 = function(){
		maps[mapFocus].addTestNodes2(p);
	}
		
	p.mouseReleased = function(){
		if(mode == 0){
			maps[mapFocus].addNode(p.mouseX, p.mouseY, p);
			//console.log(p.mouseX + " " + p.mouseY);
		} 
		maps[mapFocus].reCalculate();
	};
	
	p.keyPressed = function(){
		
	}
	
	p.changeFocus = function(){
		mapFocus++;
		if(mapFocus > maps.length-1){
			mapFocus = 0;
		}
		var div = document.getElementById('mFocus');
		div.innerHTML = 'map#' + (mapFocus + 1); 
		maps[mapFocus].reCalculate();
	}
	
};
//END LEFT CANVAS

//BEGIN RIGHT CANVAS, THREE.JS
	var renderer, scene, camera;
	var wireframeOn = false; 
	
	//var material = new THREE.MeshLambertMaterial( { color: 0x0000FF, transparent: true, opacity: 0.8, side: THREE.DoubleSide, wireframe:wireframeOn } );    
    var slices = [];
    
	
	window.onload = function() {
		initThree();
		animateThree();
	};
	
	function initThree() {	
		renderer = new THREE.WebGLRenderer({ alpha: true });
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(
                75,             // Field of view
                1000 / 600,      // Aspect ratio
                0.1,            // Near plane
                100000           // Far plane
            );	
    	camera.position.set( 0, 1000, -1000 );
    	camera.lookAt( new THREE.Vector3(0,0,0));       
	 	scene.add(camera);
	 	
			renderer.setSize( 1000, 600 );
			var div = document.getElementById('rightCanv');
			//console.log(div);
			div.appendChild(renderer.domElement);
			controls = new THREE.OrbitControls(camera, renderer.domElement);
			//scene.add( new THREE.AmbientLight( Math.random() * 0x202020 ) );
			//scene.add( new THREE.AmbientLight( 0xFFFFFF ) );
			
			var dLight = new THREE.DirectionalLight(0xFFFFFF, 0.5);
  			dLight.position.set(0,5,-5);
  			scene.add(dLight);
  			
  			var dLight2 = new THREE.DirectionalLight(0xFFFFFF, 0.5);
  			dLight2.position.set(0,-5,-5);
  			scene.add(dLight2);
  			
  			var dLight2 = new THREE.DirectionalLight(0xFFFFFF, 0.3);
  			dLight2.position.set(0,0,5);
  			scene.add(dLight2);
  			
  			var light = new THREE.AmbientLight( 0x404040 ); // soft white light
			scene.add( light );
  			
			renderer.setClearColor(0xdffffff, 1);
  			
            //plotTriangles(mdsArray,triangles);
		};
	
	function animateThree(){
			var render = function () {
				requestAnimationFrame( render );
				
				if(autoRotate){
					for ( var i = 0; i < slices.length; i ++ ) {
						var slice = slices[ i ];

						slice.rotation.x += 0.01;
						slice.rotation.z += -0.01;
						//console.log(slice.rotation.z);
						//slice.x += .00001;
					}
				}
				
				renderer.render(scene, camera);
				
				
			};

			render();
	  
	};
//END RIGHT CANVAS

//map class
function Map(name, opac, img, p, xoff){
	this.name = name;
	this.opac = opac;
	this.img = img;
	this.internalNodes = [];
	this.internalEdges = [];
	this.offSetX = xoff;
	this.offSetY = 30;
	this.trias = [0];
	this.gridMode = false; 
	this.clickCount = 0; //count clicks for long distance edges in gridMode
	
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
		makeInput(this.internalEdges[j], this.internalNodes, j, this.offSetX, this.offSetY,p, this.name);
	}
	
	p.strokeWeight(3);
	p.stroke(0,0,0,100);
	this.display = function(p){  
		p.push();
		p.translate(this.offSetX,this.offSetY);
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
    		p.ellipse(this.internalNodes[i].xpos,this.internalNodes[i].ypos, 10, 10);
    		p.text(i,this.internalNodes[i].xpos,this.internalNodes[i].ypos);
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
		p.rect(0+this.offSetX,0+this.offSetY,this.img.width+this.offSetX,this.img.height+this.offSetY);
	};
	
	this.returnImg = function(p){
		return this.img;
	};
	
	this.reCalculate = function(){
		updateData(p);
		makeMatrix();
		displayMaps(p);
		console.log("recalculate");
	};
	
	//called when mouseReleased
		this.addNode = function(mx,my,p){
		if(mx >this.offSetX && mx < this.img.width+this.offSetX && mx < p.width && my > 0 && my <  this.img.height+this.offSetY){ //check if on map
			if(this.gridMode){
				if(this.clickCount % 2 == 0){//evens are first clicks
					this.autoAddNode(mx-this.offSetX,my-this.offSetY,p);
				} else {//odds complete edge
					this.autoAddNode(mx-this.offSetX,my-this.offSetY,p);
					var d = nodeDist(this.internalNodes[this.internalNodes.length-2], this.internalNodes[this.internalNodes.length-1],p);
					p.append(this.internalEdges, new Edge(this.internalNodes.length-2,this.internalNodes.length-1,d)); //connect two above nodes
					makeInput(this.internalEdges[this.internalEdges.length-1], this.internalNodes, this.internalEdges.length-1, this.offSetX, this.offSetY,p, this.name);
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
						makeInput(this.internalEdges[this.internalEdges.length-1], this.internalNodes, this.internalEdges.length-1, this.offSetX, this.offSetY,p, this.name);
					}
					//console.log(this.internalEdges[this.internalEdges.length-1]);
			displayMaps(p);
			updateData(p);
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
	    	updateData(p);
	};
	
	this.reset = function(p){	
		p.resetMatrix();	
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
			makeInput(this.internalEdges[j], this.internalNodes, j, this.offSetX, this.offSetY,p,this.name);
		}
		this.gridMode = false;
		this.clickCount = 0;
	};	
	
	this.grid = function(p){
		this.internalNodes = [];
		this.internalEdges = [];
		
		var nodeCount = 0;
		var n = gridW;
		var m = gridH;
		//console.log(n + ' ' + m);
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
	};
	
	this.grid2 = function(p){
		this.internalNodes = [];
		this.internalEdges = [];
		
		var nodeCount = 0;
		var n = gridW;
		var m = gridH;
		console.log(n + ' ' + m);
		for(var i = 0; i <= m; i++){ //height
			for(var j = 0; j <=n; j++){ //width
				p.append(this.internalNodes, new Node(j*img.width/n,i*img.height/m));
				//console.log('j' + j + 'i' + i);
				if(j > 0 ){ //draw horizontal lines to previous node	&& i > 0 && i < gridH
					p.append(this.internalEdges,new Edge(nodeCount-1,nodeCount,
						nodeDist(this.internalNodes[nodeCount-1],this.internalNodes[nodeCount],p)));
				}
				if(i > 0 ){ //draw vertical lines on outline && (j == 0 || j == gridW)  && j> 0 && j < gridW
					//console.log(this.internalNodes);
					// :-/
					if(typeof this.internalNodes[nodeCount-(n+1)] !== "undefined" && typeof this.internalNodes[nodeCount] !== "undefined" ){
						p.append(this.internalEdges,new Edge(nodeCount-(n+1),nodeCount,
							nodeDist(this.internalNodes[nodeCount-(n+1)],this.internalNodes[nodeCount],p)));
						//console.log(nodeCount);
						//console.log(nodeDist(this.internalNodes[nodeCount-(n+1)],this.internalNodes[nodeCount],p));	
					}	
				}
				nodeCount++;
			}	
		}	
		this.gridMode = true; 
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
	var x1 = nodes[edge.node1].xpos+xOff;
	var x2 = nodes[edge.node2].xpos+xOff;
	var y1 = nodes[edge.node1].ypos+yOff;
	var y2 = nodes[edge.node2].ypos+yOff;
	
	//console.log(edge.node1);
	
    input.position(x1+(x2-x1)/2, y1+(y2-y1)/2);
    input.value(p.int(edge.distance));
    input.id(n); //adds id that refers to edge
    input.class(nm); //uses image name for class for deletion later
    input.attribute("onkeydown", "keypress(event, " + n + ")");
}

//returns distance btw node and x,y
function nodeDistXY(nn1,mx,my,p){
	return p.dist(nn1.xpos,nn1.ypos,mx,my);
}

//build empty matrix, run through Floyd Warshall and MDS
function makeMatrix(p){
	//console.log(maps[mapFocus].internalNodes);
	var nodes = maps[mapFocus].internalNodes;
	var edges = maps[mapFocus].internalEdges;
	var triangles = maps[mapFocus].trias;
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
	var mdsArray = mdsCoords(shortestDists,3); 
	//console.log(mdsArray);
    //delaunay triangulation from https://github.com/ironwallaby/delaunay
    //console.log(vertices);
    triangles = Delaunay.triangulate(vertices);
	//console.log(triangles);
	//plotCoords(mdsArray, edges);
	plotTriangles(mdsArray,triangles);
	//console.log(mdsArray);
	delaunayOn = true;
	
}

function plotTriangles(coords, trias){
	var material = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture(mapImages[mapFocus]), side: THREE.DoubleSide } );

	//iterate through slices and remove all from scene
	for(var i = 0; i < slices.length; i++){
		scene.remove(slices[i]);
	}
	material.setValues({wireframe:wireframeOn});
	slices = []; 
	if(trias.length > 1){
		for(var i = 0; i < trias.length; i+=3){
		
			//pull out width/height of image to normalize to 1 scale of UV
			//for future versions, move outside this function
			var w = maps[mapFocus].img.width;
			var h = maps[mapFocus].img.height;
		
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
			var uv1x = maps[mapFocus].internalNodes[trias[i]].xpos/w;
			var uv1y = 1-maps[mapFocus].internalNodes[trias[i]].ypos/h;
			var uv2x = maps[mapFocus].internalNodes[trias[i+1]].xpos/w;
			var uv2y = 1-maps[mapFocus].internalNodes[trias[i+1]].ypos/h;
			var uv3x = maps[mapFocus].internalNodes[trias[i+2]].xpos/w;
			var uv3y = 1-maps[mapFocus].internalNodes[trias[i+2]].ypos/h;
			
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
			triangle.rotation.x = 1.0;
			triangle.rotation.z = -1.0;
			
			scene.add(triangle);
			slices.push(triangle);	
			//console.log(x1 + ' ' + y1 + ' ' + z1);
			
		}
	}
		//var material2 = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture('images/texture.jpg'), side: THREE.DoubleSide } );
		//var cube = new THREE.CubeGeometry(300,300,300);
  		//var mesh = new THREE.Mesh(cube,material);
  		//scene.add(mesh);	
  	maps[mapFocus].trias = trias;	
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

//TO REMOVE
function plotMdsGraph(coords, es){
	push();
	translate(800,-140); //KLUDGE!
	rotate(PI/4);
	for(var i = 0; i < es.length; i++){
		var x1 = coords[es[i].node1][0]/1.5;
		var x2 = coords[es[i].node2][0]/1.5;
		var y1 = coords[es[i].node1][1]/1.5;
		var y2 = coords[es[i].node2][1]/1.5;
		ellipse(x1,y1,10,10);
		ellipse(x2,y2,10,10);
		line(x1,y1,x2,y2);
	}
	/*for(var i = 0; i < coords.length; i++){
		var x = coords[i][0]/1.5;
		var y = coords[i][1]/1.5;
		ellipse(x,y,5,5);
		console.log(x + ' ' + y);
	}*/
	pop();
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
			var inputFocus = document.getElementById(id);
			var inVal = inputFocus.value; 
			maps[mapFocus].internalEdges[id].distanceMod = inVal;
			console.log(inVal); 
			inputFocus.value = inVal + '/' + parseInt(maps[mapFocus].internalEdges[id].distance);
			maps[mapFocus].reCalculate();
			}
}



//add data to end of page for testing and cut-and-pasting to R
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

function mode0(){
	mode = 0;
	console.log('mode = 0');
}

function mode1(){
	mode = 1;
	console.log('mode = 1');
}

function imgToggle(p){
	if(imageOn){
		imageOn = false;
	} else {
		imageOn = true;
	}
	displayMaps(p);
    	//displayGraphs();
    updateData(p);
	//makeMatrix(p);
	
}

function wireFrameMode(){
	if(wireframeOn){
		wireframeOn = false;
	} else {
		wireframeOn = true;
	}
}	

function rotateMode(){
	if(autoRotate){
		autoRotate = false;
	} else {
		autoRotate = true;
	}
}	

function nNodesChange(){
	var item = nNodeSelect.value();
	nNodes = item;
}

//these are backwards!
function gridWChange(){
	var w = gridWSelect.value();
	gridH = w;
	console.log(gridW);
}

function gridHChange(){
	var h = gridHSelect.value();
	gridW = h;
	console.log(gridH);
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

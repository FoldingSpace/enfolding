var maps = []; //array to store images
var mapFocus; //number in array to focus
var buttonNodes;
var buttonDist;
var mode = 0; //mode 0 = edit nodes, 1 = edit distances

function setup() {
  // create canvas
  var c = createCanvas(1000, 700);
  colorMode(HSB,360,100,100,100)
  background(100,0,50,100);
  // Add an event for when a file is dropped onto the canvas
  c.drop(gotFile);
  
  buttonNodes = createButton('add nodes');
  buttonDist = createButton('edit distances');
  buttonNodes.position(10,0);
  buttonDist.position(100,0);
  buttonNodes.mousePressed(mode0); //must be a better way to do this
  buttonDist.mousePressed(mode1);
}

function draw() {
  fill(255,0,100,100);
  noStroke();
  textSize(24);
  textAlign(CENTER);
  text('Drag and drop a map', width/2, height/2);
  createDiv('data: ').id('dataResults');
  noLoop();
}

function gotFile(file) {
  if (file.type === 'image') {
	// Create an image DOM element and add to maps array
	append(maps,new Map(file.name,1,createImg(file.data).hide()));
	mapFocus = maps.length - 1; //change focus to last uploaded map
	console.log('map focus: ' + 	mapFocus);
  } else {
	println('Not an image file!');
  }
  displayMaps();
  displayGraphs();
  updateData();
}

//map class
function Map(name, opac, img){
	this.name = name;
	this.opac = opac;
	this.img = img;
	this.internalNodes = [];
	this.internalEdges = [];
	this.offSetX = 30;
	this.offSetY = 30;
	
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
		makeInput(this.internalEdges[j], this.internalNodes, j, this.offSetX, this.offSetY);
	}
	
	strokeWeight(3);
	stroke(0,100,0,50);
	this.display = function(){  
		image(this.img,this.offSetX,this.offSetY,this.img.width,this.img.height);
		
		//display nodes
    	for(var i=0; i < this.internalNodes.length; i++){
    		ellipse(this.internalNodes[i].xpos+this.offSetX,this.internalNodes[i].ypos+this.offSetY, 10, 10);
    	} 
    	//display edges
    	for(var i=0; i < this.internalEdges.length; i++){
    		var x1 = this.internalNodes[this.internalEdges[i].node1].xpos + this.offSetX;
    		var x2 = this.internalNodes[this.internalEdges[i].node2].xpos + this.offSetX;
    		var y1 = this.internalNodes[this.internalEdges[i].node1].ypos + this.offSetY;
    		var y2 = this.internalNodes[this.internalEdges[i].node2].ypos + this.offSetY;
    		line(x1,y1,x2,y2);	
    	}
	};
	
	this.displayGraph = function(goffSetX, goffSetY){
		//display nodes
    	for(var i=0; i < this.internalNodes.length; i++){
    		ellipse(this.internalNodes[i].xpos+this.offSetX + goffSetX,this.internalNodes[i].ypos+this.offSetY+ goffSetY, 10, 10);
    	} 
    	//display edges
    	for(var i=0; i < this.internalEdges.length; i++){
    		var x1 = this.internalNodes[this.internalEdges[i].node1].xpos + this.offSetX + goffSetX;
    		var x2 = this.internalNodes[this.internalEdges[i].node2].xpos + this.offSetX + goffSetX;
    		var y1 = this.internalNodes[this.internalEdges[i].node1].ypos + this.offSetY + goffSetY;
    		var y2 = this.internalNodes[this.internalEdges[i].node2].ypos + this.offSetY + goffSetY;
    		line(x1,y1,x2,y2);	
    	}
	};
	
	//called when mouseReleased
		this.addNode = function(mx,my){
		if(mx > this.offSetX && mx < this.offSetX + this.img.width && my > this.offSetY && my < this.offSetY + this.img.height){ //check if on map
				append(this.internalNodes, new Node(mx-this.offSetX,my-this.offSetY));
				
				//third argument = n nearest nodes to connect to
				var nodeShort = findClosestNNodes(mx-this.offSetX,my-this.offSetY, 2, this.internalNodes);  
				//console.log(nodeShort);
				for(var i = 0; i < nodeShort.length; i++){
					append(this.internalEdges, new Edge(nodeShort[i], this.internalNodes.length - 1, nodeDistXY(this.internalNodes[nodeShort[i]], mx-this.offSetX,my-this.offSetY)));
					makeInput(this.internalEdges[this.internalEdges.length-1], this.internalNodes, this.internalEdges.length-1, this.offSetX, this.offSetY);
				}
				//console.log(this.internalEdges[this.internalEdges.length-1]);
		displayMaps();
		displayGraphs();
	    updateData();
	};
	}	
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

//NOT IN USE::TO DELETE returns closest existing node to new node
function findClosestNode(mx,my,iNodes){
	var smallestD = 10000000;
	var nodeID;
	for(var i = 0; i < 4; i++){ //check edge nodes for distance
		distN = dist(iNodes[i].xpos, iNodes[i].ypos, mx,my);
		if (distN < smallestD){
			nodeID = i;
			smallestD = distN;
		}
	}
	return nodeID;
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
function makeInput(edge, nodes, n, xOff, yOff){
	input = createInput();
	var x1 = nodes[edge.node1].xpos+xOff;
	var x2 = nodes[edge.node2].xpos+xOff;
	var y1 = nodes[edge.node1].ypos+yOff;
	var y2 = nodes[edge.node2].ypos+yOff;
	
	//console.log(edge.node1);
	
    input.position(x1+(x2-x1)/2, y1+(y2-y1)/2);
    input.value(int(edge.distance));
    input.id(n); //adds id that refers to edge
    input.attribute("onkeydown", "keypress(event, " + n + ")");
}

function keypress(event, id){
	var key = event.keyCode;
	if (key == 13){ //trigger for enter key
		var inputFocus = document.getElementById(id);
		var inVal = inputFocus.value; 
		maps[mapFocus].internalEdges[id].distanceMod = inVal;
		console.log(inVal); 
		inputFocus.value = inVal + '/' + int(maps[mapFocus].internalEdges[id].distance);
		updateData();
	}
}

//returns distance btw node and x,y
function nodeDistXY(nn1,mx,my){
	return dist(nn1.xpos,nn1.ypos,mx,my);
}

function displayMaps(){
	background(255,0,100,100);
	for (var i=0; i<maps.length; i++) {
    	maps[i].display();
  	}
}

function displayGraphs(){
	for (var i=0; i<maps.length; i++) {
    	maps[i].displayGraph(maps[i].img.width+50, 0);
  	}
}

function mouseReleased(){
	if(mode == 0){
		maps[mapFocus].addNode(mouseX, mouseY);
	}
	return false;
}

//add data to end of page for testing and cut-and-pasting to R
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

function mode0(){
	mode = 0;
	console.log('mode = 0');
}

function mode1(){
	mode = 1;
	console.log('mode = 1');
}
function goInterface(){
	document.getElementById("leftCanv").style.display = "block";
	document.getElementById("rightCanv").style.display = "none";
	document.getElementById("menuEdit").style.display = "block";
	document.getElementById("menuRender").style.display = "none";
	document.getElementById("goInterface").style.backgroundColor = "#666";
	document.getElementById("goRender").style.backgroundColor = "#333";
	editMode = true;
}

function goRender(){
	document.getElementById("leftCanv").style.display = "none";
	document.getElementById("rightCanv").style.display = "block";
	document.getElementById("menuEdit").style.display = "none";
	document.getElementById("menuRender").style.display = "block";
	document.getElementById("goInterface").style.backgroundColor = "#333";
	document.getElementById("goRender").style.backgroundColor = "#666";
	editMode = false;
}

function changeFocus(){
	mapFocus++;
	if(mapFocus > maps.length-1){
		mapFocus = 0;
	}
	maps[mapFocus].reCalculate();
}

function resetMaps(){
	//find and delete all input DOM elements with class name of map's image
	var allInputs = document.getElementsByClassName(maps[mapFocus].name);
	//console.log(allInputs);
	for(var i = allInputs.length-1; i >= 0; i--){
		var toRemove = allInputs[i];
		toRemove.parentNode.removeChild(toRemove);
	}
	//run object reset routine
	maps[mapFocus].reset(myp5);
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

function imgToggle(p,obj){
	if(!obj.checked){
		imageOn = false;
	} else {
		imageOn = true;
	}
	displayMaps(p);
}

insToggle = function(p,obj){
	if(!obj.checked){
		var allInputs = document.getElementsByClassName("mapIn");
		for(var i = 0; i < allInputs.length; i++){
			allInputs[i].style.visibility = "hidden";
		}
	} else {
		var allInputs = document.getElementsByClassName("mapIn");
		for(var i = 0; i < allInputs.length; i++){
			allInputs[i].style.visibility = "visible";
		}
	}
}

function nNodesChange(obj){
	var item = obj.value;
	nNodes = item;
}

function dimensionChange(obj){
	if(!obj.checked){
		dim = 2;
	} else {
		dim = 3;
	}
	recalcMaps();
}

function wormMode(obj){
	if(!obj.checked){
		worm = false;
		document.getElementById("nodeConnect").style.display = "none";
	} else {
		worm = true;
		document.getElementById("nodeConnect").style.display = "block";
	}
	recalcMaps();
}

function bindMaps(obj){
	if(!obj.checked){
		bindTwo = false;
	} else {
		bindTwo = true;
	}
	wormCalc(myp5);
}

function cNodesChange(obj){
	var item = obj.value;
	connectLastNodes = item;
	recalcMaps();
}

function bindslide(obj){
	bindDist = obj.value;
	bindMaps(obj);
}

function rotateMode(obj){
	if(!obj.checked){
		autoRotate = false;
	} else {
		autoRotate = true;
	}
}

function tslide(obj){
	maps[obj.id].trans = obj.value/100;
	recalcMaps();
}

function wireFrameMode(obj){
	if(!obj.checked){
		wireframeOn = false;
	} else {
		wireframeOn = true;
	}
	recalcMaps();
}

function webVrOn(obj){
	var vrDiv = document.getElementById('webvr');

	if(!obj.checked){
		vrModeOn = false;
		renderer.vr.enabled = false;
		vrDiv.innerHTML = '';
	} else {
		vrModeOn = true;
		renderer.vr.enabled = true;
		vrDiv.append(WEBVR.createButton(renderer));
	}
	recalcMaps();
}

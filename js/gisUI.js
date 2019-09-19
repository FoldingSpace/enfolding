function goInterface(){
	document.getElementById("leftCanv").style.display = "block";
	document.getElementById("rightCanv").style.display = "none";
	document.getElementById("menuEdit").style.display = "block";
	document.getElementById("menuRender").style.display = "none";
	document.getElementById("goInterface").style.backgroundColor = "#666";
	document.getElementById("goRender").style.backgroundColor = "#333";
	editMode = true;
	insToggle2();
}

function goRender(){
	document.getElementById("leftCanv").style.display = "none";
	document.getElementById("rightCanv").style.display = "block";
	document.getElementById("menuEdit").style.display = "none";
	document.getElementById("menuRender").style.display = "block";
	document.getElementById("goInterface").style.backgroundColor = "#333";
	document.getElementById("goRender").style.backgroundColor = "#666";
	editMode = false;
	insToggle2();
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
	maps[mapFocus].reset();
}

function delaunay(obj){
	if(!obj.checked){
		delaunayOn = false;
	} else {
		delaunayOn = true;
	}
	maps[mapFocus].reCalculate();
	wormCalc();
}

function imgToggle(obj){
	if(!obj.checked){
		imageOn = false;
	} else {
		imageOn = true;
	}
	displayMaps();
}

insToggle = function(obj){
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

function insToggle2(){
	if(!editMode){
		var allInputs = document.getElementsByClassName("mapIn");
		for(var i = 0; i < allInputs.length; i++){
			allInputs[i].style.visibility = "hidden";
		}
	} else if(editMode){
		var allInputs = document.getElementsByClassName("mapIn");
		for(var i = 0; i < allInputs.length; i++){
			allInputs[i].style.visibility = "visible";
		}
	}

}
//color picker iro.js
//color picker iro.js
var colorPicker = new iro.ColorPicker('#color-picker-container', {
width: 150,
padding:5,
handleRadius: 5,
});

var values = document.getElementById("values");
colorPicker.on(["color:init", "color:change"], function(color, values){
  var hexPicker = colorPicker.color.hexString;
  console.log(hexPicker);
  values.innerHTML = [
    "hex: " + color.hexString,
  ].join("<br>");
});

function onColorChange(color, changes) {
//change render canvas color
    renderer.setClearColor(color.hexString, 1);
}

// listen to a color picker's color:change event
colorPicker.on('color:change', onColorChange);


//change canvas color
function orangeCan() {
  renderer.setClearColor(0xff812d, 1);
};

function blueCan() {
  renderer.setClearColor(0x5a8ad2, 1);
};

function yellowCan() {
  renderer.setClearColor(0xffd941, 1);
};

function greenCan() {
  renderer.setClearColor(0x94d668, 1);
};

function magentaCan() {
  renderer.setClearColor(0xff2d81, 1);
};

function purpleCan() {
  renderer.setClearColor(0xba72cc, 1);
};

function whiteCan() {
  renderer.setClearColor(0xFFFFFF, 1);
};

function grayCan() {
  renderer.setClearColor(0x808080, 1);
};

function blackCan() {
  renderer.setClearColor(0x000000, 1);
};
//end color change button
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
	wormCalc();
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
		var user = new THREE.Group();
		user.position.set( 0, 0, canvaswidth/2 );
		scene.add( user );
		user.add( camera );
	}
	recalcMaps();
}

document.getElementById('selectFilesGraph').onchange = function() {
  var files = document.getElementById('selectFilesGraph').files;
  if (files.length <= 0) {
    return false;
  };
	document.getElementById('fileGraph').innerHTML = (files[0].name);
	var fr = new FileReader();
	fr.readAsText(files[0]);
	fr.onload = function(e) {
  	rawText = fr.result;
		GraphXMLfromString(fr.result);
	};
}

document.getElementById('importImage').onclick = function() {
    var files = document.getElementById('selectFilesImage').files;
		/*
		var fr = new FileReader();

		fr.readAsBinaryString(files[0]);
		var rawData = fr.result;
		document.getElementById('fileImage').innerHTML = (files[0].name);
		if (files.length <= 0) {
			return false;
		}*/
		console.log("Current file: "+files[0].name);
		myfile = new p5.File(files[0]);
		console.log("Current file as p5 file: "+myfile);
		console.log("Current type of p5 file: "+myfile.type);
		var myfiledata = myfile.data;
		console.log(myfiledata);
		loadImage(myfiledata,addMap);
		//myp5.addMap(myfile);
		console.log("Made it past loadImage and addMap.")
		mapImages.push(myfile);
}

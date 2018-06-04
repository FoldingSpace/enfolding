// comment
// testing

function XMLnotfound(myerror){
  console.log("loadXML current error is: " + myerror)
}

function XMLfound(myXML){
  console.log("loadXML worked with value: " + myXML)
}


function inputGraphXML(xmlURI){
  //
  var xml = myp5.loadXML(xmlURI,XMLfound,XMLnotfound);
  var children = xml.getChildren('key');

  // get the keys
  for (var i = 0; i < children.length; i++) {
    var keyid = children[i].getString('id');
    var fortype = children[i].getString('for');
    var attrtype = children[i].getString('attr.name');
    console.log(keyid + ', ' + fortype + ', ' + attrtype);
  }

  // get the keys

  for (var i = 0; i < children.length; i++) {
    var keyid = children[i].getString('id');
    var fortype = children[i].getString('for');
    var attrtype = children[i].getString('attr.name');
    console.log(keyid + ', ' + fortype + ', ' + attrtype);
  }



  }

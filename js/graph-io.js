// comment
// testing
function inputGraphXML(xmlURI){
  //
  var xml = p.loadXML(xmlURI);
  var children = xml.getChildren('key');

  for (var i = 0; i < children.length; i++) {
    var keyid = children[i].getString('id');
    var fortype = children[i].getString('for');
    var attrtype = children[i].getString('attr.name');
    console.log(keyid + ', ' + fortype + ', ' + attrtype);
  }


  }

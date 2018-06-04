// comment
// testing

function GraphXMLfromString(xmlString){
  //
  console.log("XML data seen: "+xmlString)

  parser = new DOMParser();
  xmlDoc = parser.parseFromString(xmlString,"text/xml")

  // get the keys
  var keychildren = xmlDoc.getElementsByTagName('key');
  var keyid, fortype, attrtype;
  var keys = {};
  for (var i = 0; i < keychildren.length; i++) {
    keyid = keychildren[i].getAttribute('className')('id');
    fortype = keychildren[i].getAttribute('for');
    attrname = keychildren[i].getAttribute('attr.name');
    keys[keyid] = {'for': fortype, 'attrname': attrname}
    console.log(keyid + ', ' + fortype + ', ' + attrtype);
  }

  /*

  // parse nodes

  var nodechildren = xmlDoc.getElementsByTagName('node');
  var datachildren;
  for (var currnode = 0; currnode < nodechildren.length; currnode++) {
    datachildren = nodechildren[currnode].getElementsByTagName('data');
    for (var currdata = 0; currdata < datachildren.length; currdata++) {
      keyid = datachildren[currdata].getElementsByTagName('key');
      keycontent = datachildren[currdata].nodeValue;
      console.log("Node " + currnode + " has key " + keyid + ' of ' + keycontent);
      console.log("Node " + currnode + " has key " + keys[keyid] + ' is ' + keycontent)
    }
  }
  */

  // add the nodes to enfolding

  // parse edges

  // add edges to enfolding

}

/*

function XMLnotfound(myerror){
  console.log("loadXML current error is: " + myerror)
}

function XMLfound(myXML){
  console.log("loadXML worked with value: " + myXML)
}

function inputGraphXML(xmlURI){
  //
  console.log("XML URI to load: "+xmlURI)
  var xml = myp5.loadXML(xmlURI,XMLfound,XMLnotfound);


  // get the keys
  var keychildren = xml.getChildren('key');
  var keyid, fortype, attrtype;
  var keys = {};
  for (var i = 0; i < keychildren.length; i++) {
    keyid = keychildren[i].getString('id');
    fortype = keychildren[i].getString('for');
    attrname = keychildren[i].getString('attr.name');
    keys[keyid] = {'for': fortype, 'attrname': attrname}
    console.log(keyid + ', ' + fortype + ', ' + attrtype);
  }

  // parse nodes
  var nodechildren = xml.getChildren('node');
  var datachildren;
  for (var currnode = 0; currnode < nodechildren.length; currnode++) {
    datachildren = nodechildren[currnode].getChildren('data');
    for (var currdata = 0; currdata < datachildren.length; currdata++) {
      keyid = datachildren[currdata].getString('key');
      keycontent = datachildren[currdata].getContent();
      console.log("Node " + currnode + " has key " + keyid + ' of ' + keycontent);
      console.log("Node " + currnode + " has key " + keys[keyid] + ' is ' + keycontent)
    }
  }

  // add the nodes to enfolding

  // parse edges

  // add edges to enfolding

}
*/

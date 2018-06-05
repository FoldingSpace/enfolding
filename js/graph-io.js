// comment
// testing

function GraphXMLfromString(xmlString) {
  //
  console.log("XML data seen: "+xmlString);

  parser = new DOMParser();
  xmlDoc = parser.parseFromString(xmlString,"text/xml");

  // get the keys
  var keychildren = xmlDoc.getElementsByTagName('key');
  console.log('keychildren has this number of elements: '+keychildren.length);
  console.log(keychildren);

  var keyid, fortype, attrtype;
  var keys = {};
  for (var i = 0; i < keychildren.length; i++) {
    keyid = keychildren[i].getAttribute('id');
    fortype = keychildren[i].getAttribute('for');
    attrname = keychildren[i].getAttribute('attr.name');
    keys[keyid] = {'for': fortype, 'attrname': attrname};
    console.log(keyid + ', ' + fortype + ', ' + attrname);
  };

  // parse nodes

  var nodechildren = xmlDoc.getElementsByTagName('node');
  var datachildren;
  var nodes = {};
  for (var currnode = 0; currnode < nodechildren.length; currnode++) {
    nodeid = nodechildren[currnode].getAttribute('id');
    datachildren = nodechildren[currnode].getElementsByTagName('data');
    var current_node = {};
    for (var currdata = 0; currdata < datachildren.length; currdata++) {
      keyid = datachildren[currdata].getAttribute('key');
      keycontent = datachildren[currdata].childNodes[0].nodeValue;
      console.log("Node " + nodeid + " has key " + keys[keyid].attrname + ' of ' + keycontent);
      current_node = current_node + {keys[keyid].attrname: keycontent};
    }
    nodes = nodes + current_node;
  }
  console.log(nodes);
}
  // add the nodes to enfolding

  // parse edges

  // add edges to enfolding



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

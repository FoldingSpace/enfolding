// comment
// testing

function GraphXMLfromString(xmlString) {
  //
  console.log("XML data seen: "+xmlString);

  parser = new DOMParser();
  xmlDoc = parser.parseFromString(xmlString,"text/xml");

  // get the keys

  console.log("KEYS:");
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

  console.log("NODES:");
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
      current_node[keys[keyid].attrname] = keycontent;
    };
    nodes[nodeid] = current_node;
  };
  console.log(nodes);

  // add the nodes to enfolding
  // very much an experimental hack for now
  var tf = new Transform([-180, 180, -90, 90], [0, 1024, 0, 512]);

  for (var i in nodes) {
    var v = new Node(nodes[i].lon, nodes[i].lat, tf);
    append(maps[0].internalNodes, v);
  };

  // parse edges

  console.log("EDGES:");
  var edgechildren = xmlDoc.getElementsByTagName('edge');
  var datachildren;
  var edges = {};
  for (var curredge = 0; curredge < edgechildren.length; curredge++) {
    edgeid = edgechildren[curredge].getAttribute('id');
    edgesource = edgechildren[curredge].getAttribute('source');
    edgetarget = edgechildren[curredge].getAttribute('target');
    datachildren = edgechildren[curredge].getElementsByTagName('data');
    var current_edge = {'source': edgesource, 'target':edgetarget};
    for (var currdata = 0; currdata < datachildren.length; currdata++) {
      keyid = datachildren[currdata].getAttribute('key');
      keycontent = datachildren[currdata].childNodes[0].nodeValue;
      console.log("Edge " + edgesource + " to " + edgetarget + " has key " + keys[keyid].attrname + ' of ' + keycontent);
      current_edge[keys[keyid].attrname] = keycontent;
    };
    //edges[edgeid] = current_edge;
    // this change needed to correctly unpack edges
    edges[curredge] = current_edge;
  };
  console.log(edges);

  // add edges to enfolding
  // very much an experimental hack for now

  for (var i in edges) {
    // Note the offset by index position n (the 4 corners that are in internalNodes at the start)
    var e = new Edge(4 + Number(edges[i].source), 4 + Number(edges[i].target), edges[i].dist_km);
    append(maps[0].internalEdges, e);
  };
  maps[0].display();
};




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

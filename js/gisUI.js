$( "#goInterface" ).click(function() {
	$("#leftCanv").css( "display", "block" );
	$("#rightCanv").css( "display", "none");
	$("#goInterface").css("background-color","#666");
	$("#goRender").css("background-color","#333");
	editMode = true;
});
$( "#goRender" ).click(function() {
	$("#leftCanv").css( "display", "none" );
	$("#rightCanv").css( "display", "block");
	$("#goRender").css("background-color","#666");
	$("#goInterface").css("background-color","#333");
	editMode = false;
});
$( "#resetMaps").click(function(){
	resetMaps();
})
$( "#objOut" ).click(function() {
  outOBJ();
});
$( "#changeFocus").click(function(){
	changeFocus();
});

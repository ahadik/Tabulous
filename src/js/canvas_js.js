//GLOBAL VARIABLES
var radius = 10;
var canvas, context;
var tab_collection = {};

/*
	Cleanup the collection so that all tabs are ordered and offset by 1
*/
function maintain_collection(){
	
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

/*
	INPUT:
		point: object with keys [x,y,index]
			x,y: position
			index: order of tab
		canvas: canvas DOM object
	OUTPUT:
		draw point on canvas
*/
function draw_2D_configuration(point, canvas) {
    context = canvas.getContext("2d");
    context.beginPath();
	context.arc(point['x'], point['y'], radius, 0, 2 * Math.PI, false);
	context.fillStyle = 'green';
	context.fill();
	context.lineWidth = 1;
	context.strokeStyle = '#003300';
	context.stroke();
}

function create_point(point){
	var points = Object.keys()
}

$(document).ready(function(){
	canvas = $('#interface');
	context = canvas[0].getContext('2d');
	canvas.click(function(evt){
		var point = getMousePos(canvas[0], evt);
		point['index'] = null;
		draw_2D_configuration(point, canvas[0])
	});

});
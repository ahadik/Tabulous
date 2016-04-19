var container;
var radius = 15;
var edit_mode = true;
var bottom_padding = 40;
var top_padding = 160;
var max_width = 1000;

d3.selection.prototype.last = function() {
  var last = this.size() - 1;
  return d3.select(this[0][last]);
};

var tab_container = [];

var tooltip;

function generate_circle(point){
	var entry = {'index':tab_container.length+1, 'cx' : point[0], 'cy' : point[1], 'radius' : radius, 'color': 'green'};
	tab_container.push(entry);
	return entry;
}

function x_response(){
	tooltip.transition().duration(200).style("opacity", 0).each('end', function(){
		$('input[name="task_name"]').val('');
	});
}

function check_response(){
	var num_tabs = parseInt($('#task_master').attr('tabs'));
	var poly_type;
	var fill_color;
	if(num_tabs < 10){
		poly_type = 'green';
		fill_color = '#B4E051';
	}else if(num_tabs < 20){
		poly_type = 'orange';
		fill_color = '#FF7832';
	}else{
		poly_type = 'red';
		fill_color = '#FF5050';
	}
	$('#task_list').append('<li><span class="task_item_name">'+$('input[name="task_name"]').val()+'</span><div class="task_item_tabs"><span class="task_item_datum '+poly_type+'">'+num_tabs+'</span></div></li>');
	if($('#task_list li').length > 1){
		$('.priority').css('display', 'block');
	}
	
	var task_circle = d3.selectAll('.circle').filter(function(d){return d.index == $('#task_master').attr('tabs');});
	
	task_circle.select('circle')
	var currentx = d3.transform(task_circle.select('circle').attr("transform")).translate[0];
	var currenty = d3.transform(task_circle.select('circle').attr("transform")).translate[1];

	var task_poly = task_circle.insert('polygon', 'text')
							.attr('points', '0,11.1 19.3,0 38.6,11.1 38.6,33.4 19.3,44.6 0,33.4 ')
							.attr('transform', 'translate('+(currentx-20)+','+(currenty-20)+')')
							.attr('fill', fill_color)
							.style('stroke-width',2)
							.style('stroke', 'white')
							.style("cursor", "pointer")
							.attr("filter", "url(#dropshadow)");
							
	task_poly.data([task_circle.data()]);
	task_circle.select('circle').remove();			
	$('.sortable').sortable();
	
	tooltip.transition().duration(200).style("opacity", 0).each('end', function(){
		$('input[name="task_name"]').val('');
	});
	
	reveal_sidebar();
}

function click(){
	// Ignore the click event if it was suppressed or edit mode is disabled
	if (d3.event.defaultPrevented || !edit_mode) return;
	var mouse = d3.mouse(container.node());
	var entry = generate_circle(mouse);
	var prev_circle = d3.selectAll('.circle').last();
	var prev_entry = prev_circle.data();
	// Append a new point
	var circle_g = container.append('g').attr('class', 'circle').style("cursor", "pointer").call(drag);
	var circle = circle_g.append("circle")
							.attr("transform", "translate(" + mouse[0] + "," + mouse[1] + ")")
							.attr("r", radius)
							.attr("class", "dot")
							.style('fill', '#DB2780')
							.style('stroke-width',2)
							.style('stroke', 'white')
							.style("cursor", "pointer")
							.attr("filter", "url(#dropshadow)")
							.on('click',function(){
									var mouse = d3.mouse(container.node());
									tooltip.transition().duration(200).style("opacity", 1).each('end',function(){
										$('input[name="task_name"]').focus();
									});
									tooltip
										.style("left", (mouse[0]-125) + "px")     
										.style("top", (mouse[1]-155) + "px")
										.attr('tabs', entry.index);
							})
							.on('mouseover', function(){
								d3.select(this).transition()
									.ease('elastic')
									.duration('250')
									.attr('r', radius*1.5);
							})
							.on('mouseout', function(){
								d3.select(this).transition()
									.ease('elastic')
									.duration('250')
									.attr('r', radius);
							});
							
	var offset;
	if(entry.index>9){
		offset = 9;
	}else{
		offset = 5;
	}
	var label = circle_g.append('text')
							.attr("transform", "translate(" + (mouse[0]-(offset)) + "," + (mouse[1]+(5)) + ")")
							.attr('class', 'circle_label')
							.style('fill', 'white')
							.style('font-weight', 500)
							.text(entry.index)
							.attr("pointer-events", "none");
	
	//bind the circle's data to this newly created element
	
	if(!d3.select('#live_line').empty()){
		var live_line = d3.select('#live_line');
		
		var connector = container.insert('line', ':nth-child(2)')
								.attr('x1', live_line.attr('x1'))
								.attr('y1', live_line.attr('y1'))
								.attr('x2', live_line.attr('x2'))
								.attr('y2', live_line.attr('y2'))
								.attr('stroke-width', 2)
								.attr('stroke', '#DB2780');
		entry.incoming = connector;
		
		prev_circle.data()[0]['outgoing'] = connector;
	}
	circle_g.data([entry]);
}

// Define drag beavior
var drag = d3.behavior.drag()
    .on("drag", dragmove);

function dragmove(d) {
	var mouse = d3.mouse(container.node());
	var x = d3.event.x;
	var y = d3.event.y;
	var circle = d3.select(this).select('circle').attr("transform", "translate(" + x + "," + y + ")");
	var polygon = d3.select(this).select('polygon').attr("transform", "translate(" + (x-20) + "," + (y-20) + ")");
	var label = d3.select(this).select('text').attr("transform", "translate(" + (x-(radius/2)) + "," + (y+(radius/2)) + ")");

	var g;
	if(circle[0][0] == null){
		g = polygon.select(function(){return this.parentNode;});
	}else{
		g = circle.select(function(){return this.parentNode;});
	}
	
	//shape_move.data([circle_data]);
	//update incoming line
	
	if(g.data()[0].incoming != undefined){
	  d3.select(g.data()[0].incoming[0][0]).attr('x2',x);
	  d3.select(g.data()[0].incoming[0][0]).attr('y2',y);
	}
	
	if(g.data()[0].outgoing != undefined){
	  //update the outgoing line
	  d3.select(g.data()[0].outgoing[0][0]).attr('x1',x);
	  d3.select(g.data()[0].outgoing[0][0]).attr('y1',y);
	}
}

function create_hover(){
	var mouse = d3.mouse(container.node());
	var hover_circle = container
						.append('circle')
						.attr('id', 'hover_circle')
						.attr("transform", "translate(" + mouse[0] + "," + mouse[1] + ")")
						.attr('r', radius)
						.attr('class', 'dot');
	
}

function remove_hover(){
	d3.select('#hover_circle').remove();
}

function update_hover(){
	var mouse = d3.mouse(container.node());
	var x = d3.event.x;
	var y = d3.event.y;
	d3.select('#hover_circle').transition().duration(.00001).attr("transform", "translate(" + x + "," + y + ")");
}

function draw_line(){
	var mouse = d3.mouse(container.node());
	var live_line;
	if(tab_container.length==1 && (d3.select('#live_line').empty()) && edit_mode){
		live_line = container.append('line')
						.attr('id', 'live_line');
	}
	
	if(!d3.select('#live_line').empty() && edit_mode){
		var x1 = tab_container[tab_container.length-1].cx;
		var y1 = tab_container[tab_container.length-1].cy;
		var x2 = mouse[0];
		var y2 = mouse[1];
		live_line = d3.select('#live_line')
								.attr('x1', x1)
								.attr('y1', y1)
								.attr('x2', x2)
								.attr('y2', y2)
								.attr('stroke-width', 2)
								.attr('stroke', '#DB2780');
	}
	
	if(!edit_mode){
		d3.select('#live_line').remove();
	}
	
}

function reveal_sidebar(){
	if(!$('sidebar').hasClass('reveal')){
		$('sidebar').addClass('reveal');
		$('#wrapper').css('width', $('#wrapper').width()-300);
	}
}

function hide_sidebar(){
	if($('sidebar').hasClass('reveal')){
		$('sidebar').removeClass('reveal');
		$('#wrapper').css('width', '100%');
	}
}



/*
	0 = first file drop
	1 = upload an iteration
	2 = upload a new file
	
*/ 
function handle_file_drop(file, file_code){
	file.path = file.path.substring(file.path.indexOf("/") + 1);
	var image_url = file.path;
	var image = new Image();
	image.onload = function(){
		edit_mode = true;
		
		var im_height = this.height;
		var im_width = this.width;
		var interface_height, interface_width;
		
		if (im_width > max_width){
			interface_width = max_width;
			interface_height = (max_width/im_width)*im_height;
		}else{
			interface_width = im_width;
			interface_height = im_height;
		}		
		var background;
		if(file_code == 1){
			d3.selectAll('image').remove();
			edit_mode = false;
			background = container.insert('image', 'line')
				.attr('xlink:href', image.src)
				.attr('height', interface_height)
				.attr('width', interface_width)
				.style('display','none');
		}else if(file_code == 2){
			d3.selectAll('svg').remove();
		}
		
		if(file_code == 0 || file_code == 2){
			container = d3.select('#interface_wrapper').append('svg')
										.attr('height', interface_height)
										.attr('width', interface_width)
										.attr('id', 'interface')
										.on("click", click)
										.on('mousemove', draw_line);
			
			background = container.append('image')
				.attr('xlink:href', image.src)
				.attr('height', interface_height)
				.attr('width', interface_width)
				.style('display','none');
		}
		

		
		$('image').fadeIn();
		
		if(file_code == 0){
			$('#demo').append('<video id="video" width="640" loop><source src="/imgs/intro.mp4" type="video/mp4" /></video>');
			$('#demo').delay(1000).fadeIn(400, function(){
				$('#video').get(0).play()
			});
		}
		
		tooltip = d3.select("#interface_wrapper").append("div")   
		    .attr("id", "task_master")               
		    .style("opacity", 0)
		    .html(
		    	'<div class="arrow_box">'+
		    		'<div id="task_head">'+
		    			'<h1>MAKE TASK</h1>'+
		    			'<div id="task_can"></div>'+
		    		'</div>'+
		    		'<div id="task_input"><input type="text" name="task_name"></input></div>'+
		    		'<div id="task_options">'+
			    		'<div id="check" onclick="check_response();" class="task_option"></div>'+
		    			'<div id="x" onclick="x_response();" class="task_option"></div>'+
		    		'</div>'+
		    	'</div>');
		    	

		$('#interface_wrapper').height(interface_height).width(interface_width);
		
		$('#upload').hide();
		
			/* For the drop shadow filter... */
		  var defs = container.append("defs");
		
		  var filter = defs.append("filter")
		      .attr("id", "dropshadow")
		      .attr('transform', 'translate('+'')
		      .attr('width', '200%')
		      .attr('height', '200%')
		      .attr('x', "-25%")
		      .attr('y', "-25%");
		
		  filter.append("feGaussianBlur")
		      .attr("in", "SourceAlpha")
		      .attr("stdDeviation", 2)
		      .attr("result", "blur");
		  filter.append("feOffset")
		      .attr("in", "blur")
		      .attr("dx", 0)
		      .attr("dy", 0)
		      .attr("result", "offsetBlur");
		
		  var feMerge = filter.append("feMerge");
		
		  feMerge.append("feMergeNode")
		      .attr("in", "offsetBlur")
		  feMerge.append("feMergeNode")
		      .attr("in", "SourceGraphic");								
										
	}
	image.src = image_url;
}

$(document).ready(function(){
	$(document).keyup(function(e) {
	     if (e.keyCode == 27) { // escape key maps to keycode `27`
	        edit_mode = false;
	    }
	});
	var header_offset = $('header h1').offset().top+50;
	var max_offset = $('#interface_wrapper').offset().top-header_offset;

	
	
	$('#canvas').scroll(function(){
		var offset = $('#interface_wrapper').offset().top-header_offset;
		
		if(offset>0){
			$('#header_wrapper').css('opacity', offset/max_offset);
		}else if (offset<0){
			$('#header_wrapper').css('opacity', 0);
		}
	});
	$('#continue').click(function(){
		$('#demo').fadeOut();
		$('#fresh_upload').css('opacity', 1);
	});
	
	$('#sidebar_upload').click(function(){
		$('#reupload').fadeIn();
	});
	
	$('.sortable').sortable();
});
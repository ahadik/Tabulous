export default class Editor{
	constructor(radius, d3){
		this.container;
		this.radius = radius;
		this.edit_mode = true;
		this.bottom_padding = 40;
		this.top_padding = 160;
		this.max_width = 1000;
		this.tab_container = [];
		this.tooltip;
		this.d3 = d3;

		this.dragmove = (d) => {
			d3.mouse(this.container.node());
			let x = d3.event.x;
			let y = d3.event.y;
			let circle = d3.select(this).select('circle').attr("transform", "translate(" + x + "," + y + ")");
			let polygon = d3.select(this).select('polygon').attr("transform", "translate(" + (x-20) + "," + (y-20) + ")");
			d3.select(this).select('text').attr("transform", "translate(" + (x-(radius/2)) + "," + (y+(radius/2)) + ")");

			let g;
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

		// Define drag beavior
		this.drag = d3.behavior.drag()
	    	.on("drag", this.dragmove);

	}


	//create a circle object and push it onto the list of marked tabs
	generate_circle(point){
		var entry = {'index':this.tab_container.length+1, 'cx' : point[0], 'cy' : point[1], 'radius' : this.radius, 'color': 'green'};
		this.tab_container.push(entry);
		return entry;
	}

	//close the tooltip with an x
	//!!REFACTOR
	x_response(){
		this.tooltip.transition().duration(200).style("opacity", 0).each('end', function(){
			document.querySelector('input[name="task_name"]').value = '';
		});
	}

	//handle confirmation on tooltip
	//!!REFACTOR
	check_response(){
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
		
		task_circle.select('circle');
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
		
		this.tooltip.transition().duration(200).style("opacity", 0).each('end', function(){
			$('input[name="task_name"]').val('');
		});
		
		this.reveal_sidebar();
	}

	click(){
		// Ignore the click event if it was suppressed or edit mode is disabled
		let d3 = this.d3;
		if (d3.event.defaultPrevented || !this.edit_mode) return;
		var container = this.container;
		var mouse = d3.mouse(container.node());
		var entry = this.generate_circle(mouse);
		var prev_circle = d3.selectAll('.circle').last();
		var radius = this.radius;
		// Append a new point
		var tooltip = this.tooltip;
		var circle_g = container.append('g').attr('class', 'circle').style("cursor", "pointer").call(this.drag);
		circle_g.append("circle")
			.attr("transform", "translate(" + mouse[0] + "," + mouse[1] + ")")
			.attr("r", this.radius)
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
				tooltip.style("left", (mouse[0]-125) + "px")     
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
		circle_g.append('text')
			.attr("transform", "translate(" + (mouse[0]-(offset)) + "," + (mouse[1]+(5)) + ")")
			.attr('class', 'circle_label')
			.style('fill', 'white')
			.style('font-weight', 500)
			.text(entry.index)
			.attr("pointer-events", "none");
		
		//bind the circle's data to this newly created element
		
		if(!d3.select('#live_line').empty()){
			var live_line = d3.select('#live_line');
			
			var connector = this.container.insert('line', ':nth-child(2)')
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

	create_hover(){
		var mouse = d3.mouse(container.node());
		container
			.append('circle')
			.attr('id', 'hover_circle')
			.attr("transform", "translate(" + mouse[0] + "," + mouse[1] + ")")
			.attr('r', radius)
			.attr('class', 'dot');
		
	}

	remove_hover(){
		d3.select('#hover_circle').remove();
	}

	update_hover(){
		d3.mouse(container.node());
		var x = d3.event.x;
		var y = d3.event.y;
		d3.select('#hover_circle').transition().duration(.00001).attr("transform", "translate(" + x + "," + y + ")");
	}

	draw_line(){
		var mouse = d3.mouse(this.container.node());
		var live_line;
		if(this.tab_container.length==1 && (d3.select('#live_line').empty()) && this.edit_mode){
			live_line = this.container.append('line')
							.attr('id', 'live_line');
		}
		
		if(!d3.select('#live_line').empty() && this.edit_mode){
			var x1 = this.tab_container[this.tab_container.length-1].cx;
			var y1 = this.tab_container[this.tab_container.length-1].cy;
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
		
		if(!this.edit_mode){
			d3.select('#live_line').remove();
		}
		
	}

	reveal_sidebar(){
		if(!$('sidebar').hasClass('reveal')){
			$('sidebar').addClass('reveal');
			$('#wrapper').css('width', $('#wrapper').width()-300);
		}
	}

	hide_sidebar(){
		if($('sidebar').hasClass('reveal')){
			$('sidebar').removeClass('reveal');
			$('#wrapper').css('width', '100%');
		}
	}

	update_image(editor, image){
		let {interface_height : interface_height, interface_width : interface_width} = this.get_interface_dims(editor, image);
		d3.selectAll('image').remove();
		editor.edit_mode = false;
		editor.container.insert('image', 'line')
			.attr('xlink:href', image.src)
			.attr('height', interface_height)
			.attr('width', interface_width)
			.style('display','none');
		$('#interface_wrapper').height(interface_height).width(interface_width);
	}

	reset_image(editor,image, click){
		let svg = d3.selectAll('svg#interface');
		if(svg){
			svg.remove();
		}
		let {interface_height : interface_height, interface_width : interface_width} = this.get_interface_dims(editor, image);
		editor.container = d3.select('#interface_wrapper').append('svg')
			.attr('height', interface_height)
			.attr('width', interface_width)
			.attr('id', 'interface')
			.on("click", () => {
				click.call(editor);
			});
		
		editor.container.on('mousemove', () => {editor.draw_line.call(editor)});
				
		editor.container.append('image')
			.attr('xlink:href', image.src)
			.attr('height', interface_height)
			.attr('width', interface_width)
			.style('display','none');
		$('#interface_wrapper').height(interface_height).width(interface_width);
	}

	get_interface_dims (editor, image){
		let interface_height, interface_width;
		let im_height = image.height;
		let im_width = image.width;

		if (im_width > editor.max_width){
			interface_width = editor.max_width;
			interface_height = (editor.max_width/im_width)*im_height;
		}else{
			interface_width = im_width;
			interface_height = im_height;
		}
		return {interface_height : interface_height, interface_width : interface_width}
	}

	hide_blank_upload(){
		document.querySelector('.canvas__first-upload').classList.add('canvas__first-upload--hidden');

	}

	show_intro_video(){

		let demo_modal = document.querySelector('.new-user .demo-modal');
		if(demo_modal){
			demo_modal.classList.remove('demo-modal--hide');
			document.querySelector('.demo-modal .video').play();
			document.querySelector('.demo-modal__continue').addEventListener('click', () => {
				demo_modal.classList.add('demo-modal--hide');
				document.querySelector('.new-user').classList.remove('new-user');
			});
		}
	}

	create_tooltip(editor){
		editor.tooltip = d3.select("#interface_wrapper").append("div")   
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
			    		'<div class="task-master--check task-master--option"></div>'+
		    			'<div class="task-master--x task-master--option"></div>'+
		    		'</div>'+
		    	'</div>'
		    );

		editor.tooltip.select('.task-master--check').node().addEventListener('click', () => {
			editor.check_response.call(editor);
		});
		editor.tooltip.select('.task-master--x').node().addEventListener('click', () => {
			editor.x_response.call(editor);
		});
	}

	/*
		0 = first file drop
		1 = upload an iteration
		2 = upload a new file
		
	*/ 
	handle_file_drop(file, file_code){
		file.path = file.path.substring(file.path.indexOf("/") + 1);
		let image_url = file.path;
		let image = new Image();
		//let container = this.container;
		let click = this.click;
		let editor = this;
		image.onload = function(){
			editor.edit_mode = true;
			
			if(file_code == 0){
				editor.reset_image(editor, image, click);
				editor.show_intro_video();
				editor.hide_blank_upload();
			}
			if(file_code == 1){
				editor.update_image(editor, image)
			}
			
			$('image').fadeIn();
			
			editor.create_tooltip(editor);
			
			document.querySelector('.reupload').classList.add('reupload--hide');
			
			/* For the drop shadow filter... */
			let defs = editor.container.append("defs");

			let filter = defs.append("filter")
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

			let feMerge = filter.append("feMerge");

			feMerge.append("feMergeNode")
				.attr("in", "offsetBlur")
			feMerge.append("feMergeNode")
				.attr("in", "SourceGraphic");								
											
		}
		image.src = image_url;
	}
}
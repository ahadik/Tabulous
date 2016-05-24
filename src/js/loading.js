export default class Loader{
	constructor(width, color, parent){
		this.width = width;
		this.color = color;
		this.parent = parent;
		this.generate();
	}
	generate(){
		this.parent.append('path')
			.attr('d', 'M6.084 27.974c.408.453.841.881 1.3 1.283a15.44 15.44 0 0 0 10.222 3.85c8.56 0 15.5-6.94 15.5-15.5 0-8.561-6.94-15.5-15.5-15.5-8.56 0-15.5 6.939-15.5 15.5')
			.attr('class', 'icon-loading')
			.attr('stroke-width', '3')
			.attr('stroke', '#FFF')
			.attr('fill', 'none')
			.attr('fill-rule', 'evenodd')
	}
}
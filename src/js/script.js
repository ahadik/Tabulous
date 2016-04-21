import Editor from './Editor';
import Uploader from './Uploader';

//Add a .last() method to d3 to get the last item in a selectAll query,
//which would be the most recently added item
d3.selection.prototype.last = function() {
  let last = this.size() - 1;
  return d3.select(this[0][last]);
};

let uploader;
let editor;

window.onload = () => {
	let fileDrop = document.querySelector('.box__input svg');
	editor = new Editor(15, d3);
	uploader = new Uploader(fileDrop, '.box', editor);
	

	$(document).keyup(function(e) {
	     if (e.keyCode == 27) { // escape key maps to keycode `27`
	        editor.edit_mode = false;
	    }
	});
	let header_offset = $('header h1').offset().top+50;
	let max_offset = $('#interface_wrapper').offset().top-header_offset;



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
}
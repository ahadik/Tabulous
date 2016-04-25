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
	let newFileDrops = Array.from(document.querySelectorAll('.new-upload .box__input svg'));
	let refreshFileDrops = Array.from(document.querySelectorAll('.refresh-upload .box__input svg'));
	let enterCanvas = document.querySelector('.login__canvas');
	enterCanvas.addEventListener('click', () => {
		let introPanel = document.querySelector('.body');
		introPanel.classList.remove('intro');
		let headerContent = document.querySelector('.header__content');
		headerContent.classList.add('.header__content--hidden');
	});
	editor = new Editor(15, d3);
	uploader = new Uploader(newFileDrops, refreshFileDrops, '.box', editor);
	

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

	$('#sidebar_upload').click(function(){
		document.querySelector('.reupload').classList.remove('reupload--hide');
	});

	$('.sortable').sortable();
}
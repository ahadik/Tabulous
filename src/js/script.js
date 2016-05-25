import Editor from './Editor';
import Uploader from './Uploader';
import Loader from './Loading';

//Add a .last() method to d3 to get the last item in a selectAll query,
//which would be the most recently added item
d3.selection.prototype.last = function() {
  let last = this.size() - 1;
  return d3.select(this[0][last]);
};

let uploader;
let editor;

window.onload = () => {
	window.addEventListener("dragover",function(e){
		e = e || event;
		e.preventDefault();
	},false);
	window.addEventListener("drop",function(e){
		e = e || event;
		e.preventDefault();
	},false);
	
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

	for(let loaderSVG of [...document.querySelectorAll('svg.uploadDrop .uploadDrop__container')]){
		let loader = new Loader(null, '#fff', d3.select(loaderSVG), ()=>{});
	}

	let reportLoader = new Loader(null,'#1D3649',d3.select('.sidebar__report-gen-loader g'), (loader)=>{
		document.querySelector('#report-gen').addEventListener('click', (e)=>{
			var report_icon = e.target;
			report_icon.classList.add('sidebar__report-gen--hidden');
			loader.show();
			var target = document.querySelector('#interface');
			var wrap = document.createElement('div');
			wrap.appendChild(target.cloneNode(true));
			var svgText = wrap.innerHTML;
			var xhr = new XMLHttpRequest();
			xhr.open('POST', 'convert');
			var svgData = new FormData();
			svgData.append('svg', svgText);
			svgData.append('projectID', 123);

			xhr.responseType = 'blob';

			xhr.onload = function(e) {
				if (this.status == 200) {
					// Note: .response instead of .responseText
					var blob = new Blob([this.response], {type: 'image/pdf'});
					var a = document.createElement("a");
					document.body.appendChild(a);
					a.style = "display: none";
					((blob, fileName) => {
					    var url = window.URL.createObjectURL(blob);
					    a.href = url;
					    a.download = fileName;
					    a.click();
					    window.URL.revokeObjectURL(url);
					    console.log(target);
					    report_icon.classList.remove('sidebar__report-gen--hidden');
						loader.hide();
					})(blob, 'tabulous.pdf');
				}
			};

			xhr.send(svgData);
		});
	});
	

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
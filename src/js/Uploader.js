export default class Uploader{
	constructor(fileDrop, formSelector, editor){
		this.isAdvancedUpload = function() {
			var div = document.createElement('div');
			return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FileReader' in window;
		}();

		this.formSelector = formSelector;
		this.fileDrop = fileDrop;
		this.form = document.querySelector(formSelector);
		this.input = this.form.querySelector('input[type="file"]');
		this.droppedFiles=false;
		this.editor = editor;
		this.setFormSubmission();
		this.setFormEventListeners();
	}

	setFormSubmission(){
		this.form.addEventListener('submit', (e) => {
			if ('is-uploading' in this.form.classList) return false;
			this.form.classList.add('is-uploading');
			this.form.classList.remove('is-error');

			if(this.isAdvancedUpload){
				e.preventDefault();
				let form = document.querySelector(this.formSelector);
				let ajaxData = new FormData(this.form);

				if (this.droppedFiles) {
					Array.prototype.forEach.call(this.droppedFiles, (file) => {
						ajaxData.append( this.input.getAttribute('name'), file );
					});
				}

				let ajax = new XMLHttpRequest();
				ajax.open( form.getAttribute( 'method' ), form.getAttribute( 'action' ), true );
				ajax.setRequestHeader ("ENCTYPE", "multipart/form-data");

				let editor = this.editor;
				
				ajax.onload = () => {
					form.classList.remove( 'is-uploading' );
					if( ajax.status >= 200 && ajax.status < 400 ){
						var data = JSON.parse( ajax.responseText );
						editor.handle_file_drop(data, 0);
						form.classList.add( data.success == true ? 'is-success' : 'is-error' );
						if( !data.success ) errorMsg.textContent = data.error;
					}else{
						alert( 'Error. Please, contact the webmaster!' );	
					}
				}
				ajax.onerror = () => {
					form.classList.remove( 'is-uploading' );
					alert( 'Error. Please, try again!' );
				};
				ajax.send( ajaxData );
			}
		});
	}

	setFormEventListeners(){
		if(this.isAdvancedUpload){
			this.form.classList.add('has-advanced-upload');

			['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].map((event) => {
				this.form.addEventListener(event, (e) => {
				e.preventDefault();
				e.stopPropagation();
				});
			});

			['dragover', 'dragenter'].map((event) => {
				this.form.addEventListener(event, () => {
				this.fileDrop.classList.add('is-dragover');
				});
			});

			['dragleave', 'dragend', 'drop'].map((event) => {
				this.form.addEventListener(event, () => {
				this.fileDrop.classList.remove('is-dragover');
				});
			});

			this.form.addEventListener('drop', (e)=>{
				this.droppedFiles = e.dataTransfer.files;
				var event = document.createEvent( 'HTMLEvents' );
				event.initEvent( 'submit', true, false );
				this.form.dispatchEvent( event );
			});
		}else{
			//legacy browser support here
		}
	}
}
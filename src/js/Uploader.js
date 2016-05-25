export default class Uploader{
	constructor(newFileDrops, refreshFileDrops, formSelector, editor){
		this.isAdvancedUpload = function() {
			var div = document.createElement('div');
			return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FileReader' in window;
		}();

		this.formSelector = formSelector;
		this.newFileDrops = newFileDrops;
		this.refreshFileDrops = refreshFileDrops;
		this.newUploadForms = Array.from(document.querySelectorAll(formSelector+'.new-upload'));
		this.refreshUploadForms = Array.from(document.querySelectorAll(formSelector+'.refresh-upload'));
		
		//generate arrays of objects which each contain a form and its associated input field
		
		this.newUploadDrops = this.newUploadForms.map((form) => {
			return {form : form, input : form.querySelector('input[type="file"]')};
		});

		this.refreshUploadDrops = this.refreshUploadForms.map((form) => {
			return {form : form, input : form.querySelector('input[type="file"]')};
		});

		this.droppedFiles=false;
		this.editor = editor;

		for(let form of this.newUploadDrops){
			this.setFormSubmission(form, true);
			this.setFormEventListeners(form, true);
		}

		for(let form of this.refreshUploadDrops){
			this.setFormSubmission(form, false);
			this.setFormEventListeners(form, false);
		}
	}

	setFormSubmission(formElems, isNew){
		formElems.form.addEventListener('submit', (e) => {
			if ('is-uploading' in formElems.form.classList) return false;
			formElems.form.querySelector('svg').classList.add('is-loading');
			formElems.form.classList.remove('is-error');

			if(this.isAdvancedUpload){
				e.preventDefault();
				let ajaxData = new FormData(formElems.form);

				if (this.droppedFiles) {
					Array.prototype.forEach.call(this.droppedFiles, (file) => {
						ajaxData.append( formElems.input.getAttribute('name'), file );
					});
				}

				let ajax = new XMLHttpRequest();
				ajax.open( formElems.form.getAttribute( 'method' ), formElems.form.getAttribute( 'action' ), true );
				ajax.setRequestHeader ("ENCTYPE", "multipart/form-data");

				let editor = this.editor;
				
				ajax.onload = () => {
					if( ajax.status >= 200 && ajax.status < 400 ){
						var data = JSON.parse( ajax.responseText );
						if(isNew){
							editor.handle_file_drop(formElems, data, 0);
						}else{
							editor.handle_file_drop(formElems, data, 1);							
						}
						formElems.form.classList.add( data.success === true ? 'is-success' : 'is-error' );
						if( !data.success ) errorMsg.textContent = data.error;
						this.droppedFiles = false;
					}else{
						alert( 'Error. Please, contact the webmaster!' );	
					}
				}
				ajax.onerror = () => {
					formElems.form.classList.remove( 'is-uploading' );
					alert( 'Error. Please, try again!' );
				};
				ajax.send( ajaxData );
			}
		});
	}

	setFormEventListeners(formElems, isNew){
		if(this.isAdvancedUpload){
			formElems.form.classList.add('has-advanced-upload');

			['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].map((event) => {
				formElems.form.addEventListener(event, (e) => {
					e.preventDefault();
					e.stopPropagation();
				});
			});

			['dragover', 'dragenter'].map((event) => {
				formElems.form.addEventListener(event, () => {
					formElems.form.querySelector('svg').classList.add('is-dragover');
				});
			});

			['dragleave', 'dragend', 'drop'].map((event) => {
				formElems.form.addEventListener(event, () => {
					formElems.form.querySelector('svg').classList.remove('is-dragover');
				});
			});

			formElems.form.addEventListener('drop', (e)=>{
				this.droppedFiles = e.dataTransfer.files;
				var event = document.createEvent( 'HTMLEvents' );
				event.initEvent( 'submit', true, false );
				formElems.form.dispatchEvent( event );
			});
		}else{
			//legacy browser support here
		}
	}
}
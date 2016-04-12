var isAdvancedUpload = function() {
  var div = document.createElement('div');
  return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FileReader' in window;
}();

window.onload = () => {
  var fileDrop = document.querySelector('.box__input svg');
  var form = document.querySelector('.box');
  var input    = form.querySelector('input[type="file"]');
  var droppedFiles=false;

  form.addEventListener('submit', (e) => {
    if ('is-uploading' in form.classList) return false;
    form.classList.add('is-uploading');
    form.classList.remove('is-error');

    if(isAdvancedUpload){
      e.preventDefault();
      form = document.querySelector('.box');
      var ajaxData = new FormData(form);

      if (droppedFiles) {
        Array.prototype.forEach.call( droppedFiles, function( file )
        {
          ajaxData.append( input.getAttribute( 'name' ), file );
        });
      }

      var ajax = new XMLHttpRequest();
      ajax.open( form.getAttribute( 'method' ), form.getAttribute( 'action' ), true );
      ajax.setRequestHeader ("ENCTYPE", "multipart/form-data");
      
      ajax.onload = function()
      {
        form.classList.remove( 'is-uploading' );
        if( ajax.status >= 200 && ajax.status < 400 )
        {
          var data = JSON.parse( ajax.responseText );
          console.log(data);
          form.classList.add( data.success == true ? 'is-success' : 'is-error' );
          if( !data.success ) errorMsg.textContent = data.error;
        }
        else alert( 'Error. Please, contact the webmaster!' );
      };
      ajax.onerror = function()
      {
        form.classList.remove( 'is-uploading' );
        alert( 'Error. Please, try again!' );
      };

      ajax.send( ajaxData );
    }
  });

  if (isAdvancedUpload) {
    form.classList.add('has-advanced-upload');
    ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].map((event) => {
      form.addEventListener(event, (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
    });

    ['dragover', 'dragenter'].map((event) => {
      form.addEventListener(event, () => {
        fileDrop.classList.add('is-dragover');
      });
    });

    ['dragleave', 'dragend', 'drop'].map((event) => {
      form.addEventListener(event, () => {
        fileDrop.classList.remove('is-dragover');
      });
    });

    form.addEventListener('drop', (e)=>{
      droppedFiles = e.dataTransfer.files;
      var event = document.createEvent( 'HTMLEvents' );
      event.initEvent( 'submit', true, false );
      form.dispatchEvent( event );
    });


  }else{
    //legacy browser upload here
  }


}
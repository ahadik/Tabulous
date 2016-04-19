import Editor from './Editor';
import Uploader from './Uploader';

window.onload = () => {
  let fileDrop = document.querySelector('.box__input svg');
  var uploader = new Uploader(fileDrop, '.box');
  var editor = new Editor();
}
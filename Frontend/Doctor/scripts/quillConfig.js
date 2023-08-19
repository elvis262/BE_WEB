import Quill from 'quill'
import "quill/dist/quill.snow.css"


var toolbarOptions = [
    ['bold', 'italic'],        // toggled buttons
    ['blockquote'],

    [{ 'list': 'ordered'}, { 'list': 'bullet' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/
  
  
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme  
    [{ 'align': [] }],
  
    ['clean']                                    // remove formatting button
  ];
export function quillConfig(readOnly=false){
    var options = {
        modules: {
            toolbar: toolbarOptions
        },
        placeholder: 'Diagnostique........',
        readOnly: readOnly,
        theme: 'snow'
    };
    return new Quill('#editor',options)
}

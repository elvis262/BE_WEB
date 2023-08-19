import {quillConfig} from './quillConfig.js'
const modal = document.querySelector('#modal')

export function showDivWithOpacityAnimation(target,readOnly=false,editorChild=JSON.stringify([])) {
    editorChild = JSON.parse(editorChild)
    modal.style.display = 'block';
    requestAnimationFrame(function () {
        modal.style.opacity = '1';
        modal.appendChild(target)
        if(target.querySelector('.ql-toolbar.ql-snow') === null && target.querySelector('#editor')){
          editor =  quillConfig(readOnly)
        }
        if(editorChild.length !== 0){
            const editor = document.querySelector('.ql-editor')
            editor.setAttribute('data-placeholder','Diagnostique :')
            editorChild.forEach(child =>{
                const p = document.createElement('p')
                p.innerHTML = child
                editor.appendChild(p)
            })
        }

        try {
            target.style.opacity = '1'
            target.style.pointerEvents = 'auto'
        } catch (error) {
          console.log(error)
        }
       
        
    });
}
export function hideDivWithOpacityAnimation() {
    const target = Array.from(modal.children)[0]
    console.log(target)
    setTimeout(function () {
        target.style.opacity = '0'
    }, 30); // Temps correspondant à la durée de transition CSS
    setTimeout(()=>{
        target.remove()
        modal.style.opacity = '0'
    },60)
    setTimeout(()=>{
        modal.style.display = 'none';
    },110)

}


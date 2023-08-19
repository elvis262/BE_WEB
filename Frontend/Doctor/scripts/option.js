export function changeInput(text=true){
    
    const input = document.querySelector('#inputSrch.actif')
    const otherInputContainer = document.querySelector('#searchInArchives')
    if(text && input.type === 'date'){
        document.querySelector("input[type='text']#inputSrch").classList.add('actif')
        if(otherInputContainer.classList.contains('visible')){
            document.querySelector('#searchInArchives').classList.remove('visible')
        }
    }else{
        document.querySelector("input[type='date']#inputSrch").classList.add('actif')
        if(!otherInputContainer.classList.contains('visible')){
            document.querySelector('#searchInArchives').classList.add('visible')
        }
    }
    input.classList.remove('actif') 
}
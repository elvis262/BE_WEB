import {showDivWithOpacityAnimation} from './showModal.js'

const seeMoreTemplate = document.querySelector('#addModal')

const restEnd = (dateString, nombreHeures) => {

    const [datePart, timePart] = dateString.split(' ');
  
    const [day, month, year] = datePart.split('/');
  
    const [hour, minute, second] = timePart.split(':');

    const date = new Date(year, month - 1, day, hour, minute, second);

    date.setHours(date.getHours() + nombreHeures);
  
    return date.toLocaleString('fr-FR');
};
  

export function newConsultation (object,load = false){
    const  consulationTemplate = document.querySelector('#consulationTemplate')
    const mainContainer = document.querySelector('#mainContainer')
    

    const template = document.importNode(consulationTemplate.content, true)

    template.querySelector('#savedPhoto').style.backgroundImage = `url(${object.student.photo})`
    template.querySelector('#name').innerText = object.student.name.length > 15 ? object.student.name.slice(0,12)+'..':object.student.name
    template.querySelector('#school').innerText = object.student.school.libelle
    template.querySelector('#class').innerText = object.student.class.libelle
    template.querySelector('#matricule').innerText = object.student.registration
    template.querySelector('#restStart').innerText = object.date
    template.querySelector('#restEnd').innerText = object.restDuration
    template.querySelector('#date').innerText = restEnd(object.date.toLocaleString('fr-FR'),object.restDuration)

    template.querySelector('#seeMore').addEventListener('click',(e)=>{
        let content = document.importNode(seeMoreTemplate.content, true)
        content = Array.from(content.children)
        content[0].addEventListener('click',(e)=> {e.stopPropagation()})
  
        content[0].querySelector('#profilePhoto').style.backgroundImage = `url(${object.student.photo})`
        content[0].querySelector('#profileName').innerText = object.student.name
        content[0].querySelector('#profileSchool').innerText = object.student.school.libelle
        content[0].querySelector('#profileClass').innerText = object.student.class.libelle

        const checkbox = content[0].querySelector('#rest > input')
        checkbox.checked = object.restDuration === 0 ? false : true
        checkbox.style.pointerEvents = 'none'
        content[0].querySelector('#save').style.display = 'none'
        const number = content[0].querySelector('.number')
        number.classList.add('visible')
        number.style.pointerEvents = 'none'
        number.querySelector('input').value = object.restDuration

        showDivWithOpacityAnimation(content[0], true, object.diagnostic)
    })
    if(load === false){
        const oldValue = JSON.parse(sessionStorage.getItem('consultations'))
        const newValue = oldValue.length !== 0 ?[...oldValue,object]:[template]
        sessionStorage.setItem('consultations',JSON.stringify(newValue))
    }
    mainContainer.prepend(template)
}


import {newConsultation} from './newConsultation.js'
import {hideDivWithOpacityAnimation} from './showModal'
import toastr from 'toastr';


export async function save(socket){
  const date = new Date()  
  const object =  {
      student:{
        name:'',
        registration:'',
        photo:'',
        class:{libelle:''},
        school:{libelle:''}
      },
      diagnostic:JSON.stringify([]),
      restDuration:0,
      date: date.toLocaleString('fr-FR')
    }
  const nothing = document.querySelector('#nothing')
  const studentId = sessionStorage.getItem('studentId')
 
  object.student.name = document.querySelector("#student").value
  object.student.school.libelle = document.querySelector("#school-st").value
  object.student.registration = document.querySelector("#matricule-st").value
  object.student.class.libelle = document.querySelector("#classe-st").value
  object.student.photo =  document.querySelector("#photo-st").style.backgroundImage.split('url(')[1].split(')')[0]
  console.log('étape 1',socket)
  const number = document.querySelector('.number > input').value
  const editorChild = Array.from(document.querySelector('.ql-editor').children).map(child =>{ return child.innerHTML})
  object.diagnostic = JSON.stringify(editorChild)
  object.restDuration = parseInt(number) 
  console.log('étape 2')
  socket.emit('newConsultation',{studentId: studentId,restDuration:parseInt(number), diagnostic: JSON.stringify(editorChild), studentClass: object.student.class.libelle, studentRegistration: object.student.registration})
  socket.on('addSucced',(succed)=>{
    console.log('first',socket)
    if(succed){
      if(nothing.classList.contains('visible')) nothing.classList.remove('visible')
      newConsultation(object)
      document.querySelector('#photo-st').style.backgroundImage = ''
      document.querySelector('#student').value = ''
      document.querySelector('#matricule-st').value = ''
      document.querySelector('#classe-st').value = ''
      document.querySelector('#school-st').value = ''
      document.querySelector('#no-student').classList.add('visible')
      document.querySelector('#add').classList.remove('visible')
      document.querySelector('#reset').classList.remove('visible')
      document.querySelector('#searchStudent').value = ''
      hideDivWithOpacityAnimation()
    }else{
      toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-top-full-width",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
      }
      toastr.error("Une erreur s\'est produite")
      hideDivWithOpacityAnimation() 
    }
 
  })
    
}
export function add(object){
  newConsultation(object,true)
}
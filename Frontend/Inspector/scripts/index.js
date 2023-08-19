import {srchStudent} from './searchStudent'
import toastr from 'toastr';
import 'toastr/build/toastr.css'
import {add, displayClass} from './addSt'
import io from 'socket.io-client'
const socket = io('/')

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

document.addEventListener('DOMContentLoaded',async (e)=>{
    let mainContainerChildren = []
    const modal = document.querySelector('#modal')
    const addTemplate = document.querySelector('#addModal').content
    const confirTemplate = document.querySelector('#disconnectionConfirm')
    const searchStudent = document.querySelector('#searchConsultation')
    const nothing = document.querySelector('#nothing')
    const classSelect = document.querySelector('#my-select')
    const logo = document.querySelector('#logo')
    const disconnect = document.querySelector('#disconnect')
    const mainContainer = document.querySelector('#mainContainer')
    

  fetch('/api/connectedUser',{method:'GET'})
  .then(async (response )=>{ return await response.json()})
  .then(data =>{
    const {name, mail} = data
    console.log(data)


    socket.on('modification',(message)=>{
      console.log(mail,message.inspectorEmail, message.inspectorEmail === mail && (classSelect.value.toLowerCase() === message.class+'' || classSelect.value.toLowerCase() === 'all'))
      if(message.inspectorEmail === mail && (classSelect.value.toLowerCase() ===  message.class+'' || classSelect.value.toLowerCase() === 'all')){
        add(message)
        mainContainerChildren = Array.from(mainContainer.children)
      }
    })
    document.querySelector('#userName').innerText = name
    document.querySelector('#userEmail').innerText = mail   
    
    fetch('/api/classes',{method:'GET'})
    .then(async res => {return res.json()})
    .then(data =>{
        console.log(data)
        const storage = {}
        if(data.classes.classes.length !== 0){
          data.classes.classes.forEach(classe =>{
            const option = document.createElement('option')
            option.value = classe.id
            option.innerText = classe.libelle

            classSelect.appendChild(option)

            storage['cl-'+classe.id] = [...classe.students]
          })
          storage['all'] = [...data.allStudents.students]
          displayClass(data.allStudents.students)           
          sessionStorage.setItem('allStudents',JSON.stringify(storage))
          mainContainerChildren = Array.from(mainContainer.children)
        }else{
          window.location.href('/connexion/inspector')
        }
    })
    .catch(err =>{
      toastr.error('Une erreur s\'est produite. Rédemarrez la page!!!')
      console.log(err)
    })


    classSelect.addEventListener('change',(e)=>{
      const allStudents = JSON.parse(sessionStorage.getItem('allStudents'))
      if(e.target.value === 'all'){
        displayClass(allStudents.all)
      }else{
        displayClass(allStudents['cl-'+e.target.value])
      }
      mainContainerChildren = Array.from(mainContainer.children)
    })
      
    modal.addEventListener('click',(e)=>{
  
          import('./showModal.js')
          .then(({hideDivWithOpacityAnimation})=>{
              const children = Array.from(e.target.children)
              if(children.length !==0) {
                children.forEach(child => child.remove())
              }
              hideDivWithOpacityAnimation()
          })
    })
  
            
    searchStudent.addEventListener('input',(e)=>{     
      const result = srchStudent(e.target.value.trim().toLowerCase())
      console.log(result)
      mainContainerChildren.forEach((child, index) =>{
          if(result.includes(index) === false){
              child.style.display = 'none'
          }else{
              if(child.style.display === 'none') {child.style.display = 'grid'}
          }
          
      })      
    })



    disconnect.querySelector('#discBtn').addEventListener('click',(e)=>{
    e.target.parentElement.classList.remove('actif')
    const confirm = document.importNode(confirTemplate.content, true)
    
    confirm.querySelector('#confirm-button').addEventListener('click',(e)=>{
          fetch('/connexion/disconnect',{method: 'GET'})
          .then(res =>{
            if(res.ok){
              socket.disconnect()
              sessionStorage.removeItem('allStudents')          
              window.location.replace('/connexion/inspector')           
            }
          }).catch(err =>{
              console.log(err)
              toastr.error("Une erreur s'est produite")
          })
      })
      import('./showModal.js')
      .then(async ({showDivWithOpacityAnimation})=>{
        showDivWithOpacityAnimation(confirm)
      })

    })
    logo.addEventListener('mouseover',(e)=>{
      disconnect.classList.add('actif')
    })
    logo.addEventListener('mouseleave',(e)=>{
      setTimeout(()=>{
        disconnect.classList.remove('actif')
      },500)
    })
                    
  })
  .catch((err) =>{
      console.log(err)
  })   
})


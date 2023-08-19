import {searchFunction} from './searchConsultation.js'
import toastr from 'toastr';
import 'toastr/build/toastr.css'
import 'toastr/build/toastr.css'
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
    const modal = document.querySelector('#modal')
    const mainContainer = document.querySelector('#mainContainer')
    let mainContainerChildren = []
    const add = document.querySelector('#add')
    const addTemplate = document.querySelector('#addModal')
    const confirTemplate = document.querySelector('#disconnectionConfirm')
    const searchOption = document.querySelector('#searchOption')
    const searchStudentBtn = document.querySelector('#search')
    const searchNowConsult = document.querySelector("input[type='text']#inputSrch")
    const searchStudentInput = document.querySelector('input#searchStudent')
    const searchACInput = document.querySelector("input[type='date']#inputSrch")
    const searchInArchivesinput = document.querySelector('#searchInArchivesinput')
    const reset = document.querySelector('#reset')
    const nothing = document.querySelector('#nothing')
    const logo = document.querySelector('#logo')
    const disconnect = document.querySelector('#disconnect')
    const optionItem = Array.from(document.querySelectorAll('.optionItem')) 
    
    fetch('/api/connectedUser',{method:'GET'})
    .then(async (response )=>{ return await response.json()})
    .then(data =>{
      const {name, mail} = data
      console.log(data)
      document.querySelector('#userName').innerText = name
      document.querySelector('#userEmail').innerText = mail


        
      fetch('/api/consultations',{method:'GET'})
      .then(async res => {return res.json()})
      .then(consultation =>{
        console.log(consultation)
        sessionStorage.setItem('consultations',JSON.stringify(consultation))
        if(consultation.length !== 0){
          nothing.classList.remove('visible')
          consultation.forEach(object =>{
            import('./save.js')
            .then(({add})=>{
              add(object)
              mainContainerChildren = Array.from(mainContainer.children)
            })
          })
        }       
       
      }).catch(err =>{
        console.log(err)
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
  


      add.addEventListener('click',(e)=>{
      const temp = document.importNode(addTemplate.content, true)
      const tempChild = Array.from(temp.children)

      tempChild[0].addEventListener('click',(e)=>{
          e.stopPropagation()
      })

      tempChild[0].querySelector('#rest > input').addEventListener('change',(event)=>{
          if(event.target.checked){
              tempChild[0].querySelector('#number').classList.add('visible')
          }else{                
              tempChild[0].querySelector('#number').classList.remove('visible')
          }
      })

      tempChild[0].querySelector('#save').addEventListener('click',(e)=>{
          import('./save.js')
          .then(({save})=>{
            save(socket)
            console.log('tape 3')
            mainContainerChildren = Array.from(mainContainer.children)
            sessionStorage.removeItem('studentId')
          }).catch(err =>{
            import('./showModal.js')
            .then(({hideDivWithOpacityAnimation})=>{
              
              hideDivWithOpacityAnimation()
            })
          })
      })
      import('./showModal.js')
      .then(async ({showDivWithOpacityAnimation})=>{
        tempChild[0].querySelector('#profilePhoto').style.backgroundImage = document.querySelector('#photo-st').style.backgroundImage 
        tempChild[0].querySelector('#profileName').innerText = document.querySelector('#student').value 
        tempChild[0].querySelector('#profileClass').innerText = document.querySelector('#classe-st').value 
        tempChild[0].querySelector('#profileSchool').innerText = document.querySelector('#school-st').value
        await showDivWithOpacityAnimation(tempChild[0])
      })
              
      })
      

    optionItem.forEach(option=>{
      option.addEventListener('click',(e)=>{
          console.log('first')
          if(e.target.classList.contains('actif')) return
          const old = e.target.parentElement.querySelector('.optionItem.actif')
          old.classList.remove('actif')
          e.target.classList.add('actif')
          import('./option.js')
          .then(({changeInput})=>{

            const temp = JSON.parse(sessionStorage.getItem('consultations'))
            e.target.getAttribute('option') === '1'?changeInput(true):changeInput(false)
            if(e.target.getAttribute('option') === '1' && mainContainer.getAttribute('consultation') === 'old'){
              
              mainContainerChildren.slice(0,mainContainerChildren.length-1).forEach(child => child.remove())

              if(temp.length ===0 && mainContainerChildren.length !== 1){
                nothing.classList.add('visible')
              }else{
                temp.forEach(object =>{
                  import('./save.js')
                  .then(({add})=>{
                    add(object)
                  })
                })
                mainContainerChildren = Array.from(mainContainer.children)
              }
              mainContainer.setAttribute('consultation','to-day')
            }
            
          })
      })
    })
      

    searchOption.addEventListener('mouseover',(e)=>{
      import('./showSearchOption.js')
      .then(({showSearchOption}) =>{
          showSearchOption(true)                
      })
    })
          
    searchOption.addEventListener('mouseleave',(e)=>{
      import('./showSearchOption.js')
      .then(({showSearchOption}) =>{
          showSearchOption()           
      })
    })
      
  
  searchNowConsult.addEventListener('input',(e)=>{     
      searchFunction(e.target,mainContainerChildren)
    })
  searchInArchivesinput.addEventListener('input',(e)=>{
      searchFunction(e.target,mainContainerChildren)
    })

    searchStudentBtn.addEventListener('click', (e)=>{
      const value = searchStudentInput.value.trim()
      if(value !==''){
        import('./searchStudent.js')
        .then(async ({searchStudent})=>{
          const student = await searchStudent(value.toUpperCase())
          console.log(student)
          if(student){
            sessionStorage.setItem('studentId',student.id)
            document.querySelector('#no-student').classList.remove('visible')
            sessionStorage.setItem('studentId',student.id)
            document.querySelector('#photo-st').style.backgroundImage = `url(${student.photo})`
            document.querySelector('#student').value = student.name
            document.querySelector('#matricule-st').value = student.registration
            document.querySelector('#classe-st').value = student.class.libelle
            document.querySelector('#school-st').value = student.school.libelle
            add.classList.add('visible')
            reset.classList.add('visible')
          }else{
            
            toastr.info('Aucun étudiant ne possède ce matricule')
          
          }
        })
        .catch((err)=>{
          console.log(err)
        })
      }
    })


    searchACInput.addEventListener('change',(e)=>{
      
      const date = new Date(e.target.value)
      console.log(date.toLocaleDateString('fr-FR'))
      fetch(`/api/archives?_date=${date.toLocaleDateString('fr-FR')}`,{method:'GET'})
      .then(async response => {return response.json()})
      .then(data =>{
        console.log(data)
        if(data.length !== 0){
          console.log('between')
              if(mainContainerChildren.length !==1){
                mainContainerChildren.slice(0, mainContainerChildren.length-1).forEach(child => child.remove())
              }
              
              data.forEach(dt =>{
                  import('./save.js')
                  .then(({add})=>{
                      add(dt)
                      mainContainerChildren = Array.from(mainContainer.children)
                  })
              })
          mainContainer.setAttribute('consultation','old')
        }else{
          toastr.info("Aucune consultation à cette date")
        }
      }).catch(err =>{
        console.log(err)
        toastr.error('Une erreur s\'est produite!!')
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
            sessionStorage.removeItem('consultations')
            sessionStorage.removeItem('studentId')
            window.location.replace('/connexion/doctor')            
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
  reset.addEventListener('click',(e)=>{
    document.querySelector('#photo-st').style.backgroundImage = ''
    document.querySelector('#student').value = ''
    document.querySelector('#matricule-st').value = ''
    document.querySelector('#classe-st').value = ''
    document.querySelector('#school-st').value = ''
    document.querySelector('#no-student').classList.add('visible')
    add.classList.remove('visible')
    reset.classList.remove('visible')
    searchStudentInput.value = ''
  })   
  }).catch(err =>{
      console.log(err)
  })   
})


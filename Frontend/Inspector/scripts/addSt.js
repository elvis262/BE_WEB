import toastr from 'toastr';
import 'toastr/build/toastr.css'

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

const mainContainer = document.querySelector('#mainContainer')
const studentRow = document.querySelector('#studentRow').content

const addRow = (student)=>{
  const row = studentRow.cloneNode(true)

  row.querySelector('#studentPhoto').style.backgroundImage = `url(${student.photo})`
  row.querySelector('#name').innerText = student.name
  row.querySelector('#matricule').innerText = student.registration
  row.querySelector('#class').innerText = student.class.libelle
  const jtdTime = row.querySelector('#jdTime')
  jtdTime.innerText = student.justifiedTime
  const noStudent = document.querySelector('#no-student')
  const add = document.querySelector('#add')
  const edit = row.querySelector('#editJtContainer')
  const input = edit.querySelector('#editInput')
  row.querySelector('#studentPhoto').addEventListener('click',(e)=>{
  document.querySelector("#student").value = student.name
  document.querySelector("#matricule-st").value = student.registration
  document.querySelector("#classe-st").value = student.class.libelle
  document.querySelector("#photo-st").style.backgroundImage = `url(${student.photo})`
  add.classList.add('visible')
  noStudent.classList.remove('visible')
 

  })
  add.addEventListener('click',(e)=>{
    document.querySelector("#student").value = ''
    document.querySelector("#matricule-st").value = ''
    document.querySelector("#classe-st").value = ''
    document.querySelector("#photo-st").style.backgroundImage = ''
    e.target.classList.remove('visible')
    noStudent.classList.add('visible')
  })
  row.querySelector('#update').addEventListener('click',(e)=>{
    if(!edit.classList.contains('visible')) {
      edit.classList.add('visible')
    }  
  })
  row.querySelector('#close').addEventListener('click',(e)=>{
    edit.classList.remove('visible')
  })
  row.querySelector('#editJt').addEventListener('click',(e)=>{
    
    const value = input.value
    edit.classList.remove('visible')
    fetch(`/api/studentJustifiedTime?_matricule=${student.registration}&_time=${value}`, {method: 'PUT'})
    .then(response =>{
      if(response.ok){
        jtdTime.innerText = value
        toastr.success('Modification éffectuée')
        input.value = '0'
      }
    })
    .catch(err=>{
      toastr.error('Une erreur s\'est produite lors de la modification')
      input.value = '0'
    })
    console.log(value)
  })
  mainContainer.prepend(row)
}
export  function displayClass(classArray){
  const mainContainerChildren = Array.from(mainContainer.children)

  if(mainContainerChildren.length !== 1){
    mainContainerChildren.slice(0,mainContainerChildren.length-1).forEach(child => child.remove())
  }

  classArray.forEach(child=>{
    try {
      
      addRow(child)
    } catch (error) {
      console.log(error)
    }
  })
  // document.querySelector("#student").value
  // document.querySelector("#school-st").value
  // document.querySelector("#matricule-st").value
  // document.querySelector("#classe-st").value
  // document.querySelector("#photo-st").style.backgroundImage.split('url(')[1].split(')')[0]
}
export function add(student){
  Array.from(mainContainer.children).forEach(child =>{
    if(child.querySelector('#matricule').textContent === student.registration){
      const row = studentRow.cloneNode(true)
      row.querySelector('#studentPhoto').style.backgroundImage =  child.querySelector('#studentPhoto').style.backgroundImage
      row.querySelector('#name').innerText = child.querySelector('#name').textContent
      row.querySelector('#matricule').innerText = child.querySelector('#matricule').textContent
      row.querySelector('#class').innerText = child.querySelector('#class').textContent
      row.querySelector('#jdTime').innerText = parseInt(child.querySelector('#jdTime').textContent) + parseInt(student.restDuration)
      child.remove()
      mainContainer.prepend(row)
      return
    } 
  })
}
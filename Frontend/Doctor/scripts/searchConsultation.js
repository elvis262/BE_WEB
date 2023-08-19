const mainContainer = document.querySelector('#mainContainer');
export function srchConsultation(value) {
  const searchValue = value.toLowerCase();
  let mainContainerChildren = Array.from(mainContainer.children);

  console.log(mainContainerChildren)
  const result = mainContainerChildren.slice(0,mainContainerChildren.length-1).map((child, index) => {
    const name = child.querySelector('#name').innerText.toLowerCase();
    const matricule = child.querySelector('#matricule').innerText.toLowerCase();
    const school = child.querySelector('#school').innerText.toLowerCase();
    const classroom = child.querySelector('#class').innerText.toLowerCase();

    if (name.indexOf(searchValue) !== -1 || matricule.indexOf(searchValue) !== -1 || school.indexOf(searchValue) !== -1 || classroom.indexOf(searchValue) !== -1) {
      return index;
    }
  });

  return result.filter((index) => index !== undefined);
}

export const searchFunction = (target,mainContainerChildren)=>{
  const result = srchConsultation(target.value.trim().toLowerCase())
  mainContainerChildren.forEach((child, index) =>{
      if(result.includes(index) === false){
          child.style.display = 'none'
      }else{
          if(child.style.display === 'none') {child.style.display = 'grid'}
      }
      
  })
}
export function srchStudent(value) {
   const searchValue = value.toLowerCase();
   const mainContainer = document.querySelector('#mainContainer');
   let mainContainerChildren = Array.from(mainContainer.children);
 
   const result = mainContainerChildren.slice(0,mainContainerChildren.length-1).map((child, index) => {
     const name = child.querySelector('#name').innerText.toLowerCase();
     const matricule = child.querySelector('#matricule').innerText.toLowerCase();
 
 
     if (name.indexOf(searchValue) !== -1 || matricule.indexOf(searchValue) !== -1) {
       return index;
     }
   });
 
   return result.filter((index) => index !== undefined);
 }
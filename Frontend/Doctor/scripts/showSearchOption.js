export function showSearchOption(option=false){
  const searchOptionContainer = document.querySelector("#searchOptionContainer")
  option ?searchOptionContainer.classList.add('visible'):
  searchOptionContainer.classList.remove('visible')
}

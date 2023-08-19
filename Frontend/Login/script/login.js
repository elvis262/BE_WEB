document.getElementById('loginForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  // Récupérer les valeurs du formulaire
  const error = document.getElementById('error');
  const h1 = document.querySelector('h1');

  const formData = new FormData(event.target)
  const body = {}
  const temp = [...formData.entries()]
  temp.forEach(item => {
    body[item[0]] = item[1]
  });
  
  const response = await fetch('/doctor/login',{
    method:'POST',
    headers:{
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  console.log(response)
  if(!response.ok && response.status === 401){
    error.innerText="🚨🚨Email ou mot de passe Incorrect🚨🚨"
    h1.classList.add('small')
    error.classList.add('visible')
    setTimeout(()=>{
      h1.classList.remove('small')
      error.classList.remove('visible')
    },3000)
  }else if(!response.ok && response.status !== 401){
    error.innerText="🚨🚨Une erreur s'est produite🚨🚨"
    h1.classList.add('small')
    error.classList.add('visible')
    setTimeout(()=>{
      h1.classList.remove('small')
      error.classList.remove('visible')
    },3000)
  }else if(response.ok){
    window.location.replace('/doctor/dashboard')
  }

  this.reset();
});

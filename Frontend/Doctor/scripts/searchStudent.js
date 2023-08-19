
export const searchStudent = async (value)=>{
   
   const result = await fetch(`/api/consultation/student?_matricule=${value}`,{method:'GET'})
   if(result.ok){
      return result.json()
   }else{
      console.log('erreur ', result)
      return null
   }

}

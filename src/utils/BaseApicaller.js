


const BaseAPIcaller = ()=>{
   

// http://localhost:4000/hrms/
        const BaseRoute="https://hrms-project-backend-gijz.onrender.com/hrms/";


        

 

       const MODULE={
         ROLE:"role",
         USER:"user",
         DEPARTMENT:"department",
         CLIENT:"client",
         PROJECT:"project",
         ADDRESS:"address",
         AUTHENTICATION:"authentication",
         ATTENDENCE:"attendence",
         GATE:"gates"

       }
       
        

       const OPERATIONS={

                SAVE:"savedata",
                UPDATE:"updatedata",
                SEARCH:"search",
                SEARCHBYID:"searchById",
                GETDATA:"getData",
                LOGIN:"login",
                REGISTER:"register"
        }
     
        const geturl = (module,operations,id)=>{
            // console.log(`${BaseRoute}${module}/${operations}`);
            if(module,operations,id){
             
              
              return `${BaseRoute}${module}/${operations}/${id}`
            }
            else{
            return `${BaseRoute}${module}/${operations}`
            }
            
        }

        return{
          MODULE,
          OPERATIONS,
          geturl
        }
        
      
}


export default BaseAPIcaller;

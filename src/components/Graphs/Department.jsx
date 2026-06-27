import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import BaseAPIcaller from '../../utils/BaseApicaller.js';
import { useEffect, useState } from 'react';

const api = BaseAPIcaller();
const url = api.geturl(api.MODULE.DEPARTMENT,api.OPERATIONS.GETDATA)



  const getData = async()=>{
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(url,{
      method:'GET',
      headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
    }) 
    if(response.ok){
      const data = await response.json();
      console.log(data);
      
     const count =  {
        HR : 0,
        Operation : 0,
        Finance :0,
        Insurance : 0,
        IT :0

      }
      // data.map((value)=>{
      //   if(value.deptName == "IT"){
      //     count.IT = count.IT + 1;  
      //   }
        
      // })
      

        data.forEach((value) => {
        if (count[value.deptName] !== undefined) {
          count[value.deptName] = value.users.length
        }})
        
        
        

      
     return count;
     
      
    }
  } catch (error) {
    
  }
}




ChartJS.register(ArcElement, Tooltip, Legend);

 
 export function Department() {
   const [graphData , setGraphData] = useState({   
    HR: 0,
    Operation: 0,
    IT: 0,
    Finance: 0,
    Insurance: 0,})


      useEffect(()=>{
        async function fetchDepartmentData(){
            const count = await getData();
            // console.log(count);
            
           await setGraphData(count)
           
        }
        fetchDepartmentData();
        
      },[])



  const data = {
      
  labels: ['HR', 'IT', 'Finance', 'Operation', 'Insurance'],
  datasets: [
    {
      label: 'Employee Of Department',
      // data: [1, 19, 13, 5, 2, 2],
      data :[
        graphData.HR,
        graphData.IT,
        graphData.Finance,
        graphData.Operation,
        graphData.Insurance
      ],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
       
      ],
      borderWidth: 1,
    },
  ],
};
  return <Doughnut data={data} />;
}


 
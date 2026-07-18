import React, { useEffect, useState } from 'react';
import BaseAPIcaller from '../utils/BaseApicaller.js';
import handleApiResponse from '../utils/BaseApiResponse.js';
import { jwtDecode } from 'jwt-decode';


const api = BaseAPIcaller();
const url = api.geturl(api.MODULE.ATTENDENCE, api.OPERATIONS.SAVE)

const AttendanceButton = () => {
  // Track whether the employee is on duty or off duty
  const [isOnDuty, setIsOnDuty] = useState(false);
  const [Location , setLocation] = useState({})
  // Track the success message shown to the user
  const [statusMessage, setStatusMessage] = useState('');

  const handleToggleDuty = () => {

   

    const getLocation = (() => {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((position) => {
  
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude

          })
        }, (error) => {
          reject(error)

        }

        )
      })

    })




      async function fetchLocation() {
      try {
        const location = await getLocation()
        // console.log(location.latitude , location.longitude);
        
       
        // console.log(location);
        
        // if(location){
        //     setLocation(location)
        // }
       
      const now = new Date()
   
      
      const formatted = now.toISOString()
      console.log(formatted  , typeof(formatted));  /*'2026-07-18T09:00:13.157'*/
      
    
      

        const token = localStorage.getItem('token');
        const decoded = jwtDecode(token)
        const _id = decoded._id
        
        const response = await fetch(url,{
          method  : 'POST',
           headers:{
           'Content-Type':'application/json',
           ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
          body :JSON.stringify({location , formatted , _id})
        })
       
        const data = await handleApiResponse(response)
       console.log(data.success);

       if(data.success){
        setIsOnDuty(true);
        setStatusMessage('Your duty has started successfully');
       }else{
        alert(data.message);
        if(data.message === 'Attendance already marked for today'){
          setIsOnDuty(true);
          setStatusMessage('Attendance is already marked for today');
        }
       }
      } catch (error) {
        console.log(error);
         if(error){
          alert('Enable your location');
         }
      }
    }
   fetchLocation();
  };

  useEffect(() => {

    const checkAttendence = async()=>{
    try {
       const token = localStorage.getItem('token');
       if(!token) return;

         
        // https://hrms-project-backend-gijz.onrender.com/hrms/attendence/check-attendence
        // http://localhost:4000/hrms/attendence/check-attendence

      const res = await fetch('https://hrms-project-backend-gijz.onrender.com/hrms/attendence/check-attendence',{
        method :'GET',    headers:{
           'Content-Type':'application/json',
           ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      })
      const response = await res.json()
      
      
      if(response.marked){
          setIsOnDuty(true)
          setStatusMessage('Attendance is already marked for today')
          
      }
      
    } catch (error) {
      console.log(error.message);
      
    }
}

    checkAttendence()

}, []);



  
  
    
  

  const buttonLabel = isOnDuty ? 'Attendence Pending' : 'OFF DUTY';
  const buttonColor = isOnDuty ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700';

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 w-full min-h-200px flex flex-col items-center justify-center">
      <h2 className="text-sm font-semibold text-gray-500 mb-6 pb-3">Attendance Control</h2>
       
      <button
        type="button"
        onClick={handleToggleDuty}
        className={`w-full max-w-sm rounded-xl px-6 py-4 mb-4 text-white text-basefont-semibold transition duration-200 ease-in-out ${buttonColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300`}
        disabled ={isOnDuty ? true : false}
     >
        {buttonLabel}
      </button>

      <p className="mt-5 text-sm text-gray-600">Current status: <span className="font-medium text-gray-800">{buttonLabel}</span></p>
      <p className="mt-3 text-sm text-indigo-600">{statusMessage}</p>
    </div>
  );
}
export default AttendanceButton;

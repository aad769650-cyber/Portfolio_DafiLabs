"use client"
import React from 'react'
import {  useRouter } from "next/navigation";

const ProtectedRoute = ({children}) => {
const navigate=useRouter()
    const isAuth=JSON.parse(localStorage.getItem("isAuthenticate"));


console.log(isAuth,"inside");

if(isAuth){
    return children
}else{
    console.log("navigating...");
    
    return navigate.push("/adminLogin")
}

}

export default ProtectedRoute
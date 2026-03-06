"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Signup() {

const [email,setEmail] = useState("")
const [password,setPassword] = useState("")

async function signup(){

const { error } = await supabase.auth.signUp({
email: email,
password: password
})

if(error){
alert(error.message)
}else{
alert("Account created")
}

}

return(

<main className="min-h-screen flex items-center justify-center bg-black text-white">

<div className="bg-gray-900 p-8 rounded-xl w-[350px]">

<h1 className="text-2xl mb-6">Signup</h1>

<input
type="email"
placeholder="Email"
className="w-full mb-3 p-3 bg-gray-800 rounded"
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="password"
placeholder="Password"
className="w-full mb-3 p-3 bg-gray-800 rounded"
onChange={(e)=>setPassword(e.target.value)}
/>

<button
onClick={signup}
className="w-full bg-purple-600 py-3 rounded"
>
Create Account
</button>

</div>

</main>

)

}
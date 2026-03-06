"use client"

import { useEffect,useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Profile(){

const [watchlist,setWatchlist] = useState([])

useEffect(()=>{

const { data, error } = await supabase
  .from("watchlist")
  .select("*")
  .eq("user_id", user.id)

if (error) {
  console.log(error)
  setWatchlist([])
} else {
  setWatchlist(data ?? [])
}

load()

},[])

return(

<div className="p-10">

<h1 className="text-3xl mb-6">My Watchlist</h1>

<div className="grid grid-cols-2 md:grid-cols-6 gap-6">

{watchlist.map((a:any)=>(
<img
key={a.id}
src={a.image}
className="rounded"
/>
))}

</div>

</div>

)

}
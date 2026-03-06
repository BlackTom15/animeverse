"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import ThemeToggle from "@/components/theme-toggle"
import { LogIn, UserPlus, Heart } from "lucide-react"

export default function Home() {

const [anime,setAnime] = useState<any[]>([])
const [trending,setTrending] = useState<any[]>([])
const [search,setSearch] = useState("")
const [results,setResults] = useState<any[]>([])
const [trailer,setTrailer] = useState("")
const [watchlist,setWatchlist] = useState<number[]>([])
const [heroIndex,setHeroIndex] = useState(0)

useEffect(()=>{

async function load(){

try{

const pages=[1,2,3,4,5]

const res = await Promise.all(
pages.map(p =>
fetch(`https://api.jikan.moe/v4/anime?page=${p}`)
.then(r=>r.json())
)
)

const all = res.flatMap(r=>r?.data || [])

const top = await fetch("https://api.jikan.moe/v4/top/anime?limit=10")
const topData = await top.json()

setAnime(all.filter(Boolean))
setTrending(topData?.data || [])

}catch(e){
console.log(e)
}

}

load()

},[])

useEffect(()=>{

if(!search){
setResults([])
return
}

async function searchAnime(){

try{

const res = await fetch(`https://api.jikan.moe/v4/anime?q=${search}`)
const data = await res.json()

setResults(data?.data || [])

}catch(e){
console.log(e)
}

}

const delay=setTimeout(searchAnime,400)
return ()=>clearTimeout(delay)

},[search])

useEffect(()=>{

if(trending.length===0)return

const interval=setInterval(()=>{
setHeroIndex(i=>(i+1)%trending.length)
},4000)

return ()=>clearInterval(interval)

},[trending])

function toggleWatch(id:number){

if(watchlist.includes(id)){
setWatchlist(watchlist.filter(a=>a!==id))
}else{
setWatchlist([...watchlist,id])
}

}

const hero = trending[heroIndex]

const list = search ? results : anime

return(

<main className="bg-black text-white min-h-screen">

{/* NAVBAR */}

<div className="sticky top-0 z-50 flex justify-between items-center px-6 py-4 backdrop-blur-lg bg-black/70 border-b border-gray-800">

<h1 className="text-xl md:text-2xl font-bold text-purple-400">
AnimeVerse
</h1>

<div className="flex items-center gap-3">

<ThemeToggle/>

<Link href="/login">
<button className="flex items-center gap-1 px-3 py-2 bg-gray-800 rounded">
<LogIn size={16}/> Login
</button>
</Link>

<Link href="/signup">
<button className="flex items-center gap-1 px-3 py-2 bg-purple-600 rounded">
<UserPlus size={16}/> Sign Up
</button>
</Link>

</div>

</div>

{/* HERO */}

{hero && (

<div className="relative h-[300px] md:h-[420px] flex items-end p-6 overflow-hidden">

<img
src={hero?.images?.jpg?.large_image_url}
className="absolute inset-0 w-full h-full object-cover opacity-40"
/>

<div className="relative z-10 max-w-xl">

<h1 className="text-3xl md:text-4xl font-bold mb-3">
{hero?.title}
</h1>

<p className="text-gray-300 mb-4 text-sm md:text-base">
{hero?.synopsis?.slice(0,140)}...
</p>

<div className="flex gap-3">

<Link href={`/anime/${hero?.mal_id}`}>
<button className="bg-purple-600 px-5 py-2 rounded">
View Details
</button>
</Link>

<button
onClick={()=>setTrailer(hero?.trailer?.embed_url||"")}
className="bg-gray-800 px-5 py-2 rounded"
>
▶ Trailer
</button>

</div>

</div>

</div>

)}

<div className="p-6">

{/* SEARCH */}

<input
type="text"
placeholder="Search anime..."
className="mb-10 p-4 w-full bg-gray-900 rounded-xl border border-gray-700"
value={search}
onChange={e=>setSearch(e.target.value)}
/>

{/* TRENDING */}

<h2 className="text-2xl font-bold mb-4">
🔥 Trending Anime
</h2>

<div className="flex gap-4 overflow-x-auto pb-6">

{trending?.map(a=>{

if(!a) return null

return(

<div key={a?.mal_id} className="min-w-[160px]">

<Link href={`/anime/${a?.mal_id}`}>
<img
src={a?.images?.jpg?.image_url}
className="rounded-lg hover:scale-105 transition"
/>
</Link>

<p className="text-sm mt-1">{a?.title}</p>

</div>

)

})}

</div>

{/* GRID */}

<h2 className="text-2xl font-bold mb-6">

{search ? "🔎 Search Results" : "📺 All Anime"}

</h2>

<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">

{list?.map(a=>{

if(!a || !a.mal_id) return null

return(

<div
key={a?.mal_id}
className="relative bg-gray-900 rounded-lg overflow-hidden hover:scale-105 transition"
>

<Link href={`/anime/${a?.mal_id}`}>

<img
src={a?.images?.jpg?.image_url}
className="w-full h-[250px] object-cover"
/>

</Link>

<div className="p-3">

<h2 className="text-xs md:text-sm font-semibold">
{a?.title}
</h2>

<p className="text-yellow-400 text-xs">
⭐ {a?.score ?? "N/A"}
</p>

</div>

<button
onClick={()=>toggleWatch(a?.mal_id)}
className="absolute top-2 right-2 bg-black/60 p-1 rounded"
>
<Heart
size={16}
color={watchlist.includes(a?.mal_id)?"red":"white"}
/>
</button>

<button
onClick={()=>setTrailer(a?.trailer?.embed_url||"")}
className="absolute bottom-2 right-2 bg-black/60 px-2 rounded text-xs"
>
▶
</button>

</div>

)

})}

</div>

</div>

{/* TRAILER */}

{trailer &&(

<div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">

<div className="relative w-[90%] md:w-[800px]">

<button
onClick={()=>setTrailer("")}
className="absolute -top-10 right-0 text-white text-3xl"
>
✕
</button>

<iframe
src={trailer}
width="100%"
height="450"
allowFullScreen
className="rounded-xl"
/>

</div>

</div>

)}

<div className="text-center py-8 border-t border-gray-800 text-gray-400">
AnimeVerse © 2026 • Built with Next.js
</div>

</main>

)

}
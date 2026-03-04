"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export default function Home() {

  const [anime,setAnime] = useState([])

  useEffect(()=>{

    fetch("https://api.jikan.moe/v4/anime")
    .then(res=>res.json())
    .then(data=>setAnime(data.data))

  },[])

  return(

    <main className="p-10 grid grid-cols-2 md:grid-cols-4 gap-6">

      {anime.map((a:any)=>(
        <Link key={a.mal_id} href={`/anime/${a.mal_id}`}>

          <div className="bg-gray-900 p-4 rounded-xl hover:scale-105 transition cursor-pointer">

            <img src={a.images.jpg.image_url}/>

            <h2 className="text-sm mt-2 text-white">
              {a.title}
            </h2>

          </div>

        </Link>
      ))}

    </main>

  )

}
"use client"
import ThemeToggle from "@/components/theme-toggle"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function Home() {

  const [anime, setAnime] = useState<any[]>([])
  const [trending, setTrending] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [visible, setVisible] = useState(12)

  useEffect(() => {

    async function load() {

      try {

        const res1 = await fetch("https://api.jikan.moe/v4/anime")
        const data1 = await res1.json()

        const res2 = await fetch("https://api.jikan.moe/v4/top/anime")
        const data2 = await res2.json()

        setAnime(data1?.data || [])
        setTrending(data2?.data?.slice(0, 10) || [])

      } catch (e) {
        console.log(e)
      }

    }

    load()

  }, [])

  const filtered = anime.filter((a: any) =>
    a.title?.toLowerCase().includes(search.toLowerCase())
  )

  return (

   <main className="bg-black min-h-screen text-white bg-gradient-to-b from-black via-zinc-900 to-black">

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-10 py-6 border-b border-gray-800 backdrop-blur bg-black/40 sticky top-0 z-50">

        <h1 className="text-2xl font-bold text-purple-400">
          🍥 AnimeVerse
        </h1>

        <p className="text-gray-400 text-sm">
          Anime Discovery Platform
        </p>
<ThemeToggle/>
      </div>

      {/* HERO */}
      <div className="text-center py-20 px-6">

        <h1 className="text-6xl font-extrabold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
          Discover Amazing Anime
        </h1>

        <p className="text-gray-400 max-w-xl mx-auto">
          Browse trending anime and discover new worlds.
        </p>

      </div>

      <div className="max-w-7xl mx-auto px-6 pb-20">

        {/* SEARCH */}
        <div className="flex justify-center mb-12">

          <input
            type="text"
            placeholder="Search anime..."
            className="p-4 w-full max-w-xl bg-gray-900 rounded-xl border border-gray-800 focus:outline-none focus:border-purple-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        {/* TRENDING */}
        <h2 className="text-2xl font-bold mb-6">
          🔥 Top 10 Anime
        </h2>

        <div className="flex gap-6 overflow-x-auto pb-8 scroll-smooth">

          {trending.map((a: any, i: number) => (
            <Link key={a.mal_id} href={`/anime/${a.mal_id}`}>

              <div className="min-w-[180px] relative hover:scale-105 transition cursor-pointer">

                <div className="absolute -left-3 top-2 text-4xl font-bold text-purple-500">
                  {i + 1}
                </div>

                <img
                  src={a.images?.jpg?.image_url}
                  className="rounded-xl shadow-lg"
                />

                <p className="mt-2 text-sm font-semibold line-clamp-2">
                  {a.title}
                </p>

              </div>

            </Link>
          ))}

        </div>

        {/* ALL ANIME */}
        <h2 className="text-2xl font-bold mb-6">
          📺 All Anime
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">

          {filtered.slice(0, visible).map((a: any) => (
            <Link key={a.mal_id} href={`/anime/${a.mal_id}`}>

              <div className="bg-gray-900 p-4 rounded-xl hover:shadow-purple-500/40 hover:shadow-lg overflow-hidden hover:scale-105 hover:-translate-y-1 transition duration-300 hover:shadow-purple-500/40 hover:shadow-lg transition cursor-pointer">

                <img
                  src={a.images?.jpg?.image_url}
                  className="w-full h-[260px] object-cover"
                />

                <div className="p-3">

                  <h2 className="text-sm font-semibold line-clamp-2">
                    {a.title}
                  </h2>

                  <p className="text-yellow-400 text-sm mt-1">
                    ⭐ {a.score ?? "N/A"}
                  </p>

                </div>

              </div>

            </Link>
          ))}

        </div>

        {/* LOAD MORE */}
        {visible < filtered.length && (

          <div className="text-center mt-12">

            <button
              onClick={() => setVisible(visible + 12)}
              className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-lg font-semibold transition"
            >
              Load More
            </button>

          </div>

        )}

      </div>

      {/* FOOTER */}
      <div className="text-center py-8 border-t border-gray-800 text-gray-400 text-sm">

        AnimeVerse © 2026 • Built with Next.js

      </div>

    </main>
  )
}
"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import ThemeToggle from "@/components/theme-toggle"

export default function Home() {

  const [anime, setAnime] = useState<any[]>([])
  const [trending, setTrending] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [visible, setVisible] = useState(60)
  const [trailer, setTrailer] = useState("")
  const [genre, setGenre] = useState("")
  const [heroIndex, setHeroIndex] = useState(0)

  const loader = useRef<any>(null)

  /* LOAD ANIME */

  useEffect(() => {

    async function load() {

      try {

        const pages = [1,2,3,4,5,6,7,8,9,10]

        const results = await Promise.all(
          pages.map(p =>
            fetch(`https://api.jikan.moe/v4/anime?page=${p}&limit=25`)
              .then(res => res.json())
          )
        )

        const allAnime = results.flatMap(r => r?.data || [])

        const resTop = await fetch("https://api.jikan.moe/v4/top/anime?limit=10")
        const topData = await resTop.json()

        setAnime(allAnime)
        setTrending(topData?.data || [])

      } catch (e) {
        console.log(e)
      }

    }

    load()

  }, [])

  /* HERO AUTO CAROUSEL */

  useEffect(() => {

    if (trending.length === 0) return

    const interval = setInterval(() => {

      setHeroIndex(i => (i + 1) % trending.length)

    }, 4000)

    return () => clearInterval(interval)

  }, [trending])

  /* INFINITE SCROLL */

  useEffect(() => {

    const observer = new IntersectionObserver(entries => {

      if (entries[0].isIntersecting) {
        setVisible(v => v + 24)
      }

    })

    if (loader.current) {
      observer.observe(loader.current)
    }

    return () => observer.disconnect()

  }, [])

  /* SAFE GENRES */

  const genres = Array.from(
    new Set(
      anime.flatMap((a: any) =>
        a?.genres?.map((g: any) => g?.name) || []
      )
    )
  )

  /* FILTER */

  const filtered = anime.filter((a: any) => {

    const matchSearch =
      a?.title?.toLowerCase().includes(search.toLowerCase())

    const matchGenre =
      genre === "" ||
      a?.genres?.some((g: any) => g?.name === genre)

    return matchSearch && matchGenre

  })

  const hero = trending[heroIndex]

  return (

    <main className="bg-black text-white min-h-screen">

      {/* NAVBAR */}

      <div className="sticky top-0 z-50 flex justify-between items-center px-10 py-6 backdrop-blur-lg bg-black/60 border-b border-gray-800">

        <h1 className="text-2xl font-bold text-purple-400">
          AnimeVerse
        </h1>

        <div className="flex gap-4 items-center">

          <p className="text-gray-400 text-sm">
            Anime Discovery Platform
          </p>

          <ThemeToggle />

        </div>

      </div>

      {/* HERO SPOTLIGHT */}

      {hero && (

        <div className="relative h-[450px] flex items-end p-10 overflow-hidden">

          <img
            src={hero?.images?.jpg?.large_image_url}
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />

          <div className="relative z-10 max-w-xl">

            <h1 className="text-4xl font-bold mb-4">
              {hero?.title}
            </h1>

            <p className="text-gray-300 mb-4">
              {hero?.synopsis?.slice(0,150)}...
            </p>

            <div className="flex gap-4">

              <Link href={`/anime/${hero?.mal_id}`}>
                <button className="bg-purple-600 px-6 py-2 rounded-lg">
                  View Details
                </button>
              </Link>

              <button
                onClick={() => setTrailer(hero?.trailer?.embed_url || "")}
                className="bg-gray-800 px-6 py-2 rounded-lg"
              >
                ▶ Trailer
              </button>

            </div>

          </div>

        </div>

      )}

      <div className="p-10">

        {/* SEARCH */}

        <input
          type="text"
          placeholder="Search anime..."
          className="mb-8 p-4 w-full bg-gray-900 rounded-xl border border-gray-700"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* GENRE FILTER */}

        <div className="flex flex-wrap gap-3 mb-10">

          <button
            onClick={() => setGenre("")}
            className={`px-4 py-2 rounded-full ${genre === "" ? "bg-purple-600" : "bg-gray-800"}`}
          >
            All
          </button>

          {genres.map((g: any) => (
            <button
              key={g}
              onClick={() => setGenre(g)}
              className={`px-4 py-2 rounded-full ${genre === g ? "bg-purple-600" : "bg-gray-800"}`}
            >
              {g}
            </button>
          ))}

        </div>

        {/* TRENDING ROW */}

        <h2 className="text-2xl font-bold mb-6">
          🔥 Trending Anime
        </h2>

        <div className="flex gap-6 overflow-x-auto pb-10">

          {trending.map((a: any) => (

            <div key={a?.mal_id} className="min-w-[200px]">

              <Link href={`/anime/${a?.mal_id}`}>
                <img
                  src={a?.images?.jpg?.image_url}
                  className="rounded-xl hover:scale-105 transition"
                />
              </Link>

              <p className="mt-2 text-sm font-semibold">
                {a?.title}
              </p>

            </div>

          ))}

        </div>

        {/* ALL ANIME */}

        <h2 className="text-2xl font-bold mb-6">
          📺 All Anime
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">

          {filtered.slice(0, visible).map((a: any) => (

            <div
              key={a?.mal_id}
              className="bg-gray-900 p-4 rounded-xl hover:scale-105 hover:shadow-purple-500/40 hover:shadow-xl transition"
            >

              <div className="relative">

                <Link href={`/anime/${a?.mal_id}`}>
                  <img
                    src={a?.images?.jpg?.image_url}
                    className="rounded-lg mb-3"
                  />
                </Link>

                <button
                  onClick={() => setTrailer(a?.trailer?.embed_url || "")}
                  className="absolute bottom-2 right-2 bg-black/70 px-3 py-1 rounded text-sm"
                >
                  ▶
                </button>

              </div>

              <Link href={`/anime/${a?.mal_id}`}>
                <h2 className="text-sm font-semibold">
                  {a?.title}
                </h2>
              </Link>

              <p className="text-yellow-400 text-sm">
                ⭐ {a?.score ?? "N/A"}
              </p>

            </div>

          ))}

        </div>

        <div ref={loader} className="h-10"></div>

      </div>

      {/* TRAILER MODAL */}

      {trailer && (

        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">

          <div className="relative w-[90%] md:w-[800px]">

            <button
              onClick={() => setTrailer("")}
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

      {/* FOOTER */}

      <div className="text-center py-8 border-t border-gray-800 text-gray-400">
        AnimeVerse © 2026 • Built with Next.js
      </div>

    </main>

  )

}
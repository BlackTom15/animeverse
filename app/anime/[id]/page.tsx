import Link from "next/link"

async function getAnime(id: string){

  const res = await fetch(
    `https://api.jikan.moe/v4/anime/${id}`,
    { cache:"no-store" }
  )

  if(!res.ok) return null

  const data = await res.json()
  return data.data
}

/* NEW: similar anime fetch */
async function getRecommendations(id:string){

  try{

    const res = await fetch(
      `https://api.jikan.moe/v4/anime/${id}/recommendations`,
      { cache:"no-store" }
    )

    const data = await res.json()

    return data.data || []

  }catch{
    return []
  }

}

export default async function AnimeDetail(props:any){

  const { id } = await props.params

  const anime = await getAnime(id)
  const recommendations = await getRecommendations(id)

  if(!anime){
    return(
      <main className="bg-black text-white min-h-screen flex items-center justify-center text-xl">
        Anime not found
      </main>
    )
  }

  return(

    <main className="bg-black min-h-screen text-white">

      {/* HERO */}
      <div
        className="relative h-[340px] bg-cover bg-center"
        style={{ backgroundImage:`url(${anime.images?.jpg?.large_image_url})` }}
      >
        <div className="absolute inset-0 bg-black/70"></div>

        <div className="relative z-10 p-10">
          <Link
            href="/"
            className="text-purple-400 hover:text-purple-300 text-sm"
          >
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto p-10 grid md:grid-cols-2 gap-10">

        {/* POSTER */}
        <img
          src={anime.images?.jpg?.image_url}
          alt={anime.title}
          className="rounded-xl shadow-lg hover:shadow-purple-500/40 hover:shadow-2xl transition"
        />

        {/* INFO */}
        <div>

          <h1 className="text-4xl font-bold mb-3">
            {anime.title}
          </h1>

          <p className="text-yellow-400 text-lg mb-2">
            ⭐ {anime.score ?? "N/A"}
          </p>

          <div className="w-full bg-gray-800 h-2 rounded mb-6">
            <div
              className="bg-yellow-400 h-2 rounded"
              style={{ width:`${(anime.score || 0)*10}%` }}
            ></div>
          </div>

          <p className="text-gray-300 mb-6 leading-relaxed">
            {anime.synopsis ?? "No description"}
          </p>

          {/* DETAILS */}
          <div className="grid grid-cols-2 gap-3 text-sm">

            <p><strong>Episodes:</strong> {anime.episodes ?? "N/A"}</p>

            <p><strong>Status:</strong> {anime.status ?? "N/A"}</p>

            <p><strong>Year:</strong> {anime.year ?? "N/A"}</p>

            <p><strong>Rank:</strong> #{anime.rank ?? "N/A"}</p>

            <p><strong>Popularity:</strong> #{anime.popularity ?? "N/A"}</p>

            <p><strong>Duration:</strong> {anime.duration ?? "N/A"}</p>

            <p><strong>Rating:</strong> {anime.rating ?? "N/A"}</p>

            <p><strong>Source:</strong> {anime.source || "Unknown"}</p>

          </div>

          {/* GENRES */}
          <div className="mt-6 flex flex-wrap gap-2">

            {anime.genres?.map((g:any)=>(
              <span
                key={g.mal_id}
                className="bg-purple-600 px-3 py-1 rounded-full text-xs font-semibold"
              >
                {g.name}
              </span>
            ))}

          </div>

          {/* STUDIOS */}
          {anime.studios?.length > 0 && (
            <div className="mt-6">

              <h3 className="text-lg font-semibold mb-2">
                Studios
              </h3>

              <div className="flex flex-wrap gap-2">

                {anime.studios.map((s:any)=>(
                  <span
                    key={s.mal_id}
                    className="bg-gray-800 px-3 py-1 rounded text-xs"
                  >
                    {s.name}
                  </span>
                ))}

              </div>

            </div>
          )}

        </div>

      </div>

      {/* TRAILER */}
      <div className="max-w-5xl mx-auto px-10 pb-16">

        <h2 className="text-2xl font-bold mb-5">
          🎬 Trailer
        </h2>

        {anime.trailer?.embed_url ?(

          <iframe
            src={anime.trailer.embed_url}
            width="100%"
            height="420"
            allowFullScreen
            className="rounded-xl shadow-lg"
          ></iframe>

        ):(
          <p className="text-gray-400">
            No trailer available 🎬
          </p>
        )}

      </div>

      {/* SIMILAR ANIME */}
      {recommendations.length > 0 && (

        <div className="max-w-6xl mx-auto px-10 pb-20">

          <h2 className="text-2xl font-bold mb-6">
            🔥 Similar Anime
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-5">

            {recommendations.slice(0,10).map((rec:any)=>{

              const a = rec.entry

              return(

                <Link
                  key={a.mal_id}
                  href={`/anime/${a.mal_id}`}
                >

                  <div className="bg-gray-900 p-3 rounded-lg hover:scale-105 transition">

                    <img
                      src={a.images?.jpg?.image_url}
                      className="rounded mb-2"
                    />

                    <p className="text-xs">
                      {a.title}
                    </p>

                  </div>

                </Link>

              )

            })}

          </div>

        </div>

      )}

    </main>

  )
}
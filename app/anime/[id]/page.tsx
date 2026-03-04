export default async function AnimeDetail({ params }: any) {

  const res = await fetch(`https://api.jikan.moe/v4/anime/${params.id}`);
  const data = await res.json();
  const anime = data.data;

  return (
    <main className="p-10 text-white">

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10">

        <img
          src={anime.images.jpg.image_url}
          className="rounded-xl"
        />

        <div>

          <h1 className="text-3xl font-bold mb-4">
            {anime.title}
          </h1>

          <p className="mb-4">
            {anime.synopsis}
          </p>

          <p>
            <b>Episodes:</b> {anime.episodes ?? "N/A"}
          </p>

          <p>
            <b>Status:</b> {anime.status ?? "N/A"}
          </p>

          <p>
            <b>Score:</b> ⭐ {anime.score ?? "N/A"}
          </p>

          <p>
            <b>Year:</b> {anime.year ?? "N/A"}
          </p>

        </div>

      </div>

    </main>
  );
}
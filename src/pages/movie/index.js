import { withAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

const Spinner = () => (
  <div className="flex items-center justify-center">
    <div className="loader border-t-transparent border-solid rounded-full border-4 border-red-500 w-16 h-16 animate-spin"></div>
    Loading...
  </div>
);

function Movies() {
  const router = useRouter();

  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true); // State to manage loading

  async function fetchMovies(page = 0) {
    setLoading(true); // Set loading to true when fetching starts
    try {
      const response = await fetch(`/api/movies/get?page=${page}&size=8`);
      const data = await response.json();
      setMovies(data.movies);
      setPage(page);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false); // Set loading to false when fetching ends
    }
  }

  async function handleLogout() {
    localStorage.removeItem("token");
    router.push("/auth/login");
  }

  useEffect(() => {
    fetchMovies(page);
  }, [page]);

  return (
    <div className="flex flex-col items-center justify-center">
      {loading ? ( // Show loading indicator while fetching
        <Spinner />
      ) : movies?.length > 0 ? (
        <>
          <header className="flex w-full justify-between items-center px-8 py-4 bg-[#0f2a3f] rounded-lg">
            <div className="flex items-center space-x-4">
              <h1 className="text-white text-2xl font-semibold">My movies</h1>
              <button onClick={() => router.push("/movie/add")}>
                <Image
                  src="/assets/add_icon.png"
                  alt="add icon"
                  width={25}
                  height={25}
                />
              </button>
            </div>
            <div>
              <button className="text-gray-300" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </header>
          <main className="p-4">
            <div className="grid grid-cols-4 gap-6 justify-between">
              {movies.map((movie) => (
                <div
                  key={movie.id}
                  className="bg-gray-800 rounded-lg overflow-hidden"
                >
                  <Image
                    src={movie.poster}
                    alt={movie.title}
                    width={180}
                    height={180}
                    className="w-full h-[180px] object-cover"
                  />
                  <div className="p-4 text-start">
                    <div className="flex justify-between items-center space-x-2">
                      <h3 className="text-white text-lg">{movie.title}</h3>

                      <button
                        onClick={() =>
                          router.push(`/movie/edit?id=${movie.id}`)
                        }
                      >
                        <Image
                          src="/assets/edit-round-line-icon.png"
                          alt="edit icon"
                          width={25}
                          height={25}
                          className="cursor-pointer drop-shadow-md hover:drop-shadow-xl shadow-white"
                        />
                      </button>
                    </div>
                    <p className="text-gray-400 flex-1">{movie.publishingYear}</p>
                  </div>
                </div>
              ))}
            </div>
          </main>
          <div className="flex justify-center mt-8 space-x-4 text-white">
            <button
              className="py-2 px-4 bg-transparent text-white border border-gray-500 rounded-md disabled:opacity-50"
              onClick={() => fetchMovies(page - 1)}
              disabled={page === 0}
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`py-2 px-4 ${
                  page === index ? "bg-[#2BD17E]" : "bg-transparent"
                } text-white border border-gray-500 rounded-md`}
                onClick={() => fetchMovies(index)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="py-2 px-4 bg-transparent text-white border border-gray-500 rounded-md disabled:opacity-50"
              onClick={() => fetchMovies(page + 1)}
              disabled={page === totalPages - 1}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-center text-white text-6xl font-semibold mb-8 text-[var(--font-montserrat)]">
            Your movie list is empty
          </h1>
          <button
            type="button"
            className="bg-[#2BD17E] text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            onClick={() => router.push("/movie/add")}
          >
            Add a new movie
          </button>
        </>
      )}
    </div>
  );
}

export default withAuth(Movies);

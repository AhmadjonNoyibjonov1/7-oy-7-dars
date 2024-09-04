import React, { useState, useEffect } from 'react';
import useDebounce from '../hooks/UseDebounce';

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          `https://api.kinopoisk.dev/v1.4/movie?rating.imdb=8-10`,
          {
            headers: {
              'X-API-KEY': '68YR40J-YENM25K-K03KW0S-HS0ETEC',
            },
          }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }
        const data = await response.json();
        setMovies(data.docs);
        setFilteredMovies(data.docs); 
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    if (debouncedSearchTerm) {
      const filtered = movies.filter((movie) =>
        movie.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
      setFilteredMovies(filtered);
    } else {
      setFilteredMovies(movies); 
    }
  }, [debouncedSearchTerm, movies]);

  return (
    <div className="mb-32">
      <h2 className="text-white font-small text-3xl mt-8 ml-9">Search Movies</h2>
      <input
        type="text"
        placeholder="Search for movies..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="ml-9 p-2 rounded w-full max-w-[1280px] mb-4"
      />
      <div className="container mx-auto max-w-[1280px] grid grid-cols-3 gap-12 ml-9">
        {loading ? (
          <p className="text-xl">Loading movies...</p>
        ) : (
          filteredMovies.length > 0 ? (
            filteredMovies.map((movie) => (
              <div key={movie.id} className="cards relative mt-10 w-[250px] h-[200px]">
                <span className="absolute left-[210px] cursor-pointer top-4 w-10 h-10 bg-gray-700 opacity-[50%] rounded-[50%]">
                  <i className="fa-regular fa-bookmark ml-[14px] mt-[12px] text-white"></i>
                </span>
                {movie.poster && movie.poster.url ? (
                  <img
                    src={movie.poster.url}
                    alt={movie.title || 'Movie Poster'}
                    className="rounded-xl w-[250px] h-[174px] object-cover"
                  />
                ) : (
                  <div className="bg-gray-700 rounded-xl w-[250px] h-[174px] flex items-center justify-center">
                    <p>No Image</p>
                  </div>
                )}
                <h3 className="font-bold">{movie.year} Movie PG</h3>
                <h3 className="font-bold">{movie.name || 'No Title Available'}</h3>
              </div>
            ))
          ) : (
            <p className="text-xl">No movies found</p>
          )
        )}
      </div>
    </div>
  );
}

export default SearchComponent;

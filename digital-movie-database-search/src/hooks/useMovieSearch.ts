import { useState, useCallback, useRef, useEffect } from "react";
import {
  searchMovies,
  type MovieResult,
  MovieApiError,
} from "../services/movieApi";

interface UseMovieSearchReturn {
  results: MovieResult[];
  isLoading: boolean;
  error: string | null;
  hasSearched: boolean;
  search: (query: string) => Promise<void>;
  clearResults: () => void;
}

export function useMovieSearch(): UseMovieSearchReturn {
  const [results, setResults] = useState<MovieResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  const search = useCallback(async (query: string) => {
    abortControllerRef.current?.abort();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const movieResults = await searchMovies(
        query,
        controller.signal
      );

      setResults(movieResults);

      console.log(
        "[Analytics] Search completed successfully."
      );

    } catch (err) {

      if (err instanceof DOMException &&
          err.name === "AbortError") {

        return;

      }

      if (err instanceof MovieApiError) {

        setError(err.message);

      } else {

        setError(
          "Unable to connect. Please check your internet connection."
        );

      }

      setResults([]);

    } finally {

      setIsLoading(false);

    }

  }, []);

  const clearResults = useCallback(() => {

    setResults([]);

    setError(null);

    setHasSearched(false);

  }, []);

  useEffect(() => {

    return () => {

      abortControllerRef.current?.abort();

    };

  }, []);

  return {
    results,
    isLoading,
    error,
    hasSearched,
    search,
    clearResults,
  };
}
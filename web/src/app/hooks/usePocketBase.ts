import { useEffect, useState, useCallback } from 'react';
import { pb } from '../../lib/pocketbaseClient';

interface UsePocketBaseOptions {
  collection: string;
  limit?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

interface UsePocketBaseResult<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function usePocketBase<T = Record<string, unknown>>({
  collection,
  limit = 200,
  retryAttempts = 3,
  retryDelay = 1000,
}: UsePocketBaseOptions): UsePocketBaseResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (attempt = 1) => {
    const controller = new AbortController();
    
    try {
      setLoading(true);
      setError(null);
      
      // Add delay to prevent rapid requests
      if (attempt > 1) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
      } else {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      console.log(`Fetching from ${collection} collection (attempt ${attempt})...`);
      
      const records = await pb.collection(collection).getFullList<T>(limit, {
        signal: controller.signal,
      });
      
      console.log(`Successfully fetched ${records.length} records from ${collection}`);
      setData(records);
      setError(null);
    } catch (error: unknown) {
      if (controller.signal.aborted) {
        console.log("Request was cancelled");
        return;
      }
      
      console.error(`PocketBase error (attempt ${attempt}):`, error);
      
      if (error instanceof Error) {
        if (error.message.includes("autocancelled") && attempt < retryAttempts) {
          console.log(`Retrying request (attempt ${attempt + 1}/${retryAttempts})...`);
          setTimeout(() => fetchData(attempt + 1), retryDelay);
          return;
        } else if (error.message.includes("superuser")) {
          setError("Collection access restricted. Please set API rules to allow public access in PocketBase admin.");
        } else if (error.message.includes("authorization")) {
          setError("Authentication required. Please configure collection API rules for public access.");
        } else if (error.message.includes("autocancelled")) {
          setError(`Request auto-cancelled after ${retryAttempts} attempts. Please check your network connection.`);
        } else {
          setError(`Error: ${error.message}`);
        }
      } else {
        setError("Unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }, [collection, limit, retryAttempts, retryDelay]);

  useEffect(() => {
    fetchData();
    
    // Cleanup function is handled inside fetchData with AbortController
    return () => {
      // AbortController cleanup is handled in fetchData
    };
  }, [fetchData]);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
}

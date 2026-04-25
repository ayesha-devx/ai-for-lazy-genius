import { useState, useEffect, useCallback } from 'react';
import blogService from '@/services/blogService';

/**
 * Custom hook for fetching and managing multiple blogs.
 * Handles loading, error, and data states.
 * 
 * @param {object} params - Optional search and tag filters.
 */
export const useBlogs = (params = {}) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Stringify params to use in dependency array
  const paramsKey = JSON.stringify(params);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await blogService.getBlogs(params);
      setBlogs(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch insights.');
    } finally {
      setLoading(false);
    }
  }, [paramsKey]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  return { blogs, loading, error, refresh: fetchBlogs };
};

/**
 * Custom hook for fetching and managing a single blog post.
 * Handles loading, error, and data states.
 * 
 * @param {string|number} id - The blog ID.
 */
export const useBlog = (id) => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBlog = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await blogService.getBlogById(id);
      setBlog(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch the requested blog.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);

  return { blog, loading, error, retry: fetchBlog };
};

/**
 * Custom hook for fetching personalized blog recommendations.
 */
export const useRecommendedBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecommendations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await blogService.getRecommendedBlogs();
      setBlogs(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch recommendations.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return { blogs, loading, error, refresh: fetchRecommendations };
};

/**
 * Custom hook for fetching personalized feed (blogs from followed users).
 */
export const usePersonalizedFeed = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeed = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await blogService.getPersonalizedFeed();
      setBlogs(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch feed.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  return { blogs, loading, error, refresh: fetchFeed };
};

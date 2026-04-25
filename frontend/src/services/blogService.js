import api from './api';

const blogService = {
  /**
   * Fetches all blogs from the backend API.
   */
  getBlogs: async (params = {}) => {
    try {
      const { data } = await api.get('/blogs', { params });
      return data;
    } catch (error) {
      console.error('Error fetching blogs:', error);
      throw error;
    }
  },

  /**
   * Fetches a single blog by ID from the backend API.
   */
  getBlogById: async (id) => {
    try {
      const { data } = await api.get(`/blogs/${id}`);
      return data;
    } catch (error) {
      console.error('Error fetching blog details:', error);
      throw error;
    }
  },

  /**
   * Fetches personalized recommended blogs.
   */
  getRecommendedBlogs: async () => {
    try {
      const { data } = await api.get('/blogs/recommendations');
      return data;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw error;
    }
  },

  /**
   * Fetches personalized feed (blogs from followed users).
   */
  getPersonalizedFeed: async () => {
    try {
      const { data } = await api.get('/blogs/feed');
      return data;
    } catch (error) {
      console.error('Error fetching feed:', error);
      throw error;
    }
  },
  
  /**
   * Fetches user's own blogs (drafts + published).
   */
  getMyBlogs: async () => {
    try {
      const { data } = await api.get('/blogs/my');
      return data;
    } catch (error) {
      console.error('Error fetching user blogs:', error);
      throw error;
    }
  },

  /**
   * Creates a new blog post.
   */
  createBlog: async (blogData) => {
    try {
      const { data } = await api.post('/blogs', blogData);
      return data;
    } catch (error) {
      console.error('Error creating blog:', error);
      throw error;
    }
  },

  /**
   * Fetches all comments for a specific blog.
   */
  getComments: async (blogId) => {
    try {
      const { data } = await api.get(`/comments/${blogId}`);
      return data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },

  /**
   * Adds a new comment to a blog.
   */
  addComment: async (blogId, text) => {
    try {
      const { data } = await api.post(`/comments/${blogId}`, { text });
      return data;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  /**
   * Likes or unlikes a blog post.
   */
  likeBlog: async (blogId) => {
    try {
      const { data } = await api.put(`/blogs/${blogId}/like`);
      return data;
    } catch (error) {
      console.error('Error liking blog:', error);
      throw error;
    }
  },

  /**
   * Updates an existing blog post.
   */
  updateBlog: async (blogId, blogData) => {
    try {
      const { data } = await api.put(`/blogs/${blogId}`, blogData);
      return data;
    } catch (error) {
      console.error('Error updating blog:', error);
      throw error;
    }
  },

  /**
   * Deletes a blog post.
   */
  deleteBlog: async (blogId) => {
    try {
      const { data } = await api.delete(`/blogs/${blogId}`);
      return data;
    } catch (error) {
      console.error('Error deleting blog:', error);
      throw error;
    }
  },

  /**
   * Bookmarks or unbookmarks a blog post.
   */
  bookmarkBlog: async (blogId) => {
    try {
      const { data } = await api.put(`/blogs/${blogId}/bookmark`);
      return data;
    } catch (error) {
      console.error('Error bookmarking blog:', error);
      throw error;
    }
  },

  /**
   * Generates blog content using AI.
   */
  generateBlogWithAI: async (aiParams) => {
    try {
      const { data } = await api.post('/ai/generate', aiParams);
      return data;
    } catch (error) {
      console.error('Error generating blog with AI:', error);
      throw error;
    }
  },

  /**
   * Uploads an image to Cloudinary.
   */
  uploadImage: async (formData) => {
    try {
      const { data } = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  /**
   * Generates a cover image using AI.
   */
  generateAiImage: async (prompt) => {
    try {
      const { data } = await api.post('/ai/generate-image', { prompt });
      return data;
    } catch (error) {
      console.error('Error generating AI image:', error);
      throw error;
    }
  }
};

export default blogService;

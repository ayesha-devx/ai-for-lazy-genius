import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import { 
  Home, 
  Blogs, 
  BlogDetail, 
  Login, 
  Signup, 
  Profile, 
  Write,
  EditBlog,
  Feed,
  Dashboard,
  Notes,
  AuthorProfile
} from '@/pages';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="blog/:id" element={<BlogDetail />} />
          <Route path="author/:id" element={<AuthorProfile />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="profile" element={<Profile />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="edit/:id" element={<EditBlog />} />
          <Route path="write" element={<Write />} />
          <Route path="feed" element={<Feed />} />
          <Route path="notes" element={<Notes />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;

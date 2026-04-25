import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const MainLayout = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-ai-bg text-gray-900 dark:text-white selection:bg-blue-500 selection:text-white transition-colors duration-300">
      <Navbar />
      <main className="flex-grow pt-24 pb-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;

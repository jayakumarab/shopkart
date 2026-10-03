import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/Header";
import CategoryBar from "../components/CategoryBar";
import Footer from "../components/Footer";

const MainLayout = () => {
  const location = useLocation();

  // Don't show category bar on login or register pages
  const hideCategoryBar = ["/login", "/register", "/checkout"].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen bg-[#f1f2f4]">
      <Header />
      {!hideCategoryBar && <CategoryBar />}
      <main className="flex-1 w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;


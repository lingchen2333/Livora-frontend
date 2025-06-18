import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../layout/NavBar";
import Footer from "./Footer";

export const RootLayout = () => {
  return (
    <main className="min-h-screen flex flex-col">
      <NavBar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </main>
  );
};

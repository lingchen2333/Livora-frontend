import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../layout/NavBar";
import Footer from "./Footer";

export const RootLayout = () => {
  return (
    <main>
      <NavBar />
      <div>
        <Outlet />
      </div>
      <Footer />
    </main>
  );
};

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar";
import "./index.css";
import "./i18n.ts";
import App from "./pages/App";
import Contact from "./pages/Contact";
import Project from "./pages/Project";
import reportWebVitals from "./reportWebVitals";
import { Suspense } from "react";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Suspense fallback="loading">
      <div className="flex">
        <Router>
          <Sidebar />
          <main role="main" className="w-full">
            <Routes>
              <Route index element={<App />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/projects" element={<Project />} />
            </Routes>
          </main>
        </Router>
      </div>
    </Suspense>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);

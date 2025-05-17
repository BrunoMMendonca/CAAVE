import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import Markets from "./pages/Markets";
import AssetDetail from "./pages/AssetDetail";
import Stake from "./pages/Stake";
import Governance from "./pages/Governance";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/markets" element={<Markets />} />
            <Route path="/asset/:id" element={<AssetDetail />} />
            <Route path="/stake" element={<Stake />} />
            <Route path="/governance" element={<Governance />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;

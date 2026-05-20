//import './App.css'

import { Outlet } from 'react-router-dom';
import { BrowserRouter } from "react-router-dom";

import Header from './components/Header';
import Navigation from './components/Navigation';
import Footer from './components/Footer';

export default function App({ children }) {
  return (
 
      <div className="min-h-screen flex flex-col">
        <Header />
        <Navigation />

        <main className="flex-1 flex flex-col mx-2 mb-2 rounded-md neon-cyan gradient-border overflow-hidden">
          <Outlet />
        </main>

        <Footer />
      </div>
 
  );
}



 
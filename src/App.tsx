import React from "react";
import { NavGauge } from "./nav-gauge/NavGauge";
import './app.css';

const App: React.FC = () => {
    return (
        <React.StrictMode>
            <nav className="navbar">
                <span>nav gauge</span>
            </nav>
            <NavGauge />
            <footer className="footer">
                <a target="_blank" rel="noreferrer" href="https://openstreetmap.org/copyright">
                    © OpenStreetMap
                </a>
            </footer>
        </React.StrictMode>
    );
}

export default App;

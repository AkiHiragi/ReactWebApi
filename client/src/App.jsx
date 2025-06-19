import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "./components/Navbar";
import GameList from "./components/GameList";

function App() {
    return (
        <Router>
            <Navbar/>
            <div className="container mt-3">
                <Routes>
                    <Route path="/" element={<GameList/>}/>
                    <Route path="/games" element={<GameList/>}/>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
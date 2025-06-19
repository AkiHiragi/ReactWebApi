import React from "react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "./components/Navbar";
import GameList from "./components/GameList";
import CharacterList from "./components/CharacterList";
import GameDetail from "./components/GameDetail";
import CharacterDetail from "./components/CharacterDetail";

function App() {
    return (
        <Router>
            <Navbar/>
            <div className="container mt-3">
                <Routes>
                    <Route path="/" element={<GameList/>}/>
                    <Route path="/games" element={<GameList/>}/>
                    <Route path="/games/:id" element={<GameDetail/>}/>
                    <Route path="/characters" element={<CharacterList/>}/>
                    <Route path="/characters/:id" element={<CharacterDetail/>}/>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
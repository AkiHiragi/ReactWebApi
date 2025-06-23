import {useEffect, useState} from "react";
import {getAllCharacters, getAllGames, getAllGamesWithCharacters, getAllMusicThemes} from "../services/api";
import AlertMessages from "./admin/AlertMessages";
import GameManagement from "./admin/GameManagement";
import CharacterManagement from "./admin/CharacterManagement";
import RelationshipManagement from "./admin/RelationshipManagement";
import MusicThemeManagement from "./admin/MusicThemeManagement";
import MusicThemeRelationManagement from "./admin/MusicThemeRelationManagement";

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('games');
    const [games, setGames] = useState([]);
    const [characters, setCharacters] = useState([]);
    const [musicThemes, setMusicThemes] = useState([]);
    const [gamesWithCharacters, setGamesWithCharacters] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                fetchGames(),
                fetchCharacters(),
                fetchGamesWithCharacters(),
                fetchMusicThemes()
            ]);
        } finally {
            setLoading(false);
        }
    };

    const fetchGames = async () => {
        try {
            const data = await getAllGames();
            setGames(data);
        } catch (err) {
            setError('Failed to fetch games');
        }
    };

    const fetchCharacters = async () => {
        try {
            const data = await getAllCharacters();
            setCharacters(data);
        } catch (err) {
            setError('Failed to fetch characters');
        }
    };

    const fetchGamesWithCharacters = async () => {
        try {
            const data = await getAllGamesWithCharacters();
            setGamesWithCharacters(data);
        } catch (err) {
            setError('Failed to fetch games with characters');
        }
    };

    const fetchMusicThemes = async () => {
        try {
            const data = await getAllMusicThemes();
            setMusicThemes(data);
        } catch (err) {
            setError('Failed to fetch music themes');
        }
    }

    const handleMessage = (errorMsg, successMsg) => {
        setError(errorMsg);
        setSuccess(successMsg);

        // Автоматически скрываем сообщения через 5 секунд
        if (errorMsg || successMsg) {
            setTimeout(() => {
                setError(null);
                setSuccess(null);
            }, 5000);
        }
    };

    const handleDataChange = () => {
        fetchAllData();
    };

    return (
        <div className="container mt-4">
            <h2>Admin Panel</h2>

            {/* Вкладки */}
            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'games' ? 'active' : ''}`}
                        onClick={() => setActiveTab('games')}
                    >
                        Games
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'characters' ? 'active' : ''}`}
                        onClick={() => setActiveTab('characters')}
                    >
                        Characters
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'musicthemes' ? 'active' : ''}`}
                        onClick={() => setActiveTab('musicthemes')}
                    >
                        Music Themes
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'relationships' ? 'active' : ''}`}
                        onClick={() => setActiveTab('relationships')}
                    >
                        Relationships
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'musicrelations' ? 'active' : ''}`}
                        onClick={() => setActiveTab('musicrelations')}
                    >
                        Music Relations
                    </button>
                </li>
            </ul>

            {/* Сообщения */}
            <AlertMessages error={error} success={success}/>

            {/* Индикатор загрузки */}
            {loading && (
                <div className="text-center my-3">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}

            {/* Содержимое вкладок */}
            {!loading && activeTab === 'games' && (
                <GameManagement
                    games={games}
                    onDataChange={handleDataChange}
                    onMessage={handleMessage}
                />
            )}

            {!loading && activeTab === 'characters' && (
                <CharacterManagement
                    characters={characters}
                    onDataChange={handleDataChange}
                    onMessage={handleMessage}
                />
            )}

            {!loading && activeTab === 'musicthemes' && (
                <MusicThemeManagement
                    musicThemes={musicThemes}
                    games={games}
                    characters={characters}
                    onDataChange={handleDataChange}
                    onMessage={handleMessage}
                />
            )}

            {!loading && activeTab === 'relationships' && (
                <RelationshipManagement
                    games={games}
                    characters={characters}
                    gamesWithCharacters={gamesWithCharacters}
                    onDataChange={handleDataChange}
                    onMessage={handleMessage}
                />
            )}

            {!loading && activeTab === 'musicrelations' && (
                <MusicThemeRelationManagement
                    games={games}
                    characters={characters}
                    musicThemes={musicThemes}
                    onDataChange={handleDataChange}
                    onMessage={handleMessage}
                />
            )}
        </div>
    );
};

export default AdminPanel;

import {useEffect, useState} from "react";
import {
    addCharacter,
    addCharacterToGame,
    addGame,
    deleteCharacter,
    deleteGame,
    getAllCharacters,
    getAllGames,
    getAllGamesWithCharacters,
    getImageUrl
} from "../services/api";

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('games');
    const [games, setGames] = useState([]);
    const [characters, setCharacters] = useState([]);
    const [gamesWithCharacters, setGamesWithCharacters] = useState([]);
    const [selectedGameId, setSelectedGameId] = useState('');
    const [selectedCharacterId, setSelectedCharacterId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [gameForm, setGameForm] = useState({
        title: '',
        gameNumber: '',
        imageUrl: ''
    });

    const [characterForm, setCharacterForm] = useState({
        name: '',
        description: '',
        abilities: '',
        imageUrl: ''
    });

    useEffect(() => {
        fetchGames();
        fetchCharacters();
        fetchGamesWithCharacters();
    }, []);

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
    }

    const handleGameSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await addGame({
                ...gameForm,
                gameNumber: parseFloat(gameForm.gameNumber)
            });

            setSuccess('Game added successfully');
            setGameForm({title: '', gameNumber: '', imageUrl: ''});
            fetchGames();
        } catch (err) {
            if (err.response?.status === 400) {
                const validationErrors = err.response.data.errors;
                const errorMessage = Object.values(validationErrors).flat();
                setError(errorMessage.join(', '));
            } else {
                setError('Failed to add game');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCharacterSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await addCharacter({
                ...characterForm,
                abilities: characterForm.abilities.split(',').map(a => a.trim()).filter(a => a)
            });
            setSuccess('Character added successfully');
            setCharacterForm({name: '', description: '', abilities: '', imageUrl: ''});
            fetchCharacters();
        } catch (err) {
            if (err.response?.status === 400) {
                const validationErrors = err.response.data.errors;
                const errorMessage = Object.values(validationErrors).flat();
                setError(errorMessage.join(', '));
            } else {
                setError('Failed to add character');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteGame = async (id, title) => {
        if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
            try {
                await deleteGame(id);
                setSuccess('Game deleted successfully!');
                fetchGames();
            } catch (err) {
                setError('Failed to delete game');
            }
        }
    };

    const handleDeleteCharacter = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            try {
                await deleteCharacter(id);
                setSuccess('Character deleted successfully!');
                fetchCharacters();
            } catch (err) {
                setError('Failed to delete character');
            }
        }
    };

    const handleLinkCharacterToGame = async () => {
        if (!selectedGameId || !selectedCharacterId) return;

        const selectedGame = gamesWithCharacters.find(g => g.id.toString() === selectedGameId);
        const isAlreadyLinked = selectedGame?.characters?.some(c => c.id.toString() === selectedCharacterId);

        if (isAlreadyLinked) {
            setError('Character is already linked to this game');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            await addCharacterToGame(selectedGameId, selectedCharacterId);
            setSuccess('Character linked to game successfully');
            setSelectedGameId('');
            setSelectedCharacterId('');
            fetchGamesWithCharacters();
        } catch (err) {
            if (err.response?.status === 400) {
                const validationErrors = err.response.data.errors;
                const errorMessage = Object.values(validationErrors).flat();
                setError(errorMessage.join(', '));
            } else if (err.response?.status === 404) {
                setError('Game or character not found');
            } else {
                setError('Failed to link character to game');
            }
        } finally {
            setLoading(false);
        }
    }

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
                        className={`nav-link ${activeTab === 'relationships' ? 'active' : ''}`}
                        onClick={() => setActiveTab('relationships')}
                    >
                        Relationships
                    </button>
                </li>
            </ul>

            {/* Сообщения */}
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {/* Вкладка игр */}
            {activeTab === 'games' && (
                <>
                    <div className="card mb-4">
                        <div className="card-header">
                            <h4>Add New Game</h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleGameSubmit}>
                                <div className="row">
                                    <div className="col-md-4">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Game Title"
                                            value={gameForm.title}
                                            onChange={(e) => setGameForm({...gameForm, title: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <input
                                            type="number"
                                            step="0.1"
                                            className="form-control"
                                            placeholder="Game Number"
                                            value={gameForm.gameNumber}
                                            onChange={(e) => setGameForm({...gameForm, gameNumber: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Image URL"
                                            value={gameForm.imageUrl}
                                            onChange={(e) => setGameForm({...gameForm, imageUrl: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={loading}
                                        >
                                            {loading ? 'Adding...' : 'Add Game'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <h4>Existing Games</h4>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                    <tr>
                                        <th>Number</th>
                                        <th>Title</th>
                                        <th>Image</th>
                                        <th>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {games.map(game => (
                                        <tr key={game.id}>
                                            <td>{game.gameNumber}</td>
                                            <td>{game.title}</td>
                                            <td>
                                                <img
                                                    src={getImageUrl(game.imageUrl)}
                                                    alt={game.title}
                                                    style={{width: '50px', height: '50px', objectFit: 'cover'}}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = 'https://via.placeholder.com/50x50?text=No+Image'
                                                    }}
                                                />
                                            </td>

                                            <td>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDeleteGame(game.id, game.title)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Вкладка персонажей */}
            {activeTab === 'characters' && (
                <>
                    <div className="card mb-4">
                        <div className="card-header">
                            <h4>Add New Character</h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleCharacterSubmit}>
                                <div className="row mb-3">
                                    <div className="col-md-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Character Name"
                                            value={characterForm.name}
                                            onChange={(e) => setCharacterForm({...characterForm, name: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Description"
                                            value={characterForm.description}
                                            onChange={(e) => setCharacterForm({
                                                ...characterForm,
                                                description: e.target.value
                                            })}
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <textarea
                                            className="form-control"
                                            placeholder="Abilities (comma separated)"
                                            value={characterForm.abilities}
                                            onChange={(e) => setCharacterForm({
                                                ...characterForm,
                                                abilities: e.target.value
                                            })}
                                            rows="1"
                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Image URL"
                                            value={characterForm.imageUrl}
                                            onChange={(e) => setCharacterForm({
                                                ...characterForm,
                                                imageUrl: e.target.value
                                            })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={loading}
                                        >
                                            {loading ? 'Adding...' : 'Add Character'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <h4>Existing Characters</h4>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Description</th>
                                        <th>Abilities</th>
                                        <th>Image</th>
                                        <th>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {characters.map(character => (
                                        <tr key={character.id}>
                                            <td>{character.name}</td>
                                            <td>{character.description}</td>
                                            <td>{character.abilities?.join(', ') || 'None'}</td>
                                            <td>
                                                <img
                                                    src={getImageUrl(character.imageUrl)}
                                                    alt={character.name}
                                                    style={{width: '50px', height: '50px', objectFit: 'cover'}}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = 'https://via.placeholder.com/50x50?text=No+Image'
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDeleteCharacter(character.id, character.name)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Вкладка связей */}
            {activeTab === 'relationships' && (
                <div className="card">
                    <div className="card-header">
                        <h4>Manage Game-Character Relationships</h4>
                    </div>
                    <div className="card-body">
                        {/* Форма для связывания */}
                        <div className="row mb-4">
                            <div className="col-md-5">
                                <label>Select Game</label>
                                <select
                                    className="form-control"
                                    value={selectedGameId}
                                    onChange={(e) => setSelectedGameId(e.target.value)}
                                >
                                    <option value="">Choose a game...</option>
                                    {games.map(game => (
                                        <option key={game.id} value={game.id}>
                                            {game.title} (TH{game.gameNumber})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-5">
                                <label>Select Character</label>
                                <select
                                    className="form-control"
                                    value={selectedCharacterId}
                                    onChange={(e) => setSelectedCharacterId(e.target.value)}
                                >
                                    <option value="">Choose a character...</option>
                                    {characters.map(character => (
                                        <option key={character.id} value={character.id}>
                                            {character.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-2">
                                <label>&nbsp;</label>
                                <button
                                    className="btn btn-success form-control"
                                    onClick={handleLinkCharacterToGame}
                                    disabled={!selectedGameId || !selectedCharacterId || loading}
                                >
                                    {loading ? 'Linking...' : 'Link'}
                                </button>
                            </div>
                        </div>

                        {/* Таблица существующих связей */}
                        <h5>Current Relationships:</h5>
                        <div className="table-responsive">
                            <table className="table table-sm">
                                <thead>
                                <tr>
                                    <th>Game</th>
                                    <th>Characters</th>
                                </tr>
                                </thead>
                                <tbody>
                                {gamesWithCharacters.map(game => (
                                    <tr key={game.id}>
                                        <td>
                                            <strong>{game.title}</strong>
                                            <br/>
                                            <small className="text-muted">TH{game.gameNumber}</small>
                                        </td>
                                        <td>
                                            {game.characters && game.characters.length > 0 ? (
                                                <div>
                                                    {game.characters.map(character => (
                                                        <span key={character.id}
                                                              className="badge bg-light text-dark border me-1 mb-1">
                                                            {character.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-muted">No characters</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;

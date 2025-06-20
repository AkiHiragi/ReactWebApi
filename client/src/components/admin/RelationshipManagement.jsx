import {useState} from "react";
import {addCharacterToGame} from "../../services/api";

const RelationshipManagement = ({games, characters, gamesWithCharacters, onDataChange, onMessage}) => {
    const [loading, setLoading] = useState(false);
    const [selectedGameId, setSelectedGameId] = useState('');
    const [selectedCharacterId, setSelectedCharacterId] = useState('');

    const handleLinkCharacterToGame = async () => {
        if (!selectedGameId || !selectedCharacterId) return;

        const selectedGame = gamesWithCharacters.find(g => g.id.toString() === selectedGameId);
        const isAlreadyLinked = selectedGame?.characters?.some(c => c.id.toString() === selectedCharacterId);

        if (isAlreadyLinked) {
            onMessage('Character is already linked to this game', null);
            return;
        }

        setLoading(true);
        onMessage(null, null);

        try {
            await addCharacterToGame(selectedGameId, selectedCharacterId);
            onMessage(null, 'Character linked to game successfully');
            setSelectedGameId('');
            setSelectedCharacterId('');
            onDataChange();
        } catch (err) {
            if (err.response?.status === 400) {
                const validationErrors = err.response.data.errors;
                const errorMessage = Object.values(validationErrors).flat();
                onMessage(errorMessage.join(', '), null);
            } else if (err.response?.status === 404) {
                onMessage('Game or character not found', null);
            } else {
                onMessage('Failed to link character to game', null);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <div className="card-header">
                <h4>Manage Game-Character Relationships</h4>
            </div>
            <div className="card-body">
                {/* Форма для связывания */}
                <div className="row mb-4">
                    <div className="col-md-5">
                        <label>Select Game:</label>
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
                        <label>Select Character:</label>
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
    );
};

export default RelationshipManagement;

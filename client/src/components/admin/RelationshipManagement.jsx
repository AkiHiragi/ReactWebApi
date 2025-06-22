import {useState} from "react";
import {addCharacterToGame, getImageUrl, removeCharacterFromGame} from "../../services/api";
import SearchableSelect from "../common/SearchableSelect";

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

    const handleRemoveCharacterFromGame = async (gameId, characterId, gameName, characterName) => {
        if (window.confirm(`Remove "${characterName}" from "${gameName}"?`)) {
            setLoading(true);
            onMessage(null, null);

            try {
                await removeCharacterFromGame(gameId, characterId);
                onMessage(null, 'Character removed from game successfully');
                onDataChange();
            } catch (err) {
                if (err.response?.status === 404) {
                    onMessage('Game or character not found', null);
                } else {
                    onMessage('Failed to remove character from game', null);
                }
            } finally {
                setLoading(false);
            }
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
                        <SearchableSelect
                            options={games}
                            value={selectedGameId}
                            onChange={setSelectedGameId}
                            placeholder="Search and select game..."
                            displayField="title"
                            valueField="id"
                            imageField="imageUrl"
                            secondaryField="gameNumber"
                        />
                    </div>
                    <div className="col-md-5">
                        <label>Select Character:</label>
                        <SearchableSelect
                            options={characters}
                            value={selectedCharacterId}
                            onChange={setSelectedCharacterId}
                            placeholder="Search and select character..."
                            displayField="name"
                            valueField="id"
                            imageField="imageUrl"
                        />
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
                                    <div className="d-flex align-items-center">
                                        <img
                                            src={getImageUrl(game.imageUrl)}
                                            alt={game.title}
                                            style={{width: '40px', height: '40px', objectFit: 'cover'}}
                                            className="rounded me-2"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://via.placeholder.com/40x40?text=No+Image';
                                            }}
                                        />
                                        <div>
                                            <strong>{game.title}</strong>
                                            <br/>
                                            <small className="text-muted">TH{game.gameNumber}</small>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    {game.characters && game.characters.length > 0 ? (
                                        <div>
                                            {game.characters.map(character => (
                                                <span key={character.id}
                                                      className="badge bg-light text-dark border me-1 mb-1 d-inline-flex align-items-center p-2">
                                                    <img
                                                        src={getImageUrl(character.imageUrl)}
                                                        alt={character.name}
                                                        style={{width: '20px', height: '20px', objectFit: 'cover'}}
                                                        className="rounded-circle me-2"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = 'https://via.placeholder.com/20x20?text=?';
                                                        }}
                                                    />
                                                    {character.name}
                                                    <button
                                                        type="button"
                                                        className="btn-close btn-close-sm ms-2"
                                                        style={{fontSize: '0.6em'}}
                                                        onClick={() => handleRemoveCharacterFromGame(game.id, character.id, game.title, character.name)}
                                                        disabled={loading}
                                                        title={`Remove ${character.name} from ${game.title}`}
                                                    ></button>
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

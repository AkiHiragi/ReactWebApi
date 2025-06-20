import {useState} from "react";
import {addGame, deleteGame, getImageUrl, updateGame} from "../../services/api";

const GameManagement = ({games, onDataChange, onMessage}) => {
    const [loading, setLoading] = useState(false);
    const [gameForm, setGameForm] = useState({
        title: '',
        gameNumber: '',
        imageUrl: ''
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [editingGame, setEditingGame] = useState(null);

    const filteredGames = games.filter(game =>
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.gameNumber.toString().includes(searchQuery)
    );

    const handleGameSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        onMessage(null, null); // Очищаем сообщения

        try {
            await addGame({
                ...gameForm,
                gameNumber: parseFloat(gameForm.gameNumber)
            });

            onMessage(null, 'Game added successfully');
            setGameForm({title: '', gameNumber: '', imageUrl: ''});
            onDataChange(); // Обновляем данные в родителе
        } catch (err) {
            if (err.response?.status === 400) {
                const validationErrors = err.response.data.errors;
                const errorMessage = Object.values(validationErrors).flat();
                onMessage(errorMessage.join(', '), null);
            } else {
                onMessage('Failed to add game', null);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteGame = async (id, title) => {
        if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
            try {
                await deleteGame(id);
                onMessage(null, 'Game deleted successfully!');
                onDataChange();
            } catch (err) {
                onMessage('Failed to delete game', null);
            }
        }
    };

    const handleUpdateGame = async (e) => {
        e.preventDefault();
        setLoading(true);
        onMessage(null, null);

        try {
            await updateGame(editingGame.id, {
                ...editingGame,
                gameNumber: parseFloat(editingGame.gameNumber)
            });
            onMessage(null, 'Game updated successfully');
            setEditingGame(null);
            onDataChange();
        } catch (err) {
            if (err.response?.status === 400) {
                const validationErrors = err.response.data.errors;
                const errorMessage = Object.values(validationErrors).flat();
                onMessage(errorMessage.join(', '), null);
            } else {
                onMessage('Failed to update game', null);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search games..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

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
                            {filteredGames.map(game => (
                                <tr key={game.id}>
                                    <td>{game.gameNumber}</td>
                                    <td>{game.title}</td>
                                    <td>
                                        <img src={getImageUrl(game.imageUrl)} alt={game.title}
                                             style={{height: '50px'}}/>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => setEditingGame(game)}
                                        >
                                            Edit
                                        </button>
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

            {/* Модальное окно редактирования */}
            {editingGame && (
                <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Game</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setEditingGame(null)}
                                ></button>
                            </div>
                            <form onSubmit={handleUpdateGame}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Game Title</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={editingGame.title}
                                            onChange={(e) => setEditingGame({...editingGame, title: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Game Number</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            className="form-control"
                                            value={editingGame.gameNumber}
                                            onChange={(e) => setEditingGame({
                                                ...editingGame,
                                                gameNumber: e.target.value
                                            })}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Image URL</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={editingGame.imageUrl}
                                            onChange={(e) => setEditingGame({...editingGame, imageUrl: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => setEditingGame(null)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={loading}
                                        >
                                            {loading ? 'Updating' : 'Update Game'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default GameManagement;

import {useEffect, useState} from "react";
import {addGame, deleteGame, getAllGames} from "../services/api";

const AdminPanel = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [gameForm, setGameForm] = useState({
        title: '',
        gameNumber: '',
        imageUrl: ''
    });

    useEffect(() => {
        fetchGames();
    }, []);

    const fetchGames = async () => {
        try {
            const data = await getAllGames();
            setGames(data);
        } catch (err) {
            setError('Failed to fetch games');
        }
    }

    const handleSubmit = async (e) => {
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
            setGameForm({
                title: '',
                gameNumber: '',
                imageUrl: ''
            });
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

    const handleDelete = async (id, title) => {
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

    return (
        <div className="container mt-4">
            <h2>Admin Panel - Games</h2>

            {/* Сообщения */}
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {/* Форма добавления */}
            <div className="card mb-4">
                <div className="card-header">
                    <h4>Add New Game</h4>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
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
                                    placeholder="Image URL (e.g., Images/th08.jpg)"
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

            {/* Список игр */}
            <div className="card">
                <div className="card-header">
                    <h4>Existing Games</h4>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Number</th>
                                <th>Image</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {games.map(game => (
                                <tr key={game.id}>
                                    <td>{game.id}</td>
                                    <td>{game.title}</td>
                                    <td>{game.gameNumber}</td>
                                    <td>{game.imageUrl}</td>
                                    <td>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(game.id, game.title)}
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
        </div>
    );
};

export default AdminPanel;
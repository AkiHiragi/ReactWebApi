import {useState} from "react";
import {addMusicTheme, deleteMusicTheme, updateMusicTheme} from "../../services/api";

const MusicThemeManagement = ({musicThemes, games, characters, onDataChange, onMessage}) => {
    const [loading, setLoading] = useState(false);
    const [musicThemeForm, setMusicThemeForm] = useState({
        title: '',
        gameId: '',
        characterId: ''
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [editingMusicTheme, setEditingMusicTheme] = useState(null);

    const filteredMusicThemes = musicThemes.filter(theme =>
        theme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (theme.gameName && theme.gameName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (theme.characterName && theme.characterName.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleMusicThemeSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        onMessage(null, null);

        try {
            await addMusicTheme({
                ...musicThemeForm,
                gameId: parseInt(musicThemeForm.gameId),
                characterId: parseInt(musicThemeForm.characterId)
            });
            onMessage(null, 'Music theme added successfully');
            setMusicThemeForm({title: '', gameId: '', characterId: ''});
            onDataChange();
        } catch (err) {
            if (err.response?.status === 400) {
                const validationErrors = err.response.data.errors;
                const errorMessage = Object.values(validationErrors).flat();
                onMessage(errorMessage.join(', '), null);
            } else {
                onMessage('Failed to add music theme', null);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteMusicTheme = async (id, title) => {
        if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
            try {
                await deleteMusicTheme(id);
                onMessage(null, 'Music theme deleted successfully!');
                onDataChange();
            } catch (err) {
                onMessage('Failed to delete music theme', null);
            }
        }
    };

    const handleUpdateMusicTheme = async (e) => {
        e.preventDefault();
        setLoading(true);
        onMessage(null, null);

        try {
            await updateMusicTheme(editingMusicTheme.id, {
                ...editingMusicTheme,
                gameId: parseInt(editingMusicTheme.gameId),
                characterId: parseInt(editingMusicTheme.characterId)
            });
            onMessage(null, 'Music theme updated successfully');
            setEditingMusicTheme(null);
            onDataChange();
        } catch (err) {
            if (err.response?.status === 400) {
                const validationErrors = err.response.data.errors;
                const errorMessage = Object.values(validationErrors).flat();
                onMessage(errorMessage.join(', '), null);
            } else {
                onMessage('Failed to update music theme', null);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search music themes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="card mb-4">
                <div className="card-header">
                    <h4>Add New Music Theme</h4>
                </div>
                <div className="card-body">
                    <form onSubmit={handleMusicThemeSubmit}>
                        <div className="row">
                            <div className="col-md-4">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Music Theme Title"
                                    value={musicThemeForm.title}
                                    onChange={(e) => setMusicThemeForm({...musicThemeForm, title: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="col-md-3">
                                <select
                                    className="form-control"
                                    value={musicThemeForm.gameId}
                                    onChange={(e) => setMusicThemeForm({...musicThemeForm, gameId: e.target.value})}
                                    required
                                >
                                    <option value="">Select Game</option>
                                    {games.map(game => (
                                        <option key={game.id} value={game.id}>
                                            {game.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-3">
                                <select
                                    className="form-control"
                                    value={musicThemeForm.characterId}
                                    onChange={(e) => setMusicThemeForm({
                                        ...musicThemeForm,
                                        characterId: e.target.value
                                    })}
                                    required
                                >
                                    <option value="">Select Character</option>
                                    {characters.map(character => (
                                        <option key={character.id} value={character.id}>
                                            {character.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-2">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? 'Adding...' : 'Add Theme'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h4>Existing Music Themes</h4>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                            <tr>
                                <th>Title</th>
                                <th>Game</th>
                                <th>Character</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredMusicThemes.map(theme => (
                                <tr key={theme.id}>
                                    <td>{theme.title}</td>
                                    <td>{theme.gameName || theme.gameTitle}</td>
                                    <td>{theme.characterName}</td>
                                    <td>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => setEditingMusicTheme(theme)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDeleteMusicTheme(theme.id, theme.title)}
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
            {editingMusicTheme && (
                <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Music Theme</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setEditingMusicTheme(null)}
                                ></button>
                            </div>
                            <form onSubmit={handleUpdateMusicTheme}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Theme Title</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={editingMusicTheme.title}
                                            onChange={(e) => setEditingMusicTheme({
                                                ...editingMusicTheme,
                                                title: e.target.value
                                            })}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Game</label>
                                        <select
                                            className="form-control"
                                            value={editingMusicTheme.gameId}
                                            onChange={(e) => setEditingMusicTheme({
                                                ...editingMusicTheme,
                                                gameId: e.target.value
                                            })}
                                            required
                                        >
                                            <option value="">Select Game</option>
                                            {games.map(game => (
                                                <option key={game.id} value={game.id}>
                                                    {game.title}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Character</label>
                                        <select
                                            className="form-control"
                                            value={editingMusicTheme.characterId}
                                            onChange={(e) => setEditingMusicTheme({
                                                ...editingMusicTheme,
                                                characterId: e.target.value
                                            })}
                                            required
                                        >
                                            <option value="">Select Character</option>
                                            {characters.map(character => (
                                                <option key={character.id} value={character.id}>
                                                    {character.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setEditingMusicTheme(null)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? 'Updating...' : 'Update Theme'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default MusicThemeManagement;

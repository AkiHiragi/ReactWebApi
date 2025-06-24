import {useEffect, useState} from "react";
import {getAllGamesWithCharacters, updateMusicTheme} from "../../services/api";
import SearchableSelect from "../common/SearchableSelect";

const MusicThemeRelationManagement = ({games, characters, musicThemes, onDataChange, onMessage}) => {
    const [loading, setLoading] = useState(false);
    const [selectedGameId, setSelectedGameId] = useState('');
    const [selectedCharacterId, setSelectedCharacterId] = useState('');
    const [selectedMusicThemeId, setSelectedMusicThemeId] = useState('');
    const [gamesWithDetails, setGamesWithDetails] = useState([]);
    const [availableCharacters, setAvailableCharacters] = useState([]); // Новое состояние

    // Загружаем игры с полной информацией
    const fetchGamesWithDetails = async () => {
        try {
            const data = await getAllGamesWithCharacters();
            setGamesWithDetails(data);
        } catch (err) {
            onMessage('Failed to fetch games with details', null);
        }
    };

    // Обновляем доступных персонажей при выборе игры
    useEffect(() => {

        if (selectedGameId) {
            const selectedGame = gamesWithDetails.find(g => g.id === parseInt(selectedGameId));

            if (selectedGame && selectedGame.characters) {
                setAvailableCharacters(selectedGame.characters);
            } else {
                setAvailableCharacters([]);
            }
            setSelectedCharacterId('');
        } else {
            setAvailableCharacters([]);
            setSelectedCharacterId('');
        }
    }, [selectedGameId, gamesWithDetails]);

    // Загружаем данные при монтировании компонента
    useEffect(() => {
        fetchGamesWithDetails();
    }, []);

    // Привязка существующей музыкальной темы к игре/персонажу
    const handleLinkExistingTheme = async () => {
        if (!selectedGameId || !selectedMusicThemeId) return;

        setLoading(true);
        onMessage(null, null);

        try {
            const selectedTheme = musicThemes.find(t => t.id.toString() === selectedMusicThemeId);

            await updateMusicTheme(selectedMusicThemeId, {
                ...selectedTheme,
                gameId: parseInt(selectedGameId),
                characterId: selectedCharacterId ? parseInt(selectedCharacterId) : null
            });

            onMessage(null, 'Music theme linked successfully');
            setSelectedGameId('');
            setSelectedCharacterId('');
            setSelectedMusicThemeId('');
            onDataChange();
            fetchGamesWithDetails();
        } catch (err) {
            if (err.response?.status === 400) {
                const validationErrors = err.response.data.errors;
                const errorMessage = Object.values(validationErrors).flat();
                onMessage(errorMessage.join(', '), null);
            } else {
                onMessage('Failed to link music theme', null);
            }
        } finally {
            setLoading(false);
        }
    };

    // Отвязка музыкальной темы
    const handleUnlinkTheme = async (themeId, themeName) => {
        if (window.confirm(`Unlink "${themeName}" from its current game and character?`)) {
            setLoading(true);
            onMessage(null, null);

            try {
                const theme = musicThemes.find(t => t.id === themeId);
                await updateMusicTheme(themeId, {
                    ...theme,
                    gameId: null,
                    characterId: null
                });

                onMessage(null, 'Music theme unlinked successfully');
                onDataChange();
                fetchGamesWithDetails();
            } catch (err) {
                onMessage('Failed to unlink music theme', null);
            } finally {
                setLoading(false);
            }
        }
    };

    // Фильтруем несвязанные музыкальные темы
    const unlinkedThemes = musicThemes.filter(theme => !theme.gameId);

    return (
        <div className="card">
            <div className="card-header">
                <h4>Manage Music Theme Relations</h4>
            </div>
            <div className="card-body">
                {/* Форма для привязки существующих тем */}
                <div className="card mb-4">
                    <div className="card-header">
                        <h5>Link Existing Music Theme</h5>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-4">
                                <label>Select Music Theme:</label>
                                <select
                                    className="form-control"
                                    value={selectedMusicThemeId}
                                    onChange={(e) => setSelectedMusicThemeId(e.target.value)}
                                >
                                    <option value="">Choose a music theme...</option>
                                    {unlinkedThemes.map(theme => (
                                        <option key={theme.id} value={theme.id}>
                                            {theme.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label>Select Game:</label>
                                <SearchableSelect
                                    options={games}
                                    value={selectedGameId}
                                    onChange={setSelectedGameId}
                                    placeholder="Search game..."
                                    displayField="title"
                                    valueField="id"
                                    imageField="imageUrl"
                                    secondaryField="gameNumber"
                                />
                            </div>
                            <div className="col-md-3">
                                <label>Select Character:</label>
                                <SearchableSelect
                                    options={[
                                        {
                                            id: '',
                                            name: 'No character (Game theme)',
                                            imageUrl: 'Images/music-note.png'
                                        },
                                        ...availableCharacters
                                    ]}
                                    value={selectedCharacterId}
                                    onChange={setSelectedCharacterId}
                                    placeholder={selectedGameId ? "Search character..." : "Select game first"}
                                    displayField="name"
                                    valueField="id"
                                    imageField="imageUrl"
                                    disabled={!selectedGameId} // Отключаем, если игра не выбрана
                                />
                            </div>
                            <div className="col-md-2">
                                <label>&nbsp;</label>
                                <button
                                    className="btn btn-success form-control"
                                    onClick={handleLinkExistingTheme}
                                    disabled={!selectedGameId || !selectedMusicThemeId || loading}
                                >
                                    {loading ? 'Linking...' : 'Link'}
                                </button>
                            </div>
                        </div>

                        {/* Подсказка для пользователя */}
                        {selectedGameId && availableCharacters.length === 0 && (
                            <div className="alert alert-info mt-2">
                                <small>No characters are linked to this game yet. Please add characters to the game
                                    first in the Relationships tab.</small>
                            </div>
                        )}
                    </div>
                </div>

                {/* Остальной код остается без изменений... */}
                {/* Таблица текущих связей */}
                <h5>Current Music Theme Relations:</h5>
                <div className="table-responsive">
                    <table className="table table-sm">
                        <thead>
                        <tr>
                            <th>Music Theme</th>
                            <th>Game</th>
                            <th>Character</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {musicThemes
                            .filter(theme => theme.gameId)
                            .map(theme => (
                                <tr key={theme.id}>
                                    <td>
                                        <strong>{theme.title}</strong>
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            {theme.gameTitle && (
                                                <small className="text-muted me-2">
                                                    {theme.gameTitle}
                                                </small>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            {theme.characterName && (
                                                <span className="badge bg-light text-dark border">
                                                    {theme.characterName}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => handleUnlinkTheme(theme.id, theme.title)}
                                            disabled={loading}
                                            title={`Unlink ${theme.title}`}
                                        >
                                            Unlink
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Показываем несвязанные темы */}
                {unlinkedThemes.length > 0 && (
                    <>
                        <h5 className="mt-4">Unlinked Music Themes:</h5>
                        <div className="row">
                            {unlinkedThemes.map(theme => (
                                <div key={theme.id} className="col-md-4 mb-2">
                                    <div className="card">
                                        <div className="card-body p-2">
                                            <h6 className="card-title mb-0">{theme.title}</h6>
                                            <small className="text-muted">Not linked to any game/character</small>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MusicThemeRelationManagement;

import {useEffect, useState} from "react";
import {getAllCharactersWithGames, getAllGames, getImageUrl} from "../services/api";
import {Link} from "react-router-dom";

const CharacterList = () => {
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGame, setSelectedGame] = useState('');
    const [games, setGames] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [charactersData, gamesData] = await Promise.all([
                    getAllCharactersWithGames(),
                    getAllGames()
                ]);
                setCharacters(charactersData);
                setGames(gamesData);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch data');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredCharacters = characters.filter(character => {
        const matchesSearch = character.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGame = selectedGame === '' ||
            character.games?.some(game => game.id.toString() === selectedGame);
        return matchesSearch && matchesGame;
    });

    if (loading) return <div className="text-center mt-5">Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container mt-4">
            <div className="row mb-4">
                <div className="col-md-4">
                    <h2>Characters</h2>
                </div>
                <div className="col-md-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search characters..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="col-md-4">
                    <select
                        className="form-control"
                        value={selectedGame}
                        onChange={(e) => setSelectedGame(e.target.value)}
                    >
                        <option value="">All Games</option>
                        {games.map(game => (
                            <option key={game.id} value={game.id}>
                                {game.title}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="row">
                {filteredCharacters.map(character => (
                    <div key={character.id} className="col-md-4 mb-4">
                        <div className="card">
                            <img src={getImageUrl(character.imageUrl)}
                                 className="card-img-top"
                                 alt={character.name}
                                 style={{height: '200px', objectFit: 'contain'}}
                                 onError={(e) => {
                                     e.target.onerror = null;
                                     e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found'
                                 }}
                            />
                            <div className="card-body">
                                <h5 className="card-title">{character.name}</h5>
                                <Link to={`/characters/${character.id}`} className="btn btn-primary">View Details</Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredCharacters.length === 0 && (searchTerm || selectedGame) && (
                <div className="text-center mt-4">
                    <p className="text-muted">No characters found</p>
                </div>
            )}
        </div>
    )
}

export default CharacterList;
import {useEffect, useState} from "react";
import {getAllGames, getImageUrl} from "../services/api";
import {Link} from "react-router-dom";

const GameList = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const data = await getAllGames();
                setGames(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch games');
                setLoading(false);
            }
        };

        fetchGames();
    }, []);

    const filteredGames = games.filter(game =>
        game.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="text-center mt-5">Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container mt-4">
            <div className="row mb-4">
                <div className="col-md-6">
                    <h2>Games</h2>
                </div>
                <div className="col-md-6">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search games..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="row">
                {filteredGames.map(game => (
                    <div key={game.id} className="col-md-4 mb-4">
                        <div className="card">
                            <img src={getImageUrl(game.imageUrl)}
                                 className="card-img-top"
                                 alt={game.title}
                                 style={{height: '200px', objectFit: 'contain'}}
                                 onError={(e) => {
                                     e.target.onerror = null;
                                     e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found'
                                 }}
                            />

                            <div className="card-body">
                                <h5 className="card-title">{game.title}</h5>
                                <p className="card-text">Game #{game.gameNumber}</p>
                                <Link to={`/games/${game.id}`} className="btn btn-primary">View Details</Link>
                            </div>
                        </div>
                    </div>
                ))
                }
            </div>

            {filteredGames.length === 0 && searchTerm && (
                <div className="text-center mt-4">
                    <p className="text-muted">No games found for "{searchTerm}"</p>
                </div>
            )}
        </div>
    )
}

export default GameList;
import {useEffect, useState} from "react";
import {getAllGames, getImageUrl} from "../services/api";

const GameList = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    if (loading) return <div className="text-center mt-5">Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container mt-4">
            <h2>Games</h2>
            <div className="row">
                {games.map(game => (
                    <div key={game.id} className="col-md-4 mb-4">
                        <div className="card">
                            <img src={getImageUrl(game.imageUrl)}
                                 className="card-img-top"
                                 alt={game.title}
                                 onError={(e) => {
                                     e.target.onerror = null;
                                     e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found'
                                 }}
                            />

                            <div className="card-body">
                                <h5 className="card-title">{game.title}</h5>
                                <p className="card-text">Game #{game.gameNumber}</p>
                                <button className="btn btn-primary">View Details</button>
                            </div>
                        </div>
                    </div>
                ))
                }
            </div>
        </div>
    )
}

export default GameList;
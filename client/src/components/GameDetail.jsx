import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getGameById, getImageUrl} from "../services/api";

const GameDetail = () => {
    const {id} = useParams();
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGame = async () => {
            try {
                const data = await getGameById(id);
                setGame(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch game details');
                setLoading(false);
            }
        };

        fetchGame();
    }, [id]);

    if (loading) return <div className="text-center mt-5">Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;
    if (!game) return <div className="alert alert-warning">Game not found</div>;

    return (
        <div className="container mt-4">
            <Link to="/games" className="btn btn-secondary mb-3">← Back to Games</Link>

            <div className="row">
                <div className="col-md-4">
                    <img src={getImageUrl(game.imageUrl)}
                         className="img-fluid rounded"
                         alt={game.title}
                         style={{maxHeight: '400px', objectFit: 'contain'}}
                    />
                </div>
                <div className="col-md-8">
                    <h1>{game.title}</h1>
                    <p className="lead">Game #{game.gameNumber}</p>

                    <h3>Characters</h3>
                    <div className="row">
                        {game.characters.map(character => (
                            <div key={character.id} className="col-md-6 mb-2">
                                <Link to={`/characters/${character.id}`} className="text-decoration-none">
                                    <div className="card character-card">
                                        <div className="card-body p-2">
                                            <h6 className="card-title mb-0 text-primary">{character.name}</h6>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>

                    <h3 className="mt-4">Music Themes</h3>
                    <ul className="list-group">
                        {game.musicThemes.map(theme => (
                            <li key={theme.id} className="list-group-item">
                                <strong>{theme.title}</strong>
                                {theme.characterName && <span className="text-muted"> - {theme.characterName}</span>}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default GameDetail;
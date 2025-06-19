import {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {getCharacterById, getImageUrl} from "../services/api";

const CharacterDetail = () => {
    const {id} = useParams();
    const [character, setCharacter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCharacter = async () => {
            try {
                const data = await getCharacterById(id);
                setCharacter(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch character details');
                setLoading(false);
            }
        };

        fetchCharacter();
    }, [id]);

    if (loading) return <div className="text-center mt-5">Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;
    if (!character) return <div className="alert alert-warning">Character not found</div>;

    return (
        <div className="container mt-4">
            <Link to="/characters" className="btn btn-secondary mb-3">← Back to Characters</Link>

            <div className="row">
                <div className="col-md-4">
                    <img src={getImageUrl(character.imageUrl)}
                         className="img-fluid rounded"
                         alt={character.name}
                         style={{maxHeight: '400px', objectFit: 'contain'}}
                    />
                </div>
                <div className="col-md-8">
                    <h1>{character.name}</h1>
                    <p className="lead">{character.description}</p>

                    <h3>Abilities</h3>
                    <ul className="list-group mb-4">
                        {character.abilities.map((ability, index) => (
                            <li key={index} className="list-group-item">{ability}</li>
                        ))}
                    </ul>

                    <h3>Appears in Games</h3>
                    <div className="row">
                        {character.games.map(game => (
                            <div key={game.id} className="col-md-6 mb-2">
                                <div className="card">
                                    <div className="card-body p-2">
                                        <h6 className="card-title mb-0">{game.title}</h6>
                                        <small className="text-muted">Game #{game.gameNumber}</small>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <h3 className="mt-4">Music Themes</h3>
                    <ul className="list-group">
                        {character.musicThemes.map(theme => (
                            <li key={theme.id} className="list-group-item">
                                <strong>{theme.title}</strong>
                                {theme.gameTitle && <span className="text-muted"> - {theme.gameTitle}</span>}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CharacterDetail;

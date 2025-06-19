import {useEffect, useState} from "react";
import {getAllCharacters, getImageUrl} from "../services/api";
import {Link} from "react-router-dom";

const CharacterList = () => {
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCharacters = async () => {
            try {
                const data = await getAllCharacters();
                setCharacters(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch characters');
                setLoading(false);
            }
        };

        fetchCharacters();
    }, []);

    if (loading) return <div className="text-center mt-5">Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container mt-4">
            <h2>Characters</h2>
            <div className="row">
                {characters.map(character => (
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
        </div>
    )
}

export default CharacterList;
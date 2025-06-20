import {useState} from "react";
import {addCharacter, deleteCharacter, getImageUrl} from "../../services/api";

const CharacterManagement = ({characters, onDataChange, onMessage}) => {
    const [loading, setLoading] = useState(false);
    const [characterForm, setCharacterForm] = useState({
        name: '',
        description: '',
        abilities: '',
        imageUrl: ''
    });
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCharacters = characters.filter(character =>
        character.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (character.description && character.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (Array.isArray(character.abilities) && character.abilities.some(ability =>
            ability.toLowerCase().includes(searchQuery.toLowerCase())
        ))
    );

    const handleCharacterSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        onMessage(null, null);

        try {
            await addCharacter({
                ...characterForm,
                abilities: characterForm.abilities.split(',').map(a => a.trim()).filter(a => a)
            });
            onMessage(null, 'Character added successfully');
            setCharacterForm({name: '', description: '', abilities: '', imageUrl: ''});
            onDataChange();
        } catch (err) {
            if (err.response?.status === 400) {
                const validationErrors = err.response.data.errors;
                const errorMessage = Object.values(validationErrors).flat();
                onMessage(errorMessage.join(', '), null);
            } else {
                onMessage('Failed to add character', null);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCharacter = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            try {
                await deleteCharacter(id);
                onMessage(null, 'Character deleted successfully!');
                onDataChange();
            } catch (err) {
                onMessage('Failed to delete character', null);
            }
        }
    };

    return (
        <>
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search characters..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="card mb-4">
                <div className="card-header">
                    <h4>Add New Character</h4>
                </div>
                <div className="card-body">
                    <form onSubmit={handleCharacterSubmit}>
                        <div className="row">
                            <div className="col-md-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Character Name"
                                    value={characterForm.name}
                                    onChange={(e) => setCharacterForm({...characterForm, name: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="col-md-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Description"
                                    value={characterForm.description}
                                    onChange={(e) => setCharacterForm({...characterForm, description: e.target.value})}
                                />
                            </div>
                            <div className="col-md-4">
            <textarea
                className="form-control"
                placeholder="Abilities (comma separated)"
                value={characterForm.abilities}
                onChange={(e) => setCharacterForm({...characterForm, abilities: e.target.value})}
                rows="1"
            />
                            </div>
                            <div className="col-md-2">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Image URL"
                                    value={characterForm.imageUrl}
                                    onChange={(e) => setCharacterForm({...characterForm, imageUrl: e.target.value})}
                                    required
                                />
                            </div>
                        </div>
                        <div className="row mt-2">
                            <div className="col-md-12 d-flex justify-content-end">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? 'Adding...' : 'Add Character'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h4>Existing Characters</h4>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Abilities</th>
                                <th>Image</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredCharacters.map(character => (
                                <tr key={character.id}>
                                    <td>{character.name}</td>
                                    <td>{character.description}</td>
                                    <td>{Array.isArray(character.abilities) ? character.abilities.join(', ') : character.abilities}</td>
                                    <td>
                                        <img src={getImageUrl(character.imageUrl)} alt={character.name}
                                             style={{height: '50px'}}/>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDeleteCharacter(character.id, character.name)}
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
        </>
    );
};

export default CharacterManagement;

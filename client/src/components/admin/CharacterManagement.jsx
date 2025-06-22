import React, {useState} from "react";
import {addCharacter, deleteCharacter, getImageUrl, updateCharacter} from "../../services/api";
import {useImageUpload} from "../../hooks/useImageUpload";
import ImageUpload from "../common/ImageUpload";

const CharacterManagement = ({characters, onDataChange, onMessage}) => {
    const [loading, setLoading] = useState(false);
    const [characterForm, setCharacterForm] = useState({
        name: '',
        description: '',
        abilities: '',
        imageUrl: ''
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [editingCharacter, setEditingCharacter] = useState(null);
    
    const addImage = useImageUpload();
    const editImage = useImageUpload();

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
            let imageUrl = characterForm.imageUrl;
            const uploadedImageUrl = await addImage.uploadImageFile();
            if (uploadedImageUrl) imageUrl = uploadedImageUrl;

            await addCharacter({
                ...characterForm,
                imageUrl,
                abilities: characterForm.abilities.split(',').map(a => a.trim()).filter(a => a)
            });

            onMessage(null, 'Character added successfully');
            setCharacterForm({name: '', description: '', abilities: '', imageUrl: ''});
            addImage.resetImage();
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

    const handleUpdateCharacter = async (e) => {
        e.preventDefault();
        setLoading(true);
        onMessage(null, null);

        try {
            let imageUrl = editingCharacter.imageUrl;
            const uploadedImageUrl = await editImage.uploadImageFile();
            if (uploadedImageUrl) imageUrl = uploadedImageUrl;

            await updateCharacter(editingCharacter.id, {
                ...editingCharacter,
                imageUrl,
                abilities: Array.isArray(editingCharacter.abilities)
                    ? editingCharacter.abilities
                    : editingCharacter.abilities.split(',').map(a => a.trim()).filter(a => a)
            });
            onMessage(null, 'Character updated successfully');
            setEditingCharacter(null);
            editImage.resetImage();
            onDataChange();
        } catch (err) {
            if (err.response?.status === 400) {
                const validationErrors = err.response.data.errors;
                const errorMessage = Object.values(validationErrors).flat();
                onMessage(errorMessage.join(', '), null);
            } else {
                onMessage('Failed to update character', null);
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
                            <div className="col-md-4">
                                <div style={{marginTop: '32px'}}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Character Name"
                                        value={characterForm.name}
                                        onChange={(e) => setCharacterForm({...characterForm, name: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div style={{marginTop: '32px'}}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Description"
                                        value={characterForm.description}
                                        onChange={(e) => setCharacterForm({
                                            ...characterForm,
                                            description: e.target.value
                                        })}
                                    />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <ImageUpload
                                    label="Character Image"
                                    imagePreview={addImage.imagePreview}
                                    onImageChange={addImage.handleImageChange}
                                />
                            </div>
                        </div>

                        <div className="row mt-2">
                            <div className="col-md-12">
                                <textarea
                                    className="form-control"
                                    placeholder="Abilities (comma separated)"
                                    value={characterForm.abilities}
                                    onChange={(e) => setCharacterForm({...characterForm, abilities: e.target.value})}
                                    rows="2"
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
                                <th>Image</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredCharacters.map(character => (
                                <tr key={character.id}>
                                    <td>
                                        <img
                                            src={getImageUrl(character.imageUrl)}
                                            alt={character.name}
                                            style={{width: '80px', height: '80px', objectFit: 'cover'}}
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <strong>{character.name}</strong>
                                        <br/>
                                        <small className="text-muted">
                                            {Array.isArray(character.abilities) 
                                                ? character.abilities.slice(0, 2).join(', ') + (character.abilities.length > 2 ? '...' : '')
                                                : character.abilities
                                            }
                                        </small>
                                    </td>
                                    <td>{character.description}</td>
                                    <td>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => setEditingCharacter({
                                                ...character,
                                                abilities: Array.isArray(character.abilities)
                                                    ? character.abilities.join(', ')
                                                    : character.abilities
                                            })}
                                        >
                                            Edit
                                        </button>
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

            {/* Модальное окно редактирования */}
            {editingCharacter && (
                <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Character</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => {
                                        setEditingCharacter(null);
                                        editImage.resetImage();
                                    }}
                                ></button>
                            </div>
                            <form onSubmit={handleUpdateCharacter}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Character Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={editingCharacter.name}
                                            onChange={(e) => setEditingCharacter({
                                                ...editingCharacter,
                                                name: e.target.value
                                            })}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Description</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={editingCharacter.description}
                                            onChange={(e) => setEditingCharacter({
                                                ...editingCharacter,
                                                description: e.target.value
                                            })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Abilities (comma separated)</label>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            value={editingCharacter.abilities}
                                            onChange={(e) => setEditingCharacter({
                                                ...editingCharacter,
                                                abilities: e.target.value
                                            })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <ImageUpload
                                            label="Character Image"
                                            imagePreview={editImage.imagePreview}
                                            onImageChange={editImage.handleImageChange}
                                            currentImage={getImageUrl(editingCharacter.imageUrl)}
                                            showCurrent={true}
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => {
                                            setEditingCharacter(null);
                                            editImage.resetImage();
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? 'Updating...' : 'Update Character'}
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

export default CharacterManagement;
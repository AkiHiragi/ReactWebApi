import axios from "axios";

const BASE_URL = 'http://localhost:5000';
const API_URL = `${BASE_URL}/api`;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getAllGames = async () => {
    try {
        const response = await api.get('/games');
        return response.data;
    } catch (error) {
        console.error('Error fetching games:', error);
        throw error;
    }
}

export const getAllCharacters = async () => {
    try {
        const response = await api.get('/characters');
        return response.data;
    } catch (error) {
        console.error('Error fetching characters:', error);
        throw error;
    }
}

export const getGameById = async (id) => {
    try {
        const response = await api.get(`/games/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching game`, error);
        throw error;
    }
}

export const getCharacterById = async (id) => {
    try {
        const response = await api.get(`/characters/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching character`, error);
        throw error;
    }
}

export const getAllCharactersWithGames = async () => {
    try {
        const response = await api.get('/characters/WithGames');
        return response.data;
    } catch (error) {
        console.error('Error fetching characters with games:', error);
        throw error;
    }
}

export const addGame = async (gameData) => {
    try {
        const response = await api.post('/games', gameData);
        return response.data;
    } catch (error) {
        console.error('Error adding game:', error);
        throw error;
    }
}

export const deleteGame = async (id) => {
    try {
        const response = await api.delete(`/games/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting game`, error);
        throw error;
    }
}

export const addCharacter = async (characterData) => {
    try {
        const response = await api.post('/characters', characterData);
        return response.data;
    } catch (error) {
        console.error('Error adding character:', error);
        throw error;
    }
}

export const deleteCharacter = async (id) => {
    try {
        const response = await api.delete(`/characters/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting character`, error);
        throw error;
    }
}

export const addCharacterToGame = async (gameId, characterId) => {
    try {
        await api.post(`/games/${gameId}/characters/${characterId}`);
    } catch (error) {
        console.error(`Error adding character to game`, error);
        throw error;
    }
}

export const removeCharacterFromGame = async (gameId, characterId) => {
    try {
        await api.delete(`/games/${gameId}/characters/${characterId}`);
    } catch (error) {
        console.error('Error removing character from game:', error);
        throw error;
    }
};

export const getAllGamesWithCharacters = async () => {
    try {
        const response = await api.get('/games/WithCharacters');
        return response.data;
    } catch (error) {
        console.error('Error fetching games with characters:', error);
        throw error;
    }
}

export const updateGame = async (id, gameData) => {
    try {
        const response = await api.put(`/games/${id}`, gameData);
        return response.data;
    } catch (error) {
        console.error(`Error updating game:`, error);
        throw error;
    }
}

export const updateCharacter = async (id, characterData) => {
    try {
        const response = await api.put(`/characters/${id}`, characterData);
        return response.data;
    } catch (error) {
        console.error(`Error updating character:`, error);
        throw error;
    }
}

export const uploadImage = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/fileupload/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
}

export const getImageUrl = (imageUrl) => `${BASE_URL}/${imageUrl}`;

export const getAllMusicThemes = async () => {
    try {
        const response = await api.get('/musicthemes');
        return response.data;
    } catch (error) {
        console.error('Error fetching music themes:', error);
        throw error;
    }
};

export const getMusicThemeById = async (id) => {
    try {
        const response = await api.get(`/musicthemes/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching music theme:', error);
        throw error;
    }
};

export const addMusicTheme = async (musicThemeData) => {
    try {
        const response = await api.post('/musicthemes', musicThemeData);
        return response.data;
    } catch (error) {
        console.error('Error adding music theme:', error);
        throw error;
    }
};

export const updateMusicTheme = async (id, musicThemeData) => {
    try {
        const response = await api.put(`/musicthemes/${id}`, musicThemeData);
        return response.data;
    } catch (error) {
        console.error('Error updating music theme:', error);
        throw error;
    }
};

export const deleteMusicTheme = async (id) => {
    try {
        const response = await api.delete(`/musicthemes/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting music theme:', error);
        throw error;
    }
};

export default api;
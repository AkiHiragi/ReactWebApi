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

export const getImageUrl = (imageUrl) => `${BASE_URL}/${imageUrl}`;

export default api;
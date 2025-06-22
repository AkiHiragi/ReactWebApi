import { useState } from 'react';
import { uploadImage } from '../services/api';

export const useImageUpload = () => {
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadImageFile = async () => {
        if (imageFile) {
            const result = await uploadImage(imageFile);
            return result.imageUrl;
        }
        return null;
    };

    const resetImage = () => {
        setImageFile(null);
        setImagePreview('');
    };

    return {
        imageFile,
        imagePreview,
        handleImageChange,
        uploadImageFile,
        resetImage
    };
};
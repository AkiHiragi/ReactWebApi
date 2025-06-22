import React from 'react';

const ImageUpload = ({ 
    label, 
    imagePreview, 
    onImageChange, 
    currentImage = null,
    showCurrent = false 
}) => {
    return (
        <div>
            <label className="form-label">{label}</label>
            <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={onImageChange}
            />
            <div className="mt-2 d-flex gap-2">
                {imagePreview && (
                    <div>
                        <small className="text-muted">New image:</small>
                        <img 
                            src={imagePreview} 
                            alt="Preview" 
                            style={{width: '80px', height: '80px', objectFit: 'cover'}}
                        />
                    </div>
                )}
                {showCurrent && currentImage && (
                    <div>
                        <small className="text-muted">Current image:</small>
                        <img 
                            src={currentImage} 
                            alt="Current" 
                            style={{width: '80px', height: '80px', objectFit: 'cover'}}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageUpload;
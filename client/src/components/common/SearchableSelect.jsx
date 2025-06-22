import {useState, useRef, useEffect} from "react";
import {getImageUrl} from "../../services/api";

const SearchableSelect = ({
                              options = [],
                              value,
                              onChange,
                              placeholder = "Search and select...",
                              displayField = "name",
                              valueField = "id",
                              imageField = "imageUrl",
                              secondaryField = null,
                              className = ""
                          }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);

    const filteredOptions = options.filter(option =>
        option[displayField].toLowerCase().includes(searchTerm.toLowerCase()) ||
        (secondaryField && option[secondaryField]?.toString().toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const selectedOption = options.find(option => option[valueField].toString() === value.toString());

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (option) => {
        onChange(option[valueField]);
        setIsOpen(false);
        setSearchTerm('');
    };

    return (
        <div className={`position-relative ${className}`} ref={dropdownRef}>
            <div
                className="form-control d-flex align-items-center justify-content-between"
                style={{cursor: 'pointer', minHeight: '38px'}}
                onClick={() => setIsOpen(!isOpen)}
            >
                {selectedOption ? (
                    <div className="d-flex align-items-center">
                        <img
                            src={getImageUrl(selectedOption[imageField])}
                            alt={selectedOption[displayField]}
                            style={{width: '24px', height: '24px', objectFit: 'cover'}}
                            className="rounded me-2"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/24x24?text=?';
                            }}
                        />
                        <span>{selectedOption[displayField]}</span>
                        {secondaryField && (
                            <small className="text-muted ms-2">({selectedOption[secondaryField]})</small>
                        )}
                    </div>
                ) : (
                    <span className="text-muted">{placeholder}</span>
                )}
                <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`}></i>
            </div>

            {isOpen && (
                <div
                    className="position-absolute w-100 bg-white border rounded shadow-lg"
                    style={{zIndex: 1000, maxHeight: '300px', overflowY: 'auto', top: '100%'}}
                >
                    <div className="p-2 border-bottom">
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className="py-1">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map(option => (
                                <div
                                    key={option[valueField]}
                                    className="px-3 py-2 d-flex align-items-center hover-bg-light"
                                    style={{cursor: 'pointer'}}
                                    onClick={() => handleSelect(option)}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                >
                                    <img
                                        src={getImageUrl(option[imageField])}
                                        alt={option[displayField]}
                                        style={{width: '32px', height: '32px', objectFit: 'cover'}}
                                        className="rounded me-3"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://via.placeholder.com/32x32?text=?';
                                        }}
                                    />
                                    <div>
                                        <div>{option[displayField]}</div>
                                        {secondaryField && (
                                            <small className="text-muted">{option[secondaryField]}</small>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-3 py-2 text-muted">No results found</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchableSelect;

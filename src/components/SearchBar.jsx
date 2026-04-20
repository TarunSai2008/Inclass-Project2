import React from 'react';
import { RiSearchLine, RiCloseLine } from 'react-icons/ri';

export default function SearchBar({ value, onChange, placeholder = 'Search by company, role, location...' }) {
    return (
        <div className="search-wrapper" style={{ width: '100%' }}>
            <RiSearchLine className="search-icon" />
            <input
                type="text"
                className="search-input"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />
            {value && (
                <button
                    className="search-clear"
                    onClick={() => onChange('')}
                >
                    <RiCloseLine />
                </button>
            )}
        </div>
    );
}

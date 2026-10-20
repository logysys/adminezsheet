import React, { useState, useRef, useEffect } from 'react';

export default function SearchableSelect({ options, value, onChange, placeholder = 'Search...' }) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const wrapperRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions = options.filter(option => 
        option.label.toLowerCase().includes(search.toLowerCase())
    );

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className="relative" ref={wrapperRef}>
            <div
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm rounded-md cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                {selectedOption ? selectedOption.label : placeholder}
            </div>
            
            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    <div className="sticky top-0 bg-white p-2">
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-yellow-400 focus:border-yellow-400"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                            <div
                                key={option.value}
                                className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-yellow-50 ${
                                    value === option.value ? 'bg-yellow-100' : ''
                                }`}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                    setSearch('');
                                }}
                            >
                                {option.label}
                            </div>
                        ))
                    ) : (
                        <div className="cursor-default select-none relative py-2 pl-3 pr-9 text-gray-500">
                            No results found
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
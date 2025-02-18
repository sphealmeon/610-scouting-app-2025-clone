'use client';

import { useState, useEffect } from 'react';
import { ScoutingData } from '../data';

export default function Helper() {
    const [isOpen, setIsOpen] = useState(false);
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const checkScoutName = () => {
            setShowButton(ScoutingData.start.scoutName === 'PL4YBL0CKBL4ST');
        };

        // Check initially and set up interval to check for changes
        checkScoutName();
        const interval = setInterval(checkScoutName, 100);

        return () => clearInterval(interval);
    }, []);

    if (!showButton || !isOpen) {
        return showButton ? (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 right-4 bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-full shadow-lg"
            >
                ???
            </button>
        ) : null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-4 rounded-lg shadow-xl w-[90vw] h-[90vh] relative">
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-2 right-2 text-white hover:text-gray-300 text-xl font-bold"
                >
                    ×
                </button>
                <iframe
                    src="https://www.onlinegames.io/games/2023/construct/198/car-football/index.html"
                    className="w-full h-full"
                    allow="fullscreen"
                ></iframe>
            </div>
        </div>
    );
} 
'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FaMoon, FaSun } from "react-icons/fa"; 

export default function DarkModeToggle() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const handleToggle = () => {
        setIsDarkMode(!isDarkMode);

        if (!isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    return (
        <Button
            onClick={handleToggle}
            className={`fixed top-5 right-5 flex items-center justify-center w-10 h-10 rounded-full ${
                isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' : 'bg-gray-300 hover:bg-gray-200 text-blue-600'
            }`}
        >
            {isDarkMode ? <FaMoon size={20} /> : <FaSun size={20} />}
        </Button>
    );
}

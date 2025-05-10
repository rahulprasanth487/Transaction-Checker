import React from 'react';

const Navbar = () => {
    return (
        <nav className="bg-red-600 shadow-lg w-full h-16">
            <div className="max-w-1xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <span className="text-white text-xl font-bold">TRANSACTION CHECKER</span>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center space-x-4">
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7RRFmIHAqBNuG40Bbo3bRvPExzQK0wyhVlg&s" alt="wells fargo" className="w-8 h-8" />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
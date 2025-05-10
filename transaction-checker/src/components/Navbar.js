import React from 'react';

const Navbar = () => {
    return (
        <nav className="bg-gray-800 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <span className="text-white text-xl font-bold">Transaction Checker</span>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center space-x-4">
                            <a href="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Home</a>
                            <a href="/transactions" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Transactions</a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
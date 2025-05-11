import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import wf_logo from './resources/images/WellsFargo-2.png';

const LandingPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleGetStarted = () => {
        setIsLoading(true);
        // Simulate loading time (you can remove setTimeout in production)
        setTimeout(() => {
            navigate('/dashboard');
        }, 1500);
    };
    return (
        <div className="min-h-screen bg-gradient-to-b ">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col items-center justify-center">
                    <img
                        src={wf_logo}
                        alt="Wells Fargo Logo"
                        className="w-90 h-64 mb-2"
                    />
                </div>
                <div className="text-center">
                    <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl mt-10">
                        <span className="text-[80px] block bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-900">
                            Transaction Checker
                        </span>
                        <span className="block text-gray-600 mt-6 text-3xl">
                            Extract Parameters from Your Transactions
                        </span>
                    </h1>


                    {/* CTA Button */}
                    <div className="mt-[15vh]">
                        <button
                            onClick={handleGetStarted}
                            disabled={isLoading}
                            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-black hover:bg-black transition-all transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50"
                        >
                            {isLoading ? (
                                <>
                                    <LoadingSpinner />
                                    <span className="ml-2">Loading...</span>
                                </>
                            ) : (
                                <>
                                    Get Started Now
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const LoadingSpinner = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export default LandingPage;
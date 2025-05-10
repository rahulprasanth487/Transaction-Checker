import React from 'react';
import { X } from 'lucide-react';

const Drawer = ({ isOpen, onClose, fileData }) => {
    return (
        <>

            <div
                className={`fixed inset-0 bg-black/80 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    } z-40`}
                onClick={onClose}
            />
            <div
                className={`fixed inset-y-0 right-0 w-2/3 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    } z-50`}
            >
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">File Preview</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="h-full p-4">
                    {fileData && (
                        <iframe
                            src={fileData}
                            className="w-full h-[calc(100vh-8rem)]"
                            title="File Preview"
                        />
                    )}
                </div>
            </div>
        </>
    );
};

export default Drawer;
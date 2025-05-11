import React, { useState, useEffect } from 'react';
import { Eye, Upload, Trash } from 'lucide-react';
import Drawer from './drawer';

const FileUpload = () => {
    const [files, setFiles] = useState([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect((event) => {
        const storedFiles = sessionStorage.getItem('uploadedFiles');
        if (storedFiles) {
            setFiles(JSON.parse(storedFiles));
        }
    }, []);

    useEffect(() => {
        return () => {
            // Cleanup function to revoke object URLs when component unmounts
            files.forEach(file => {
                if (file.data) {
                    URL.revokeObjectURL(file.data);
                }
            });
        };
    }, [files]);


    const handleFolderUpload = (event) => {
        console.log("FILE UPLOAD CLICKD");
        event.preventDefault();

        // Revoke previous object URLs
        files.forEach(file => {
            if (file.data) {
                URL.revokeObjectURL(file.data);
            }
        });

        const uploadedFiles = Array.from(event.target.files).filter(file => file.type === 'application/pdf');
        const fileDetails = uploadedFiles.map(file => ({
            name: file.name,
            type: file.type,
            size: file.size,
            data: URL.createObjectURL(file)
        }));

        setFiles(fileDetails);
        sessionStorage.setItem('uploadedFiles', JSON.stringify(fileDetails));
    };

    const handleView = (fileData) => {
        setSelectedFile(fileData);
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
        setSelectedFile(null);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto h-[80vh]">
            <h1 className="text-2xl font-semibold mb-5">Upload a directory</h1>

            <div className='flex flex-col justify-between h-full'>

                <div className=' h-[calc(65vh-1rem)] overflow-y-auto mb-4 border border-gray-200 rounded-lg p-4'>
                    {files.length === 0 && (
                        <div className="flex items-center justify-center h-full text-gray-500 text-lg">
                            No files uploaded yet.
                        </div>
                    )}
                    <div className="space-y-1">
                        {files.map((file, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-2 border-b border-gray-200"
                            >
                                <span className="flex-grow mr-4 truncate cursor-help" title={file.name}>{file.name}</span>
                                <button
                                    onClick={() => handleView(file.data)}
                                    className="p-2 hover:opacity-70 transition-opacity duration-200"
                                    aria-label="View file"
                                >
                                    <Eye className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-center">

                    <div className="">
                        <input
                            type="file"
                            id="folder-upload"
                            webkitdirectory="true"
                            directory="true"
                            multiple
                            onChange={handleFolderUpload}
                            className="hidden"
                        />
                        <label
                            htmlFor="folder-upload"
                            className="inline-block px-6 py-2.5 bg-gray-100 border border-gray-400 rounded-lg cursor-pointer font-bold hover:bg-gray-300 transition-colors duration-200"
                        >
                            <Upload className="w-5 h-5 inline-block mr-2" />
                            <span className=' '>Upload</span>
                        </label>
                    </div>

                    {/* <button
                        class="bg-red-100 hover:bg-red-400 border border-red-500 text-gray-800 py-2 px-4 rounded inline-flex items-center font-bold"
                        onClick={handleClear}
                    >
                        <Trash className="w-5 h-5 inline-block mr-2" />
                        <span>Clear</span>
                    </button> */}
                </div>
            </div>

            <Drawer
                isOpen={isDrawerOpen}
                onClose={handleCloseDrawer}
                fileData={selectedFile}
            />
        </div>
    );
};

export default FileUpload;
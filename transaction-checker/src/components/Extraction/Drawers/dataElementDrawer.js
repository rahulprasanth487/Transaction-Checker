import React from 'react';
import { X } from 'lucide-react';
import { LucidePlusSquare } from "lucide-react";
import dataElementsJson from '../dataElements.json';
import { useEffect, useState } from 'react';
import { LucideEdit3 } from 'lucide-react';
import { Trash2Icon } from 'lucide-react';
import { writeToJsonFile } from '../../../utils/updatingJSON';


const DataElementDrawer = ({ isOpen, onClose }) => {
    const [dataElements, setDataElements] = React.useState([]);
    const [editingElement, setEditingElement] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [elementToDelete, setElementToDelete] = useState(null);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [editedValue, setEditedValue] = useState('');
    const [newElement, setNewElement] = useState({ name: '', expectedValue: '' });


    useEffect(() => {
        setDataElements(dataElementsJson.dataElements);
    }, []);

    const handleEdit = (element) => {
        setEditingElement(element);
        setEditedValue(element.expectedValue);
        setShowEditDialog(true);
    };

    const handleDelete = (element) => {
        setElementToDelete(element);
        setShowDeleteDialog(true);
    };

    const handleAddElement = async (e) => {
        e.preventDefault();
        try {
            const updatedElements = [...dataElements, newElement];
            const success = await writeToJsonFile(updatedElements);
            if (success) {
                setDataElements(updatedElements);
                setNewElement({ name: '', expectedValue: '' });
            }
        } catch (error) {
            console.error('Error adding new element:', error);
        }
    };

    const confirmDelete = async () => {
        try {
            const updatedElements = dataElements.filter(el => el !== elementToDelete);
            const success = await writeToJsonFile(updatedElements);
            if (success) {
                setDataElements(updatedElements);
                setShowDeleteDialog(false);
                setElementToDelete(null);
            }
        } catch (error) {
            console.error('Error updating JSON file:', error);
        }
    };

    const confirmEdit = async () => {
        try {
            const updatedElements = dataElements.map(el =>
                el === editingElement ? { ...el, expectedValue: editedValue } : el
            );
            const success = await writeToJsonFile(updatedElements);
            if (success) {
                setDataElements(updatedElements);
                setShowEditDialog(false);
                setEditingElement(null);
            }
        } catch (error) {
            console.error('Error updating JSON file:', error);
        }
    };

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
                    <h2 className="text-xl font-semibold">Add Data Element</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="h-full p-4">

                    <form onSubmit={handleAddElement} className="flex flex-col space-y-1 mb-10">
                        <label className="text-lg font-semibold mb-2">Name :</label>
                        <input
                            required
                            type="text"
                            placeholder="Data Element Name"
                            value={newElement.name}
                            onChange={(e) => setNewElement({ ...newElement, name: e.target.value })}
                            className="w-full p-2 border rounded mb-4"
                        />
                        <br />
                        <label className="text-lg font-semibold mb-2">Expected Value:</label>
                        <input
                            required
                            type="text"
                            placeholder="Expected Value"
                            value={newElement.expectedValue}
                            onChange={(e) => setNewElement({ ...newElement, expectedValue: e.target.value })}
                            className="w-full p-2 border rounded mb-4"
                        />
                        <br />
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="my-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-70 w-1/4"
                            >
                                Add Data Element
                            </button>
                        </div>
                    </form>

                    <div className="flex justify-center items-center m-3 p-3 bg-gray-100 rounded-lg shadow-md">
                        <div className='flex justify-center font-bold text-lg w-2/6'>Data Element</div>
                        <div className='flex justify-center font-bold text-lg w-2/6'>Expected Value</div>
                        <div className='flex justify-center font-bold text-lg w-1/6'>Edit</div>
                        <div className='flex justify-center font-bold text-lg w-1/6'>Delete</div>
                    </div>
                    <div className='h-[calc(40vh-5rem)] overflow-y-auto'>
                        <div className="space-y-4">
                            {dataElements.map((element, index) => (
                                <div key={index} className="flex justify-center items-center p-3 border-b border-gray-500">
                                    <div className='flex justify-center text-md w-2/6'>{element.name}</div>
                                    <div className='flex justify-center font-semibold text-md w-2/6'>{element.expectedValue}</div>
                                    <button className='flex justify-center font-semibold text-md w-1/6 rounded-lg p-2'>
                                        <LucideEdit3
                                            className='hover:text-gray-200'
                                            onClick={() => handleEdit(element)}
                                        />
                                    </button>
                                    <button className='flex justify-center font-semibold text-md w-1/6  rounded-lg p-2'>
                                        <Trash2Icon
                                            className="w-5 h-5 text-gray-600 hover:text-gray-200"
                                            onClick={() => handleDelete(element)}
                                        />
                                    </button>
                                </div>

                            ))}
                        </div>
                    </div>
                </div>

                {/* Delete Confirmation Dialog */}
                {showDeleteDialog && (
                    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl">
                            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
                            <p>Are you sure you want to delete {elementToDelete?.name}?</p>
                            <div className="mt-4 flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowDeleteDialog(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Dialog */}
                {showEditDialog && (
                    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
                        <div className="bg-white w-[30vw] p-6 rounded-lg shadow-xl">
                            <h3 className="text-lg font-semibold mb-4">Edit {editingElement?.name}</h3>
                            <input
                                type="text"
                                value={editedValue}
                                onChange={(e) => setEditedValue(e.target.value)}
                                className="w-full p-2 border rounded mb-4"
                            />
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowEditDialog(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmEdit}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default DataElementDrawer;
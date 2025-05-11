import React from "react";
import { LucidePlusSquare } from "lucide-react";
import DataElementDrawer from "./Drawers/dataElementDrawer";
import extractedDataElements from "./extractedDataElements.json";
import "./styles/style.css"
import ExportDrawer from "./Drawers/exportDataDrawer";


const ExtractParams = () => {
    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
    const [isExtracting, setIsExtracting] = React.useState(false);
    const [isExporting, setIsExporting] = React.useState(false);
    const [isExportingDrawer, setIsExportingDrawer] = React.useState(false)

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
    }

    const handleExtraction = async () => {
        try {
            setIsExtracting(true);

            const uploadedFiles = JSON.parse(sessionStorage.getItem('uploadedFiles'));

            // Create FormData to send files
            const formData = new FormData();

            // For each file, fetch the blob and append to FormData
            const filePromises = uploadedFiles.map(async (file) => {
                const blob = await fetch(file.data).then(r => r.blob());
                formData.append('files', blob, file.name);
            });

            // Wait for all blobs to be fetched and appended
            await Promise.all(filePromises);

            console.log("FormData", formData);

            // Send to backend
            const response = await fetch('http://localhost:3001/api/extract', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Extraction failed');
            }

            const data = await response.json();
            // Handle the extracted data response
            console.log('Extraction successful:', data);

        } catch (error) {
            console.error('Extraction error:', error);
        }
        finally {
            setIsExtracting(false);
        }
    };

    const handleCloseExportDrawer = () => {
        setIsExportingDrawer(false);
    }

    const handleExport = async () => {
        try {
            setIsExporting(true);

            const response = await fetch('http://localhost:3001/api/match', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: extractedDataElements }),
            });

            if (!response.ok) {
                throw new Error('Export failed');
            }

            const data = await response.json();
            console.log('Export successful:', data);

        } catch (error) {
            console.error('Export error:', error);
        }
        finally {
            setIsExporting(false);
            setIsExportingDrawer(true);
        }
    }

    return (
        <div className="p-6 h-[85vh] ">
            <div className="flex justify-between items-center mb-2 px-4">
                <h1 className="text-2xl font-semibold mb-5">Data Elements Extraction</h1>
                <button
                    className="flex items-center bg-black text-white px-4 py-2 rounded-md hover:bg-white hover:text-black hover:border hover:border-gray-900 transition duration-200"
                    onClick={() => setIsDrawerOpen(true)}
                >
                    <LucidePlusSquare className="w-6 h-6" />
                    <span className="ml-2">Add Data Element</span>
                </button>

                <DataElementDrawer
                    isOpen={isDrawerOpen}
                    onClose={handleCloseDrawer}
                />
            </div>

            <div className="h-[calc(85vh-4rem)] rounded-lg shadow-md overflow-hidden">
                <div className="h-[85%] p-4">
                    <div className="h-full">
                        <table class="table-scroll small-first-col">
                            <thead className="bg-gray-900 text-white rounded-t-lg">
                                <tr>
                                    <th>#</th>
                                    <th>Data Element</th>
                                    <th>Extracted Value</th>
                                    <th>Expected Value</th>
                                    <th>Citations</th>
                                </tr>
                            </thead>
                            <tbody class="body-half-screen">
                                {extractedDataElements?.dataElements?.map((element, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{element.name}</td>
                                        <td>{element.extractedValue}</td>
                                        <td>{element.expectedValue}</td>
                                        <td>{
                                            element.citations[0].document_name && element.citations[0].page_number
                                                ? <a
                                                    href={`http://localhost:3001/uploads/${element.citations[0].document_name}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800 underline"
                                                >
                                                    {element.citations[0].document_name} (Page {element.citations[0].page_number}, Line {element.citations[0].line_number})
                                                </a>
                                                : "N/A"
                                        }</td>
                                    </tr>
                                ))}

                                

                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="p-4 flex justify-between">
                    {!isExtracting ? (
                        <button
                            className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-white hover:text-black hover:border hover:border-gray-900 transition duration-200"
                            onClick={handleExtraction}
                        >
                            Extract
                        </button>
                    ) : (
                        <button
                            className="bg-gray-400 text-white px-6 py-2 rounded-md disabled cursor-not-allowed"
                            disabled
                        >
                            Extracting...
                        </button>
                    )}

                    {!isExporting ? (
                        <button
                            className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-white hover:text-black hover:border hover:border-gray-900 transition duration-200"
                            onClick={handleExport}
                        >
                            Export
                        </button>
                    ) : (
                        <button
                            className="bg-gray-400 text-white px-6 py-2 rounded-md disabled cursor-not-allowed"
                            disabled
                        >
                            Exporting...
                        </button>
                    )}

                    <ExportDrawer 
                        isOpen={isExportingDrawer}
                        onClose={handleCloseExportDrawer}
                    />
                </div>
            </div>
        </div>

    );
}

export default ExtractParams;
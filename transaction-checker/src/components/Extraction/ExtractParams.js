import React from "react";
import { LucidePlusSquare } from "lucide-react";
import DataElementDrawer from "./dataElementDrawer";
import extractedDataElements from "./extractedDataElements.json";
import "./styles/style.css"


const ExtractParams = () => {
    const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
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
                                        <td>{element.citations.document_name}</td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default ExtractParams;
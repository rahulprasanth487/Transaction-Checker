import React from 'react';
import { X } from 'lucide-react';
import extractedDataElements from "../extractedDataElements.json";
import CorrectSVG from "../../../resources/svgs/correct.svg";
import IncorrectSVG from "../../../resources/svgs/incorrect.svg";
import { utils as xlsxUtils, write as xlsxWrite } from 'xlsx';
import ExcelJS from 'exceljs';

const ExportDrawer = ({ isOpen, onClose }) => {

    const generateStyledExcel = async (extractedDataElements) => {
        // Create a new workbook and worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Extracted Data');

        // Define columns with widths
        worksheet.columns = [
            { header: '#', key: 'index', width: 8 },
            { header: 'Data Element', key: 'dataElement', width: 30 },
            { header: 'Extracted Value', key: 'extractedValue', width: 35 },
            { header: 'Expected Value', key: 'expectedValue', width: 35 },
            { header: 'Matching', key: 'matching', width: 20 },
            { header: 'Citations', key: 'citations', width: 50 }
        ];

        // Style the header row - this WILL work with ExcelJS
        const headerRow = worksheet.getRow(1);
        headerRow.height = 30;
        headerRow.eachCell((cell) => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF000000' } // Black with alpha (FF)
            };
            cell.font = {
                bold: true,
                color: { argb: 'FFFFFFFF' } // White with alpha (FF)
            };
            cell.alignment = {
                vertical: 'middle',
                horizontal: 'center',
                wrapText: true
            };
        });

        // Add data rows
        extractedDataElements.dataElements.forEach((element, index) => {
            worksheet.addRow({
                index: index + 1,
                dataElement: element.name,
                extractedValue: element.extractedValue,
                expectedValue: element.expectedValue,
                matching: element.match,
                citations: element.citations[0].document_name
                    ? `${element.citations[0].document_name} (Page ${element.citations[0].page_number}, Line ${element.citations[0].line_number})`
                    : "N/A"
            });
        });

        // Write to buffer
        const buffer = await workbook.xlsx.writeBuffer();

        // Create blob and download
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'transaction_checker.xlsx';
        a.click();
        URL.revokeObjectURL(url);
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
                    <h2 className="text-xl font-semibold">Export Data</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="h-[76vh] p-4">
                    <div className="h-[100%]">
                        <table className="table-scroll small-first-col w-full h-full overflow-auto">
                            <thead className="bg-gray-900 text-white rounded-t-lg">
                                <tr>
                                    <th>#</th>
                                    <th>Data Element</th>
                                    <th>Extracted Value</th>
                                    <th>Expected Value</th>
                                    <th>Matching</th>
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
                                        <td className=''>
                                            {
                                                element.match.toLowerCase() === "match"
                                                    ? <img src={CorrectSVG} alt="Correct" className="ml-[35%] w-8 h-8" />
                                                    : <img src={IncorrectSVG} alt="Incorrect" className="ml-[35%] w-8 h-8" />
                                            }
                                        </td>
                                        <td>
                                            {
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

                    <div className="p-4 flex justify-center">
                        <button
                            className='bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-white hover:text-black hover:border hover:border-gray-900 transition duration-200 mt-4'
                            onClick={() => {
                                generateStyledExcel(extractedDataElements);
                            }}
                        >
                            Download Excel data
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ExportDrawer;
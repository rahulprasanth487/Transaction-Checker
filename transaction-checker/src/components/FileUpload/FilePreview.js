import React from "react"

const FilePreview = ({fileData}) => {
    return <iframe
        src={fileData}
        className="w-full h-full"
        title="File Preview"
    />
}

export default FilePreview;
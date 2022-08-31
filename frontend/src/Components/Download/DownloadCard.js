import React from 'react';
import { saveAs } from 'file-saver';
const DownloadCard = ({ item }) => {
    const downloadImage = () => {
        saveAs(`http://localhost:4000/uploads/${item}`, item);
    };
    return (
        <div className="singleItem">
            <img
                className="down-image"
                src={`http://localhost:4000/uploads/${item}`}
                alt="item images"
            />
            <button onClick={downloadImage}>Download</button>
        </div>
    );
};

export default DownloadCard;

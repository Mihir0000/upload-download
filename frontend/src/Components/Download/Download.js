import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Download.css';
import DownloadCard from './DownloadCard';
import { Link } from 'react-router-dom';

const Download = () => {
    const [downloadData, setDownloadData] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:4000/downloads').then((response) => {
            console.log(response.data);
            setDownloadData(response.data);
        });
    }, []);

    return (
        <section>
            <div className="download-container">
                <div className="container-text">
                    <h4 className="down-text">Want to Download?</h4>
                    <Link rel="noreferrer" to="/upload">
                        <button className="uploadBtn">Upload?</button>
                    </Link>
                </div>
                <div className="allItem">
                    {downloadData &&
                        downloadData.map((item, index) => {
                            return (
                                <div key={index}>
                                    <DownloadCard item={item} />
                                </div>
                            );
                        })}
                </div>
            </div>
        </section>
    );
};

export default Download;

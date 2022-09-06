import { useEffect, useState } from 'react';
import axios from 'axios';
import './Upload.css';
import { Link } from 'react-router-dom';

const chunkSize = 10 * 1024;

const Upload = () => {
    const [activeDropzone, setActveDropzone] = useState(false);
    const [files, setFiles] = useState([]);
    const [currentFileIndex, setCurrentFileIndex] = useState(null);
    const [lastUploadedFileIndex, setLastUploadedFileIndex] = useState(null);
    const [currentChunkIndex, setCurrentChunkIndex] = useState(null);
    const [userData, setUserData] = useState({});

    const onDragOver = (e) => {
        e.preventDefault();
        setActveDropzone(true);
    };
    const onDragLeave = (e) => {
        e.preventDefault();
        setActveDropzone(false);
    };
    const onDrag = (e) => {
        e.preventDefault();
        // setFiles([...files, ...e.dataTransfer.files]);
    };
    const onFileDrop = (e) => {
        // console.log(e);
        setFiles([...files, ...e.target.files]);
    };
    useEffect(() => {
        const data = localStorage.getItem('userData');
        setUserData(JSON.parse(data));
    }, []);

    const readAndUploadCurrentChunk = () => {
        const reader = new FileReader();
        const file = files[currentFileIndex];
        if (!file) {
            return;
        }
        const chunkFrom = currentChunkIndex * chunkSize;
        const chunkTo = chunkFrom + chunkSize;
        const blob = file.slice(chunkFrom, chunkTo);
        reader.onload = (e) => uploadChunks(e);
        reader.readAsDataURL(blob);
    };
    const uploadChunks = (readerEvent) => {
        const file = files[currentFileIndex];
        const data = readerEvent.target.result;
        const params = new URLSearchParams();
        params.set('name', file.name);
        params.set('size', file.size);
        params.set('currentChunkIndex', currentChunkIndex);
        params.set('totalChunks', Math.ceil(file.size / chunkSize));
        params.set('userName', userData.userName);
        params.set('email', userData.email);
        const url = 'http://localhost:4000/upload?' + params.toString();
        const headers = { 'Content-Type': 'application/octet-stream' };
        let config = {
            headers,
        };
        axios.post(url, data, config).then((response) => {
            const fileSize = file.size;
            const isLastChunks =
                currentChunkIndex === Math.ceil(fileSize / chunkSize) - 1;
            if (isLastChunks) {
                // file.name = response.data.name;
                setLastUploadedFileIndex(currentFileIndex);
                setCurrentChunkIndex(null);
            } else {
                setCurrentChunkIndex(currentChunkIndex + 1);
            }
        });
    };
    useEffect(() => {
        if (lastUploadedFileIndex === null) {
            return;
        }
        const isLastFile = lastUploadedFileIndex === files.length - 1;
        const nextFileIndex = isLastFile ? null : currentFileIndex + 1;
        setCurrentFileIndex(nextFileIndex);
    }, [lastUploadedFileIndex]);
    useEffect(() => {
        if (files.length > 0) {
            if (currentFileIndex === null) {
                setCurrentFileIndex(
                    lastUploadedFileIndex === null
                        ? 0
                        : lastUploadedFileIndex + 1
                );
            }
        }
    }, [files.length]);
    useEffect(() => {
        if (currentFileIndex !== null) {
            setCurrentChunkIndex(0);
        }
    }, [currentFileIndex]);
    useEffect(() => {
        if (currentChunkIndex !== null) {
            readAndUploadCurrentChunk();
        }
    }, [currentChunkIndex]);

    return (
        <section className="uploadSection">
            <div className="app-container">
                <div
                    onDragOver={(e) => onDragOver(e)}
                    onDragLeave={(e) => onDragLeave(e)}
                    onDrag={(e) => onDrag(e)}
                    className={'dropzone' + (activeDropzone ? ' active' : '')}
                >
                    Drop your files here
                </div>
                <input type="file" value="" onChange={onFileDrop} />
                <div className="files">
                    {files.map((file, index) => {
                        let progress = 0;
                        const isLastChunks =
                            Math.ceil(file.size / chunkSize) - 1;
                        if (file.name && isLastChunks === currentChunkIndex) {
                            progress = 100;
                        } else {
                            const uploading = index === currentFileIndex;
                            const chunks = Math.ceil(file.size / chunkSize);
                            if (uploading) {
                                progress = Math.round(
                                    (currentChunkIndex / chunks) * 100
                                );
                            } else {
                                progress = 0;
                            }
                        }
                        return (
                            <div key={index} className="uploadFile">
                                <div className="file">
                                    <a
                                        rel="noreferrer"
                                        href={
                                            'http://localhost:4000/uploads/' +
                                            file.name
                                        }
                                        target="_blank"
                                    >
                                        <div className="name">{file.name}</div>
                                        <div
                                            className={
                                                'progress ' +
                                                (progress === 100 ? 'done' : '')
                                            }
                                            style={{ width: progress + '%' }}
                                        >
                                            {progress} %
                                        </div>
                                    </a>
                                </div>
                                <div className="btnbtn">
                                    <button className="playPause">
                                        <i className="fa-sharp fa-solid fa-pause" />
                                    </button>
                                    <button className="cancel">
                                        <i className="fa-sharp fa-solid fa-xmark" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="container-text">
                <Link rel="noreferrer" to="/download">
                    <button className="uploadBtn">Download?</button>
                </Link>
            </div>
        </section>
    );
};

export default Upload;

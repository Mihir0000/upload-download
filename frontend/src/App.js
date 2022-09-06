import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Upload from './Components/Upload/Upload';
import Download from './Components/Download/Download';
import Home from './Components/Home/Home';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path='/upload' element={<Upload/>}/>
                <Route path="/download" element={<Download />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

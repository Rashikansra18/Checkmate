import React from 'react';
import './App.css';
import Home from './Components/Home';
import Headers from './Components/Headers';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import Error from './Components/Error';
import PlagiarismChecker from './Components/PlagiarismChecker';
import { Routes, Route } from 'react-router-dom';

function App() {
    return (
        <>
            <Headers />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/PlagiarismChecker" element={<PlagiarismChecker />} />
                <Route path="*" element={<Error />} /> {/* Fallback route */}
            </Routes>
        </>
    );
}

export default App;

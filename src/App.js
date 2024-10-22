import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useState } from 'react';
import './App.css';
import TopBar from './components/topbar';
import DicomViewer from './pages/imageLoadView/imageLoad'
import Analysis from './pages/analysisView/analysis';
import MenuBar from './components/menubar';
import { UploadProvider } from './context/UploadContext';

function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Router>
      <div className="App">
      <UploadProvider>
        <MenuBar collapsed={collapsed} setCollapsed={setCollapsed} />
        <TopBar/>
          <Routes>
            <Route path="/image-load" element={<DicomViewer/>} />
            <Route path="/detection" element={<DicomViewer/>} />
            <Route path="/analysis" element={<Analysis/>} />
          </Routes>
        </UploadProvider>
      </div>
    </Router>
  );
}

export default App;

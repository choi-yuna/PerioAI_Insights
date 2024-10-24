import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useState } from 'react';
import './App.css';
import TopBar from './components/topbar';
import DicomViewer from './pages/imageLoadView/imageLoad'
import DetectionViewer from './pages/DetectionView/detection'
import Analysis from './pages/analysisView/analysis';
import MenuBar from './components/menubar';
import { UploadProvider } from './context/UploadContext';
import { IniDataProvider } from './context/IniDataContext';

function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Router>
      <div className="App">
      <UploadProvider>
        <IniDataProvider>
        <MenuBar collapsed={collapsed} setCollapsed={setCollapsed} />
        <TopBar/>
          <Routes>
            <Route path="/image-load" element={<DicomViewer/>} />
            <Route path="/detection" element={<DetectionViewer/>} />
            <Route path="/analysis" element={<Analysis/>} />
          </Routes>
          </IniDataProvider>
        </UploadProvider>
      </div>
    </Router>
  );
}

export default App;

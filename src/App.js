import { BrowserRouter as Router } from 'react-router-dom';
import React, { useState } from 'react';
import './App.css';
import TopBar from './components/topbar';
import ImageLoad from './imageLoadView/imageLoad'
import { UploadProvider } from './context/UploadContext';
import MenuBar from './components/menubar';

function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Router>
      <div className="App">
      <UploadProvider>
        <MenuBar collapsed={collapsed} setCollapsed={setCollapsed} />
        <TopBar />
        <ImageLoad/>
        </UploadProvider>
      </div>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router } from 'react-router-dom';
import React, { useState } from 'react';
import './App.css';
import TopBar from './components/topbar';
import MenuBar from './components/menubar';

function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Router>
      <div className="App">
        <MenuBar collapsed={collapsed} setCollapsed={setCollapsed} />
        <TopBar />
      </div>
    </Router>
  );
}

export default App;

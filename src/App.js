import logo from './logo.svg';
import './App.css';
import TopBar from './components/topbar';
import ImageLoad from './imageLoad'
import { UploadProvider } from './context/UploadContext';

function App() {
  return (
       <UploadProvider>
        <TopBar/>
        <ImageLoad/>
        </UploadProvider>

  );
}

export default App;
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatbotPage from "./pages/ChatbotPage"; 
import Home from "./pages/Home";
import "./index.css";
import ImageUpload from "./components/ImageUpload";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
      </Routes>
       
    </Router>
  );
}

export default App;

// src/components/ImageUpload.jsx
import { useState } from "react";
import axios from "axios";

function ImageUpload() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await axios.post("http://localhost:5000/upload", formData);
    setResult(JSON.stringify(res.data, null, 2));
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload & Recognize</button>
      <pre>{result}</pre>
    </div>
  );
}

export default ImageUpload;

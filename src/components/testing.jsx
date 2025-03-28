import React, { useState } from 'react';
import mediaUpload from '../utils/mediaupload';
import { toast } from 'react-hot-toast';

function Testing() {
  const [file, setFile] = useState(null);

  async function uploadfile() {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    const response = await mediaUpload(file);
  
    console.log(response);

    if (response.error) {
      toast.error(response.message);
      return;
    }

    toast.success("File uploaded successfully");
    console.log("File URL:", response.url);
  }

  return (
    <div className="p-6">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4"
      />

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        onClick={uploadfile}
      >
        Upload
      </button>
    </div>
  );
}

export default Testing;

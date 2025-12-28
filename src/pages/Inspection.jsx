import React, { useState } from 'react';
import { supabase } from '../supabase'; 
import InspectionUpload from '../components/inspection/InspectionUpload';
import InspectionResult from '../components/inspection/InspectionResult';
import { toast } from 'react-toastify';

const Inspection = () => {
  const [image, setImage] = useState(null);
  const [imageBlob, setImageBlob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setImageBlob(file);
      setResult(null);
    }
  };

  const handleClear = () => {
    setImage(null);
    setImageBlob(null);
    setResult(null);
    toast.dismiss(); 
  };

  const handleAnalyze = async () => {
    if (!imageBlob) {
        toast.error("Please upload an image first.");
        return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const formData = new FormData();
      formData.append('file', imageBlob);
      if (user) formData.append('user_id', user.id); 

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Analysis failed');

      const data = await response.json();
      setResult(data);
      
    } catch (error) {
      console.error("Error:", error);
      toast.error("Server Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <InspectionUpload 
            image={image}
            loading={loading}
            hasResult={!!result}
            onFileChange={handleFileChange}
            onAnalyze={handleAnalyze}
            onClear={handleClear}
          />
        </div>
        <div className="lg:col-span-1">
          <InspectionResult result={result} />
        </div>
      </div>
    </div>
  );
};

export default Inspection;
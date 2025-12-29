import React, { useState } from "react";
import { supabase } from "../supabase";
import InspectionUpload from "../components/inspection/InspectionUpload";
import InspectionResult from "../components/inspection/InspectionResult";
import { toast } from "react-toastify";
import DeviceInput from "../components/inspection/DeviceInput";

const Inspection = () => {
  const [image, setImage] = useState(null);
  const [imageBlob, setImageBlob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [deviceName, setDeviceName] = useState("");

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
    setDeviceName("");
    toast.dismiss();
  };

  const handleAnalyze = async () => {
    if (!deviceName.trim()) {
      toast.error("Please enter a device name.");
      return;
    }
    if (!imageBlob) {
      toast.error("Please upload an image first.");
      return;
    }

    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const formData = new FormData();
      formData.append("file", imageBlob);
      if (user) formData.append("user_id", user.id);
      formData.append("device_name", deviceName);

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/analyze`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Analysis failed");

      const data = await response.json();
      setResult(data);
      toast.success("Analysis Complete!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Server Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <DeviceInput deviceName={deviceName} setDeviceName={setDeviceName} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-start lg:items-stretch">
        {/* Left Side */}
        <div className="lg:col-span-3 w-full space-y-6">
          <InspectionUpload
            image={image}
            loading={loading}
            hasResult={!!result}
            onFileChange={handleFileChange}
            onAnalyze={handleAnalyze}
            onClear={handleClear}
          />
        </div>

        {/* Right Side */}
        <div
          className={`${
            result ? "flex" : "hidden"
          } lg:flex lg:col-span-2 w-full animate-in slide-in-from-bottom-5 fade-in duration-500`}
        >
          <InspectionResult result={result} />
        </div>
      </div>
    </div>
  );
};

export default Inspection;

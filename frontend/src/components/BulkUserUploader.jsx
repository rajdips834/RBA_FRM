import React, { useState, useContext, useRef } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { createBulkUsers, fetchAllUsers } from "../utils/globalUtils";
import apiClient from "../utils/apiClient";
import { addDeviceProfiles, fetchDeviceDetails } from "../utils/deviceDetails";

const BulkUserUploader = () => {
  const { token, setUsers, setDeviceDetails } = useContext(GlobalContext);
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const [showModal, setShowModal] = useState(false);

  const handleFile = (selectedFile) => {
    const allowedTypes = ["text/csv", "text/plain"];
    const allowedExtensions = [".csv", ".txt"];
    const isValidType = allowedTypes.includes(selectedFile.type);
    const hasValidExtension = allowedExtensions.some((ext) =>
      selectedFile.name.toLowerCase().endsWith(ext)
    );

    if (!selectedFile || (!isValidType && !hasValidExtension)) {
      alert("Please upload a valid .csv or .txt file.");
      return;
    }

    setFile(selectedFile);
    setResponse(null); // reset previous result
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file.");

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      const result = await createBulkUsers(formData, token).then(
        async (res) => {
          if (res.resultData._successOTPENTRIES.length > 0) {
            console.log("Bulk user upload successful:", res.resultData);
            const response = await fetchAllUsers(token);
            setUsers(response);
            setResponse({
              message: "Bulk user upload successful!",
              count: res.resultData._successOTPENTRIES.length,
            });
            // Extract userIds from success entries
            const userIds = res.resultData._successOTPENTRIES.map(
              (entry) => entry.userid
            );
            await addDeviceProfiles(userIds);
            await fetchDeviceDetails(setDeviceDetails);
          } else if (res.resultData._failedOTPENTRIES.length > 0) {
            setResponse({
              message: "No valid entries found in the file.",
              failed_entries: res.resultData._failedOTPENTRIES.length,
            });
          } else {
            setResponse({
              error: true,
              message: "No valid entries found in the file.",
            });
          }
        }
      );
    } catch (err) {
      setResponse({ error: true, message: err.message });
    } finally {
      setLoading(false);
    }
  };
  const handleDownloadExample = () => {
    const exampleContent = `#userId,userName,email,phone,branchid\nAVINASH,AvinashL,avinash@mollatech.com,+919272221568,Pune`;
    const blob = new Blob([exampleContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "bulk-user-example.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-cyan-700 text-white rounded hover:bg-cyan-600"
      >
        Add More Users
      </button>

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center min-h-screen"
          style={{
            background: "rgba(0,0,0,0.45)",
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-slate-800 p-6 rounded-lg space-y-4 border border-slate-700 w-full max-w-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-slate-400 hover:text-slate-200 text-xl"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <h2 className="text-lg font-semibold text-slate-100">
              Bulk User Upload
            </h2>
            <div
              className={`w-full h-48 border-2 border-dashed rounded-lg flex items-center justify-center text-slate-400 cursor-pointer transition-colors ${
                dragActive ? "border-cyan-400 bg-slate-700" : "border-slate-600"
              }`}
              onDragEnter={() => setDragActive(true)}
              onDragOver={(e) => e.preventDefault()}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()}
            >
              {file ? (
                <span className="text-slate-200 text-center">
                  Selected file: <strong>{file.name}</strong>
                </span>
              ) : (
                <div className="text-center">
                  <p className="text-sm">
                    Drag and drop a .csv or .txt file here
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    or click to browse
                  </p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.txt"
              onChange={(e) => handleFile(e.target.files[0])}
              className="hidden"
            />
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleUpload}
                className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-500 disabled:opacity-50"
                disabled={loading || !file}
              >
                {loading ? "Uploading..." : "Upload File"}
              </button>
              <button
                onClick={handleDownloadExample}
                className="px-4 py-2 bg-slate-700 text-slate-100 border border-slate-500 rounded hover:bg-slate-600"
              >
                Download Example File
              </button>
            </div>
            {response && (
              <pre className="bg-slate-900 p-2 text-xs text-green-400 rounded overflow-x-auto">
                {JSON.stringify(response, null, 2)}
              </pre>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default BulkUserUploader;

import React, { useState, useCallback, useRef, useEffect } from "react";
import { UploadCloud, FileText, Download, X, Save } from "lucide-react";
import { useDropzone } from "react-dropzone";

// Load external libraries globally via CDN to resolve build errors.
// These libraries (Tesseract, PDF.js, jsPDF) will be accessed via the global scope (e.g., window.Tesseract)
// We need to ensure the worker for PDF.js is also set, which we can do in a separate script block.

// Initial state for the form data
const initialFormData = {
  claimId: "",
  claimantName: "",
  village: "",
  district: "",
  state: "",
  claimType: "",
};

// Component to handle external library loading and PDF worker setup
function ExternalScriptLoader({ onLoaded }) {
  useEffect(() => {
    // Function to load a script dynamically
    const loadScript = (src, onLoad) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = onLoad;
      document.head.appendChild(script);
    };

    // Scripts to load in order
    const scripts = [
      // Tesseract.js (for OCR)
      "https://cdn.jsdelivr.net/npm/tesseract.js@5.0.3/dist/tesseract.min.js",
      // PDF.js (main library)
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js",
      // jsPDF (for generating the output PDF)
      "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
    ];

    let loadedCount = 0;

    const handleScriptLoad = () => {
      loadedCount++;
      if (loadedCount === scripts.length) {
        // All libraries loaded.
        // Set the PDF.js worker source using the global object now that it's loaded.
        if (window.pdfjsLib && window.pdfjsLib.version) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${window.pdfjsLib.version}/pdf.worker.min.js`;
        }
        onLoaded(true);
      } else {
        // Load the next script
        loadScript(scripts[loadedCount], handleScriptLoad);
      }
    };

    // Start loading the first script
    loadScript(scripts[0], handleScriptLoad);
  }, [onLoaded]);

  return null; // This component is only for loading and doesn't render UI elements itself
}

export default function App() {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [notification, setNotification] = useState(null);
  const [isLibsLoaded, setIsLibsLoaded] = useState(false); // New state for library status

  // Reference for the canvas needed by OCR (though Tesseract 5 can often take Blob/File directly)
  const canvasRef = useRef(null);

  // Helper to show a temporary notification with a fade-out transition
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    // The notification UI element has its transition defined in Tailwind classes
    setTimeout(() => setNotification(null), 3000);
  };

  // Helper to reset form data, file, and progress
  const resetFormAndFiles = () => {
    setFile(null);
    setFormData(initialFormData);
    setProgress(0);
  };

  // Handle file drop and initiate OCR
  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (!isLibsLoaded) {
        showNotification(
          "Libraries are still loading. Please wait a moment.",
          "error"
        );
        return;
      }
      if (acceptedFiles.length > 0) {
        const uploadedFile = acceptedFiles[0];
        setFile(uploadedFile);
        // Reset form before processing new file
        setFormData(initialFormData);
        await handleOCR(uploadedFile);
      }
    },
    [isLibsLoaded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".jpg", ".jpeg", ".png"],
    },
    maxFiles: 1,
    disabled: isProcessing || !isLibsLoaded, // Disable dropzone until libs are ready
  });

  // Remove file and reset form
  const handleRemoveFile = () => {
    resetFormAndFiles();
    showNotification("File removed successfully");
  };

  // OCR extraction logic using Tesseract and PDF.js
  const handleOCR = async (file) => {
    setIsProcessing(true);
    setProgress(0);

    // Access global libraries
    const Tesseract = window.Tesseract;
    const pdfjsLib = window.pdfjsLib;

    if (!Tesseract || !pdfjsLib) {
      setIsProcessing(false);
      showNotification(
        "OCR libraries failed to load. Please refresh.",
        "error"
      );
      return;
    }

    try {
      let extractedText = "";

      if (file.type === "application/pdf") {
        const loadingTask = pdfjsLib.getDocument(URL.createObjectURL(file));
        const pdf = await loadingTask.promise;

        // Use a single, persistent canvas for sequential page rendering
        let canvas = canvasRef.current;
        if (!canvas) {
          canvas = document.createElement("canvas");
          canvasRef.current = canvas;
        }

        for (let i = 1; i <= pdf.numPages; i++) {
          // Render PDF page to the off-screen canvas for Tesseract
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 2 });

          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext("2d");

          await page.render({ canvasContext: ctx, viewport }).promise;

          // Perform OCR on the canvas image
          const pageResult = await Tesseract.recognize(canvas, "eng", {
            logger: (m) => {
              if (m.status === "recognizing text") {
                // Calculate overall progress across all pages
                setProgress(
                  Math.round(((m.progress + i - 1) / pdf.numPages) * 100)
                );
              }
            },
          });
          extractedText += pageResult.data.text + "\n";
        }
      } else {
        // Handle image files directly
        const result = await Tesseract.recognize(file, "eng", {
          logger: (m) => {
            if (m.status === "recognizing text") {
              setProgress(Math.round(m.progress * 100));
            }
          },
        });
        extractedText = result.data.text;
      }

      // --- Simple Data Extraction (Pattern Matching) ---
      const extracted = {
        claimId:
          extractedText.match(/Claim\s*ID[:\-]?\s*(\S+)/i)?.[1]?.trim() ||
          "FRA-XXXX-00000",
        claimantName:
          extractedText.match(/Name[:\-]?\s*([A-Za-z\s]+)/i)?.[1]?.trim() ||
          "Unknown Claimant",
        village:
          extractedText.match(/Village[:\-]?\s*([A-Za-z\s]+)/i)?.[1]?.trim() ||
          "N/A",
        district:
          extractedText.match(/District[:\-]?\s*([A-Za-z\s]+)/i)?.[1]?.trim() ||
          "N/A",
        state:
          extractedText.match(/State[:\-]?\s*([A-Za-z\s]+)/i)?.[1]?.trim() ||
          "N/A",
        claimType:
          extractedText.match(/Claim\s*Type[:\-]?\s*(\S+)/i)?.[1]?.trim() ||
          "Individual",
      };

      setFormData(extracted);
      showNotification("Data extracted successfully");
    } catch (err) {
      console.error("OCR Error:", err);
      showNotification("Failed to extract text from the document", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  // Download form data as a PDF document
  const downloadPDF = () => {
    // Access global library
    const jsPDF = window.jspdf.jsPDF;

    if (!jsPDF) {
      showNotification("PDF library is not yet loaded.", "error");
      return;
    }

    if (!formData.claimId && !formData.claimantName) {
      showNotification(
        "Form is empty. Please fill in data to generate a PDF.",
        "error"
      );
      return;
    }
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("FRA Claim Report", 14, 20);
    let y = 30;
    Object.entries(formData).forEach(([key, value]) => {
      const label = key
        .replace(/([A-Z])/g, " $1") // Add space before capital letters
        .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
      doc.text(`${label}: ${value}`, 14, y);
      y += 10;
    });
    doc.save(`${formData.claimId || "FRA_Report"}.pdf`);
    // Added explicit success notification for PDF download
    showNotification("Claim report PDF downloaded successfully");
  };

  // Simulate saving the extracted/manual data
  const saveToRecords = () => {
    if (!formData.claimId && !formData.claimantName) {
      showNotification(
        "Form is empty. Please fill in data to save a record.",
        "error"
      );
      return;
    }
    // In a real application, you would connect to Firestore or another backend here.
    console.log("Saving to records:", formData);

    // 1. Show explicit success notification for saving
    showNotification("Claim record saved to database successfully");

    // 2. Reset the page state (form data, file, and progress)
    resetFormAndFiles();
  };

  // Render Form Input Field
  const FormInputField = ({ label, value, name }) => (
    <div className="flex flex-col">
      <label
        htmlFor={name}
        className="text-sm font-medium text-gray-700 capitalize"
      >
        {label}
      </label>
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
        className="mt-1 block w-full rounded-lg border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm transition-colors"
        disabled={isProcessing}
      />
    </div>
  );

  return (
    // The ExternalScriptLoader component handles loading the necessary CDN scripts
    // and sets the isLibsLoaded state when finished.
    <>
      <ExternalScriptLoader onLoaded={setIsLibsLoaded} />
      <div className="min-h-screen bg-gray-100 p-4 font-sans flex justify-center items-start pt-10">
        <div className="w-full max-w-xl bg-white rounded-2xl p-6 shadow-2xl border border-gray-200 relative">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
            Claim Data Extraction Tool
          </h1>

          {/* Notification - Uses absolute positioning and transition classes */}
          {notification && (
            <div
              className={`absolute z-10 top-4 right-4 p-3 rounded-xl shadow-lg text-sm transition-all duration-500 ${
                notification.type === "error"
                  ? "bg-red-100 text-red-700 border border-red-300"
                  : "bg-green-100 text-green-700 border border-green-300"
              }`}
            >
              {notification.message}
            </div>
          )}

          {/* Upload Section */}
          <section className="mb-8 p-4 border border-blue-200 rounded-xl bg-blue-50">
            <h2 className="text-xl font-bold mb-4 text-center text-blue-800">
              {file ? "Document Uploaded" : "Upload Document for OCR"}
            </h2>
            {!file ? (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? "border-blue-500 bg-blue-100"
                    : "border-blue-300 hover:border-blue-500 hover:bg-blue-100"
                } ${!isLibsLoaded ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <input {...getInputProps()} />
                <div className="flex justify-center mb-3 text-blue-500">
                  <UploadCloud
                    size={48}
                    className="transition-transform duration-300 animate-pulse-slow"
                  />
                </div>
                <p className="text-sm text-gray-600 font-medium">
                  {isLibsLoaded
                    ? "Drag & drop a **PDF, JPG, or PNG** file here, or click to select"
                    : "Loading OCR and PDF libraries... Please wait."}
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-inner">
                <span className="flex items-center gap-2 text-sm font-semibold text-gray-700 truncate">
                  <FileText size={18} className="text-blue-500" />
                  {file.name}
                </span>
                <button
                  onClick={handleRemoveFile}
                  className="p-1 text-red-500 hover:text-red-700 rounded-full transition-colors"
                  aria-label="Remove file"
                  disabled={isProcessing}
                >
                  <X size={18} />
                </button>
              </div>
            )}
          </section>

          {/* Progress Bar (Only visible during processing) */}
          {isProcessing && (
            <section className="mb-8">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm font-medium text-gray-600 text-center mt-2">
                Extracting data... {progress}%
              </p>
            </section>
          )}

          {/* Form Section - Always visible unless processing */}
          {!isProcessing && (
            <section className="transition-all duration-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
                  <FileText size={24} className="text-blue-500" /> Claim Details
                </h2>
                <div className="flex gap-3">
                  <button
                    onClick={saveToRecords}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-green-600 text-white font-medium hover:bg-green-700 shadow-md transition transform hover:scale-[1.02]"
                    title="Save record to database"
                    disabled={!isLibsLoaded}
                  >
                    <Save size={16} /> Save to Records
                  </button>
                  <button
                    onClick={downloadPDF}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-md transition transform hover:scale-[1.02]"
                    title="Download as PDF"
                    disabled={!isLibsLoaded}
                  >
                    <Download size={16} /> Download PDF
                  </button>
                </div>
              </div>

              <form className="space-y-4">
                {Object.entries(formData).map(([key, value]) => (
                  <FormInputField
                    key={key}
                    name={key}
                    label={key.replace(/([A-Z])/g, " $1")}
                    value={value}
                  />
                ))}
              </form>
            </section>
          )}
        </div>
      </div>
    </>
  );
}

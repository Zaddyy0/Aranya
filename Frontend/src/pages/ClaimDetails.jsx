import React, { useEffect, useState } from "react";
// Make sure jsPDF is included in index.html:
// <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
import {
  FileText,
  Flag,
  Calendar,
  BarChart3,
  X,
  Edit,
  Save,
  Ban,
  Activity,
  Award,
  Search,
  RotateCcw,
  Download,
} from "lucide-react";

// Map display names to claim object keys for editing
const EDITABLE_DETAIL_MAP = {
  "Claim ID": "claimId",
  "Claimant Name": "name",
  Village: "village",
  District: "district",
  State: "state",
  "Claim Type": "claimType",
  "Area (ha)": "area",
  "Date of Application": "date",
};

// Map display names for scoring metrics
const SCORE_MAP = {
  "Overall Score": "overallScore",
  "Land Suitability": "landSuitability",
  "Community Need": "communityNeed",
};

// Mock database
const MOCK_CLAIM_DATABASE = [
  {
    claimId: "FRA-2023-00123",
    name: "Rajesh Kumar",
    village: "Amgaon",
    district: "Chandrapur",
    state: "Maharashtra",
    claimType: "Individual",
    area: "2.5 ha",
    date: "2023-05-15",
    overallScore: "85/100",
    landSuitability: "92/100",
    communityNeed: "78/100",
    vulnerability: 65,
    status: ["Verified", "Approved", "Land Allotted"],
    historicalClaims: [
      { claimId: "FRA-2022-00987", date: "2022-07-12", status: "Completed" },
      { claimId: "FRA-2021-00456", date: "2021-11-23", status: "Rejected" },
      { claimId: "FRA-2020-00321", date: "2020-05-18", status: "Pending" },
    ],
  },
  {
    claimId: "6020/2010",
    name: "Baikuntha Majhi",
    village: "Sankiriguda",
    district: "Kalahandi",
    state: "Odisha",
    claimType: "Individual",
    area: "0.607 ha",
    date: "2010-01-01",
    overallScore: "90/100",
    landSuitability: "95/100",
    communityNeed: "85/100",
    vulnerability: 80,
    status: ["Approved", "Land Allotted"],
    historicalClaims: [],
  },
];

const DEFAULT_CLAIM_ID = "FRA-2023-00123";

const getClaimData = (query) => {
  const normalizedQuery = query.toLowerCase();
  return MOCK_CLAIM_DATABASE.find(
    (claim) =>
      claim.claimId.toLowerCase() === normalizedQuery ||
      claim.name.toLowerCase().includes(normalizedQuery)
  );
};

export default function App() {
  const initialClaimData = getClaimData(DEFAULT_CLAIM_ID);

  const [vulnerabilityPercent, setVulnerabilityPercent] = useState(0);
  const [showDocumentPreview, setShowDocumentPreview] = useState(false);
  const [showReportPreview, setShowReportPreview] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableClaim, setEditableClaim] = useState(initialClaimData);
  const [searchQuery, setSearchQuery] = useState(DEFAULT_CLAIM_ID);
  const [loadingClaim, setLoadingClaim] = useState(false);
  const [auditLog, setAuditLog] = useState([
    "Exported PDF report on 2025-10-05",
    "Approved claim FRA-2023-00123",
    "Edited claimant details on 2025-10-07",
  ]);

  // Animate Vulnerability
  useEffect(() => {
    setVulnerabilityPercent(0);
    const interval = setInterval(() => {
      setVulnerabilityPercent((prev) => {
        if (prev < editableClaim.vulnerability) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 15);
    return () => clearInterval(interval);
  }, [editableClaim.vulnerability]);

  // PDF Export
  const handleExport = () => {
    const { jsPDF } = window.jspdf;
    if (!jsPDF) return;

    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Claim Report", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    let y = 40;
    const lineHeight = 10;
    Object.keys(EDITABLE_DETAIL_MAP).forEach((key) => {
      doc.text(`${key}: ${editableClaim[EDITABLE_DETAIL_MAP[key]]}`, 20, y);
      y += lineHeight;
    });
    doc.text(`Overall Score: ${editableClaim.overallScore}`, 20, y);
    y += lineHeight;
    doc.text(`Land Suitability: ${editableClaim.landSuitability}`, 20, y);
    y += lineHeight;
    doc.text(`Community Need: ${editableClaim.communityNeed}`, 20, y);
    y += lineHeight;
    doc.text(`Vulnerability: ${editableClaim.vulnerability}%`, 20, y);
    y += lineHeight;
    doc.text(`Status: ${editableClaim.status.join(", ")}`, 20, y);

    doc.save(`${editableClaim.claimId}_Report.pdf`);
    setAuditLog((prev) => [
      `Exported report ${
        editableClaim.claimId
      } at ${new Date().toLocaleString()}`,
      ...prev,
    ]);
  };

  const handleViewDocuments = () => setShowDocumentPreview(true);
  const handleViewReport = () => setShowReportPreview(true);
  const handleEditToggle = () => setIsEditing(!isEditing);
  const handleInputChange = (key, value) =>
    setEditableClaim((prev) => ({ ...prev, [key]: value }));
  const handleSaveChanges = () => {
    setIsEditing(false);
    setAuditLog((prev) => [
      `Updated claimant details for ${
        editableClaim.claimId
      } on ${new Date().toLocaleString()}`,
      ...prev,
    ]);
  };

  const handleLoadClaim = () => {
    setLoadingClaim(true);
    setTimeout(() => {
      const newClaim = getClaimData(searchQuery);
      if (newClaim) {
        setEditableClaim(newClaim);
        setAuditLog((prev) => [
          `Loaded claim ${newClaim.claimId} (Name: ${
            newClaim.name
          }) at ${new Date().toLocaleTimeString()}`,
          ...prev,
        ]);
      } else {
        setAuditLog((prev) => [
          `Claim search failed for "${searchQuery}" at ${new Date().toLocaleTimeString()}`,
          ...prev,
        ]);
      }
      setLoadingClaim(false);
    }, 500);
  };

  // Modals with blur background
  const DocumentPreviewModal = ({ onClose }) => (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      {/* Background Blur Overlay */}
      <div className="absolute inset-0 bg-green bg-opacity-30 backdrop-blur-lg"></div>

      {/* Modal Box */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-5/6 flex flex-col animate-modal-in overflow-hidden border border-gray-300">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-amber-700 to-yellow-600 text-white border-b border-yellow-800 shadow-md">
          <h3 className="text-lg font-semibold flex items-center gap-3 tracking-wide">
            <FileText className="text-yellow-300" size={20} />
            Land Patta Document Review
          </h3>

          <div className="flex items-center gap-3">
            {/* 🟡 Improved Export Button */}
            <button
              onClick={handleExport}
              className="group relative flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm text-yellow-900 
                       bg-gradient-to-r from-yellow-200 to-yellow-400 
                       hover:from-yellow-300 hover:to-yellow-500 
                       transition-all duration-200 ease-in-out 
                       shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              title="Export Patta PDF"
            >
              <Download
                size={16}
                className="transition-transform duration-200 group-hover:-translate-y-0.5"
              />
              <span>Export PDF</span>
              {/* Glow ring effect */}
              <span className="absolute inset-0 rounded-full ring-2 ring-yellow-500 opacity-0 group-hover:opacity-60 transition"></span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-yellow-800 transition"
              title="Close"
            >
              <X size={20} className="text-white" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col flex-grow overflow-hidden bg-gray-50">
          <div className="flex-grow flex items-start justify-center overflow-auto p-6">
            {/* Document wrapper with watermark */}
            <div className="relative bg-white border border-gray-200 rounded-lg shadow-inner w-full max-w-3xl p-6">
              {/* Watermark */}
              <div className="absolute inset-0 flex justify-center items-center pointer-events-none opacity-6">
                <FileText size={200} className="text-gray-800" />
              </div>

              {/* Top area: small metadata */}
              <div className="relative z-10 mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Document</p>
                    <p className="text-lg font-semibold text-gray-900">
                      FRA Patta
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Claim ID</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {editableClaim.claimId}
                    </p>
                  </div>
                </div>
              </div>

              {/* Document preview image */}
              <div className="relative z-10 flex justify-center items-start">
                <img
                  src="https://imgv2-1-f.scribdassets.com/img/document/807141385/original/203a92d829/1?v=1"
                  alt="FRA Patta Document Preview"
                  className="w-full h-auto border-2 border-gray-200 rounded-md object-contain bg-white shadow-md"
                  style={{ maxHeight: "68vh" }}
                />
              </div>

              {/* Footer inside doc */}
              <div className="relative z-10 mt-4 border-t border-gray-100 pt-3 text-sm text-gray-600 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">Verified By</p>
                  <p className="text-xs text-gray-500">
                    Revenue Office, {editableClaim.district}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Source: External URL</p>
                  <p className="text-xs text-gray-500">
                    Preview only — not final
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom small caption */}
          <p className="text-center text-xs text-gray-500 mt-3">
            Showing document for Claim ID:{" "}
            <span className="font-semibold text-gray-700">
              {editableClaim.claimId}
            </span>
          </p>
        </div>
      </div>
    </div>
  );

  const ReportPreviewModal = ({ onClose }) => (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      {/* Background Blur Overlay */}
      <div className="absolute inset-0 bg-green bg-opacity-30 backdrop-blur-lg"></div>

      {/* Modal Box */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-5/6 flex flex-col animate-modal-in overflow-hidden border border-gray-300">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-green-700 to-green-600 text-white border-b border-green-800 shadow-md">
          <h3 className="text-xl font-semibold flex items-center gap-2 tracking-wide">
            <FileText className="text-yellow-300" size={22} />
            Government Claim Evaluation Report
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-green-800 transition"
          >
            <X size={20} className="text-white" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-grow overflow-y-auto bg-gray-50 p-8 text-gray-800 leading-relaxed">
          {/* Document-style wrapper */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-inner p-8 mx-auto max-w-3xl relative">
            {/* Watermark effect */}
            <div className="absolute inset-0 flex justify-center items-center pointer-events-none opacity-5">
              <FileText size={200} className="text-gray-800" />
            </div>

            {/* Title and Metadata */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 underline decoration-green-600 underline-offset-4">
                Claim Verification & Assessment Report
              </h1>
              <p className="text-sm mt-2 text-gray-600 italic">
                Issued by the Forest Rights Evaluation Committee, Govt. of India
              </p>
            </div>

            {/* Claim Information */}
            <div className="space-y-3 text-[15px] font-medium relative z-10">
              {Object.entries(EDITABLE_DETAIL_MAP).map(([label, key]) => (
                <div
                  key={key}
                  className="flex justify-between border-b border-gray-100 py-1"
                >
                  <span className="text-gray-600">{label}</span>
                  <span className="font-semibold text-gray-900">
                    {editableClaim[key]}
                  </span>
                </div>
              ))}

              {/* Scores Section */}
              <div className="mt-6 border-t border-gray-300 pt-3">
                <h3 className="font-bold text-gray-800 text-lg mb-2">
                  Performance Metrics
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Overall Score</span>
                    <span className="font-semibold text-indigo-700">
                      {editableClaim.overallScore}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Land Suitability</span>
                    <span className="font-semibold text-green-700">
                      {editableClaim.landSuitability}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Community Need</span>
                    <span className="font-semibold text-orange-700">
                      {editableClaim.communityNeed}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vulnerability Index</span>
                    <span className="font-semibold text-red-700">
                      {editableClaim.vulnerability}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="mt-6 border-t border-gray-300 pt-3">
                <h3 className="font-bold text-gray-800 text-lg mb-2">
                  Current Claim Status
                </h3>
                <p className="text-gray-900">
                  {editableClaim.status.join(", ")}
                </p>
              </div>

              {/* Authorized Seal */}
              <div className="mt-10 text-center relative">
                <p className="text-sm text-gray-500">
                  Certified by: <br />
                  <span className="font-semibold text-gray-800">
                    Divisional Forest Officer, {editableClaim.district} District
                  </span>
                </p>
                <div className="mt-4 inline-block relative">
                  <div className="absolute inset-0 rounded-full border-4 border-green-600 opacity-40 blur-[1px]"></div>
                  <div className="px-6 py-2 border-2 border-green-700 text-green-700 rounded-full font-bold tracking-wide uppercase text-sm bg-green-50">
                    Official Seal
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <p className="text-center text-xs text-gray-500 mt-6">
            Document generated on{" "}
            <span className="font-semibold">
              {new Date().toLocaleDateString()}
            </span>{" "}
            for Claim ID:{" "}
            <span className="font-semibold text-gray-800">
              {editableClaim.claimId}
            </span>
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-8 text-gray-900 relative font-sans">
      {showDocumentPreview && (
        <DocumentPreviewModal onClose={() => setShowDocumentPreview(false)} />
      )}
      {showReportPreview && (
        <ReportPreviewModal onClose={() => setShowReportPreview(false)} />
      )}

      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold tracking-wide flex items-center gap-3 text-indigo-700">
          <BarChart3 className="text-green-600" size={30} />
          FRA Claim Status:{" "}
          <span className="text-gray-900">{editableClaim.claimId}</span>
        </h1>
        <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0 items-center w-full sm:w-auto">
          <div className="relative flex items-center w-full sm:w-64">
            <input
              type="text"
              placeholder="Search by ID or Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-full w-full focus:ring-indigo-500 focus:border-indigo-500 transition shadow-inner text-sm"
            />
            <Search size={16} className="absolute left-3 text-gray-400" />
          </div>
          <button
            onClick={handleLoadClaim}
            disabled={loadingClaim}
            className={`px-4 py-2 ${
              loadingClaim
                ? "bg-indigo-300"
                : "bg-indigo-600 hover:bg-indigo-700"
            } transition text-white rounded-full font-semibold shadow-md flex items-center justify-center gap-2 text-sm`}
          >
            {loadingClaim ? (
              <RotateCcw size={18} className="animate-spin" />
            ) : (
              <Search size={18} />
            )}
            {loadingClaim ? "Loading..." : "Load Claim"}
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-8 justify-end">
        <button
          onClick={handleViewDocuments}
          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 transition text-white rounded-full font-semibold shadow-md flex items-center gap-2 text-sm"
        >
          <FileText size={18} /> Review Patta Docs
        </button>
        <button
          onClick={handleViewReport}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 transition text-white rounded-full font-semibold shadow-md flex items-center gap-2 text-sm"
        >
          <FileText size={18} /> Preview Report
        </button>
        <button
          onClick={isEditing ? handleSaveChanges : handleEditToggle}
          className={`px-4 py-2 ${
            isEditing
              ? "bg-indigo-600 hover:bg-indigo-700"
              : "bg-blue-600 hover:bg-blue-700"
          } transition text-white rounded-full font-semibold shadow-md flex items-center gap-2 text-sm`}
        >
          {isEditing ? <Save size={18} /> : <Edit size={18} />}
          {isEditing ? "Save Changes" : "Edit Details"}
        </button>
        {isEditing && (
          <button
            onClick={handleEditToggle}
            className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-full font-semibold shadow-md flex items-center gap-2 text-sm"
          >
            <Ban size={18} /> Cancel
          </button>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT: Claim Details */}
        <div className="bg-white rounded-xl shadow-xl p-6 hover:shadow-2xl transition-all border border-gray-200">
          <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2 border-b pb-2">
            <FileText className="text-indigo-600" /> Claimant & Application Data
          </h2>
          <table className="w-full text-sm border-collapse">
            <tbody>
              {Object.entries(EDITABLE_DETAIL_MAP).map(
                ([displayKey, objKey], i) => (
                  <tr
                    key={objKey}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition ${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="py-3 px-3 font-medium text-gray-600">
                      {displayKey}
                    </td>
                    <td className="py-3 px-3 text-gray-900 font-semibold">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editableClaim[objKey]}
                          onChange={(e) =>
                            handleInputChange(objKey, e.target.value)
                          }
                          className="border border-indigo-300 rounded-md p-1 w-full text-gray-800 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      ) : (
                        editableClaim[objKey]
                      )}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {/* RIGHT: Scores & Vulnerability */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition border border-gray-200">
            <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2 border-b pb-2">
              <Award className="text-orange-600" /> Assessment Scores
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(SCORE_MAP).map(([displayKey, objKey]) => (
                <ScoreCard
                  key={objKey}
                  title={displayKey}
                  value={editableClaim[objKey]}
                  color={
                    objKey === "overallScore"
                      ? "text-indigo-600"
                      : objKey === "landSuitability"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                />
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition border border-gray-200">
            <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2 border-b pb-2">
              <Activity className="text-red-600" /> Vulnerability Scoring
            </h2>
            <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
              <div
                className="h-full bg-red-500 transition-all"
                style={{ width: `${vulnerabilityPercent}%` }}
              ></div>
            </div>
            <p className="mt-2 text-sm font-semibold text-gray-700">
              {vulnerabilityPercent}%
            </p>
          </div>

          {/* Audit Log */}
          <div className="bg-white p-6 rounded-xl shadow-xl hover:shadow-2xl transition border border-gray-200">
            <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2 border-b pb-2">
              <Activity className="text-purple-600" /> Audit Log
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 max-h-48 overflow-y-auto">
              {auditLog.map((log, i) => (
                <li key={i}>{log}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Historical Claims */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow-xl border border-gray-200">
        <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2 border-b pb-2">
          <Calendar className="text-indigo-600" /> Historical Claims
        </h2>
        {editableClaim.historicalClaims.length > 0 ? (
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-2 text-left text-gray-600">Claim ID</th>
                <th className="p-2 text-left text-gray-600">Date</th>
                <th className="p-2 text-left text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {editableClaim.historicalClaims.map((hc) => (
                <tr key={hc.claimId} className="hover:bg-gray-50 transition">
                  <td className="p-2 font-medium">{hc.claimId}</td>
                  <td className="p-2">{hc.date}</td>
                  <td className="p-2">{hc.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 text-sm">
            No historical claims found for this claimant.
          </p>
        )}
      </div>
    </div>
  );
}

const ScoreCard = ({ title, value, color }) => (
  <div className="bg-gray-50 p-4 rounded-lg shadow-inner border border-gray-200 text-center">
    <p className={`text-sm font-medium ${color}`}>{title}</p>
    <p className={`text-xl font-bold mt-2 ${color}`}>{value}</p>
  </div>
);

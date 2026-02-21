import React, { useState, useMemo } from "react";
import {
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  Edit,
  ArrowRight,
  Map,
  ClipboardList,
  MessageSquare,
  X,
  Zap,
  Search,
  ExternalLink,
  Calendar,
  Layers,
  Home,
  Check, // Added Check icon for schemes
} from "lucide-react";
// Omitted Recharts imports for brevity

// --- DSS Schemes Card Component (REVISED UI) ---
const DSSSchemesCard = ({ claim, onClose }) => {
  // Sample data based on DSS functionality described in Q&A
  const schemes = [
    {
      name: "PM-Kisan Samman Nidhi",
      description: "Direct income support for farmers.",
      priority: "High",
      link: "https://pmkisan.gov.in/",
      reason: "Claim is marked for agriculture use.",
    },
    {
      name: "Jal Jeevan Mission",
      description: "Water connection for habitation areas.",
      priority: "Medium",
      link: "https://ejalshakti.gov.in/jjm/",
      reason: "Claim location is near a mapped habitation cluster.",
    },
    {
      name: "MGNREGA Scheme",
      description: "Guaranteed wage employment for rural households.",
      priority: "High",
      link: "https://nrega.nic.in/",
      reason: "Low-income household status detected.",
    },
    {
      name: "Rural Housing Scheme",
      description: "Financial assistance for house construction.",
      priority: "Low",
      link: "#",
      reason: "Claimant is listed as low-income, but location density is low.",
    },
  ];

  const getPriorityClasses = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-500 text-white";
      case "Medium":
        return "bg-yellow-500 text-gray-900";
      case "Low":
        return "bg-gray-200 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    // UPDATED BACKGROUND CLASS: changed to bg-gray-900/50 backdrop-blur-lg
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-lg p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Card Header (Matches requested style: Green header, Check icon) */}
        <div className="flex justify-between items-center p-5 bg-green-600 text-white sticky top-0 z-10">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <CheckCircle size={24} className="text-white" />
            DSS Recommendations for {claim.id}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Card Body */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          <p className="text-gray-700 font-medium border-b pb-3">
            The Decision Support System has matched the data about the
            claimant's profile with the following eligible welfare schemes:
          </p>

          {schemes.map((scheme, index) => (
            <div
              key={index}
              className="p-5 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Check size={18} className="text-green-600" />
                  {scheme.name}
                </h4>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${getPriorityClasses(
                    scheme.priority
                  )}`}
                >
                  Priority: {scheme.priority}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{scheme.description}</p>
              <p className="text-xs text-indigo-700 italic">
                Reason: {scheme.reason}
              </p>
              <a
                href={scheme.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition border-b border-blue-600 border-dashed"
              >
                Go to Portal <ExternalLink size={14} className="ml-1" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Claim Review Modal Component (Unchanged - uses the new DSSSchemesCard) ---
const ClaimReviewModal = ({ claim, onClose, onUpdateStatus }) => {
  const initialChecklist = [
    { label: "Documents submitted and valid", checked: true },
    { label: "Land area within permissible limits", checked: false },
    { label: "No conflicting claims on same land", checked: true },
    { label: "Claimant meets eligibility criteria", checked: true },
    { label: "GPS coordinates verified (if provided)", checked: false },
    { label: "Village/Mandal records checked", checked: true },
  ];

  const [verificationChecklist, setVerificationChecklist] =
    useState(initialChecklist);
  const [verificationNotes, setVerificationNotes] = useState("");
  const [currentStatus, setCurrentStatus] = useState(claim.status);
  const [isSaving, setIsSaving] = useState(false);
  const [showDssCard, setShowDssCard] = useState(false);

  const handleChecklistToggle = (index) => {
    setVerificationChecklist((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleUpdate = (newStatus) => {
    setIsSaving(true);
    setTimeout(() => {
      setCurrentStatus(newStatus);
      onUpdateStatus(
        claim.id,
        newStatus,
        verificationNotes,
        verificationChecklist
      );
      setIsSaving(false);
      onClose();
    }, 1500);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-600";
      case "Rejected":
        return "bg-red-600";
      case "Pending":
        return "bg-yellow-500";
      case "Verified":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  if (showDssCard) {
    // Renders the REVISED DSS CARD
    return (
      <DSSSchemesCard claim={claim} onClose={() => setShowDssCard(false)} />
    );
  }

  const claimantDetails = [
    {
      label: "Claim ID",
      value: claim.id,
      icon: <ClipboardList size={16} className="text-green-500" />,
    },
    {
      label: "Claimant Name",
      value: claim.claimant,
      icon: <Edit size={16} className="text-green-500" />,
    },
    {
      label: "Claim Type",
      value: claim.claimType,
      icon: <Layers size={16} className="text-green-500" />,
    },
    {
      label: "Village",
      value: claim.village,
      icon: <Home size={16} className="text-green-500" />,
    },
    {
      label: "District",
      value: claim.district,
      icon: <Map size={16} className="text-green-500" />,
    },
    {
      label: "State",
      value: claim.state,
      icon: <Map size={16} className="text-green-500" />,
    },
    {
      label: "Area (ha)",
      value: claim.landArea,
      icon: <Map size={16} className="text-green-500" />,
    },
    {
      label: "Date of Application",
      value: claim.submissionDate,
      icon: <Calendar size={16} className="text-green-500" />,
    },
    { label: "Current Status", value: currentStatus, status: true },
  ];

  return (
    // UPDATED BACKGROUND CLASS: changed to bg-gray-900/50 backdrop-blur-lg
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-lg p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-5 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <CheckCircle size={24} className="text-green-600" />
            Claim Verification:{" "}
            <span className="text-gray-800">{claim.id}</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Body - Split View */}
        <div className="flex-grow overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel: Claim Info & Review */}
          <div className="space-y-6">
            {/* CLAIM INFORMATION CARD */}
            <div className="p-5 bg-white rounded-xl shadow-md border border-gray-200">
              <h3 className="text-lg font-bold mb-4 border-b pb-2 text-gray-700 flex items-center gap-2">
                <ClipboardList size={20} className="text-green-600" /> Claimant
                Details
              </h3>
              <div className="space-y-3">
                {claimantDetails.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center text-sm border-b border-dashed pb-2 last:border-b-0 last:pb-0"
                  >
                    <div className="font-medium text-gray-600 flex items-center gap-2">
                      {item.icon} {item.label}:
                    </div>
                    {item.status ? (
                      <span
                        className={`font-bold py-1 px-3 rounded-full text-white text-xs text-center inline-block ${getStatusColor(
                          item.value
                        )}`}
                      >
                        {item.value}
                      </span>
                    ) : (
                      <p className="font-semibold text-gray-800">
                        {item.value}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Verification Checklist Card (Interactive Checkboxes) */}
            <div className="p-5 bg-white rounded-xl shadow-md border border-gray-200">
              <h3 className="text-lg font-bold mb-3 border-b pb-2 text-gray-700 flex items-center gap-2">
                <CheckCircle size={20} className="text-blue-600" /> Verification
                Checklist
              </h3>
              <div className="space-y-3">
                {verificationChecklist.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center text-sm cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition"
                    onClick={() => handleChecklistToggle(index)}
                  >
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => handleChecklistToggle(index)}
                      className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2 mr-3"
                    />
                    <span
                      className={`flex-grow ${
                        item.checked ? "text-gray-800" : "text-gray-600"
                      }`}
                    >
                      {item.label}
                    </span>
                    {item.checked ? (
                      <CheckCircle size={16} className="text-green-500 ml-2" />
                    ) : (
                      <XCircle size={16} className="text-red-500 ml-2" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* DSS Recommendation Button */}
            <button
              onClick={() => setShowDssCard(true)}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-semibold hover:bg-indigo-700 transition-all shadow-md"
            >
              <Zap size={18} />
              Check DSS Schemes Eligibility
            </button>
          </div>

          {/* Right Panel: Notes & Status Update */}
          <div className="space-y-6">
            <div className="p-5 bg-white rounded-xl shadow-md border border-gray-200">
              <h3 className="text-lg font-bold mb-3 border-b pb-2 text-gray-700 flex items-center gap-2">
                <MessageSquare size={20} className="text-gray-600" />{" "}
                Verification Notes
              </h3>
              <textarea
                rows="14"
                placeholder="Enter verification notes, observations, or reasons for decision..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition resize-none"
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
              ></textarea>
            </div>

            {/* Status Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => handleUpdate("Approved")}
                disabled={isSaving}
                className="w-full bg-green-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-semibold hover:bg-green-700 transition-all disabled:opacity-50 shadow-md"
              >
                {isSaving ? (
                  "Saving..."
                ) : (
                  <>
                    <CheckCircle size={18} /> Approve Claim
                  </>
                )}
              </button>
              <button
                onClick={() => handleUpdate("Rejected")}
                disabled={isSaving}
                className="w-full bg-red-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-semibold hover:bg-red-700 transition-all disabled:opacity-50 shadow-md"
              >
                {isSaving ? (
                  "Saving..."
                ) : (
                  <>
                    <XCircle size={18} /> Reject Claim
                  </>
                )}
              </button>
              <button
                onClick={() => handleUpdate("Verified")}
                disabled={isSaving}
                className="w-full bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 shadow-md"
              >
                {isSaving ? (
                  "Saving..."
                ) : (
                  <>
                    <Edit size={18} /> Mark as Verified
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Dashboard Component (Unchanged from previous step, included for completeness) ---
export default function Dashboard() {
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const initialClaims = [
    {
      id: "CL1756231553674",
      claimant: "Rajesh Kumar",
      village: "Amgaon",
      landArea: "2.5 ha",
      status: "Pending",
      priority: "HIGH",
      submissionDate: "2023-05-15",
      claimType: "Individual",
      district: "Chandrapur",
      state: "Madhya Pradesh",
    },
    {
      id: "No-49 (PA059A)",
      claimant: "Sunder",
      village: "Almoor",
      landArea: "3 ha",
      status: "Pending",
      priority: "LOW",
      submissionDate: "30/09/2025",
      claimType: "Community",
      district: "Gadchiroli",
      state: "Madhya Pradesh",
    },
    {
      id: "CL1757231553745",
      claimant: "Priya",
      village: "Almoor",
      landArea: "3.5 hectares",
      status: "Pending",
      priority: "LOW",
      submissionDate: "30/09/2025",
      claimType: "Individual",
      district: "Nagpur",
      state: "Madhya Pradesh",
    },
    {
      id: "CL1758231553767",
      claimant: "Rahul",
      village: "Ganeshpur",
      landArea: "5 acres",
      status: "Verified",
      priority: "HIGH",
      submissionDate: "28/09/2025",
      claimType: "Individual",
      district: "Yavatmal",
      state: "Madhya Pradesh",
    },
  ];

  const [claimsList, setClaimsList] = useState(initialClaims);

  const filteredClaims = useMemo(() => {
    if (!searchTerm) return claimsList;
    const lowerCaseSearch = searchTerm.toLowerCase();

    return claimsList.filter(
      (claim) =>
        claim.id.toLowerCase().includes(lowerCaseSearch) ||
        claim.claimant.toLowerCase().includes(lowerCaseSearch)
    );
  }, [claimsList, searchTerm]);

  const summary = [
    {
      title: "Records Digitized",
      value: "15,000+",
      desc: "Converted Handwritten records",
    },
    {
      title: "Villages Mapped",
      value: "120+",
      desc: "Villages with mapped assets",
    },
    {
      title: "Schemes Recommended",
      value: "200+",
      desc: "Suggested welfare schemes",
    },
    {
      title: "Potential Claim Areas",
      value: "80+",
      desc: "Areas available for claims",
    },
  ];
  const pendingClaimsCount = filteredClaims.filter(
    (c) => c.status === "Pending"
  ).length;
  const verifiedClaimsCount = filteredClaims.filter(
    (c) => c.status === "Verified"
  ).length;
  const approvedClaimsCount = filteredClaims.filter(
    (c) => c.status === "Approved"
  ).length;

  const handleClaimClick = (claim) => {
    setSelectedClaim(claim);
  };

  const handleStatusUpdate = (claimId, newStatus, notes, checklist) => {
    setClaimsList((prev) =>
      prev.map((claim) =>
        claim.id === claimId
          ? {
              ...claim,
              status: newStatus,
              notes: notes,
              verification: checklist,
            }
          : claim
      )
    );
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Verified":
        return "bg-blue-100 text-blue-700";
      case "Approved":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6 md:p-10 transition-colors duration-700 ease-in-out">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-500">
            Real-time overview of digitization & claims progress
          </p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow hover:bg-green-700 transition-all duration-300 transform hover:scale-105">
            <Download size={18} />
            Download Report
          </button>
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-300 transition-all duration-300 transform hover:scale-105">
            <RefreshCw size={18} />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {summary.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md border p-6 transition-all duration-500 hover:shadow-xl hover:scale-[1.03] animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <p className="text-gray-500 text-sm">{item.title}</p>
            <h2 className="text-2xl font-bold text-green-600 mt-2">
              {item.value}
            </h2>
            <p className="text-gray-400 text-sm mt-1">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Claim Review Section */}
      <div className="bg-white rounded-2xl p-6 shadow-xl border mb-10 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <h3 className="font-semibold text-xl">Claim Review Queue</h3>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search by Claim ID or Claimant Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition"
            />
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>

          <button className="text-green-600 flex items-center gap-1 hover:text-green-700 transition hidden md:block">
            View All <ArrowRight size={18} />
          </button>
        </div>

        {/* Status Indicators */}
        <div className="flex gap-4 mb-6 border-b pb-4">
          <div className="text-center p-3 rounded-lg bg-red-50 text-red-600 font-bold w-1/4 shadow-sm">
            <div className="text-2xl">{pendingClaimsCount}</div>
            <div className="text-sm">PENDING REVIEW</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-blue-50 text-blue-600 font-bold w-1/4 shadow-sm">
            <div className="text-2xl">{verifiedClaimsCount}</div>
            <div className="text-sm">VERIFIED</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-green-50 text-green-600 font-bold w-1/4 shadow-sm">
            <div className="text-2xl">{approvedClaimsCount}</div>
            <div className="text-sm">APPROVED</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-yellow-50 text-yellow-600 font-bold w-1/4 shadow-sm">
            <div className="text-2xl">4</div>
            <div className="text-sm">HIGH PRIORITY</div>
          </div>
        </div>

        {/* Pending Claims Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b text-gray-500 bg-gray-50">
                <th className="p-3">Claim ID</th>
                <th className="p-3">Claimant/Village</th>
                <th className="p-3">Land Area</th>
                <th className="p-3">Status</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Submission</th>
                <th className="p-3 text-center">Review</th>
              </tr>
            </thead>
            <tbody>
              {filteredClaims.length > 0 ? (
                filteredClaims.map((claim, idx) => (
                  <tr
                    key={claim.id}
                    className="border-b hover:bg-green-50/50 transition-all duration-300 cursor-pointer"
                    onClick={() => handleClaimClick(claim)}
                  >
                    <td className="py-3 px-3 text-green-700 font-medium">
                      {claim.id}
                    </td>
                    <td className="py-3">
                      <div className="font-semibold">{claim.claimant}</div>
                      <div className="text-gray-500 text-xs">
                        {claim.village}
                      </div>
                    </td>
                    <td className="py-3">{claim.landArea}</td>
                    <td className="py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClasses(
                          claim.status
                        )}`}
                      >
                        {claim.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          claim.priority === "HIGH"
                            ? "bg-red-100 text-red-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {claim.priority}
                      </span>
                    </td>
                    <td className="py-3 text-gray-500 text-xs">
                      {claim.submissionDate}
                    </td>
                    <td className="py-3 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClaimClick(claim);
                        }}
                        className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition shadow-md"
                        title="Review Claim"
                      >
                        <Edit size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-500">
                    No claims match your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Render */}
      {selectedClaim && (
        <ClaimReviewModal
          claim={selectedClaim}
          onClose={() => setSelectedClaim(null)}
          onUpdateStatus={handleStatusUpdate}
        />
      )}
      {/* Animations (Existing) */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        .animate-slide-up {
          animation: slide-up 0.7s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

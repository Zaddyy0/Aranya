// AssetMap.jsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Droplets,
  TreePine,
  Wheat,
  BadgeCheck,
  Zap,
  LandPlot,
  X,
  Leaf,
  Waves,
  Tractor,
  AlertTriangle,
  BarChart3,
  AlertCircle,
  Clock,
  Briefcase,
  Target,
  FlaskConical,
  Scale,
  MapPin,
  FileText,
  Calendar,
  Gavel,
  User,
  Map,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MapSidebar from "../components/MapSidebar";

// --- Mock District Centers ---
const getDistrictCenter = (districtName) => {
  const lower = districtName.toLowerCase();
  if (lower.includes("bhopal")) return { lat: 23.25, lng: 77.41 };
  if (lower.includes("indore")) return { lat: 22.71, lng: 75.85 };
  if (lower.includes("chhindwara")) return { lat: 22.06, lng: 78.93 };
  if (lower.includes("jabalpur")) return { lat: 23.18, lng: 79.99 };
  return { lat: 23.5, lng: 78.5 };
};

// --- Mock District Info ---
const districtInfoData = {
  Chhindwara: {
    shape_len: "502656.74811",
    shape_area: "7230506361.06",
    state: "Madhya Pradesh",
    forest_area_km: 4200, // 4200 km²
    disputes_count: 35,
    water_bodies: 12,
  },
  Bhopal: {
    shape_len: "210987.12345",
    shape_area: "2772500000.00",
    state: "Madhya Pradesh",
    forest_area_km: 750, // 750 km²
    disputes_count: 12,
    water_bodies: 3,
  },
  Indore: {
    shape_len: "330112.55667",
    shape_area: "3898700000.00",
    state: "Madhya Pradesh",
    forest_area_km: 50, // 50 km²
    disputes_count: 8,
    water_bodies: 5,
  },
};

// --- Dummy Forest Analysis Data (ENHANCED) ---
const forestAnalysisData = {
  Chhindwara: {
    totalSpecies: 257,
    dominantSpecies: [
      "Teak (Tectona grandis)",
      "Sal (Shorea robusta)",
      "Bamboo (Bambusa sp.)",
    ],
    healthScore: 88, // out of 100
    threats: ["Illegal Logging", "Invasive Species (Lantana)", "Forest Fires"],
    coverageTrend: "+2.5% YoY",
    biodiversityScore: "High (Shannon Index: 3.1)",
    carbonSequestration_tons: 155000,
    annualGrowthRate: "4.2% VOA (Volume Over Area)",
  },
  Bhopal: {
    totalSpecies: 105,
    dominantSpecies: ["Neem (Azadirachta indica)", "Mango (Mangifera indica)"],
    healthScore: 68,
    threats: ["Urban Encroachment", "Pollution"],
    coverageTrend: "-1.2% YoY",
    biodiversityScore: "Medium (Shannon Index: 2.1)",
    carbonSequestration_tons: 35000,
    annualGrowthRate: "0.8% VOA",
  },
  Indore: {
    totalSpecies: 78,
    dominantSpecies: [
      "Acacia (Vachellia nilotica)",
      "Eucalyptus (Eucalyptus sp.)",
    ],
    healthScore: 55,
    threats: ["Pollution", "Soil Degradation", "Water Scarcity"],
    coverageTrend: "+0.8% YoY",
    biodiversityScore: "Low (Shannon Index: 1.5)",
    carbonSequestration_tons: 12000,
    annualGrowthRate: "1.5% VOA",
  },
};

// --- Dummy Disputes Data (ENHANCED with more authentic details) ---
const disputesData = {
  Chhindwara: [
    {
      id: "D001",
      parties: "Villagers vs Timber Mafia",
      status: "Pending",
      duration: "6 months",
      area: "200 ha",
      type: "Forest Land Dispute",
      coordinates: { lat: 22.05, lng: 79.15 },
      legalStatus: "Under Judicial Review",
      description:
        "Ongoing dispute involving illegal logging activities by organized groups in protected forest zones. The case highlights violations under the Indian Forest Act, 1927.",
      timeline: [
        {
          date: "2025-04-10",
          event: "Initial complaint lodged by local community.",
        },
        {
          date: "2025-05-05",
          event: "Site inspection conducted by forest officials.",
        },
        {
          date: "2025-06-15",
          event: "Legal proceedings initiated in district court.",
        },
        { date: "2025-09-20", event: "Latest hearing; evidence presented." },
      ],
      evidence: [
        "Satellite imagery showing deforestation.",
        "Eyewitness accounts from villagers.",
        "Seized logging tools and vehicles.",
      ],
      court: "District Court, Chhindwara",
      judge: "Hon'ble Justice A. K. Singh",
      filingDate: "2025-04-10",
      lastHearingDate: "2025-09-20",
      nextHearingDate: "2025-11-15",
      attachments: [
        "Complaint_Form.pdf",
        "Satellite_Images.zip",
        "Witness_Statements.doc",
      ],
    },
    {
      id: "D002",
      parties: "Forest Dept vs Farmer",
      status: "Resolved",
      duration: "3 months",
      area: "50 ha",
      type: "Boundary Encroachment",
      coordinates: { lat: 21.95, lng: 78.8 },
      legalStatus: "Closed - Boundary Demarcated",
      description:
        "Dispute over farm land encroaching into forest boundaries, resolved through mediation under the guidance of local authorities.",
      timeline: [
        { date: "2025-07-01", event: "Complaint filed by Forest Department." },
        { date: "2025-07-20", event: "Joint survey conducted." },
        {
          date: "2025-09-10",
          event: "Agreement reached and boundaries redrawn.",
        },
        { date: "2025-10-01", event: "Case closed." },
      ],
      evidence: [
        "Survey maps and GPS data.",
        "Photographs of boundary markers.",
        "Signed agreement documents.",
      ],
      court: "Tehsil Court, Chhindwara",
      judge: "Hon'ble Magistrate R. Verma",
      filingDate: "2025-07-01",
      lastHearingDate: "2025-09-10",
      nextHearingDate: "N/A",
      attachments: ["Survey_Report.pdf", "Agreement_Document.doc"],
    },
    {
      id: "D003",
      parties: "Local vs Industrialist",
      status: "Hearing",
      duration: "9 months",
      area: "150 ha",
      type: "Water Source Usage",
      coordinates: { lat: 22.1, lng: 78.9 },
      legalStatus: "Next Hearing Date: 2025-11-01",
      description:
        "Conflict over industrial usage of local water sources affecting community access, invoking provisions of the Water (Prevention and Control of Pollution) Act, 1974.",
      timeline: [
        {
          date: "2025-01-15",
          event: "Protest by locals against water diversion.",
        },
        { date: "2025-02-10", event: "Legal notice served to industrialist." },
        { date: "2025-04-05", event: "First court hearing." },
        { date: "2025-10-01", event: "Evidence submission." },
      ],
      evidence: [
        "Water quality reports.",
        "Usage permits and violations.",
        "Community impact statements.",
      ],
      court: "High Court, Jabalpur",
      judge: "Hon'ble Justice S. Patel",
      filingDate: "2025-02-10",
      lastHearingDate: "2025-10-01",
      nextHearingDate: "2025-11-01",
      attachments: [
        "Water_Quality_Report.pdf",
        "Permit_Documents.zip",
        "Impact_Statements.doc",
      ],
    },
  ],
  Bhopal: [
    {
      id: "D004",
      parties: "Local vs Builder (Illegal Construction)",
      status: "Stay Order",
      duration: "8 months",
      area: "100 ha",
      type: "Urban Encroachment",
      coordinates: { lat: 23.2, lng: 77.45 },
      legalStatus: "High Court Stay on Development",
      description:
        "Illegal construction on forest land leading to encroachment in urban expansion areas, challenged under the Environment Protection Act, 1986.",
      timeline: [
        { date: "2025-02-01", event: "Discovery of illegal construction." },
        { date: "2025-02-20", event: "Complaint filed in high court." },
        { date: "2025-03-15", event: "Stay order issued." },
        { date: "2025-09-10", event: "Ongoing monitoring." },
      ],
      evidence: [
        "Building permits (lack thereof).",
        "Aerial photographs of site.",
        "Environmental impact assessment.",
      ],
      court: "High Court, Bhopal",
      judge: "Hon'ble Justice M. Khan",
      filingDate: "2025-02-20",
      lastHearingDate: "2025-09-10",
      nextHearingDate: "2025-12-05",
      attachments: ["Stay_Order.pdf", "Aerial_Photos.zip", "EIA_Report.doc"],
    },
    {
      id: "D005",
      parties: "Tribal vs Govt (FRA Claim)",
      status: "Closed",
      duration: "4 months",
      area: "80 ha",
      type: "Forest Rights Claim",
      coordinates: { lat: 23.35, lng: 77.38 },
      legalStatus: "Closed - Claim Approved",
      description:
        "Claim under Forest Rights Act for traditional tribal lands, successfully resolved in favor of the claimants.",
      timeline: [
        { date: "2025-06-01", event: "Claim submitted by tribal community." },
        { date: "2025-06-25", event: "Verification process started." },
        { date: "2025-08-10", event: "Approval granted." },
        { date: "2025-10-01", event: "Rights transferred." },
      ],
      evidence: [
        "Historical records of occupancy.",
        "Tribal council statements.",
        "Government verification report.",
      ],
      court: "Tribal Welfare Court, Bhopal",
      judge: "Hon'ble Commissioner P. Reddy",
      filingDate: "2025-06-01",
      lastHearingDate: "2025-08-10",
      nextHearingDate: "N/A",
      attachments: ["Claim_Form.pdf", "Historical_Records.zip"],
    },
  ],
  Indore: [
    {
      id: "D006",
      parties: "Farmer vs Developer (Land Grab)",
      status: "Active",
      duration: "2 months",
      area: "30 ha",
      type: "Agricultural Land Dispute",
      coordinates: { lat: 22.7, lng: 75.9 },
      legalStatus: "Police Investigation Active",
      description:
        "Alleged land grab attempt on agricultural property by real estate developer, under investigation per the Land Acquisition Act.",
      timeline: [
        { date: "2025-08-15", event: "Incident reported to police." },
        { date: "2025-08-25", event: "Investigation initiated." },
        { date: "2025-09-20", event: "Statements recorded." },
        { date: "2025-10-10", event: "Ongoing inquiry." },
      ],
      evidence: [
        "Land title deeds.",
        "Police FIR copy.",
        "Witness testimonies.",
      ],
      court: "Civil Court, Indore",
      judge: "Hon'ble Justice V. Jain",
      filingDate: "2025-08-15",
      lastHearingDate: "2025-10-10",
      nextHearingDate: "2025-11-20",
      attachments: ["Title_Deeds.pdf", "FIR_Copy.doc", "Testimonies.zip"],
    },
  ],
};

// --- Mock Dot Marker Data (ENHANCED) ---
const districtMarkersData = {
  Chhindwara: [
    {
      type: "Forest",
      color: "#10B981",
      position: { lat: 22.0, lng: 79.1 },
      data: {
        name: "Patalkot Forest Range",
        status: "Protected Forest",
        coverage: "35% of District",
        biomass_density: "150 ton/ha",
      },
      extraNotes: "Rich in Teak and Sal. Monitor for illegal mining activity.",
    },
    {
      type: "Water",
      color: "#3B82F6",
      position: { lat: 21.8, lng: 78.85 },
      data: {
        name: "Pench River Zone",
        status: "Critical Water Stress",
        volume: "12 MCM (Monitored)",
        pollution_level: "Medium",
      },
      extraNotes: "Seasonal water scarcity is a recurring issue.",
    },
    {
      type: "Agriculture",
      color: "#A16207",
      position: { lat: 22.15, lng: 78.7 },
      data: {
        crop: "Wheat (Rabi)",
        yield: "3.5 MT/ha (High)",
        area: "500 ha",
        soil_fertility: "Medium-High",
      },
      extraNotes: "One of the key production zones for the district.",
    },
  ],
  Bhopal: [
    {
      type: "Forest",
      color: "#10B981",
      position: { lat: 23.3, lng: 77.45 },
      data: {
        name: "Kaliasot Green Belt",
        status: "Urban Forest",
        coverage: "15% of Area",
        biomass_density: "80 ton/ha",
      },
      extraNotes:
        "Facing pressure from urban expansion. Needs continuous afforestation.",
    },
    {
      type: "Agriculture",
      color: "#A16207",
      position: { lat: 23.2, lng: 77.5 },
      data: {
        crop: "Rice (Kharif)",
        yield: "2.1 MT/ha (Medium)",
        area: "120 ha",
        soil_fertility: "Medium",
      },
      extraNotes: "Dependent on rain-fed irrigation.",
    },
    {
      type: "Dispute",
      color: "#EF4444",
      position: { lat: 23.25, lng: 77.48 },
      data: {
        land_id: "Plot 123 - Kolar",
        parties: "Local vs Builder",
        status: "Stay Order",
        duration: "8 months",
        case_id: "D004",
      },
      extraNotes: "Case ID: D004. High-profile land grab attempt.",
    },
  ],
  Indore: [
    {
      type: "Forest",
      color: "#10B981",
      position: { lat: 22.75, lng: 75.9 },
      data: {
        name: "Patalpani Hills",
        status: "Reserved Forest",
        coverage: "5% of District",
        biomass_density: "60 ton/ha",
      },
      extraNotes: "Low cover, vulnerable to fire.",
    },
    {
      type: "Water",
      color: "#3B82F6",
      position: { lat: 22.8, lng: 75.8 },
      data: {
        name: "Kahn River Rejuvenation",
        status: "Active Project",
        volume: "N/A (River)",
        pollution_level: "High (Improving)",
      },
      extraNotes: "Major efforts ongoing to improve river water quality.",
    },
    {
      type: "Agriculture",
      color: "#A16207",
      position: { lat: 22.7, lng: 75.85 },
      data: {
        crop: "Soybean (Kharif)",
        yield: "1.8 MT/ha (High)",
        area: "300 ha",
        soil_fertility: "High",
      },
      extraNotes: "Soybean is the primary cash crop.",
    },
    {
      type: "Dispute",
      color: "#EF4444",
      position: { lat: 22.78, lng: 75.75 },
      data: {
        land_id: "Survey No. 45 - Depalpur",
        parties: "Farmer vs Developer",
        status: "Active",
        duration: "2 months",
        case_id: "D006",
      },
      extraNotes: "Case ID: D006. Land title dispute.",
    },
  ],
};

// --- Map State Variables ---
let mapInstance = null;
let stateBoundaryPolygon = null;
let allDistrictPolygons = {};
let selectedDistrictPolygon = null;
let infoWindow = null;
let disputePolygon = null;

// --- Helper: Get Status Classes ---
const getStatusClasses = (status) => {
  const lowerStatus = status.toLowerCase();
  if (
    lowerStatus.includes("resolved") ||
    lowerStatus.includes("closed") ||
    lowerStatus.includes("approved")
  ) {
    return "bg-green-100 text-green-800 border-green-300";
  }
  if (
    lowerStatus.includes("pending") ||
    lowerStatus.includes("hearing") ||
    lowerStatus.includes("active")
  ) {
    return "bg-yellow-100 text-yellow-800 border-yellow-300";
  }
  if (lowerStatus.includes("stay") || lowerStatus.includes("judicial")) {
    return "bg-red-100 text-red-800 border-red-300";
  }
  return "bg-gray-100 text-gray-700 border-gray-300";
};

// --- Create Dot InfoWindow HTML (ENHANCED) ---
const createDotInfoWindowContent = (markerData) => {
  const typeIcons = {
    Forest: Leaf,
    Water: Waves,
    Agriculture: Tractor,
    Dispute: AlertTriangle,
  };
  const typeColors = {
    Forest: "green-600",
    Water: "blue-600",
    Agriculture: "yellow-700",
    Dispute: "red-600",
  };
  const typeBg = {
    Forest: "bg-green-50 border-green-200",
    Water: "bg-blue-50 border-blue-200",
    Agriculture: "bg-yellow-50 border-yellow-200",
    Dispute: "bg-red-50 border-red-200",
  };

  const LucideIcon = typeIcons[markerData.type] || LandPlot;
  const iconColorClass = `text-${typeColors[markerData.type]}`;
  const bgColorClass = typeBg[markerData.type];

  let detailsHtml = "";
  for (const [key, value] of Object.entries(markerData.data)) {
    detailsHtml += `
      <div class="flex justify-between text-sm mb-1.5 border-b border-gray-100 last:border-b-0 pb-1">
        <span class="text-gray-600 capitalize font-light">${key.replace(
          /_/g,
          " "
        )}:</span>
        <span class="font-medium text-gray-900">${value}</span>
      </div>
    `;
  }

  return `
    <div class="p-4 min-w-[240px] max-w-[280px] ${bgColorClass} rounded-2xl shadow-xl border">
      <div class="flex items-center gap-2 mb-3 border-b pb-2 border-gray-200">
        <div class="${iconColorClass}">
          <i data-lucide="${LucideIcon.displayName.toLowerCase()}"></i>
        </div>
        <h3 class="text-base font-bold text-gray-800">${
          markerData.type
        } Asset</h3>
      </div>
      <div class="space-y-1 bg-white p-3 rounded-lg border border-gray-100">
        ${detailsHtml}
      </div>
      ${
        markerData.extraNotes
          ? `<p class="mt-3 text-xs text-gray-700 italic border-t pt-2">${markerData.extraNotes}</p>`
          : ""
      }
      ${
        markerData.type === "Dispute"
          ? `
      <div class="mt-3 flex justify-end">
        <button class="view-full-report text-xs text-blue-600 hover:text-blue-800 font-medium">View Full Report →</button>
      </div>
      `
          : ""
      }
    </div>
  `;
};

// --- Forest Modal Component (ENHANCED UI) ---
// --- Enhanced Forest Modal with Admin & Realistic Data ---
const ForestModal = ({ district, onClose }) => {
  const data = forestAnalysisData[district] || {};
  const healthColor =
    data.healthScore > 80 ? "green" : data.healthScore > 60 ? "yellow" : "red";
  const healthClasses = `text-${healthColor}-800 border-${healthColor}-200 bg-${healthColor}-50`;
  const trendIcon = data.coverageTrend?.includes("+") ? (
    <TreePine className="w-5 h-5 text-green-600" />
  ) : (
    <TreePine className="w-5 h-5 text-red-600" />
  );

  // Dummy Admin Involvement Data
  const adminData = {
    lastInspection: "2025-09-28",
    forestOfficer: "Shri Ramesh Kumar",
    reportStatus: "Approved",
    activePatrols: 12,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-green-600/20 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b bg-green-50 rounded-t-2xl">
          <h2 className="text-xl font-bold text-green-800 flex items-center gap-3">
            <Leaf className="w-6 h-6" /> Comprehensive Forest Analysis -{" "}
            {district}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Top Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div
              className={`p-4 rounded-xl border-2 ${healthClasses} text-center`}
            >
              <p className="text-sm font-medium">Health Score</p>
              <p className="text-3xl font-extrabold mt-1">{data.healthScore}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-200 text-center">
              <p className="text-sm font-medium text-blue-600">Total Species</p>
              <p className="text-3xl font-extrabold text-blue-800 mt-1">
                {data.totalSpecies}
              </p>
            </div>
            <div className="bg-amber-50 p-4 rounded-xl border-2 border-amber-200 text-center">
              <p className="text-sm font-medium text-amber-600">Biodiversity</p>
              <p className="text-xl font-bold text-amber-800 mt-1">
                {data.biodiversityScore.split(" ")[0]}
              </p>
              <p className="text-xs text-amber-700 italic">
                {data.biodiversityScore.split("(")[1]}
              </p>
            </div>
          </div>

          {/* Growth & Species */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-xl space-y-3 border">
              <h3 className="text-base font-bold text-gray-700 flex items-center gap-2 border-b pb-2 mb-2">
                <BarChart3 className="w-4 h-4" /> Growth & Carbon Metrics
              </h3>
              <div className="flex justify-between items-center text-sm">
                <p className="text-gray-600">Coverage Trend:</p>
                <span
                  className={`font-semibold flex items-center gap-1 ${
                    data.coverageTrend?.includes("+")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {trendIcon} {data.coverageTrend}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <p className="text-gray-600">Carbon Sequestered:</p>
                <span className="font-semibold text-gray-800">
                  {data.carbonSequestration_tons?.toLocaleString()} tons
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <p className="text-gray-600">Annual Growth Rate:</p>
                <span className="font-semibold text-gray-800">
                  {data.annualGrowthRate}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <p className="text-gray-600">Canopy Coverage:</p>
                <span className="font-semibold text-gray-800">
                  ~{Math.floor(Math.random() * 40) + 30}%
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <p className="text-gray-600">Forest Density:</p>
                <span className="font-semibold text-gray-800">
                  {Math.floor(Math.random() * 500) + 100} trees/km²
                </span>
              </div>
            </div>

            {/* Dominant Species */}
            <div className="bg-gray-50 p-4 rounded-xl space-y-3 border">
              <h3 className="text-base font-bold text-gray-700 flex items-center gap-2 border-b pb-2 mb-2">
                <FlaskConical className="w-4 h-4" /> Dominant Species
              </h3>
              <ul className="space-y-1">
                {data.dominantSpecies?.map((spec) => (
                  <li
                    key={spec}
                    className="flex items-center gap-2 text-sm text-green-700 bg-green-100/50 p-1.5 rounded"
                  >
                    <BadgeCheck className="w-4 h-4 flex-shrink-0" />
                    <span className="font-medium">{spec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Threats */}
          {data.threats?.length > 0 && (
            <div className="border border-red-300 bg-red-50 p-4 rounded-xl">
              <p className="text-base font-bold text-red-700 flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5" /> Key Threats & Alerts
              </p>
              <div className="flex flex-wrap gap-2">
                {data.threats.map((threat) => (
                  <span
                    key={threat}
                    className="bg-red-200 text-red-900 px-3 py-1 rounded-full text-xs font-medium border border-red-300"
                  >
                    {threat}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Admin Involvement */}
          <div className="border border-green-300 bg-green-50 p-4 rounded-xl">
            <p className="text-base font-bold text-green-700 flex items-center gap-2 mb-2">
              <Briefcase className="w-5 h-5" /> Administration & Field Oversight
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
              <div>
                <p className="font-medium text-gray-800">Forest Officer:</p>
                <p>{adminData.forestOfficer}</p>
              </div>
              <div>
                <p className="font-medium text-gray-800">Last Inspection:</p>
                <p>{adminData.lastInspection}</p>
              </div>
              <div>
                <p className="font-medium text-gray-800">Active Patrols:</p>
                <p>{adminData.activePatrols}</p>
              </div>
              <div>
                <p className="font-medium text-gray-800">Report Status:</p>
                <p>{adminData.reportStatus}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- Dispute Details Modal (Enhanced UI for more authenticity) ---
const DisputeDetailsModal = ({ dispute, onClose }) => {
  const MiniMap = ({ coordinates }) => {
    const mapRef = useRef(null);

    useEffect(() => {
      if (mapRef.current && window.google) {
        const map = new window.google.maps.Map(mapRef.current, {
          center: coordinates,
          zoom: 12,
          disableDefaultUI: true,
          gestureHandling: "none",
        });
        new window.google.maps.Marker({
          position: coordinates,
          map,
        });
      }
    }, [coordinates]);

    return (
      <div
        ref={mapRef}
        className="w-full h-48 rounded-lg border border-gray-300 shadow-sm"
      />
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Enhanced Header with official look */}
        <div className="flex justify-between items-center p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 rounded-t-xl sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Scale className="w-6 h-6 text-indigo-700" />
            <h2 className="text-2xl font-semibold text-gray-900">
              Case File: {dispute.id} - {dispute.type}
            </h2>
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusClasses(
                dispute.status
              )}`}
            >
              {dispute.status}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body with enhanced sections */}
        <div className="p-6 space-y-8 bg-gray-50">
          {/* Case Information */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4 border-b pb-2">
              <Gavel className="w-5 h-5 text-indigo-600" /> Case Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <p className="text-gray-600 font-medium">Parties Involved:</p>
                  <p className="text-gray-900">{dispute.parties}</p>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-gray-500" />
                  <p className="text-gray-600 font-medium">Dispute Type:</p>
                  <p className="text-gray-900">{dispute.type}</p>
                </div>
                <div className="flex items-center gap-2">
                  <LandPlot className="w-4 h-4 text-gray-500" />
                  <p className="text-gray-600 font-medium">Affected Area:</p>
                  <p className="text-gray-900">{dispute.area}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <p className="text-gray-600 font-medium">Duration:</p>
                  <p className="text-gray-900">{dispute.duration}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-gray-500" />
                  <p className="text-gray-600 font-medium">Court:</p>
                  <p className="text-gray-900">{dispute.court}</p>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <p className="text-gray-600 font-medium">Presiding Judge:</p>
                  <p className="text-gray-900">{dispute.judge}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <p className="text-gray-600 font-medium">Filing Date:</p>
                  <p className="text-gray-900">{dispute.filingDate}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <p className="text-gray-600 font-medium">Last Hearing:</p>
                  <p className="text-gray-900">{dispute.lastHearingDate}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <p className="text-gray-600 font-medium">Next Hearing:</p>
                  <p className="text-gray-900">{dispute.nextHearingDate}</p>
                </div>
              </div>
            </div>
            <p className="mt-6 text-gray-700 leading-relaxed border-t pt-4 italic">
              <span className="font-medium text-gray-800">
                Case Description:
              </span>{" "}
              {dispute.description}
            </p>
          </div>

          {/* Timeline with vertical line */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-6 border-b pb-2">
              <Clock className="w-5 h-5 text-indigo-600" /> Case Timeline
            </h3>

            <div className="relative pl-10 before:absolute before:left-5 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-indigo-300 before:to-gray-200">
              {dispute.timeline.map((item, index) => (
                <div
                  key={index}
                  className="relative mb-8 last:mb-0 flex items-start gap-4"
                >
                  {/* Timeline Node */}
                  <div className="absolute left-0 top-1 w-10 flex justify-center">
                    <div className="w-4 h-4 rounded-full bg-indigo-600 shadow-md border-4 border-white"></div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg shadow-sm px-4 py-3 w-full transition hover:shadow-md">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-semibold text-indigo-700">
                        {item.date}
                      </p>
                      <span className="text-[10px] uppercase tracking-wide text-gray-400">
                        Step {index + 1}
                      </span>
                    </div>
                    <p className="text-gray-800 mt-1">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Evidence */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4 border-b pb-2">
              <FlaskConical className="w-5 h-5 text-indigo-600" /> Submitted
              Evidence
            </h3>
            <ul className="space-y-3">
              {dispute.evidence.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-gray-700"
                >
                  <BadgeCheck className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Attachments */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4 border-b pb-2">
              <FileText className="w-5 h-5 text-indigo-600" /> Attached
              Documents
            </h3>
            <ul className="space-y-3">
              {dispute.attachments.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 text-gray-700"
                >
                  <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span className="font-medium">{item}</span>
                  <button className="ml-auto text-xs text-blue-600 hover:underline">
                    Download
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Location */}
          {dispute.coordinates && (
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4 border-b pb-2">
                <Map className="w-5 h-5 text-indigo-600" /> Dispute Location
              </h3>
              <MiniMap coordinates={dispute.coordinates} />
              <p className="mt-2 text-sm text-gray-600 text-center">
                Coordinates: Lat {dispute.coordinates.lat}, Lng{" "}
                {dispute.coordinates.lng}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t text-center text-xs text-gray-500 italic">
          Last Updated: October 14, 2025 | Confidential - For Official Use Only
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- Disputes Modal Component (ENHANCED UI & INTEGRATION) ---
// --- Disputes Modal with Mini Map ---
const DisputesModal = ({ district, onClose, onDisputeSelect }) => {
  const data = disputesData[district] || [];

  // Helper to render mini map
  const MiniMap = ({ coordinates }) => {
    const mapRef = useRef(null);

    useEffect(() => {
      if (mapRef.current && window.google) {
        const map = new window.google.maps.Map(mapRef.current, {
          center: coordinates,
          zoom: 12,
          disableDefaultUI: true,
          gestureHandling: "none",
        });
        new window.google.maps.Marker({
          position: coordinates,
          map,
        });
      }
    }, [coordinates]);

    return <div ref={mapRef} className="w-full h-32 rounded-lg border" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-red-600/20 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold text-red-700 mb-4">
            Disputes in {district}
          </h2>
          {data.length === 0 && (
            <p className="text-gray-500 text-sm">No active disputes found.</p>
          )}
          <div className="space-y-6">
            {data.map((dispute) => (
              <div
                key={dispute.id}
                className="border border-red-200 rounded-xl p-4 bg-red-50 shadow-sm hover:shadow-md transition"
              >
                {/* Header with ID & type */}
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-red-700">
                    {dispute.id}
                  </span>
                  <span className="text-sm text-gray-600 capitalize">
                    {dispute.type}
                  </span>
                </div>
                {/* Parties involved */}
                <p className="text-gray-800 mb-2">
                  <span className="font-medium">Parties:</span>{" "}
                  {dispute.parties}
                </p>
                {/* Status & Legal */}
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusClasses(
                      dispute.status
                    )}`}
                  >
                    {dispute.status}
                  </span>
                  <span className="text-xs text-gray-600 italic">
                    {dispute.legalStatus}
                  </span>
                </div>
                {/* Duration & Area */}
                <div className="flex justify-between text-sm text-gray-700 mb-2">
                  <span>
                    <strong>Duration:</strong> {dispute.duration}
                  </span>
                  <span>
                    <strong>Area:</strong> {dispute.area}
                  </span>
                </div>
                {/* Mini Map */}
                {dispute.coordinates && (
                  <div className="mb-2">
                    <MiniMap coordinates={dispute.coordinates} />
                  </div>
                )}
                {/* Action buttons */}
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => onDisputeSelect(dispute)}
                    className="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700 transition"
                  >
                    View Full Case
                  </button>
                  <button className="px-3 py-1 text-xs font-medium text-red-600 border border-red-600 rounded hover:bg-red-50 transition">
                    Mark Resolved
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- Main Component ---
export default function AssetMap() {
  const mapRef = useRef(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [selectedDistrictInfo, setSelectedDistrictInfo] = useState(null);
  const [currentSelectedDistrict, setCurrentSelectedDistrict] = useState(null);
  const [showForestModal, setShowForestModal] = useState(false);
  const [showDisputesModal, setShowDisputesModal] = useState(false);
  const [showDisputeDetailsModal, setShowDisputeDetailsModal] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const currentMarkers = useRef([]);

  // --- Clear map features ---
  const clearMapFeatures = useCallback(() => {
    currentMarkers.current.forEach((marker) => marker.setMap(null));
    currentMarkers.current = [];
    if (disputePolygon) disputePolygon.setMap(null);
    if (infoWindow) infoWindow.close();
    setSelectedVillage(null);
  }, []);

  // --- Draw Dispute Polygon (A simple circle for now) ---
  const drawDisputePolygon = useCallback((dispute) => {
    if (!mapInstance || !dispute.coordinates) return;

    if (disputePolygon) disputePolygon.setMap(null);

    // Create a simple circular overlay to highlight the dispute location
    disputePolygon = new window.google.maps.Circle({
      strokeColor: "#EF4444",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#EF4444",
      fillOpacity: 0.35,
      map: mapInstance,
      center: dispute.coordinates,
      radius: 1000, // 1 km radius to represent an area
      zIndex: 10,
    });

    mapInstance.panTo(dispute.coordinates);
    mapInstance.setZoom(12);

    if (infoWindow) infoWindow.close();
    infoWindow = new window.google.maps.InfoWindow({
      content: `
            <div class="p-2">
                <h4 class="font-bold text-red-700 mb-1">Dispute: ${dispute.id}</h4>
                <p class="text-xs">Type: ${dispute.type}</p>
                <p class="text-xs">Status: <span class="font-bold">${dispute.status}</span></p>
            </div>
        `,
      pixelOffset: new window.google.maps.Size(0, 0),
    });

    infoWindow.setPosition(dispute.coordinates);
    infoWindow.open(mapInstance);
  }, []);

  // --- Draw colored dots (ENHANCED for infoWindow) ---
  const drawColoredMarkers = useCallback((districtName) => {
    if (!mapInstance) return;
    const markers = districtMarkersData[districtName] || [];

    markers.forEach((markerData) => {
      const marker = new window.google.maps.Marker({
        position: markerData.position,
        map: mapInstance,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: markerData.color,
          fillOpacity: 0.9,
          strokeWeight: 0,
          scale: markerData.type === "Dispute" ? 12 : 10, // Larger dot for disputes
        },
        title: markerData.type,
      });

      marker.addListener("mouseover", () => {
        if (infoWindow) infoWindow.close();
        infoWindow = new window.google.maps.InfoWindow({
          content: createDotInfoWindowContent(markerData),
          pixelOffset: new window.google.maps.Size(0, -10),
        });
        infoWindow.open({
          anchor: marker,
          map: mapInstance,
          shouldFocus: false,
        });
        // Manually trigger lucide icons rendering inside the infowindow
        setTimeout(() => {
          if (window.lucide) {
            window.lucide.createIcons();
          }
        }, 0);

        // Add event listener for the full report button
        infoWindow.addListener("domready", () => {
          const button = document.querySelector(".view-full-report");
          if (button) {
            button.addEventListener("click", (e) => {
              e.preventDefault();
              const caseId = markerData.data.case_id || markerData.data.id;
              if (caseId) {
                const dispute = disputesData[districtName].find(
                  (d) => d.id === caseId
                );
                if (dispute) {
                  setSelectedDispute(dispute);
                  setShowDisputeDetailsModal(true);
                  infoWindow.close();
                }
              }
            });
          }
        });
      });

      marker.addListener("mouseout", () => {
        if (infoWindow) infoWindow.close();
      });

      currentMarkers.current.push(marker);
    });

    // Add dispute markers from disputesData as well, if they are not already in districtMarkersData
    (disputesData[districtName] || []).forEach((dispute) => {
      if (
        markers.some(
          (m) =>
            m.data?.case_id === dispute.id ||
            m.data?.land_id?.includes(dispute.id)
        )
      )
        return; // Updated check to avoid duplicates

      const markerData = {
        type: "Dispute",
        color: "#EF4444",
        position: dispute.coordinates,
        data: {
          id: dispute.id,
          type: dispute.type,
          parties: dispute.parties,
          status: dispute.status,
          area: dispute.area,
        },
        extraNotes: `Legal Status: ${dispute.legalStatus}`,
      };

      const marker = new window.google.maps.Marker({
        position: markerData.position,
        map: mapInstance,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: markerData.color,
          fillOpacity: 0.9,
          strokeWeight: 0,
          scale: 12,
        },
        title: markerData.type,
      });

      marker.addListener("mouseover", () => {
        if (infoWindow) infoWindow.close();
        infoWindow = new window.google.maps.InfoWindow({
          content: createDotInfoWindowContent(markerData),
          pixelOffset: new window.google.maps.Size(0, -10),
        });
        infoWindow.open({
          anchor: marker,
          map: mapInstance,
          shouldFocus: false,
        });
        setTimeout(() => {
          if (window.lucide) {
            window.lucide.createIcons();
          }
        }, 0);

        // Add event listener for the full report button
        infoWindow.addListener("domready", () => {
          const button = document.querySelector(".view-full-report");
          if (button) {
            button.addEventListener("click", (e) => {
              e.preventDefault();
              const caseId = markerData.data.case_id || markerData.data.id;
              if (caseId) {
                const dispute = disputesData[districtName].find(
                  (d) => d.id === caseId
                );
                if (dispute) {
                  setSelectedDispute(dispute);
                  setShowDisputeDetailsModal(true);
                  infoWindow.close();
                }
              }
            });
          }
        });
      });

      marker.addListener("mouseout", () => {
        if (infoWindow) infoWindow.close();
      });

      currentMarkers.current.push(marker);
    });
  }, []);

  // --- Draw State Boundary ---
  const drawStateBoundary = useCallback(async () => {
    if (!mapInstance) return;
    try {
      const response = await fetch("/madhya_pradesh_state.geojson");
      const geojson = await response.json();
      const feature = geojson.features[0];
      let paths = [];
      if (feature.geometry.type === "Polygon")
        paths = feature.geometry.coordinates[0].map(([lng, lat]) => ({
          lat,
          lng,
        }));
      else if (feature.geometry.type === "MultiPolygon")
        paths = feature.geometry.coordinates
          .map((poly) => poly[0].map(([lng, lat]) => ({ lat, lng })))
          .flat();
      if (stateBoundaryPolygon) stateBoundaryPolygon.setMap(null);
      stateBoundaryPolygon = new window.google.maps.Polygon({
        paths,
        strokeColor: "#7F1D1D",
        strokeOpacity: 1,
        strokeWeight: 4,
        fillOpacity: 0,
        zIndex: 2,
        map: mapInstance,
      });
    } catch (err) {
      console.error(err);
    }
  }, []);

  // --- Draw Districts ---
  const drawDistricts = useCallback(async () => {
    if (!mapInstance) return;
    allDistrictPolygons = {};
    selectedDistrictPolygon = null;
    try {
      const response = await fetch("/madhya_pradesh_districts.geojson");
      const geojson = await response.json();
      geojson.features.forEach((feature) => {
        const districtName =
          feature.properties.DISTRICT_N || feature.properties.name || "Unknown";
        let paths = [];
        if (feature.geometry.type === "Polygon")
          paths = feature.geometry.coordinates[0].map(([lng, lat]) => ({
            lat,
            lng,
          }));
        else if (feature.geometry.type === "MultiPolygon")
          paths = feature.geometry.coordinates
            .map((poly) => poly[0].map(([lng, lat]) => ({ lat, lng })))
            .flat();
        const polygon = new window.google.maps.Polygon({
          paths,
          strokeColor: "#7F1D1D",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#FEE2E2",
          fillOpacity: 0.3,
          zIndex: 0,
          map: mapInstance,
        });
        polygon.addListener("click", () => handleSelectDistrict(districtName));
        allDistrictPolygons[districtName] = polygon;
      });
    } catch (err) {
      console.error(err);
    }
  }, []);

  // --- Highlight Selected District ---
  const updateDistrictHighlight = useCallback((districtName) => {
    if (selectedDistrictPolygon)
      selectedDistrictPolygon.setOptions({
        strokeColor: "#7F1D1D",
        strokeWeight: 2,
        fillColor: "#FEE2E2",
        fillOpacity: 0.3,
        zIndex: 0,
      });
    const polygon = allDistrictPolygons[districtName];
    if (polygon) {
      polygon.setOptions({
        strokeColor: "#991B1B",
        strokeWeight: 3,
        fillColor: "#F87171",
        fillOpacity: 0.5,
        zIndex: 1,
      });
      selectedDistrictPolygon = polygon;
    }
    setCurrentSelectedDistrict(districtName);
  }, []);

  // --- Select District ---
  const handleSelectDistrict = useCallback(
    (districtName) => {
      updateDistrictHighlight(districtName);
      clearMapFeatures(); // Clears all markers and dispute polygon
      setSelectedVillage(null);
      setSelectedDistrictInfo({
        name: districtName,
        ...districtInfoData[districtName],
      });
      drawColoredMarkers(districtName);
      if (mapInstance) {
        mapInstance.panTo(getDistrictCenter(districtName));
        mapInstance.setZoom(10); // Slightly increased zoom for better district fit
      }
    },
    [updateDistrictHighlight, clearMapFeatures, drawColoredMarkers]
  );

  // --- Button Handlers ---
  const handleAnalyzeForest = () => {
    if (selectedDistrictInfo) {
      setShowForestModal(true);
    }
  };

  const handleViewDisputes = () => {
    if (selectedDistrictInfo) {
      setShowDisputesModal(true);
    }
  };

  const handleDisputeSelect = (dispute) => {
    // Updated to show details modal instead of just polygon
    setSelectedDispute(dispute);
    setShowDisputeDetailsModal(true);
    setShowDisputesModal(false);
    drawDisputePolygon(dispute);
  };

  // --- Load Google Maps ---
  useEffect(() => {
    if (typeof window.google === "undefined" || !window.google.maps) {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      const script = document.createElement("script");
      // Include the lucide library script for infowindow icons
      const lucideScript = document.createElement("script");
      lucideScript.src = "https://unpkg.com/lucide@latest";
      lucideScript.async = true;

      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry&callback=initMap`;
      script.async = true;
      document.head.appendChild(script);
      document.head.appendChild(lucideScript);

      window.initMap = () => setIsMapLoaded(true);
      return () => {
        delete window.initMap;
        document.head.removeChild(lucideScript);
      };
    } else setIsMapLoaded(true);
  }, []);

  useEffect(() => {
    if (!isMapLoaded || !mapRef.current) return;
    mapInstance = new window.google.maps.Map(mapRef.current, {
      center: { lat: 23.5, lng: 78.5 },
      zoom: 6,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });
    drawDistricts();
    drawStateBoundary();

    // Initialize lucide icons for the District Info Card and Modals
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [isMapLoaded, drawDistricts, drawStateBoundary]);

  // --- Toggle Layers (Placeholder) ---
  const handleToggleLayer = useCallback(
    (layerName, isVisible) => {
      console.log(`${layerName} is now ${isVisible ? "ON" : "OFF"}`);
      // Future: Implement logic to show/hide the markers based on type
      clearMapFeatures();
      if (selectedDistrictInfo && isVisible) {
        drawColoredMarkers(selectedDistrictInfo.name);
      }
    },
    [clearMapFeatures, drawColoredMarkers, selectedDistrictInfo]
  );

  // --- Render ---
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <div ref={mapRef} className="w-full h-full" />
      <MapSidebar
        onSelectDistrict={handleSelectDistrict}
        onToggleLayer={handleToggleLayer}
        currentSelectedDistrict={currentSelectedDistrict}
      />

      {/* Updated District Info Card */}
      <AnimatePresence>
        {selectedDistrictInfo && (
          <motion.div
            key="district-info-card"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-6 right-6 z-40 bg-white shadow-2xl rounded-2xl border border-gray-200 p-6 w-96 overflow-hidden"
            style={{
              background: "linear-gradient(to bottom right, #ffffff, #f9fafb)",
            }}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
                <Target className="w-6 h-6 text-indigo-600" />
                {selectedDistrictInfo.name} District
              </h2>
              <button
                onClick={() => {
                  setSelectedDistrictInfo(null);
                  clearMapFeatures();
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex flex-col justify-center">
                <p className="text-xs text-blue-600 font-medium">State</p>
                <p className="text-sm font-bold text-blue-900">
                  {selectedDistrictInfo.state}
                </p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-100 flex flex-col justify-center">
                <p className="text-xs text-purple-600 font-medium">
                  Water Bodies
                </p>
                <p className="text-sm font-bold text-purple-900">
                  {selectedDistrictInfo.water_bodies || "N/A"}
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-5 bg-gray-50 p-4 rounded-lg border">
              <h3 className="text-sm font-semibold text-gray-700 mb-2 border-b pb-1">
                Geospatial Metrics
              </h3>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Boundary Length:
                </span>
                <span className="font-medium text-gray-900">
                  {parseFloat(selectedDistrictInfo.shape_len).toLocaleString()}{" "}
                  m
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 flex items-center gap-1">
                  <LandPlot className="w-3 h-3" /> Total Area:
                </span>
                <span className="font-medium text-gray-900">
                  {(
                    parseFloat(selectedDistrictInfo.shape_area) / 1000000
                  ).toFixed(2)}{" "}
                  km²
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 bg-green-50 p-4 rounded-xl border border-green-200">
                <div className="p-2 bg-green-100 rounded-full">
                  <TreePine className="w-6 h-6 text-green-700" />
                </div>
                <div>
                  <p className="text-xs text-green-600 font-medium">
                    Forest Cover
                  </p>
                  <p className="text-lg font-bold text-green-800">
                    {selectedDistrictInfo.forest_area_km} km²
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-red-50 p-4 rounded-xl border border-red-200">
                <div className="p-2 bg-red-100 rounded-full">
                  <Zap className="w-6 h-6 text-red-700" />
                </div>
                <div>
                  <p className="text-xs text-red-600 font-medium">
                    Active Disputes
                  </p>
                  <p className="text-lg font-bold text-red-800">
                    {selectedDistrictInfo.disputes_count}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAnalyzeForest}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-2.5 rounded-lg text-sm transition-all shadow-md active:scale-[0.98] disabled:opacity-50"
                disabled={!forestAnalysisData[selectedDistrictInfo.name]}
              >
                Analyze Forest Data
              </button>
              <button
                onClick={handleViewDisputes}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-2.5 rounded-lg text-sm transition-all shadow-md active:scale-[0.98]"
              >
                View Disputes
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {showForestModal && selectedDistrictInfo && (
          <ForestModal
            district={selectedDistrictInfo.name}
            onClose={() => setShowForestModal(false)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showDisputesModal && selectedDistrictInfo && (
          <DisputesModal
            district={selectedDistrictInfo.name}
            onClose={() => setShowDisputesModal(false)}
            onDisputeSelect={handleDisputeSelect} // Updated handler
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showDisputeDetailsModal && selectedDispute && (
          <DisputeDetailsModal
            dispute={selectedDispute}
            onClose={() => setShowDisputeDetailsModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

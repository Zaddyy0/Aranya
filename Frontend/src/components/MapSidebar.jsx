import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMapMarkedAlt,
  FaUsers,
  FaLayerGroup,
  FaFilter,
  FaShieldAlt,
  FaLeaf,
  FaChevronDown,
  FaMapPin,
  FaChartBar,
  FaSearch,
  FaMap,
  FaMinus,
} from "react-icons/fa";

// --- MOCK DATA ---
const STATES = [
  "Madhya Pradesh",
  "Telangana",
  "Maharashtra",
  "Karnataka",
  "Rajasthan",
  "Uttar Pradesh",
];

const DISTRICTS_DATA = {
  "Madhya Pradesh": [
    "Bhopal",
    "Indore",
    "Jabalpur",
    "Gwalior",
    "Ujjain",
    "Sagar",
    "Rewa",
    "Satna",
    "Chhindwara",
    "Betul",
  ],
  Telangana: [
    "Hyderabad",
    "Rangareddy",
    "Medchal-Malkajgiri",
    "Karimnagar",
    "Warangal",
  ],
  default: ["Select District"],
};

const MOCK_STATS = {
  allDistricts: 55,
  mandals: 300,
  surveys: 900,
  fraClaims: 7700,
  forestChange: 0,
};

const CLAIM_STATUSES = [
  "All Claims (7700)",
  "Approved (2500)",
  "Pending (4500)",
  "Rejected (700)",
];

// --- Utility: Enhanced Animated Stat Card ---
const StatCard = ({ label, value, icon: Icon, colorClass, unit = "" }) => (
  <motion.div
    className="relative flex flex-col justify-between p-5 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-md border border-gray-100 cursor-default group transition-all duration-300"
    whileHover={{ y: -3, scale: 1.03 }}
    transition={{ type: "spring", stiffness: 300, damping: 25 }}
  >
    {/* Accent strip */}
    <div
      className={`absolute top-0 left-0 w-full h-full ${colorClass.replace(
        "text-",
        "bg-"
      )}-500 rounded-l-xl opacity-40`}
    />

    {/* Top section */}
    <div className="flex items-center justify-between mb-2">
      <div className={`p-1 rounded-xl bg-${colorClass.replace("text-", "")}-50`}>
        <Icon className={`w-4 h-4 ${colorClass}`} />
      </div>
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
        {label}
      </span>
    </div>

    {/* Value */}
    <div className="flex items-end justify-between">
      <span className={`text-2xl font-bold ${colorClass} leading-none`}>
        {value}
        {unit && (
          <span className="text-sm font-normal text-gray-400 ml-1">{unit}</span>
        )}
      </span>
    </div>

    {/* Progress bar */}
    <div className="mt-3 w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
      <motion.div
        className={`${colorClass.replace("text-", "bg-")}-500 h-full rounded-full`}
        initial={{ width: 0 }}
        animate={{ width: "75%" }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </div>
  </motion.div>
);

// --- Utility: Enhanced Layer Toggle ---
const LayerToggle = ({ label, isChecked, onToggle, icon: Icon, description }) => (
  <motion.div
    layout
    className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-200 border border-transparent hover:border-gray-200 ${
      isChecked
        ? "bg-gradient-to-r from-emerald-50 to-emerald-100 shadow-sm"
        : "bg-white hover:bg-gray-50"
    }`}
    onClick={onToggle}
    whileHover={{ x: 4 }}
    whileTap={{ scale: 0.98 }}
  >
    <div
      className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
        isChecked ? "bg-emerald-100 text-emerald-600" : "bg-gray-100 text-gray-500"
      } transition-colors`}
    >
      {Icon ? <Icon className="w-5 h-5" /> : <FaMap className="w-4 h-4" />}
    </div>
    <div className="flex-1 min-w-0">
      <span
        className={`block text-sm font-semibold truncate ${
          isChecked ? "text-gray-900" : "text-gray-600"
        }`}
      >
        {label}
      </span>
      {description && (
        <span className="block text-xs text-gray-400 mt-0.5">{description}</span>
      )}
    </div>
    <div
      className={`relative w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
        isChecked ? "bg-emerald-500" : "bg-gray-300"
      }`}
    >
      <motion.div
        layout
        className="w-4 h-4 bg-white rounded-full shadow-sm"
        animate={{ x: isChecked ? 25 : 0 }}
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
      />
    </div>
  </motion.div>
);

// --- Main Sidebar Component ---
export default function MapSidebar({
  onSelectState,
  onSelectDistrict,
  onToggleLayer,
}) {
  const [selectedState, setSelectedState] = useState(STATES[0]);
  const [selectedDistrict, setSelectedDistrict] = useState(
    DISTRICTS_DATA[STATES[0]][0]
  );
  const [claimStatus, setClaimStatus] = useState(CLAIM_STATUSES[0]);
  const [isLayersOpen, setIsLayersOpen] = useState(true);
  const [searchState, setSearchState] = useState("");

  const availableDistricts = useMemo(
    () => DISTRICTS_DATA[selectedState] || DISTRICTS_DATA.default,
    [selectedState]
  );

  const [layerControls, setLayerControls] = useState({
    stateBoundary: true,
    districtBoundary: true,
    mandalBoundary: false,
    villageBoundary: true,
    fraClaims: true,
    forestChange: false,
  });

  const filteredStates = useMemo(
    () =>
      STATES.filter((state) =>
        state.toLowerCase().includes(searchState.toLowerCase())
      ),
    [searchState]
  );

  const handleLayerToggle = (layerName) => {
    setLayerControls((prev) => {
      const newState = { ...prev, [layerName]: !prev[layerName] };
      onToggleLayer(layerName, newState[layerName]);
      return newState;
    });
  };

  const handleStateChange = (e) => {
    const newState = e.target.value;
    setSelectedState(newState);
    const districts = DISTRICTS_DATA[newState] || DISTRICTS_DATA.default;
    const newDistrict = districts[0];
    setSelectedDistrict(newDistrict);
    onSelectState(newState);
    onSelectDistrict(newDistrict);
  };

  const handleDistrictChange = (e) => {
    const district = e.target.value;
    setSelectedDistrict(district);
    onSelectDistrict(district);
  };

  const layerConfig = {
    stateBoundary: { icon: FaMap, description: "State outlines" },
    districtBoundary: { icon: FaMap, description: "District boundaries" },
    mandalBoundary: { icon: FaMap, description: "Mandal/Block lines" },
    villageBoundary: { icon: FaMapPin, description: "Village perimeters" },
    fraClaims: { icon: FaShieldAlt, description: "FRA claim markers" },
    forestChange: { icon: FaLeaf, description: "Forest cover changes" },
  };

  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className="absolute top-0 left-0 h-full w-80 z-30 bg-white/98 backdrop-blur-xl border-r border-gray-200 shadow-2xl overflow-y-auto"
    >
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-b from-emerald-50 to-white p-6 border-b border-gray-100 z-10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-black text-gray-900 flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-600 text-white">
              <FaMapMarkedAlt className="w-5 h-5" />
            </div>
            <span>National Land Dashboard</span>
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <FaMinus className="w-4 h-4" />
          </motion.button>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          Comprehensive state-level insights into land assets and FRA claims.
        </p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Geographic Filters */}
        <motion.div
          className="bg-white/80 p-5 rounded-2xl shadow-lg backdrop-blur-sm space-y-4 border border-gray-100"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
            <FaFilter className="w-5 h-5 text-blue-500" />
            <span>Geographic Filters</span>
          </h2>

          {/* State Search */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
              <FaMapPin className="w-4 h-4 text-red-500" />
              <span>Select State</span>
            </label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search states..."
                value={searchState}
                onChange={(e) => setSearchState(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
              />
            </div>
            <select
              value={selectedState}
              onChange={handleStateChange}
              className="w-full p-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 text-sm font-medium transition-all hover:shadow-md"
            >
              {filteredStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          {/* District */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
              <FaUsers className="w-4 h-4 text-emerald-500" />
              <span>Select District</span>
            </label>
            <select
              value={selectedDistrict}
              onChange={handleDistrictChange}
              className="w-full p-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800 text-sm font-medium transition-all hover:shadow-md disabled:opacity-50"
              disabled={!selectedState}
            >
              {availableDistricts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>

          {/* Claim Status */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Filter by Claim Status
            </label>
            <select
              value={claimStatus}
              onChange={(e) => setClaimStatus(e.target.value)}
              className="w-full p-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 text-sm font-medium transition-all hover:shadow-md"
            >
              {CLAIM_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center space-x-2">
            <FaChartBar className="w-5 h-5 text-purple-500" />
            <span>Key Metrics ({selectedState})</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <StatCard
              label="Districts"
              value={MOCK_STATS.allDistricts}
              icon={FaUsers}
              colorClass="text-indigo-400"
            />
            <StatCard
              label="FRA Claims"
              value={MOCK_STATS.fraClaims}
              icon={FaShieldAlt}
              colorClass="text-emerald-400"
            />
            <StatCard
              label="Mandals"
              value={MOCK_STATS.mandals}
              icon={FaUsers}
              colorClass="text-blue-400"
              unit="units"
            />
            <StatCard
              label="Surveys"
              value={MOCK_STATS.surveys}
              icon={FaLeaf}
              colorClass="text-orange-400"
              unit="bcm"
            />
          </div>
        </motion.section>

        {/* Map Layers */}
        <motion.div
          className="bg-white/80 p-5 rounded-2xl shadow-lg backdrop-blur-sm border border-gray-100"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div
            className="flex justify-between items-center cursor-pointer mb-4 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={() => setIsLayersOpen(!isLayersOpen)}
          >
            <h3 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
              <FaLayerGroup className="w-5 h-5 text-red-500" />
              <span>Map Layers</span>
            </h3>
            <motion.div
              animate={{ rotate: isLayersOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <FaChevronDown className="w-5 h-5 text-gray-500" />
            </motion.div>
          </div>

          <AnimatePresence>
            {isLayersOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="overflow-hidden space-y-3"
              >
                {Object.entries(layerControls).map(([layer, value]) => {
                  const config = layerConfig[layer];
                  return (
                    <LayerToggle
                      key={layer}
                      label={layer
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())
                        .trim()}
                      isChecked={value}
                      onToggle={() => handleLayerToggle(layer)}
                      icon={config?.icon}
                      description={config?.description}
                    />
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Brain,
  Globe,
  Upload,
  AlertCircle,
  Mail,
  Phone,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  ChartArea,
  File,
  Building,
} from "lucide-react";

// --- Framer Motion Variants ---

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  hover: {
    scale: 1.01,
    y: -3,
    // Enhanced box-shadow for a modern lift/glow
    boxShadow:
      "0 10px 20px rgba(0,0,0,0.05), 0 0 0 3px rgba(16, 185, 129, 0.1)",
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const iconVariants = {
  hover: {
    scale: 1.3,
    rotate: 5,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const buttonVariants = {
  hover: {
    scale: 1.05,
    boxShadow: "0 4px 10px rgba(16, 185, 129, 0.5)", // Shadow for lift
    transition: { duration: 0.2, yoyo: Infinity, repeat: 1 },
  },
  tap: { scale: 0.98 },
};

// --- Main Component ---

export default function SplashPage() {
  const [activeSection, setActiveSection] = useState(0); // Kept for future use if sections are navigated
  const navigate = useNavigate();

  // Function to smoothly scroll to the footer section
  const scrollToFooter = () => {
    const footer = document.getElementById("contact-footer");
    if (footer) {
      // Scroll smoothly, aligning the top of the element to the viewport top
      footer.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const sections = [
    {
      id: 0,
      title: "Revolutionize Your Records: \nDigitize Forest Lands in Seconds!",
      subtitle:
        "Effortlessly convert handwritten records to secure, searchable digital formats for faster FRA claims and better land governance.",
      image:
        "https://images.unsplash.com/photo-1542577268-f027c64c871b?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cGluZSUyMGZvcmVzdHxlbnwwfHwwfHx8MA%3D%3D",
      cta: "Start Digitizing Now",
      path: "/dataupload",
    },
    {
      id: 1,
      title: "Asset Mapping – Know Your Land Like Never Before",
      subtitle:
        "Discover how our system detects forest cover, integrates layers, and provides AI-driven insights for smarter land management.",
      features: [
        {
          icon: <MapPin size={24} className="text-green-600" />, // Changed to 600
          text: "Detect forest cover, farms, water sources, and homesteads",
        },
        {
          icon: <Globe size={24} className="text-blue-600" />, // Changed to 600
          text: "Integrate multiple layers: roads, groundwater",
        },
        {
          icon: <Brain size={24} className="text-purple-600" />, // Changed to 600
          text: "AI-assisted resource insights for smarter planning",
        },
      ],
      image:
        "https://thumbs.dreamstime.com/z/india-map-magnifying-glass-world-106515138.jpg",
      stat: "1200+ assets mapped across 60 villages",
      cta: "Explore Asset Mapping",
      path: "/assetmap",
    },
    {
      id: 2,
      title: "WebGIS Integretion",
      subtitle: "Transforming forest rights into a digital future",
      features: [
        {
          icon: <ChartArea size={32} className="text-green-600" />, // Changed to 600
          title: "Visualize through WebGIS Mapping",
        },
        {
          icon: <Brain size={32} className="text-blue-600" />, // Changed to 600
          title: "AI Insights",
        },
        {
          icon: <File size={32} className="text-blue-600" />, // Changed to 600
          title: "FRA Progress Tracking",
        },
        {
          icon: <Building size={32} className="text-blue-600" />, // Changed to 600
          title: "AI-enhanced DSS engine",
        },
      ],
      image:
        "https://s3.youthkiawaaz.com/wp-content/uploads/2016/05/06041202/Young_Baiga_women_India.jpg",
      stat: "15,000+ Records Digitized and counting",
      cta: "Track Progress",
      path: "assetmap",
    },
    {
      id: 3,
      title: "Unlock Hidden Opportunities: AI-Powered Govt Schemes Recommender",
      subtitle: "Supercharge Your Success with Tailored Government Schemes",
      image:
        "https://harisharandevgan.com/wp-content/uploads/2024/01/Important-Government-Schemes-jpg.webp",
      cta: "Discover Your Schemes",
      path: "/schemes",
    },
    {
      id: 4,
      title: "FRA WebGIS Portal",
      subtitle:
        "Advanced geospatial intelligence platform providing comprehensive infrastructure, asset mapping, and strategic planning solutions with real-time analytics capabilities.",
      image:
        "https://www.genesisray.com/wp-content/uploads/2022/01/DALL%C2%B7E-2024-04-10-00.42.31-Create-an-image-illustrating-a-Geographic-Information-System-GIS-interface-focused-on-land-records-and-ownership.-The-screen-displays-a-detailed-map.webp",
      cta: "Get Started",
      path: "/login",
    },
  ];

  const handleSectionClick = (path) => {
    if (path) navigate(path);
  };

  const handleNavClick = (path) => {
    if (path) navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 relative">
      {/* Navigation - Fixed at the top, z-50 */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white shadow-md px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between fixed w-full top-0 z-50"
      >
        <motion.div
          className="flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
        >
          <Globe size={24} className="text-green-600" />
          <span className="text-xl font-bold text-gray-900">ARANYA</span>
        </motion.div>
        <motion.div
          className="hidden md:flex items-center space-x-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.button
            onClick={() => handleNavClick("/dashboard")}
            className="text-gray-600 hover:text-gray-900 transition"
            whileHover={{ x: 5 }}
          >
            Dashboard
          </motion.button>
          <motion.button
            onClick={scrollToFooter}
            className="text-gray-600 hover:text-gray-900 transition"
            whileHover={{ x: 5 }}
          >
            Contact
          </motion.button>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link
              to="/login"
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition"
            >
              Get Started
            </Link>
          </motion.div>
        </motion.div>
      </motion.nav>

      {/* Hero Section: Full-Screen Background UI (Section 0) */}
      <section className="relative w-full min-h-screen flex items-center justify-center text-white z-10 px-4 pt-16 md:pt-20">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed z-0"
          style={{
            backgroundImage: `url('${sections[0].image}')`,
          }}
        />
        {/* Dark Overlay for Readability */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] z-0" />

        {/* Content */}
        <div className="max-w-4xl text-center z-10 py-10">
          <motion.h1
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            // Applied Gradient and increased line height for impact
            className="text-5xl sm:text-6xl font-extrabold mb-4 drop-shadow-lg leading-snug whitespace-pre-line bg-clip-text text-transparent bg-gradient-to-r from-white to-green-300"
          >
            {sections[0].title}
          </motion.h1>
          <motion.p
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="text-gray-200 text-xl sm:text-2xl mb-10 max-w-2xl mx-auto drop-shadow-md"
          >
            {sections[0].subtitle}
          </motion.p>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => handleSectionClick(sections[0].path)}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-full font-bold text-xl shadow-lg transition duration-300"
          >
            {sections[0].cta}
          </motion.button>
        </div>
      </section>

      {/* Main Content Sections - Start AFTER the hero section */}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        // -mt-20 pulls it up over the hero slightly for visual break
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-20 relative z-20"
      >
        {/* Section 1: FRA WebGIS Portal Overview (Original Index 4) - White Card */}
        <motion.section
          variants={cardVariants}
          whileHover="hover"
          className="mb-12 bg-white rounded-xl p-8 shadow-2xl text-center mt-20"
        >
          <motion.h2
            variants={itemVariants}
            className="text-2xl sm:text-3xl font-bold mb-4"
          >
            {sections[4].title}
          </motion.h2>
          <motion.p variants={itemVariants} className="text-gray-600 mb-8">
            {sections[4].subtitle}
          </motion.p>
          <motion.img
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            src={sections[4].image}
            alt="Geospatial platform"
            className="w-full h-80 object-cover rounded-lg mx-auto mb-6 shadow-md"
            whileHover={{ y: -5 }}
          />
          <motion.div
            variants={containerVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => handleSectionClick(sections[4].path)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              {sections[4].cta}
            </motion.button>
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              // Standardized Secondary CTA
              className="border-2 border-gray-300 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Learn More
            </motion.button>
          </motion.div>
        </motion.section>

        {/* Section 2: Asset Mapping (Original Index 1) - Segmented Background */}
        <motion.section
          variants={cardVariants}
          whileHover="hover"
          className="mb-12 bg-gray-100 rounded-xl p-8 shadow-xl"
        >
          <motion.h2
            variants={itemVariants}
            className="text-2xl sm:text-3xl font-bold mb-4"
          >
            {sections[1].title}
          </motion.h2>
          <motion.p variants={itemVariants} className="text-gray-600 mb-6">
            {sections[1].subtitle}
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="grid md:grid-cols-2 gap-8 items-center"
          >
            <motion.div className="space-y-4">
              <AnimatePresence>
                {sections[1].features.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start space-x-3 p-2 bg-white rounded-lg shadow-sm" // Feature boxes slight lift
                  >
                    <div className="flex-shrink-0 mt-1">{feature.icon}</div>
                    <p className="text-gray-700">{feature.text}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm text-gray-500 italic pt-4"
              >
                {sections[1].stat}
              </motion.p>
            </motion.div>
            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              src={sections[1].image}
              alt="Asset mapping"
              className="w-full h-64 object-cover rounded-lg shadow-md"
              whileHover={{ rotate: 1, scale: 1.02 }}
            />
          </motion.div>
          <motion.div variants={itemVariants} className="text-center mt-6">
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => handleSectionClick(sections[1].path)}
              // CTA Style Standardized
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              {sections[1].cta}
            </motion.button>
          </motion.div>
        </motion.section>

        {/* Section 3: WebGIS Integration (Original Index 2) - Segmented Background */}
        {/* <motion.section
          variants={cardVariants}
          whileHover="hover"
          className="mb-12 bg-white rounded-xl p-8 shadow-xl"
        >
          <motion.div variants={itemVariants} className="text-center mb-8">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl sm:text-3xl font-bold mb-4"
            >
              {sections[2].title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-600"
            >
              {sections[2].subtitle}
            </motion.p>
          </motion.div>
          <motion.div
            variants={containerVariants}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8" // Added 4 column layout for features
          >
            {sections[2].features.map((feature, idx) => (
              <motion.div
                key={idx}
                variants={cardVariants}
                whileHover="hover"
                // Change card color on hover for visual feedback
                className="text-center p-6 rounded-lg bg-gray-50 hover:bg-white transition duration-300 overflow-hidden cursor-pointer group shadow-sm"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: idx * 0.2 }}
                  className="mx-auto mb-4 relative w-fit"
                  whileHover="hover"
                  variants={iconVariants}
                >
                  <motion.div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10">{feature.icon}</div>
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5, color: "#3b82f6" }}
                  className="font-semibold mb-2 text-lg transition-colors duration-300"
                >
                  {feature.title}
                </motion.h3>
              </motion.div>
            ))}
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="grid md:grid-cols-2 gap-8 items-center pt-4"
          >
            <motion.img
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              src={sections[2].image}
              alt="Why choose"
              className="w-full h-80 object-cover rounded-lg mx-auto mb-6 shadow-md"
              whileHover={{ x: 10 }}
            />
            <motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-sm text-gray-500 italic mb-4 text-center md:text-left"
              >
                {sections[2].stat}
              </motion.p>
              <motion.div
                variants={containerVariants}
                className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
              >
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => handleSectionClick(sections[2].path)}
                  // CTA Style Standardized
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  {sections[2].cta}
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.section> */}

        {/* Section 4: AI Recommender (Original Index 3) - Thematic Background */}
        <motion.section
          variants={cardVariants}
          whileHover="hover"
          // Unique background for AI/Recommender system
          className="mb-12 bg-blue-50 rounded-xl p-8 shadow-xl text-center"
        >
          <motion.h2
            variants={itemVariants}
            className="text-2xl sm:text-3xl font-bold mb-4"
          >
            {sections[3].title}
          </motion.h2>
          <motion.p variants={itemVariants} className="text-gray-600 mb-6">
            {sections[3].subtitle}
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="grid md:grid-cols-2 gap-8 items-center"
          >
            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              src={sections[3].image}
              alt="Govt Schemes"
              className="w-full h-50 object-cover rounded-lg shadow-md"
              whileHover={{ scale: 1.02, rotate: -1 }}
            />
            <motion.div>
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={() => handleSectionClick(sections[3].path)}
                // CTA Style Standardized
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition w-70 items-center"
              >
                {sections[3].cta}
              </motion.button>
              {/* Added bullet points for the AI section for more detail */}
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ delay: 0.5 }}
                className="mt-6 text-left inline-block"
              >
                <ul className="text-gray-700 space-y-2">
                  <li className="flex items-center space-x-2">
                    <AlertCircle
                      size={16}
                      className="text-green-600 flex-shrink-0"
                    />
                    <span>
                      Filter schemes by land size, demographics, and needs.
                    </span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <AlertCircle
                      size={16}
                      className="text-green-600 flex-shrink-0"
                    />
                    <span>Receive proactive alerts for new opportunities.</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <AlertCircle
                      size={16}
                      className="text-green-600 flex-shrink-0"
                    />
                    <span>
                      Increase claim success rate with relevant recommendations.
                    </span>
                  </li>
                </ul>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.section>
      </motion.main>

      {/* Footer (Detailed Version) */}
      <motion.footer
        id="contact-footer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="bg-gray-800 text-gray-400"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <motion.div variants={itemVariants} className="space-y-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center space-x-2"
              >
                <Globe size={24} className="text-green-400" />
                <span className="text-xl font-bold text-white">FRA WebGIS</span>
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-sm"
              >
                Advanced geospatial intelligence platform providing
                comprehensive infrastructure, asset mapping, and strategic
                planning solutions with real-time analytics capabilities.
              </motion.p>
              <motion.div
                variants={containerVariants}
                className="flex space-x-4"
              >
                <motion.a
                  href="https://twitter.com"
                  whileHover={{ scale: 1.1, color: "#1da1f2" }}
                  className="text-gray-400 hover:text-blue-400 transition"
                >
                  <Twitter size={20} />
                </motion.a>
                <motion.a
                  href="https://facebook.com"
                  whileHover={{ scale: 1.1, color: "#3b5998" }}
                  className="text-gray-400 hover:text-blue-600 transition"
                >
                  <Facebook size={20} />
                </motion.a>
                <motion.a
                  href="https://instagram.com"
                  whileHover={{ scale: 1.1, color: "#e1306c" }}
                  className="text-gray-400 hover:text-pink-500 transition"
                >
                  <Instagram size={20} />
                </motion.a>
                <motion.a
                  href="https://linkedin.com"
                  whileHover={{ scale: 1.1, color: "#0077b5" }}
                  className="text-gray-400 hover:text-blue-700 transition"
                >
                  <Linkedin size={20} />
                </motion.a>
              </motion.div>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={itemVariants} className="space-y-4">
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-white font-semibold text-sm"
              >
                Quick Links
              </motion.h3>
              <motion.ul
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="space-y-2 text-sm"
              >
                <motion.li variants={itemVariants}>
                  <Link to="/dashboard" className="hover:text-white transition">
                    Dashboard
                  </Link>
                </motion.li>
                <motion.li variants={itemVariants}>
                  <Link to="/assetmap" className="hover:text-white transition">
                    Asset Mapping
                  </Link>
                </motion.li>
                <motion.li variants={itemVariants}>
                  <Link to="/assetmap" className="hover:text-white transition">
                    FRA Map
                  </Link>
                </motion.li>
                <motion.li variants={itemVariants}>
                  <Link
                    to="/govt-schemes"
                    className="hover:text-white transition"
                  >
                    Govt Schemes
                  </Link>
                </motion.li>
              </motion.ul>
            </motion.div>

            {/* Solutions */}
            <motion.div variants={itemVariants} className="space-y-4">
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-white font-semibold text-sm"
              >
                Solutions
              </motion.h3>
              <motion.ul
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="space-y-2 text-sm"
              >
                <motion.li variants={itemVariants}>
                  <Link
                    to="/asset-management"
                    className="hover:text-white transition"
                  >
                    Asset Management
                  </Link>
                </motion.li>
                <motion.li variants={itemVariants}>
                  <Link
                    to="/risk-assessment"
                    className="hover:text-white transition"
                  >
                    Risk Assessment
                  </Link>
                </motion.li>
                <motion.li variants={itemVariants}>
                  <Link
                    to="/compliance"
                    className="hover:text-white transition"
                  >
                    Compliance Monitoring
                  </Link>
                </motion.li>
                <motion.li variants={itemVariants}>
                  <Link
                    to="/dataupload"
                    className="hover:text-white transition"
                  >
                    Digitize Records
                  </Link>
                </motion.li>
              </motion.ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div variants={itemVariants} className="space-y-4">
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-white font-semibold text-sm"
              >
                Contact Us
              </motion.h3>
              <motion.div
                variants={containerVariants}
                className="space-y-2 text-sm"
              >
                <motion.div
                  variants={itemVariants}
                  className="flex items-center space-x-2"
                >
                  <Mail size={16} className="text-green-400" />
                  <span>contact@frawebgis.com</span>
                </motion.div>
                <motion.div
                  variants={itemVariants}
                  className="flex items-center space-x-2"
                >
                  <Phone size={16} className="text-green-400" />
                  <span>+1 (565) 234-567</span>
                </motion.div>
                <motion.div
                  variants={itemVariants}
                  className="flex items-center space-x-2"
                >
                  <MapPin size={16} className="text-green-400" />
                  <span>123 Geospatial Ave, Forest City, FC 12345</span>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="border-t border-gray-700 mt-8 pt-6"
          >
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <motion.p variants={itemVariants} className="text-sm">
                © 2025 FRA WebGIS. All rights reserved.
              </motion.p>
              <motion.div
                variants={containerVariants}
                className="flex space-x-6"
              >
                <motion.div whileHover={{ scale: 1.1, color: "#ffffff" }}>
                  <Link to="/privacy" className="hover:text-white transition">
                    Privacy Policy
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1, color: "#ffffff" }}>
                  <Link to="/terms" className="hover:text-white transition">
                    Terms of Service
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1, color: "#ffffff" }}>
                  <Link to="/cookies" className="hover:text-white transition">
                    Cookie Policy
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1, color: "#ffffff" }}>
                  <Link to="/security" className="hover:text-white transition">
                    Security
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
}

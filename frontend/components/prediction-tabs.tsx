"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Heart, Brain, Droplet, Stethoscope, ArrowRight } from "lucide-react"
import Link from "next/link"

const tabs = [
  {
    id: "heart",
    label: "Heart Disease",
    icon: Heart,
    color: "from-red-500 to-pink-500",
    glowColor: "shadow-red-500/25",
    description: "Comprehensive cardiovascular risk assessment using clinical parameters and lifestyle factors",
    features: ["ECG Analysis", "Blood Pressure", "Cholesterol Levels"],
    accuracy: "96%",
    href: "/predict/heart",
  },
  {
    id: "parkinsons",
    label: "Parkinson's Disease",
    icon: Brain,
    color: "from-purple-500 to-indigo-500",
    glowColor: "shadow-purple-500/25",
    description: "Early neurological pattern detection through vocal biomarker analysis and motor assessments",
    features: ["Vocal Analysis", "Motor Symptoms", "Tremor Detection"],
    accuracy: "94%",
    href: "/predict/parkinsons",
  },
  {
    id: "diabetes",
    label: "Diabetes",
    icon: Droplet,
    color: "from-blue-500 to-cyan-500",
    glowColor: "shadow-blue-500/25",
    description: "Blood glucose prediction and metabolic risk evaluation with comprehensive health metrics",
    features: ["Glucose Levels", "BMI Analysis", "Family History"],
    accuracy: "92%",
    href: "/predict/diabetes",
  },
  {
    id: "common",
    label: "Common Diseases",
    icon: Stethoscope,
    color: "from-emerald-500 to-teal-500",
    glowColor: "shadow-emerald-500/25",
    description: "Multi-condition screening system for early detection of prevalent health conditions",
    features: ["40+ Symptoms", "Multi-Disease", "Risk Profiling"],
    accuracy: "90%",
    href: "/predict/common-diseases",
  },
]

export function PredictionTabs() {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null)

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-20"
      >
        <div className="inline-flex items-center justify-center mb-6">
          <div className="flex items-center space-x-3 bg-gradient-to-r from-blue-500/10 to-violet-500/10 border border-blue-500/20 rounded-full px-6 py-3 backdrop-blur-sm">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-blue-300">AI-Powered Medical Insights</span>
          </div>
        </div>
        
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent mb-6 text-balance">
          Choose Your Health Assessment
        </h2>
        
        <p className="text-lg text-slate-300 max-w-3xl mx-auto text-pretty leading-relaxed mb-8">
          Select from our specialized AI models designed for different health conditions. Each model uses cutting-edge machine learning algorithms trained on extensive medical datasets.
        </p>

        <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Clinically Validated</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
            </svg>
            <span>Patient & Professional Modes</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span>Instant Results</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10"
      >
        {tabs.map((tab, index) => (
          <motion.div
            key={tab.id}
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            onHoverStart={() => setHoveredTab(tab.id)}
            onHoverEnd={() => setHoveredTab(null)}
            className="group relative"
          >
            <Link href={tab.href}>
              <motion.div
                whileHover={{ scale: 1.02, y: -6 }}
                whileTap={{ scale: 0.98 }}
                className="relative h-96 rounded-3xl overflow-hidden cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(15, 15, 15, 0.8) 100%)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(99, 102, 241, 0.1)",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                }}
              >
                {/* Enhanced background gradient overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${tab.color} opacity-5 group-hover:opacity-15 transition-opacity duration-500`}
                />

                {/* Animated border */}
                <div
                  className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  style={{
                    background: `linear-gradient(135deg, transparent 0%, rgba(99, 102, 241, 0.1) 50%, transparent 100%)`,
                    padding: "1px",
                  }}
                />

                {/* Content */}
                <div className="relative z-10 p-8 h-full flex flex-col">
                  {/* Header with enhanced styling */}
                  <div className="flex items-start justify-between mb-6">
                    <div className={`relative p-4 rounded-2xl bg-gradient-to-r ${tab.color} shadow-2xl group-hover:shadow-3xl transition-shadow duration-300`}>
                      <tab.icon className="w-10 h-10 text-white" />
                      <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <motion.div
                        animate={{
                          x: hoveredTab === tab.id ? 4 : 0,
                          opacity: hoveredTab === tab.id ? 1 : 0.7,
                        }}
                        transition={{ duration: 0.3 }}
                        className="p-2 rounded-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50"
                      >
                        <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors duration-300" />
                      </motion.div>
                      
                      <div className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${tab.color} text-white shadow-lg`}>
                        {tab.accuracy} Accuracy
                      </div>
                    </div>
                  </div>

                  {/* Content section */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-400 group-hover:to-violet-400 transition-all duration-500">
                        {tab.label}
                      </h3>
                      <p className="text-slate-400 group-hover:text-slate-300 transition-colors duration-300 text-pretty leading-relaxed mb-6">
                        {tab.description}
                      </p>
                    </div>

                    {/* Features list */}
                    <div className="space-y-3 mb-6">
                      <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Key Features</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {tab.features.map((feature, featureIndex) => (
                          <motion.div
                            key={featureIndex}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: 0.1 * featureIndex }}
                            className="flex items-center space-x-3 text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300"
                          >
                            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${tab.color} opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />
                            <span>{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Footer with enhanced call-to-action */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                      <span className="text-sm text-slate-500 group-hover:text-slate-400 transition-colors font-medium">
                        Start Assessment
                      </span>
                      <motion.div
                        className={`w-3 h-3 rounded-full bg-gradient-to-r ${tab.color} shadow-lg`}
                        animate={{
                          scale: hoveredTab === tab.id ? [1, 1.3, 1] : 1,
                          boxShadow: hoveredTab === tab.id 
                            ? ["0 0 0 0 rgba(99, 102, 241, 0.4)", "0 0 0 10px rgba(99, 102, 241, 0)", "0 0 0 0 rgba(99, 102, 241, 0)"]
                            : "0 0 0 0 rgba(99, 102, 241, 0)",
                        }}
                        transition={{
                          duration: hoveredTab === tab.id ? 1.5 : 0.3,
                          repeat: hoveredTab === tab.id ? Number.POSITIVE_INFINITY : 0,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Enhanced decorative elements */}
                <div
                  className={`absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-r ${tab.color} opacity-10 rounded-full blur-2xl group-hover:opacity-25 group-hover:scale-110 transition-all duration-500`}
                />
                <div
                  className={`absolute -bottom-6 -left-6 w-40 h-40 bg-gradient-to-r ${tab.color} opacity-5 rounded-full blur-3xl group-hover:opacity-15 group-hover:scale-110 transition-all duration-500`}
                />
                
                {/* Subtle grid pattern overlay */}
                <div 
                  className="absolute inset-0 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-500"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }}
                />
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

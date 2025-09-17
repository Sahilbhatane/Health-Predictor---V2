"use client"

import { motion } from "framer-motion"
import { Stethoscope, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ImprovedCommonDiseasesPredictionForm } from "@/components/forms/common-diseases-prediction-form"
import { ThemeProvider } from "@/components/theme-provider"
import { useLenis } from "@/hooks/use-lenis"

export default function CommonDiseasesPredictionPage() {
  useLenis()

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Background elements */}
        <div className="fixed inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-600/30 rounded-full blur-3xl" />
          <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-emerald-600/30 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-teal-600/30 rounded-full blur-3xl" />
        </div>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 pt-8 pb-4 px-4"
        >
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm border border-slate-600 text-slate-300 font-medium rounded-xl hover:bg-slate-700/50 hover:text-white transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </motion.button>
            </Link>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                Health Predictor
              </span>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <motion.main
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative z-10 py-8 px-4 sm:px-6 lg:px-8"
        >
          <div className="w-full max-w-[90%] xl:max-w-[85%] 2xl:max-w-[80%] mx-auto">
            {/* Page Header */}
            <div className="text-center mb-16">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="inline-flex items-center justify-center p-6 rounded-3xl bg-gradient-to-r from-green-500 to-emerald-500 shadow-2xl mb-8"
              >
                <Stethoscope className="w-16 h-16 text-white" />
              </motion.div>
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent mb-6 text-balance leading-tight"
              >
                Common Diseases Prediction
              </motion.h1>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-xl text-slate-300 max-w-4xl mx-auto text-pretty leading-relaxed"
              >
                Multi-disease prediction system for comprehensive health screening and early detection.
                Get insights across multiple common health conditions with our advanced AI system.
              </motion.p>
            </div>

            {/* Form Container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="glass-enhanced rounded-3xl p-8 md:p-12 lg:p-16 shadow-2xl border border-green-500/20"
              style={{
                background: "linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(15, 15, 15, 0.8) 100%)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 25px 50px -12px rgba(34, 197, 94, 0.25), 0 0 0 1px rgba(34, 197, 94, 0.1)",
              }}
            >
              <ImprovedCommonDiseasesPredictionForm />
            </motion.div>
          </div>
        </motion.main>
      </div>
    </ThemeProvider>
  )
}

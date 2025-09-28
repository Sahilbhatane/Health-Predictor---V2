"use client"

import { useRef, useState } from "react"
import { useSession } from "next-auth/react"
import { motion, useScroll, useTransform } from "framer-motion"
import { LogIn } from "lucide-react"
import { FloatingNavbar } from "@/components/floating-navbar"
import { PredictionTabs } from "@/components/prediction-tabs"
import { ContactSection } from "@/components/contact-section"
import { UserMenu } from "@/components/user-menu"
import { Button } from "@/components/ui/button"
import { useLenis } from "@/hooks/use-lenis"
import Link from "next/link"

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const startBtnRef = useRef<HTMLButtonElement>(null)
  const learnBtnRef = useRef<HTMLButtonElement>(null)
  const { data: session } = useSession()
  
  const [startBtnGlow, setStartBtnGlow] = useState({ x: 0, y: 0 })
  const [learnBtnGlow, setLearnBtnGlow] = useState({ x: 0, y: 0 })
  const [startBtnHovering, setStartBtnHovering] = useState(false)
  const [learnBtnHovering, setLearnBtnHovering] = useState(false)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
  const { scrollTo } = useLenis()

  const handleStartBtnMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (startBtnRef.current) {
      const rect = startBtnRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setStartBtnGlow({ x, y })
    }
  }

  const handleLearnBtnMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (learnBtnRef.current) {
      const rect = learnBtnRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setLearnBtnGlow({ x, y })
    }
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-background relative overflow-hidden">
      {/* Floating Navbar */}
      <FloatingNavbar />

      {/* Top Right Auth Button */}
      <div className="fixed top-4 right-4 z-40 sm:top-6 sm:right-6">
        {session?.user ? (
          <UserMenu />
        ) : (
          <Link href="/auth/signin">
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              <Button
                size="lg"
                className="bg-black/20 backdrop-blur-xl border border-white/10 text-white font-medium shadow-2xl hover:bg-black/30 transition-all duration-300 px-4 py-2 sm:px-6 sm:py-3 rounded-2xl text-sm sm:text-base"
              >
                <LogIn className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" />
                <span className="hidden sm:inline ml-2">Sign In</span>
              </Button>
              
              {/* Glassmorphism glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
            </motion.div>
          </Link>
        )}
      </div>

        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 pt-24 pb-12 px-4"
          data-animate="fade-up"
        >
          <div className="max-w-5xl mx-auto text-center">
            {/* Logo/Brand Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center justify-center mb-6"
            >
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/25">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 rounded-2xl opacity-20 blur-lg animate-pulse"></div>
              </div>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-3xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent mb-4 neon-text"
            >
              AI Health Predictor
            </motion.h1>

            {/* Subtitle with Features */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="space-y-4 mb-8"
            >
              <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Harness the power of advanced machine learning to gain personalized health insights and make informed decisions about your wellness journey.
              </p>
              
              {/* Feature Highlights */}
              <div className="flex flex-wrap justify-center gap-4 mt-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 backdrop-blur-sm"
                >
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-blue-300 font-medium">97% Accuracy</span>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                  className="flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-2 backdrop-blur-sm"
                >
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-indigo-300 font-medium">4 Conditions</span>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                  className="flex items-center space-x-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-2 backdrop-blur-sm"
                >
                  <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-violet-300 font-medium">Instant Results</span>
                </motion.div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.1 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.button
                ref={startBtnRef}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollTo("#prediction")}
                onMouseEnter={() => setStartBtnHovering(true)}
                onMouseLeave={() => setStartBtnHovering(false)}
                onMouseMove={handleStartBtnMouseMove}
                className="relative px-8 py-4 text-white font-semibold rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden border border-slate-600 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500"
                style={{
                  boxShadow: startBtnHovering 
                    ? "0 0 25px rgba(59, 130, 246, 0.6), 0 0 50px rgba(99, 102, 241, 0.4), 0 0 75px rgba(139, 92, 246, 0.2)"
                    : "0 0 15px rgba(59, 130, 246, 0.3), 0 0 30px rgba(99, 102, 241, 0.2)"
                }}
              >
                <motion.div
                  className="absolute pointer-events-none"
                  style={{
                    left: startBtnGlow.x - 40,
                    top: startBtnGlow.y - 40,
                    width: "80px",
                    height: "80px",
                    background: "radial-gradient(circle, rgba(59, 130, 246, 0.8) 0%, rgba(99, 102, 241, 0.6) 30%, rgba(139, 92, 246, 0.4) 60%, transparent 80%)",
                    borderRadius: "50%",
                    filter: "blur(15px)",
                  }}
                  animate={{
                    opacity: startBtnHovering ? 1 : 0,
                    scale: startBtnHovering ? 1 : 0.5,
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
                
                <span className="relative z-10 flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Start Prediction</span>
                </span>
              </motion.button>

              <motion.button
                ref={learnBtnRef}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open("https://health-predictor-wiki.vercel.app/", "_blank")}
                onMouseEnter={() => setLearnBtnHovering(true)}
                onMouseLeave={() => setLearnBtnHovering(false)}
                onMouseMove={handleLearnBtnMouseMove}
                className="relative px-8 py-4 bg-slate-800/50 backdrop-blur-sm border border-slate-600 text-slate-300 font-semibold rounded-2xl hover:bg-slate-700/50 hover:text-white transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>Documentation</span>
                </span>
              </motion.button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.3 }}
              className="mt-8 pt-6 border-t border-slate-800/50"
            >
              <p className="text-xs text-slate-500 mb-4">Trusted by healthcare professionals and patients worldwide</p>
              <div className="flex justify-center items-center space-x-8 opacity-60">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-xs text-slate-400">HIPAA Compliant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-xs text-slate-400">Data Secure</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-xs text-slate-400">FDA Guidelines</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Prediction Section with scroll-triggered animations */}
        <section id="prediction" className="relative z-10 py-16 px-4" data-animate="fade-up">
          <PredictionTabs />
        </section>

        <section id="contact" className="relative z-10 py-12 px-4" data-animate="fade-up">
          <ContactSection />
        </section>

        {/* Copyright Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 py-8 px-4 border-t border-slate-800/50"
          data-animate="fade-up"
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex items-center justify-center space-x-3 mb-4"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 border border-white rounded-full border-t-transparent" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                  AI Health Predictor
                </span>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-slate-400 text-sm mb-2"
              >
                © 2024 AI Health Predictor. Advanced AI for better health insights.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xs text-slate-500 max-w-2xl mx-auto"
              >
                Empowering individuals with AI-driven health insights for better wellness decisions and preventive care. 
                This tool provides predictions for informational purposes only.
              </motion.p>
            </div>
          </div>
        </motion.section>

        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 py-12 px-4 bg-slate-900/30 backdrop-blur-sm"
          data-animate="fade-up"
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-white font-semibold mb-4 text-lg">Predictions</h4>
                <ul className="space-y-3 text-sm text-slate-400">
                  <li>
                    <a href="#prediction" className="hover:text-blue-400 transition-colors duration-200 flex items-center space-x-2">
                      <span>Heart Disease Analysis</span>
                    </a>
                  </li>
                  <li>
                    <a href="#prediction" className="hover:text-blue-400 transition-colors duration-200 flex items-center space-x-2">
                      <span>Diabetes Prediction</span>
                    </a>
                  </li>
                  <li>
                    <a href="#prediction" className="hover:text-blue-400 transition-colors duration-200 flex items-center space-x-2">
                      <span>Parkinson's Assessment</span>
                    </a>
                  </li>
                  <li>
                    <a href="#prediction" className="hover:text-blue-400 transition-colors duration-200 flex items-center space-x-2">
                      <span>Common Diseases</span>
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-4 text-lg">Resources</h4>
                <ul className="space-y-3 text-sm text-slate-400">
                  <li>
                    <a
                      href="https://health-predictor-wiki.vercel.app/"
                      target="_blank"
                      className="hover:text-blue-400 transition-colors duration-200 flex items-center space-x-2"
                      rel="noreferrer"
                    >
                      <span>Documentation</span>
                    </a>
                  </li>
                  <li>
                    <a href="#contact" className="hover:text-blue-400 transition-colors duration-200 flex items-center space-x-2">
                      <span>Contact Support</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-blue-400 transition-colors duration-200 flex items-center space-x-2">
                      <span>Privacy Policy</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-blue-400 transition-colors duration-200 flex items-center space-x-2">
                      <span>Terms of Service</span>
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-4 text-lg flex items-center">
                  <svg className="w-5 h-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Medical Disclaimer
                </h4>
                <div className="space-y-3 text-xs text-slate-400">
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                    <p className="font-semibold text-yellow-400 mb-2">- AI/ML Generated Predictions</p>
                    <ul className="space-y-1 list-disc list-inside text-slate-300">
                      <li>Results are for informational purposes only</li>
                      <li>Not a substitute for professional medical diagnosis</li>
                      <li>AI algorithms may have limitations and inaccuracies</li>
                    </ul>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                    <p className="font-semibold text-red-400 mb-1">- Always Consult Healthcare Professionals</p>
                    <p className="text-slate-300">
                      Seek immediate medical attention for symptoms or health concerns. 
                      Do not rely solely on AI predictions for health decisions.
                    </p>
                  </div>
                  <div className="pt-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      AI-Powered Technology
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.footer>
      </div>
  )
}

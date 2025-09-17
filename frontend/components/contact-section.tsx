"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Send, User, MessageSquare, Loader2, CheckCircle, ChevronDown, ChevronUp } from "lucide-react"

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Web3Forms implementation will be added next
    const formDataToSend = new FormData()
    formDataToSend.append("access_key", "d149d7a6-d35b-4dd8-a928-895145916788")
    formDataToSend.append("name", formData.name)
    formDataToSend.append("email", formData.email)
    formDataToSend.append("message", formData.message)

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formDataToSend,
      })

      if (response.ok) {
        setIsSubmitted(true)
        setTimeout(() => {
          setIsSubmitted(false)
          setFormData({ name: "", email: "", message: "" })
          setIsExpanded(false)
        }, 3000)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
          style={{
            background: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(34, 197, 94, 0.3)",
            borderRadius: "24px",
          }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 text-green-400 mb-4">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
          <p className="text-lg text-slate-300">Thank you for reaching out. We'll get back to you soon.</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent mb-3 text-balance">
          Get In Touch
        </h2>
        <p className="text-base text-slate-400 max-w-xl mx-auto text-pretty">
          Have questions about your health predictions? Need support? We're here to help.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative w-full"
      >
        <div
          className="glass-enhanced rounded-3xl shadow-2xl overflow-hidden"
          style={{
            background: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(99, 102, 241, 0.2)",
          }}
        >
          {/* Collapsible Header */}
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full p-6 md:p-8 flex items-center justify-between text-left focus:outline-none"
          >
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 shadow-lg">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-1">Contact Form</h3>
                <p className="text-slate-400 text-sm">Send us a message and we'll respond as soon as possible</p>
              </div>
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="text-slate-400"
            >
              <ChevronDown className="w-6 h-6" />
            </motion.div>
          </motion.button>

          {/* Expandable Form Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-6 md:px-8 pb-6 md:pb-8 border-t border-slate-700">
                  <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="space-y-2"
                    >
                      <label htmlFor="name" className="block text-sm font-medium text-slate-300">
                        Your Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="space-y-2"
                    >
                      <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          id="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                          placeholder="Enter your email address"
                          required
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="space-y-2"
                    >
                      <label htmlFor="message" className="block text-sm font-medium text-slate-300">
                        Message
                      </label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3 top-4 w-4 h-4 text-slate-400" />
                        <textarea
                          id="message"
                          rows={4}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 resize-none"
                          placeholder="Tell us how we can help you..."
                          required
                        />
                      </div>
                    </motion.div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="w-full py-3 bg-gradient-to-r from-blue-500 to-violet-500 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send Message</span>
                        </>
                      )}
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-blue-500/20 to-violet-500/20 rounded-full blur-xl" />
        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-xl" />
      </motion.div>
    </div>
  )
}

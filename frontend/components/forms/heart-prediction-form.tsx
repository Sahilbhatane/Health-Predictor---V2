"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Loader2, Heart, AlertCircle, CheckCircle, TrendingUp, Activity, AlertTriangle, Stethoscope, User, UserCheck } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PatientFormData {
  // Patient-friendly inputs
  chestPain: string
  breathingDifficulty: string
  fatigue: string
  heartRate: string
  age: string
  exerciseHabits: string
}

interface DoctorFormData {
  // Professional Medical Inputs
  age: string
  sex: string
  chestPainType: string
  restingBP: string
  cholesterol: string
  fastingBS: string
  restingECG: string
  maxHR: string
  exerciseAngina: string
  oldpeak: string
  stSlope: string
}

interface PredictionResult {
  risk: "high" | "low"
  confidence: number
  riskScore: number
  factors: PatientFormData | DoctorFormData
  recommendations: string[]
  subPredictions: {
    condition: string
    confidence: number
  }[]
}

export function HeartPredictionForm() {
  const [mode, setMode] = useState<"patient" | "doctor">("patient")
  const [patientFormData, setPatientFormData] = useState<PatientFormData>({
    chestPain: "",
    breathingDifficulty: "",
    fatigue: "",
    heartRate: "",
    age: "",
    exerciseHabits: "",
  })
  const [doctorFormData, setDoctorFormData] = useState<DoctorFormData>({
    age: "",
    sex: "",
    chestPainType: "",
    restingBP: "",
    cholesterol: "",
    fastingBS: "",
    restingECG: "",
    maxHR: "",
    exerciseAngina: "",
    oldpeak: "",
    stSlope: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const currentFormData = mode === "patient" ? patientFormData : doctorFormData
      const response = await fetch("/api/predict/heart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...currentFormData, mode }),
      })

      const data = await response.json()

      if (data.success) {
        setResult(data.prediction)
      } else {
        setError(data.error || "Failed to get prediction")
      }
    } catch (error) {
      console.error("Prediction error:", error)
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Patient-friendly questions
  const patientQuestions = [
    {
      key: "chestPain" as keyof PatientFormData,
      question: "Do you experience chest pain or discomfort?",
      options: [
        { value: "never", label: "Never" },
        { value: "rarely", label: "Rarely" },
        { value: "sometimes", label: "Sometimes" },
        { value: "often", label: "Often" },
        { value: "always", label: "Always" },
      ],
    },
    {
      key: "breathingDifficulty" as keyof PatientFormData,
      question: "Do you have difficulty breathing or shortness of breath?",
      options: [
        { value: "never", label: "Never" },
        { value: "light_activity", label: "During light activity" },
        { value: "moderate_activity", label: "During moderate activity" },
        { value: "heavy_activity", label: "During heavy activity" },
        { value: "at_rest", label: "Even at rest" },
      ],
    },
    {
      key: "fatigue" as keyof PatientFormData,
      question: "How often do you feel unusually tired or fatigued?",
      options: [
        { value: "never", label: "Never" },
        { value: "rarely", label: "Rarely" },
        { value: "sometimes", label: "Sometimes" },
        { value: "often", label: "Often" },
        { value: "always", label: "Always" },
      ],
    },
    {
      key: "heartRate" as keyof PatientFormData,
      question: "Have you noticed any irregular heartbeat or palpitations?",
      options: [
        { value: "never", label: "Never" },
        { value: "rarely", label: "Rarely" },
        { value: "sometimes", label: "Sometimes" },
        { value: "often", label: "Often" },
        { value: "always", label: "Always" },
      ],
    },
    {
      key: "age" as keyof PatientFormData,
      question: "What is your age?",
      options: [
        { value: "under_30", label: "Under 30" },
        { value: "30_45", label: "30-45" },
        { value: "46_60", label: "46-60" },
        { value: "over_60", label: "Over 60" },
      ],
    },
    {
      key: "exerciseHabits" as keyof PatientFormData,
      question: "How would you describe your exercise habits?",
      options: [
        { value: "sedentary", label: "Sedentary (little to no exercise)" },
        { value: "light", label: "Light activity (1-2 times per week)" },
        { value: "moderate", label: "Moderate activity (3-4 times per week)" },
        { value: "active", label: "Very active (5+ times per week)" },
      ],
    },
  ]

  // Professional medical questions
  const doctorQuestions = [
    {
      key: "age" as keyof DoctorFormData,
      question: "Age (years)",
      type: "number",
      placeholder: "Enter age in years",
    },
    {
      key: "sex" as keyof DoctorFormData,
      question: "Sex",
      options: [
        { value: "M", label: "Male" },
        { value: "F", label: "Female" },
      ],
    },
    {
      key: "chestPainType" as keyof DoctorFormData,
      question: "Chest Pain Type",
      options: [
        { value: "TA", label: "Typical Angina" },
        { value: "ATA", label: "Atypical Angina" },
        { value: "NAP", label: "Non-Anginal Pain" },
        { value: "ASY", label: "Asymptomatic" },
      ],
    },
    {
      key: "restingBP" as keyof DoctorFormData,
      question: "Resting Blood Pressure (mm Hg)",
      type: "number",
      placeholder: "e.g., 120",
    },
    {
      key: "cholesterol" as keyof DoctorFormData,
      question: "Serum Cholesterol (mg/dl)",
      type: "number",
      placeholder: "e.g., 200",
    },
    {
      key: "fastingBS" as keyof DoctorFormData,
      question: "Fasting Blood Sugar > 120 mg/dl",
      options: [
        { value: "0", label: "No (≤ 120 mg/dl)" },
        { value: "1", label: "Yes (> 120 mg/dl)" },
      ],
    },
    {
      key: "restingECG" as keyof DoctorFormData,
      question: "Resting Electrocardiogram Results",
      options: [
        { value: "Normal", label: "Normal" },
        { value: "ST", label: "ST-T Wave Abnormality" },
        { value: "LVH", label: "Left Ventricular Hypertrophy" },
      ],
    },
    {
      key: "maxHR" as keyof DoctorFormData,
      question: "Maximum Heart Rate Achieved",
      type: "number",
      placeholder: "e.g., 150",
    },
    {
      key: "exerciseAngina" as keyof DoctorFormData,
      question: "Exercise Induced Angina",
      options: [
        { value: "N", label: "No" },
        { value: "Y", label: "Yes" },
      ],
    },
    {
      key: "oldpeak" as keyof DoctorFormData,
      question: "ST Depression (Oldpeak)",
      type: "number",
      placeholder: "e.g., 0.0",
      step: "0.1",
    },
    {
      key: "stSlope" as keyof DoctorFormData,
      question: "Slope of Peak Exercise ST Segment",
      options: [
        { value: "Up", label: "Upsloping" },
        { value: "Flat", label: "Flat" },
        { value: "Down", label: "Downsloping" },
      ],
    },
  ]

  if (error) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/20 text-red-400 mb-6">
          <AlertCircle className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-bold text-red-400 mb-4">Error</h3>
        <p className="text-slate-300 mb-6">{error}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setError(null)
            setResult(null)
          }}
          className="px-8 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200"
        >
          Try Again
        </motion.button>
      </motion.div>
    )
  }

  if (result) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-8">
        <Tabs defaultValue="prediction" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
            <TabsTrigger value="prediction" className="data-[state=active]:bg-red-500/20">
              Prediction
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="data-[state=active]:bg-red-500/20">
              Recommendations
            </TabsTrigger>
            <TabsTrigger value="disclaimer" className="data-[state=active]:bg-red-500/20">
              Important Notice
            </TabsTrigger>
          </TabsList>

          <TabsContent value="prediction" className="space-y-6 mt-6">
            {/* Main Result */}
            <div className="text-center mb-8">
              <div
                className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
                  result.risk === "low" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                }`}
              >
                {result.risk === "low" ? <CheckCircle className="w-10 h-10" /> : <AlertCircle className="w-10 h-10" />}
              </div>

              <h3 className={`text-3xl font-bold mb-4 ${result.risk === "low" ? "text-green-400" : "text-red-400"}`}>
                {result.risk === "low" ? "Low Risk" : "High Risk"}
              </h3>

              <p className="text-xl text-slate-300 mb-6">
                You are at <strong>{result.risk}</strong> risk of heart disease
              </p>
            </div>

            {/* Detailed Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Confidence Level */}
              <div className="bg-slate-800/50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <Activity className="w-5 h-5 text-blue-400 mr-2" />
                  <h4 className="font-semibold text-white">Confidence Level</h4>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3 mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${result.confidence}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={`h-3 rounded-full ${
                      result.risk === "low"
                        ? "bg-gradient-to-r from-green-500 to-emerald-400"
                        : "bg-gradient-to-r from-red-500 to-pink-400"
                    }`}
                  />
                </div>
                <p className="text-white font-semibold">{result.confidence}%</p>
              </div>

              {/* Risk Score */}
              <div className="bg-slate-800/50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <TrendingUp className="w-5 h-5 text-purple-400 mr-2" />
                  <h4 className="font-semibold text-white">Risk Score</h4>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3 mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${result.riskScore}%` }}
                    transition={{ duration: 1, delay: 0.7 }}
                    className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-400"
                  />
                </div>
                <p className="text-white font-semibold">{Math.round(result.riskScore)}%</p>
              </div>
            </div>

            {/* Sub-predictions */}
            {result.subPredictions && (
              <div className="bg-slate-800/30 rounded-xl p-6 mb-8">
                <h4 className="font-semibold text-white mb-4 flex items-center">
                  <Stethoscope className="w-5 h-5 text-cyan-400 mr-2" />
                  Related Cardiac Conditions
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {result.subPredictions.map((subPred, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 + index * 0.2 }}
                      className="bg-slate-700/50 rounded-lg p-4"
                    >
                      <h5 className="text-white font-medium mb-2">{subPred.condition}</h5>
                      <div className="w-full bg-slate-600 rounded-full h-2 mb-2">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-400"
                          style={{ width: `${subPred.confidence}%` }}
                        />
                      </div>
                      <p className="text-cyan-400 text-sm font-semibold">{subPred.confidence}%</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6 mt-6">
            <div className="bg-slate-800/30 rounded-xl p-6">
              <h4 className="font-semibold text-white mb-4 flex items-center">
                <Heart className="w-5 h-5 text-red-400 mr-2" />
                Medical Recommendations
              </h4>
              <ul className="space-y-3">
                {result.recommendations.map((rec, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start text-slate-300"
                  >
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span className="text-sm leading-relaxed">{rec}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="disclaimer" className="space-y-6 mt-6">
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <AlertTriangle className="w-6 h-6 text-yellow-400 mr-3" />
                <h4 className="font-semibold text-yellow-400 text-lg">Important Medical Disclaimer</h4>
              </div>
              <div className="space-y-4 text-slate-300">
                <p className="leading-relaxed">
                  <strong className="text-yellow-400">⚠️ This is an AI/ML Generated Prediction</strong>
                </p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>This prediction is generated by artificial intelligence and machine learning algorithms</li>
                  <li>Results are for informational purposes only and should not be used for medical diagnosis</li>
                  <li>AI predictions can have limitations and may not account for all medical factors</li>
                  <li>Individual health conditions vary significantly and require professional assessment</li>
                </ul>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mt-4">
                  <p className="text-red-400 font-semibold">
                    Always consult with a qualified healthcare provider or cardiologist for proper medical evaluation, 
                    diagnosis, and treatment decisions. If you experience chest pain or cardiac symptoms, seek immediate medical attention.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setResult(null)
              setPatientFormData({
                chestPain: "",
                breathingDifficulty: "",
                fatigue: "",
                heartRate: "",
                age: "",
                exerciseHabits: "",
              })
              setDoctorFormData({
                age: "",
                sex: "",
                chestPainType: "",
                restingBP: "",
                cholesterol: "",
                fastingBS: "",
                restingECG: "",
                maxHR: "",
                exerciseAngina: "",
                oldpeak: "",
                stSlope: "",
              })
            }}
            className="px-8 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200"
          >
            Take Another Test
          </motion.button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-slate-800/50 rounded-xl p-1 flex">
          <button
            type="button"
            onClick={() => setMode("patient")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${
              mode === "patient" 
                ? "bg-red-500/20 text-red-400 shadow-lg" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Patient Mode</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("doctor")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${
              mode === "doctor" 
                ? "bg-red-500/20 text-red-400 shadow-lg" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Doctor Mode</span>
          </button>
        </div>
      </div>

      {/* Mode Description */}
      <div className="text-center mb-6">
        <p className="text-slate-300">
          {mode === "patient" 
            ? "Answer simple questions about your symptoms and lifestyle" 
            : "Enter detailed clinical measurements and diagnostic parameters"}
        </p>
      </div>

      {/* Patient Mode Form */}
      {mode === "patient" && (
        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12">
            {patientQuestions.map((q, index) => (
              <motion.div
                key={q.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="space-y-6 bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50"
              >
                <h4 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                  {q.question}
                </h4>
                
                <div className="grid grid-cols-1 gap-3">
                  {q.options?.map((option) => (
                    <motion.label
                      key={option.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                        patientFormData[q.key] === option.value
                          ? "bg-red-500/20 border-red-500/50 text-white shadow-lg"
                          : "bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700/50 hover:border-slate-600"
                      } border`}
                    >
                      <input
                        type="radio"
                        name={q.key}
                        value={option.value}
                        checked={patientFormData[q.key] === option.value}
                        onChange={(e) => setPatientFormData({ ...patientFormData, [q.key]: e.target.value })}
                        className="sr-only"
                      />
                      <div
                        className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center transition-all duration-200 ${
                          patientFormData[q.key] === option.value ? "border-red-500 bg-red-500" : "border-slate-500"
                        }`}
                      >
                        {patientFormData[q.key] === option.value && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                      </div>
                      <span className="leading-relaxed">{option.label}</span>
                    </motion.label>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.button
            type="submit"
            disabled={isLoading || Object.values(patientFormData).some((value) => !value)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="w-full py-5 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-2xl transition-all duration-200 flex items-center justify-center space-x-3 text-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Analyzing Your Health Data...</span>
              </>
            ) : (
              <>
                <Heart className="w-6 h-6" />
                <span>Get Heart Disease Prediction</span>
              </>
            )}
          </motion.button>
        </form>
      )}

      {/* Doctor Mode Form */}
      {mode === "doctor" && (
        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-8">
            {doctorQuestions.map((q, index) => (
              <motion.div
                key={q.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="space-y-4 bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50"
              >
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                  {q.question}
                </h4>
                
                {q.options ? (
                  <div className="space-y-3">
                    {q.options.map((option) => (
                      <motion.label
                        key={option.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                          doctorFormData[q.key] === option.value
                            ? "bg-red-500/20 border-red-500/50 text-white shadow-lg"
                            : "bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700/50 hover:border-slate-600"
                        } border`}
                      >
                        <input
                          type="radio"
                          name={q.key}
                          value={option.value}
                          checked={doctorFormData[q.key] === option.value}
                          onChange={(e) => setDoctorFormData({ ...doctorFormData, [q.key]: e.target.value })}
                          className="sr-only"
                        />
                        <div
                          className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center transition-all duration-200 ${
                            doctorFormData[q.key] === option.value ? "border-red-500 bg-red-500" : "border-slate-500"
                          }`}
                        >
                          {doctorFormData[q.key] === option.value && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        <span className="text-sm leading-relaxed">{option.label}</span>
                      </motion.label>
                    ))}
                  </div>
                ) : (
                  <div className="w-full">
                    <input
                      type={q.type || "text"}
                      placeholder={q.placeholder}
                      step={q.step}
                      value={doctorFormData[q.key]}
                      onChange={(e) => setDoctorFormData({ ...doctorFormData, [q.key]: e.target.value })}
                      className="w-full p-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all duration-200 text-center font-mono"
                      required
                    />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <motion.button
            type="submit"
            disabled={isLoading || Object.values(doctorFormData).some((value) => !value)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="w-full py-5 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-2xl transition-all duration-200 flex items-center justify-center space-x-3 text-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Processing Clinical Data...</span>
              </>
            ) : (
              <>
                <Heart className="w-6 h-6" />
                <span>Generate Medical Prediction</span>
              </>
            )}
          </motion.button>
        </form>
      )}
    </div>
  )
}

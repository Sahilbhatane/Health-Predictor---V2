"use client"

import type React from "react"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { Loader2, Droplet, AlertCircle, CheckCircle, TrendingUp, Activity, AlertTriangle, Stethoscope, User, UserCheck } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AuthGuard } from "@/components/auth-guard"

interface PatientFormData {
  // Patient-friendly inputs
  excessiveThirst: string
  frequentUrination: string
  unexplainedWeightLoss: string
  fatigue: string
  blurredVision: string
  slowHealingWounds: string
  age: string
  familyHistory: string
}

interface DoctorFormData {
  // Professional Medical Inputs for Diabetes
  pregnancies: string
  glucose: string
  bloodPressure: string
  skinThickness: string
  insulin: string
  bmi: string
  diabetesPedigreeFunction: string
  age: string
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

export function DiabetesPredictionForm() {
  const [mode, setMode] = useState<"patient" | "doctor">("patient")
  const { data: session } = useSession()
  const [patientFormData, setPatientFormData] = useState<PatientFormData>({
    excessiveThirst: "",
    frequentUrination: "",
    unexplainedWeightLoss: "",
    fatigue: "",
    blurredVision: "",
    slowHealingWounds: "",
    age: "",
    familyHistory: "",
  })
  const [doctorFormData, setDoctorFormData] = useState<DoctorFormData>({
    pregnancies: "",
    glucose: "",
    bloodPressure: "",
    skinThickness: "",
    insulin: "",
    bmi: "",
    diabetesPedigreeFunction: "",
    age: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const currentFormData = mode === "patient" ? patientFormData : doctorFormData
      
      // Simulate API call to FastAPI backend
      const response = await fetch("/api/predict/diabetes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...currentFormData, mode }),
      })

      // Simulate response for demo
      setTimeout(() => {
        const mockResult: PredictionResult = {
          risk: Math.random() > 0.6 ? "high" : "low",
          confidence: Math.floor(Math.random() * 20) + 80,
          riskScore: Math.floor(Math.random() * 40) + 30,
          factors: currentFormData,
          recommendations: [
            "Monitor blood glucose levels regularly",
            "Maintain a healthy diet with controlled carbohydrate intake",
            "Engage in regular physical activity (30 minutes daily)",
            "Maintain a healthy weight and BMI",
            "Regular medical check-ups and screenings",
          ],
          subPredictions: [
            { condition: "Type 2 Diabetes", confidence: 85 },
            { condition: "Prediabetes", confidence: 72 },
            { condition: "Gestational Diabetes", confidence: 45 },
          ],
        }
        setResult(mockResult)
        setIsLoading(false)
      }, 2000)
    } catch (error) {
      console.error("Prediction error:", error)
      setIsLoading(false)
    }
  }

  // Patient-friendly questions
  const patientQuestions = [
    {
      key: "excessiveThirst" as keyof PatientFormData,
      question: "Do you experience excessive thirst?",
      options: [
        { value: "never", label: "Never" },
        { value: "rarely", label: "Rarely" },
        { value: "sometimes", label: "Sometimes" },
        { value: "often", label: "Often" },
        { value: "always", label: "Always" },
      ],
    },
    {
      key: "frequentUrination" as keyof PatientFormData,
      question: "Do you urinate more frequently than usual?",
      options: [
        { value: "never", label: "Never" },
        { value: "little", label: "A little more" },
        { value: "moderate", label: "Moderately more" },
        { value: "much", label: "Much more" },
        { value: "extremely", label: "Extremely more" },
      ],
    },
    {
      key: "unexplainedWeightLoss" as keyof PatientFormData,
      question: "Have you experienced unexplained weight loss?",
      options: [
        { value: "none", label: "No weight loss" },
        { value: "slight", label: "Slight weight loss" },
        { value: "moderate", label: "Moderate weight loss" },
        { value: "significant", label: "Significant weight loss" },
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
      key: "blurredVision" as keyof PatientFormData,
      question: "Do you experience blurred vision?",
      options: [
        { value: "never", label: "Never" },
        { value: "rarely", label: "Rarely" },
        { value: "sometimes", label: "Sometimes" },
        { value: "frequently", label: "Frequently" },
        { value: "constantly", label: "Constantly" },
      ],
    },
    {
      key: "slowHealingWounds" as keyof PatientFormData,
      question: "Do cuts and wounds heal slower than normal?",
      options: [
        { value: "normal", label: "Normal healing" },
        { value: "little", label: "A little slower" },
        { value: "moderate", label: "Moderately slower" },
        { value: "much", label: "Much slower" },
        { value: "very", label: "Very slow healing" },
      ],
    },
    {
      key: "age" as keyof PatientFormData,
      question: "What is your age group?",
      options: [
        { value: "under_30", label: "Under 30" },
        { value: "30_45", label: "30-45" },
        { value: "46_60", label: "46-60" },
        { value: "over_60", label: "Over 60" },
      ],
    },
    {
      key: "familyHistory" as keyof PatientFormData,
      question: "Do you have a family history of diabetes?",
      options: [
        { value: "none", label: "No family history" },
        { value: "distant", label: "Distant relatives" },
        { value: "close", label: "Close relatives (siblings, parents)" },
        { value: "immediate", label: "Immediate family (parents, siblings)" },
      ],
    },
  ]

  // Professional medical questions
  const doctorQuestions = [
    {
      key: "pregnancies" as keyof DoctorFormData,
      question: "Number of Pregnancies",
      type: "number",
      placeholder: "e.g., 2",
    },
    {
      key: "glucose" as keyof DoctorFormData,
      question: "Plasma Glucose Concentration (mg/dL)",
      type: "number",
      placeholder: "e.g., 120",
    },
    {
      key: "bloodPressure" as keyof DoctorFormData,
      question: "Diastolic Blood Pressure (mm Hg)",
      type: "number",
      placeholder: "e.g., 80",
    },
    {
      key: "skinThickness" as keyof DoctorFormData,
      question: "Triceps Skin Fold Thickness (mm)",
      type: "number",
      placeholder: "e.g., 20",
    },
    {
      key: "insulin" as keyof DoctorFormData,
      question: "2-Hour Serum Insulin (mu U/ml)",
      type: "number",
      placeholder: "e.g., 85",
    },
    {
      key: "bmi" as keyof DoctorFormData,
      question: "Body Mass Index (kg/m²)",
      type: "number",
      placeholder: "e.g., 25.5",
      step: "0.1",
    },
    {
      key: "diabetesPedigreeFunction" as keyof DoctorFormData,
      question: "Diabetes Pedigree Function",
      type: "number",
      placeholder: "e.g., 0.627",
      step: "0.001",
    },
    {
      key: "age" as keyof DoctorFormData,
      question: "Age (years)",
      type: "number",
      placeholder: "e.g., 35",
    },
  ]

  if (result) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-8">
        <Tabs defaultValue="prediction" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
            <TabsTrigger value="prediction" className="data-[state=active]:bg-blue-500/20">
              Prediction
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="data-[state=active]:bg-blue-500/20">
              Recommendations
            </TabsTrigger>
            <TabsTrigger value="disclaimer" className="data-[state=active]:bg-blue-500/20">
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
                You are at <strong>{result.risk}</strong> risk of diabetes
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
                        : "bg-gradient-to-r from-blue-500 to-cyan-400"
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
                  Related Diabetes Conditions
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
            <AuthGuard requiredForTabs={["recommendations"]}>
              <div className="bg-slate-800/30 rounded-xl p-6">
                <h4 className="font-semibold text-white mb-4 flex items-center">
                  <Droplet className="w-5 h-5 text-blue-400 mr-2" />
                  Diabetes Prevention Recommendations
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
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                      <span className="text-sm leading-relaxed">{rec}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
              
              {/* Medicine Suggestions Section - Only for authenticated users */}
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <Stethoscope className="w-5 h-5 text-green-400 mr-2" />
                  <h4 className="font-semibold text-green-300 text-lg">
                    Medicine & Supplement Suggestions
                  </h4>
                </div>
                <div className="space-y-4">
                  <div className="bg-slate-800/30 rounded-lg p-4">
                    <h5 className="font-medium text-white mb-2">Blood Sugar Management</h5>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-3" />
                        Metformin (500mg-1000mg) - First-line medication for Type 2 diabetes
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-3" />
                        Chromium supplements (200-400mcg) - May improve insulin sensitivity
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-3" />
                        Alpha-lipoic acid (300-600mg) - Antioxidant support
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                    <p className="text-xs text-amber-300 font-medium">
                      ⚠️ These are general suggestions only. Always consult your endocrinologist before starting any medication.
                    </p>
                  </div>
                </div>
              </div>
            </AuthGuard>
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
                    🏥 Always consult with a qualified healthcare provider or endocrinologist for proper medical evaluation, 
                    diagnosis, and treatment decisions. If you suspect diabetes symptoms, seek immediate medical attention.
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
                excessiveThirst: "",
                frequentUrination: "",
                unexplainedWeightLoss: "",
                fatigue: "",
                blurredVision: "",
                slowHealingWounds: "",
                age: "",
                familyHistory: "",
              })
              setDoctorFormData({
                pregnancies: "",
                glucose: "",
                bloodPressure: "",
                skinThickness: "",
                insulin: "",
                bmi: "",
                diabetesPedigreeFunction: "",
                age: "",
              })
            }}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200"
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
                ? "bg-blue-500/20 text-blue-400 shadow-lg" 
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
                ? "bg-blue-500/20 text-blue-400 shadow-lg" 
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
            ? "Answer simple questions about your diabetes symptoms and risk factors" 
            : "Enter detailed clinical measurements and diagnostic parameters"}
        </p>
      </div>

      {/* Patient Mode Form */}
      {mode === "patient" && (
        <form onSubmit={handleSubmit} className="space-y-8">
          {patientQuestions.map((q, index) => (
            <motion.div
              key={q.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="space-y-4"
            >
              <h4 className="text-lg font-semibold text-white mb-4">{q.question}</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {q.options?.map((option) => (
                  <motion.label
                    key={option.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                      patientFormData[q.key] === option.value
                        ? "bg-blue-500/20 border-blue-500/50 text-white"
                        : "bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700/50"
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
                      className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                        patientFormData[q.key] === option.value ? "border-blue-500 bg-blue-500" : "border-slate-500"
                      }`}
                    >
                      {patientFormData[q.key] === option.value && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <span>{option.label}</span>
                  </motion.label>
                ))}
              </div>
            </motion.div>
          ))}

          <motion.button
            type="submit"
            disabled={isLoading || Object.values(patientFormData).some((value) => !value)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Droplet className="w-5 h-5" />
                <span>Get Diabetes Prediction</span>
              </>
            )}
          </motion.button>
        </form>
      )}

      {/* Doctor Mode Form */}
      {mode === "doctor" && (
        <form onSubmit={handleSubmit} className="space-y-8">
          {doctorQuestions.map((q, index) => (
            <motion.div
              key={q.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="space-y-4"
            >
              <h4 className="text-lg font-semibold text-white mb-4">{q.question}</h4>
              <div className="w-full">
                <input
                  type={q.type || "text"}
                  placeholder={q.placeholder}
                  step={q.step}
                  value={doctorFormData[q.key]}
                  onChange={(e) => setDoctorFormData({ ...doctorFormData, [q.key]: e.target.value })}
                  className="w-full p-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                  required
                />
              </div>
            </motion.div>
          ))}

          <motion.button
            type="submit"
            disabled={isLoading || Object.values(doctorFormData).some((value) => !value)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Droplet className="w-5 h-5" />
                <span>Get Diabetes Prediction</span>
              </>
            )}
          </motion.button>
        </form>
      )}
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { Loader2, Brain, AlertCircle, CheckCircle, TrendingUp, Activity, AlertTriangle, Stethoscope, User, UserCheck } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AuthGuard } from "@/components/auth-guard"

interface PatientFormData {
  // Patient-friendly inputs
  tremor: string
  rigidity: string
  bradykinesia: string
  balanceProblems: string
  speechChanges: string
  handwritingChanges: string
  facialExpression: string
  walkingDifficulty: string
  age: string
  familyHistory: string
}

interface DoctorFormData {
  // Professional Medical Inputs for Parkinson's Disease Assessment
  mdvpFo: string // Average vocal fundamental frequency
  mdvpFhi: string // Maximum vocal fundamental frequency
  mdvpFlo: string // Minimum vocal fundamental frequency
  mdvpJitter: string // Jitter percentage
  mdvpShimmer: string // Shimmer percentage
  mdvpRap: string // Relative average perturbation
  mdvpPpq: string // Five-point period perturbation quotient
  shimmerDdb: string // Shimmer in dB
  nhr: string // Noise-to-harmonics ratio
  hnr: string // Harmonics-to-noise ratio
  rpde: string // Recurrence period density entropy
  dfa: string // Detrended fluctuation analysis
  spread1: string // Nonlinear measure of fundamental frequency variation
  spread2: string // Nonlinear measure of fundamental frequency variation
  d2: string // Correlation dimension
  ppe: string // Pitch period entropy
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

export function ParkinsonsPredictionForm() {
  const [mode, setMode] = useState<"patient" | "doctor">("patient")
  const { data: session } = useSession()
  const [patientFormData, setPatientFormData] = useState<PatientFormData>({
    tremor: "",
    rigidity: "",
    bradykinesia: "",
    balanceProblems: "",
    speechChanges: "",
    handwritingChanges: "",
    facialExpression: "",
    walkingDifficulty: "",
    age: "",
    familyHistory: "",
  })
  const [doctorFormData, setDoctorFormData] = useState<DoctorFormData>({
    mdvpFo: "",
    mdvpFhi: "",
    mdvpFlo: "",
    mdvpJitter: "",
    mdvpShimmer: "",
    mdvpRap: "",
    mdvpPpq: "",
    shimmerDdb: "",
    nhr: "",
    hnr: "",
    rpde: "",
    dfa: "",
    spread1: "",
    spread2: "",
    d2: "",
    ppe: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const currentFormData = mode === "patient" ? patientFormData : doctorFormData
      
      // Simulate API call to FastAPI backend
      const response = await fetch("/api/predict/parkinsons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...currentFormData, mode }),
      })

      // Simulate response for demo
      setTimeout(() => {
        const mockResult: PredictionResult = {
          risk: Math.random() > 0.7 ? "high" : "low",
          confidence: Math.floor(Math.random() * 25) + 75,
          riskScore: Math.floor(Math.random() * 50) + 25,
          factors: currentFormData,
          recommendations: [
            "Regular physical therapy and exercise programs",
            "Speech therapy to maintain vocal function",
            "Medication adherence and regular neurologist consultations",
            "Balance training and fall prevention measures",
            "Regular monitoring of motor symptoms",
            "Maintain social activities and mental stimulation",
          ],
          subPredictions: [
            { condition: "Motor Dysfunction", confidence: 78 },
            { condition: "Voice Tremor", confidence: 65 },
            { condition: "Bradykinesia", confidence: 52 },
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
      key: "tremor" as keyof PatientFormData,
      question: "Do you experience tremor or shaking?",
      options: [
        { value: "never", label: "Never" },
        { value: "rarely", label: "Rarely" },
        { value: "sometimes", label: "Sometimes" },
        { value: "often", label: "Often" },
        { value: "always", label: "Always" },
      ],
    },
    {
      key: "rigidity" as keyof PatientFormData,
      question: "Do you experience muscle stiffness or rigidity?",
      options: [
        { value: "none", label: "No stiffness" },
        { value: "mild", label: "Mild stiffness" },
        { value: "moderate", label: "Moderate stiffness" },
        { value: "severe", label: "Severe stiffness" },
      ],
    },
    {
      key: "bradykinesia" as keyof PatientFormData,
      question: "Do you have difficulty with slow movements?",
      options: [
        { value: "normal", label: "Normal movement speed" },
        { value: "slightly_slow", label: "Slightly slow" },
        { value: "moderately_slow", label: "Moderately slow" },
        { value: "very_slow", label: "Very slow movements" },
      ],
    },
    {
      key: "balanceProblems" as keyof PatientFormData,
      question: "Do you have balance or stability problems?",
      options: [
        { value: "never", label: "Never" },
        { value: "occasionally", label: "Occasionally" },
        { value: "frequently", label: "Frequently" },
        { value: "constantly", label: "Constantly" },
      ],
    },
    {
      key: "speechChanges" as keyof PatientFormData,
      question: "Have you noticed changes in your speech?",
      options: [
        { value: "no_change", label: "No changes" },
        { value: "softer", label: "Softer voice" },
        { value: "slurred", label: "Slurred speech" },
        { value: "monotone", label: "Monotone speech" },
      ],
    },
    {
      key: "handwritingChanges" as keyof PatientFormData,
      question: "Have you noticed changes in your handwriting?",
      options: [
        { value: "no_change", label: "No changes" },
        { value: "smaller", label: "Getting smaller" },
        { value: "shakier", label: "More shaky" },
        { value: "difficult", label: "Very difficult to write" },
      ],
    },
    {
      key: "facialExpression" as keyof PatientFormData,
      question: "Have you noticed changes in facial expression?",
      options: [
        { value: "normal", label: "Normal expression" },
        { value: "less_animated", label: "Less animated" },
        { value: "masked", label: "Reduced expression" },
        { value: "frozen", label: "Very limited expression" },
      ],
    },
    {
      key: "walkingDifficulty" as keyof PatientFormData,
      question: "Do you have difficulty walking?",
      options: [
        { value: "normal", label: "Normal walking" },
        { value: "slower", label: "Walking slower" },
        { value: "shuffling", label: "Shuffling gait" },
        { value: "freezing", label: "Episodes of freezing" },
      ],
    },
    {
      key: "age" as keyof PatientFormData,
      question: "What is your age group?",
      options: [
        { value: "under_50", label: "Under 50" },
        { value: "50_65", label: "50-65" },
        { value: "66_75", label: "66-75" },
        { value: "over_75", label: "Over 75" },
      ],
    },
    {
      key: "familyHistory" as keyof PatientFormData,
      question: "Do you have a family history of Parkinson's disease?",
      options: [
        { value: "none", label: "No family history" },
        { value: "distant", label: "Distant relatives" },
        { value: "close", label: "Close relatives" },
        { value: "immediate", label: "Immediate family" },
      ],
    },
  ]

    const doctorQuestions = [
    {
      key: "mdvpFo" as keyof DoctorFormData,
      question: "Average Vocal Fundamental Frequency (Hz)",
      type: "number",
      placeholder: "e.g., 119.992",
      step: "0.001",
    },
    {
      key: "mdvpFhi" as keyof DoctorFormData,
      question: "Maximum Vocal Fundamental Frequency (Hz)",
      type: "number",
      placeholder: "e.g., 157.302",
      step: "0.001",
    },
    {
      key: "mdvpFlo" as keyof DoctorFormData,
      question: "Minimum Vocal Fundamental Frequency (Hz)",
      type: "number",
      placeholder: "e.g., 116.676",
      step: "0.001",
    },
    {
      key: "mdvpJitter" as keyof DoctorFormData,
      question: "Jitter (%) - Frequency Variation",
      type: "number",
      placeholder: "e.g., 0.00784",
      step: "0.00001",
    },
    {
      key: "mdvpShimmer" as keyof DoctorFormData,
      question: "Shimmer (%) - Amplitude Variation",
      type: "number",
      placeholder: "e.g., 0.04374",
      step: "0.00001",
    },
    {
      key: "mdvpRap" as keyof DoctorFormData,
      question: "Relative Average Perturbation",
      type: "number",
      placeholder: "e.g., 0.00465",
      step: "0.00001",
    },
    {
      key: "mdvpPpq" as keyof DoctorFormData,
      question: "Five-point Period Perturbation Quotient",
      type: "number",
      placeholder: "e.g., 0.00696",
      step: "0.00001",
    },
    {
      key: "shimmerDdb" as keyof DoctorFormData,
      question: "Shimmer in dB",
      type: "number",
      placeholder: "e.g., 0.381",
      step: "0.001",
    },
    {
      key: "nhr" as keyof DoctorFormData,
      question: "Noise-to-Harmonics Ratio",
      type: "number",
      placeholder: "e.g., 0.02211",
      step: "0.00001",
    },
    {
      key: "hnr" as keyof DoctorFormData,
      question: "Harmonics-to-Noise Ratio",
      type: "number",
      placeholder: "e.g., 21.033",
      step: "0.001",
    },
    {
      key: "rpde" as keyof DoctorFormData,
      question: "Recurrence Period Density Entropy",
      type: "number",
      placeholder: "e.g., 0.414783",
      step: "0.000001",
    },
    {
      key: "dfa" as keyof DoctorFormData,
      question: "Detrended Fluctuation Analysis",
      type: "number",
      placeholder: "e.g., 0.815285",
      step: "0.000001",
    },
    {
      key: "spread1" as keyof DoctorFormData,
      question: "Nonlinear Measure - Spread1",
      type: "number",
      placeholder: "e.g., -4.813031",
      step: "0.000001",
    },
    {
      key: "spread2" as keyof DoctorFormData,
      question: "Nonlinear Measure - Spread2",
      type: "number",
      placeholder: "e.g., 0.266482",
      step: "0.000001",
    },
    {
      key: "d2" as keyof DoctorFormData,
      question: "Correlation Dimension",
      type: "number",
      placeholder: "e.g., 2.301442",
      step: "0.000001",
    },
    {
      key: "ppe" as keyof DoctorFormData,
      question: "Pitch Period Entropy",
      type: "number",
      placeholder: "e.g., 0.284654",
      step: "0.000001",
    },
  ]

  if (result) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-8">
        <Tabs defaultValue="prediction" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
            <TabsTrigger value="prediction" className="data-[state=active]:bg-purple-500/20">
              Prediction
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="data-[state=active]:bg-purple-500/20">
              Recommendations
            </TabsTrigger>
            <TabsTrigger value="disclaimer" className="data-[state=active]:bg-purple-500/20">
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
                You are at <strong>{result.risk}</strong> risk of Parkinson's disease
              </p>
            </div>

            {/* Detailed Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Confidence Level */}
              <div className="bg-slate-800/50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <Activity className="w-5 h-5 text-purple-400 mr-2" />
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
                        : "bg-gradient-to-r from-purple-500 to-indigo-400"
                    }`}
                  />
                </div>
                <p className="text-white font-semibold">{result.confidence}%</p>
              </div>

              {/* Risk Score */}
              <div className="bg-slate-800/50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <TrendingUp className="w-5 h-5 text-pink-400 mr-2" />
                  <h4 className="font-semibold text-white">Risk Score</h4>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3 mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${result.riskScore}%` }}
                    transition={{ duration: 1, delay: 0.7 }}
                    className="h-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-400"
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
                  Related Neurological Symptoms
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
                          className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-400"
                          style={{ width: `${subPred.confidence}%` }}
                        />
                      </div>
                      <p className="text-purple-400 text-sm font-semibold">{subPred.confidence}%</p>
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
                  <Brain className="w-5 h-5 text-purple-400 mr-2" />
                  Neurological Care Recommendations
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
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                      <span className="text-sm leading-relaxed">{rec}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
              
              {/* Medicine Suggestions Section - Only for authenticated users */}
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <Stethoscope className="w-5 h-5 text-purple-400 mr-2" />
                  <h4 className="font-semibold text-purple-300 text-lg">
                    Medicine & Treatment Suggestions
                  </h4>
                </div>
                <div className="space-y-4">
                  <div className="bg-slate-800/30 rounded-lg p-4">
                    <h5 className="font-medium text-white mb-2">Parkinson's Management</h5>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mr-3" />
                        Levodopa/Carbidopa - Gold standard for motor symptoms
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mr-3" />
                        Dopamine Agonists (Pramipexole, Ropinirole)
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mr-3" />
                        MAO-B Inhibitors (Selegiline, Rasagiline)
                      </li>
                      <li className="flex items-center">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mr-3" />
                        Coenzyme Q10 (300-1200mg) - Neuroprotective support
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                    <p className="text-xs text-amber-300 font-medium">
                      ⚠️ These are general suggestions only. Always consult your neurologist for proper Parkinson's treatment.
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
                  <li>Parkinson's disease requires comprehensive neurological examination for proper diagnosis</li>
                </ul>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mt-4">
                  <p className="text-red-400 font-semibold">
                    🏥 Always consult with a qualified neurologist or movement disorder specialist for proper medical evaluation, 
                    diagnosis, and treatment decisions. Early detection and intervention are crucial for Parkinson's management.
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
                tremor: "",
                rigidity: "",
                bradykinesia: "",
                balanceProblems: "",
                speechChanges: "",
                handwritingChanges: "",
                facialExpression: "",
                walkingDifficulty: "",
                age: "",
                familyHistory: "",
              })
              setDoctorFormData({
                mdvpFo: "",
                mdvpFhi: "",
                mdvpFlo: "",
                mdvpJitter: "",
                mdvpShimmer: "",
                mdvpRap: "",
                mdvpPpq: "",
                shimmerDdb: "",
                nhr: "",
                hnr: "",
                rpde: "",
                dfa: "",
                spread1: "",
                spread2: "",
                d2: "",
                ppe: "",
              })
            }}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200"
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
                ? "bg-purple-500/20 text-purple-400 shadow-lg" 
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
                ? "bg-purple-500/20 text-purple-400 shadow-lg" 
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
            ? "Answer simple questions about motor symptoms and movement changes" 
            : "Enter detailed vocal biomarker measurements and acoustic parameters"}
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
                        ? "bg-purple-500/20 border-purple-500/50 text-white"
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
                        patientFormData[q.key] === option.value ? "border-purple-500 bg-purple-500" : "border-slate-500"
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
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Brain className="w-5 h-5" />
                <span>Get Parkinson's Prediction</span>
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
                  className="w-full p-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
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
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Brain className="w-5 h-5" />
                <span>Get Parkinson's Prediction</span>
              </>
            )}
          </motion.button>
        </form>
      )}
    </div>
  )
}

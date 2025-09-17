"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Stethoscope, AlertCircle, CheckCircle, Pill, AlertTriangle, Activity, TrendingUp, ChevronDown, ChevronUp, User, UserCheck } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface FormData {
  symptoms: string[]
  duration: string
  severity: string
  age: string
  medicalHistory: string
}

interface PredictionResult {
  condition: string
  risk: "high" | "medium" | "low"
  confidence: number
  riskScore: number
  factors: FormData
  subPredictions: {
    condition: string
    confidence: number
  }[]
  recommendations: string[]
}

// Comprehensive symptom categories based on the dataset
const symptomCategories = {
  "Respiratory": [
    "shortness_of_breath", "cough", "wheezing", "breathing_difficulty", "chest_tightness",
    "snoring", "throat_irritation", "hoarseness", "voice_changes", "respiratory_problems"
  ],
  "Cardiovascular": [
    "sharp_chest_pain", "chest_pressure", "palpitations", "irregular_heartbeat", "rapid_heartbeat",
    "chest_tightness", "heart_murmur", "circulation_problems", "blood_pressure_issues"
  ],
  "Gastrointestinal": [
    "nausea", "vomiting", "diarrhea", "constipation", "abdominal_pain", "stomach_pain",
    "indigestion", "heartburn", "bloating", "loss_of_appetite", "difficulty_swallowing",
    "rectal_bleeding", "bowel_problems", "digestive_issues"
  ],
  "Neurological": [
    "headache", "dizziness", "confusion", "memory_problems", "seizures", "tremors",
    "numbness", "tingling", "weakness", "paralysis", "coordination_problems",
    "balance_problems", "fainting", "loss_of_consciousness"
  ],
  "Musculoskeletal": [
    "joint_pain", "muscle_pain", "back_pain", "neck_pain", "shoulder_pain",
    "arm_pain", "leg_pain", "hip_pain", "knee_pain", "ankle_pain",
    "stiffness", "muscle_weakness", "joint_swelling", "bone_pain"
  ],
  "Dermatological": [
    "skin_rash", "itching", "skin_lesions", "bruising", "skin_discoloration",
    "hair_loss", "nail_problems", "skin_growth", "wounds", "swelling"
  ],
  "Psychological": [
    "anxiety_and_nervousness", "depression", "depressive_or_psychotic_symptoms",
    "mood_changes", "behavioral_problems", "stress", "panic_attacks", "irritability"
  ],
  "ENT (Ear, Nose, Throat)": [
    "ear_pain", "hearing_problems", "nasal_congestion", "runny_nose", "nosebleeds",
    "sinus_problems", "throat_pain", "difficulty_speaking", "voice_hoarseness"
  ],
  "Ophthalmological": [
    "eye_problems", "vision_changes", "blurred_vision", "eye_pain", "eye_discharge",
    "sensitivity_to_light", "double_vision", "visual_disturbances"
  ],
  "Genitourinary": [
    "urinary_problems", "painful_urination", "frequent_urination", "blood_in_urine",
    "kidney_problems", "bladder_problems", "sexual_problems", "reproductive_issues"
  ],
  "General": [
    "fever", "fatigue", "weakness", "weight_loss", "weight_gain", "loss_of_appetite",
    "excessive_thirst", "excessive_sweating", "chills", "sleep_problems", "insomnia"
  ]
}

export function ImprovedCommonDiseasesPredictionForm() {
  const [formData, setFormData] = useState<FormData>({
    symptoms: [],
    duration: "",
    severity: "",
    age: "",
    medicalHistory: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call to FastAPI backend
      const response = await fetch("/api/predict/common-diseases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      // Simulate response for demo
      setTimeout(() => {
        const conditions = ["Common Cold", "Flu", "Allergies", "Migraine", "Gastritis"]
        const risks = ["low", "medium", "high"] as const

        const mockResult: PredictionResult = {
          condition: conditions[Math.floor(Math.random() * conditions.length)],
          risk: risks[Math.floor(Math.random() * risks.length)],
          confidence: Math.floor(Math.random() * 30) + 70,
          riskScore: Math.floor(Math.random() * 40) + 30,
          factors: formData,
          subPredictions: [
            { condition: "Viral Infection", confidence: 78 },
            { condition: "Bacterial Infection", confidence: 45 },
            { condition: "Allergic Reaction", confidence: 62 },
          ],
          recommendations: [
            "Get adequate rest and maintain proper hydration",
            "Monitor symptoms and track any changes",
            "Maintain good hygiene practices",
            "Consider over-the-counter remedies for symptom relief",
            "Seek medical attention if symptoms worsen or persist",
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

  const handleSymptomChange = (symptom: string, checked: boolean) => {
    if (checked) {
      setFormData({ ...formData, symptoms: [...formData.symptoms, symptom] })
    } else {
      setFormData({
        ...formData,
        symptoms: formData.symptoms.filter((s) => s !== symptom),
      })
    }
  }

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(category)) {
      newExpanded.delete(category)
    } else {
      newExpanded.add(category)
    }
    setExpandedCategories(newExpanded)
  }

  const formatSymptomName = (symptom: string) => {
    return symptom.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  const getSelectedSymptomsInCategory = (symptoms: string[]) => {
    return symptoms.filter(symptom => formData.symptoms.includes(symptom)).length
  }

  if (result) {
    const getRiskColor = (risk: string) => {
      switch (risk) {
        case "low": return "text-green-400"
        case "medium": return "text-yellow-400"
        case "high": return "text-red-400"
        default: return "text-slate-400"
      }
    }

    const getRiskBg = (risk: string) => {
      switch (risk) {
        case "low": return "bg-green-500/20"
        case "medium": return "bg-yellow-500/20"
        case "high": return "bg-red-500/20"
        default: return "bg-slate-500/20"
      }
    }

    const getRiskGradient = (risk: string) => {
      switch (risk) {
        case "low": return "from-green-500 to-emerald-400"
        case "medium": return "from-yellow-500 to-orange-400"
        case "high": return "from-red-500 to-pink-400"
        default: return "from-slate-500 to-slate-400"
      }
    }

    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-8">
        <Tabs defaultValue="prediction" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
            <TabsTrigger value="prediction" className="data-[state=active]:bg-emerald-500/20">
              Prediction
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="data-[state=active]:bg-emerald-500/20">
              Recommendations
            </TabsTrigger>
            <TabsTrigger value="medicine" className="data-[state=active]:bg-emerald-500/20">
              Medicine Suggestions
            </TabsTrigger>
            <TabsTrigger value="disclaimer" className="data-[state=active]:bg-emerald-500/20">
              Important Notice
            </TabsTrigger>
          </TabsList>

          <TabsContent value="prediction" className="space-y-6 mt-6">
            {/* Main Result */}
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${getRiskBg(result.risk)}`}>
                {result.risk === "low" ? (
                  <CheckCircle className={`w-10 h-10 ${getRiskColor(result.risk)}`} />
                ) : (
                  <AlertCircle className={`w-10 h-10 ${getRiskColor(result.risk)}`} />
                )}
              </div>

              <h3 className="text-3xl font-bold mb-2 text-white">Likely Condition: {result.condition}</h3>

              <p className={`text-xl font-semibold mb-6 ${getRiskColor(result.risk)}`}>
                {result.risk.charAt(0).toUpperCase() + result.risk.slice(1)} Risk Level
              </p>
            </div>

            {/* Detailed Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Confidence Level */}
              <div className="bg-slate-800/50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <Activity className="w-5 h-5 text-emerald-400 mr-2" />
                  <h4 className="font-semibold text-white">Confidence Level</h4>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3 mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${result.confidence}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={`h-3 rounded-full bg-gradient-to-r ${getRiskGradient(result.risk)}`}
                  />
                </div>
                <p className="text-white font-semibold">{result.confidence}%</p>
              </div>

              {/* Risk Score */}
              <div className="bg-slate-800/50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <TrendingUp className="w-5 h-5 text-purple-400 mr-2" />
                  <h4 className="font-semibold text-white">Severity Score</h4>
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
                  Related Conditions Analysis
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
                <Stethoscope className="w-5 h-5 text-emerald-400 mr-2" />
                General Health Recommendations
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
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span className="text-sm leading-relaxed">{rec}</span>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-blue-400 text-sm">
                  <strong>Note:</strong> {result.risk === "high"
                    ? "Please consult with a healthcare professional as soon as possible."
                    : result.risk === "medium"
                      ? "Consider monitoring your symptoms and consult a doctor if they worsen."
                      : "Your symptoms appear mild. Rest and basic care should help, but consult a doctor if symptoms persist."}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="medicine" className="space-y-6 mt-6">
            <div className="bg-slate-800/30 rounded-xl p-6">
              <h4 className="font-semibold text-white mb-4 flex items-center">
                <Pill className="w-5 h-5 text-blue-400 mr-2" />
                Medicine Suggestions and Recommendations
              </h4>
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-orange-400 mr-3" />
                  <h5 className="font-semibold text-orange-400 text-lg">Coming Soon</h5>
                </div>
                <div className="space-y-4 text-slate-300">
                  <p className="leading-relaxed">
                    This section will provide personalized medicine suggestions and pharmaceutical recommendations based on your symptoms and predicted condition.
                  </p>
                  <ul className="space-y-2 list-disc list-inside text-sm">
                    <li>Tailored medication options for your specific condition</li>
                    <li>Dosage recommendations and timing instructions</li>
                    <li>Potential side effects and drug interactions</li>
                    <li>Over-the-counter alternatives and natural remedies</li>
                    <li>Emergency medication protocols when applicable</li>
                  </ul>
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mt-4">
                    <p className="text-blue-400 text-sm font-semibold">
                      📋 This feature will be implemented in future updates to provide comprehensive pharmaceutical guidance.
                    </p>
                  </div>
                </div>
              </div>
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
                  <li>Symptom analysis requires comprehensive medical evaluation for accurate diagnosis</li>
                </ul>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mt-4">
                  <p className="text-red-400 font-semibold">
                    🏥 Always consult with a qualified healthcare provider for proper medical evaluation, 
                    diagnosis, and treatment decisions. If you experience severe symptoms, seek immediate medical attention.
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
              setFormData({
                symptoms: [],
                duration: "",
                severity: "",
                age: "",
                medicalHistory: "",
              })
            }}
            className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200"
          >
            Take Another Test
          </motion.button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header Information */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">Multi-System Health Assessment</h3>
        <p className="text-slate-300 text-sm">
          Select symptoms from the categories below. Each category contains related symptoms organized by body system.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Symptoms Selection by Categories */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <h4 className="text-lg font-semibold text-white mb-6">
            Which symptoms are you experiencing? (Select all that apply)
          </h4>
          
          <div className="space-y-4">
            {Object.entries(symptomCategories).map(([category, symptoms], categoryIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                className="bg-slate-800/30 rounded-xl border border-slate-700/50 overflow-hidden"
              >
                {/* Category Header */}
                <motion.button
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-700/30 transition-colors duration-200"
                  whileHover={{ backgroundColor: "rgba(51, 65, 85, 0.3)" }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                    <h5 className="text-white font-semibold">{category}</h5>
                    <span className="text-slate-400 text-sm">
                      ({symptoms.length} symptoms)
                    </span>
                    {getSelectedSymptomsInCategory(symptoms) > 0 && (
                      <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full text-xs font-medium">
                        {getSelectedSymptomsInCategory(symptoms)} selected
                      </span>
                    )}
                  </div>
                  <motion.div
                    animate={{ rotate: expandedCategories.has(category) ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  </motion.div>
                </motion.button>

                {/* Category Content */}
                <AnimatePresence>
                  {expandedCategories.has(category) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {symptoms.map((symptom, index) => (
                          <motion.label
                            key={symptom}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2, delay: index * 0.02 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                              formData.symptoms.includes(symptom)
                                ? "bg-emerald-500/20 border-emerald-500/50 text-white shadow-lg"
                                : "bg-slate-700/30 border-slate-600 text-slate-300 hover:bg-slate-600/40 hover:border-slate-500"
                            } border text-sm`}
                          >
                            <input
                              type="checkbox"
                              checked={formData.symptoms.includes(symptom)}
                              onChange={(e) => handleSymptomChange(symptom, e.target.checked)}
                              className="sr-only"
                            />
                            <div
                              className={`w-4 h-4 rounded border-2 mr-3 flex items-center justify-center transition-all duration-200 ${
                                formData.symptoms.includes(symptom) 
                                  ? "border-emerald-500 bg-emerald-500" 
                                  : "border-slate-500"
                              }`}
                            >
                              {formData.symptoms.includes(symptom) && (
                                <CheckCircle className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <span className="leading-tight">{formatSymptomName(symptom)}</span>
                          </motion.label>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Selected Symptoms Summary */}
          {formData.symptoms.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mt-6"
            >
              <h5 className="text-emerald-400 font-semibold mb-2">Selected Symptoms ({formData.symptoms.length}):</h5>
              <div className="flex flex-wrap gap-2">
                {formData.symptoms.map((symptom) => (
                  <span
                    key={symptom}
                    className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {formatSymptomName(symptom)}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Duration */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-4"
        >
          <h4 className="text-lg font-semibold text-white mb-4">How long have you had these symptoms?</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { value: "1-2days", label: "1-2 days" },
              { value: "3-7days", label: "3-7 days" },
              { value: "1-2weeks", label: "1-2 weeks" },
              { value: "over2weeks", label: "Over 2 weeks" },
            ].map((option) => (
              <motion.label
                key={option.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                  formData.duration === option.value
                    ? "bg-emerald-500/20 border-emerald-500/50 text-white shadow-lg"
                    : "bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700/50"
                } border`}
              >
                <input
                  type="radio"
                  name="duration"
                  value={option.value}
                  checked={formData.duration === option.value}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                    formData.duration === option.value ? "border-emerald-500 bg-emerald-500" : "border-slate-500"
                  }`}
                >
                  {formData.duration === option.value && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <span>{option.label}</span>
              </motion.label>
            ))}
          </div>
        </motion.div>

        {/* Severity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          <h4 className="text-lg font-semibold text-white mb-4">How would you rate the severity of your symptoms?</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { value: "mild", label: "Mild - Barely noticeable" },
              { value: "moderate", label: "Moderate - Uncomfortable" },
              { value: "severe", label: "Severe - Very bothersome" },
            ].map((option) => (
              <motion.label
                key={option.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                  formData.severity === option.value
                    ? "bg-emerald-500/20 border-emerald-500/50 text-white shadow-lg"
                    : "bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700/50"
                } border`}
              >
                <input
                  type="radio"
                  name="severity"
                  value={option.value}
                  checked={formData.severity === option.value}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                    formData.severity === option.value ? "border-emerald-500 bg-emerald-500" : "border-slate-500"
                  }`}
                >
                  {formData.severity === option.value && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <span className="text-sm">{option.label}</span>
              </motion.label>
            ))}
          </div>
        </motion.div>

        <motion.button
          type="submit"
          disabled={isLoading || formData.symptoms.length === 0 || !formData.duration || !formData.severity}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-2xl transition-all duration-200 flex items-center justify-center space-x-3 text-lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Analyzing Your Symptoms...</span>
            </>
          ) : (
            <>
              <Stethoscope className="w-6 h-6" />
              <span>Get Multi-Disease Prediction</span>
            </>
          )}
        </motion.button>
      </form>
    </div>
  )
}
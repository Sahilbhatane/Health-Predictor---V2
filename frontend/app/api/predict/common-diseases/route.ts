import { type NextRequest, NextResponse } from "next/server"

interface PredictionRequest {
  symptoms: string[]
  duration: string
  severity: string
  age?: string
  medicalHistory?: string
}

interface PredictionResult {
  condition: string
  risk: "high" | "medium" | "low"
  confidence: number
  riskScore: number
  factors: PredictionRequest
  subPredictions: {
    condition: string
    confidence: number
  }[]
  recommendations: string[]
}

export async function POST(request: NextRequest) {
  try {
    const body: PredictionRequest = await request.json()
    
    // Validate input
    if (!body.symptoms || !Array.isArray(body.symptoms) || body.symptoms.length === 0) {
      return NextResponse.json(
        { error: 'Symptoms array is required and cannot be empty' },
        { status: 400 }
      )
    }

    if (!body.duration || !body.severity) {
      return NextResponse.json(
        { error: 'Duration and severity are required' },
        { status: 400 }
      )
    }

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate sophisticated prediction
    const prediction = generateAdvancedPrediction(body)
    
    return NextResponse.json({
      success: true,
      ...prediction
    })

  } catch (error) {
    console.error('Common diseases prediction error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process prediction' },
      { status: 500 }
    )
  }
}

function generateAdvancedPrediction(body: PredictionRequest): PredictionResult {
  const symptomCount = body.symptoms.length
  const severityMap = { "mild": 1, "moderate": 2, "severe": 3 }
  const durationMap = { "1-2days": 1, "3-7days": 2, "1-2weeks": 3, "over2weeks": 4 }
  
  const severityScore = severityMap[body.severity as keyof typeof severityMap] || 1
  const durationScore = durationMap[body.duration as keyof typeof durationMap] || 1
  
  // Enhanced condition detection based on symptom categories
  const symptomCategories = {
    respiratory: body.symptoms.filter(s => 
      s.includes('shortness_of_breath') || s.includes('cough') || s.includes('wheezing') || 
      s.includes('breathing_difficulty') || s.includes('chest_tightness') || s.includes('snoring') ||
      s.includes('throat_irritation') || s.includes('hoarseness')
    ),
    cardiovascular: body.symptoms.filter(s => 
      s.includes('sharp_chest_pain') || s.includes('chest_pressure') || s.includes('palpitations') || 
      s.includes('irregular_heartbeat') || s.includes('rapid_heartbeat') || s.includes('heart_murmur')
    ),
    gastrointestinal: body.symptoms.filter(s => 
      s.includes('nausea') || s.includes('vomiting') || s.includes('diarrhea') || 
      s.includes('constipation') || s.includes('abdominal_pain') || s.includes('stomach_pain') ||
      s.includes('indigestion') || s.includes('heartburn') || s.includes('bloating')
    ),
    neurological: body.symptoms.filter(s => 
      s.includes('headache') || s.includes('dizziness') || s.includes('confusion') || 
      s.includes('memory_problems') || s.includes('seizures') || s.includes('tremors') ||
      s.includes('numbness') || s.includes('tingling') || s.includes('weakness')
    ),
    musculoskeletal: body.symptoms.filter(s => 
      s.includes('joint_pain') || s.includes('muscle_pain') || s.includes('back_pain') || 
      s.includes('neck_pain') || s.includes('stiffness') || s.includes('muscle_weakness')
    ),
    general: body.symptoms.filter(s => 
      s.includes('fever') || s.includes('fatigue') || s.includes('weakness') || 
      s.includes('weight_loss') || s.includes('excessive_thirst') || s.includes('chills')
    )
  }

  // Determine primary condition based on dominant symptom category
  let condition: string
  let confidence: number
  let primaryCategory = ""
  let maxSymptoms = 0

  Object.entries(symptomCategories).forEach(([category, symptoms]) => {
    if (symptoms.length > maxSymptoms) {
      maxSymptoms = symptoms.length
      primaryCategory = category
    }
  })

  // Assign condition based on primary category and symptom patterns
  switch (primaryCategory) {
    case "respiratory":
      if (symptomCategories.respiratory.some(s => s.includes('shortness_of_breath') || s.includes('wheezing'))) {
        condition = maxSymptoms >= 3 ? "Asthma/COPD Exacerbation" : "Upper Respiratory Infection"
        confidence = 85 + maxSymptoms * 3
      } else {
        condition = "Respiratory Tract Infection"
        confidence = 80 + maxSymptoms * 2
      }
      break
    
    case "cardiovascular":
      condition = maxSymptoms >= 3 ? "Cardiovascular Condition" : "Cardiac Arrhythmia"
      confidence = 82 + maxSymptoms * 4
      break
    
    case "gastrointestinal":
      if (symptomCategories.gastrointestinal.some(s => s.includes('diarrhea') || s.includes('vomiting'))) {
        condition = "Acute Gastroenteritis"
        confidence = 88 + maxSymptoms * 2
      } else {
        condition = "Gastrointestinal Disorder"
        confidence = 78 + maxSymptoms * 3
      }
      break
    
    case "neurological":
      if (symptomCategories.neurological.some(s => s.includes('headache'))) {
        condition = symptomCategories.general.some(s => s.includes('fever')) ? 
          "Neurological Infection" : "Primary Headache Disorder"
        confidence = 83 + maxSymptoms * 3
      } else {
        condition = "Neurological Condition"
        confidence = 75 + maxSymptoms * 4
      }
      break
    
    case "musculoskeletal":
      condition = maxSymptoms >= 3 ? "Systemic Inflammatory Condition" : "Musculoskeletal Disorder"
      confidence = 77 + maxSymptoms * 3
      break
    
    case "general":
      if (symptomCategories.general.some(s => s.includes('fever'))) {
        condition = "Viral Syndrome"
        confidence = 85 + maxSymptoms * 2
      } else {
        condition = "Chronic Fatigue Syndrome"
        confidence = 70 + maxSymptoms * 3
      }
      break
    
    default:
      condition = "Non-specific Systemic Condition"
      confidence = 60 + symptomCount * 2
  }

  // Calculate risk score based on multiple factors
  const riskScore = Math.min(
    ((maxSymptoms * 8) + (severityScore * 15) + (durationScore * 10) + (symptomCount * 2)), 
    100
  )
  
  // Determine risk level with more nuanced logic
  let risk: "high" | "medium" | "low"
  if (riskScore >= 75 || severityScore === 3 || maxSymptoms >= 5) {
    risk = "high"
  } else if (riskScore >= 45 || severityScore === 2 || maxSymptoms >= 3) {
    risk = "medium"
  } else {
    risk = "low"
  }
  
  // Adjust confidence based on risk factors
  confidence = Math.min(confidence + (severityScore * 2) + (durationScore * 1), 98)
  
  // Generate sub-predictions based on symptom overlap
  const subPredictions = [
    { 
      condition: "Viral Infection", 
      confidence: Math.max(confidence - 8, 35) 
    },
    { 
      condition: "Bacterial Infection", 
      confidence: Math.max(confidence - 15, 25) 
    },
    { 
      condition: "Autoimmune Disorder", 
      confidence: Math.max(confidence - 25, 20) 
    },
    { 
      condition: "Allergic Reaction", 
      confidence: Math.max(confidence - 12, 30) 
    }
  ].sort((a, b) => b.confidence - a.confidence)

  // Generate context-aware recommendations
  const recommendations = generateRecommendations(risk, condition, symptomCategories, severityScore)

  return {
    condition,
    risk,
    confidence,
    riskScore,
    factors: body,
    subPredictions,
    recommendations
  }
}

function generateRecommendations(
  risk: "high" | "medium" | "low", 
  condition: string, 
  symptomCategories: any,
  severityScore: number
): string[] {
  const baseRecommendations = [
    "Monitor your symptoms closely and track any changes over time",
    "Maintain adequate hydration by drinking plenty of fluids",
    "Get sufficient rest and avoid strenuous activities"
  ]

  const riskSpecificRecommendations = {
    high: [
      "Seek immediate medical attention or emergency care",
      "Do not delay treatment due to symptom severity",
      "Have someone available to assist you if needed",
      "Prepare a list of all current medications for healthcare providers"
    ],
    medium: [
      "Schedule an appointment with your healthcare provider within 24-48 hours",
      "Monitor for any worsening of symptoms",
      "Consider telehealth consultation if in-person visit is not immediately available",
      "Keep track of symptom progression and triggers"
    ],
    low: [
      "Continue monitoring symptoms for improvement over the next few days",
      "Consider basic home remedies appropriate for your symptoms",
      "Consult a healthcare provider if symptoms persist beyond a week",
      "Maintain normal activities as tolerated"
    ]
  }

  const conditionSpecificRecommendations: { [key: string]: string[] } = {
    "Respiratory": [
      "Use a humidifier or breathe steam to ease respiratory symptoms",
      "Avoid smoke, dust, and other respiratory irritants",
      "Consider over-the-counter expectorants if appropriate"
    ],
    "Cardiovascular": [
      "Avoid sudden exertion and monitor heart rate",
      "Keep a record of any chest pain or heart rhythm changes",
      "Ensure you have access to emergency services"
    ],
    "Gastrointestinal": [
      "Follow the BRAT diet (bananas, rice, applesauce, toast) if experiencing nausea",
      "Avoid dairy, fatty foods, and caffeine temporarily",
      "Use oral rehydration solutions if experiencing fluid loss"
    ],
    "Neurological": [
      "Rest in a quiet, dark environment for headache relief",
      "Avoid triggers such as bright lights, loud noises, or stress",
      "Keep a symptom diary to identify patterns"
    ]
  }

  let recommendations = [...baseRecommendations, ...riskSpecificRecommendations[risk]]

  // Add condition-specific recommendations
  Object.keys(conditionSpecificRecommendations).forEach(key => {
    if (condition.toLowerCase().includes(key.toLowerCase())) {
      recommendations.push(...conditionSpecificRecommendations[key])
    }
  })

  return recommendations.slice(0, 8) // Limit to 8 recommendations for readability
}

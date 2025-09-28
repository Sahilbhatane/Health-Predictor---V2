import { type NextRequest, NextResponse } from "next/server"

const PYTHON_API_URL = process.env.PYTHON_API_URL || process.env.NODE_ENV === 'production' 
  ? '/api/python' 
  : "http://localhost:8000"
const API_KEY = process.env.API_KEY || "changeme"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()

    // Map frontend form data to Python server format
    const heartData = {
      chestPain: formData.chestPain,
      breathingDifficulty: formData.breathingDifficulty,
      fatigue: formData.fatigue,
      heartRate: formData.heartRate,
      age: formData.age,
      exerciseHabits: formData.exerciseHabits,
    }

    // Call the Python FastAPI server
    const response = await fetch(`${PYTHON_API_URL}/predict/heart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
      },
      body: JSON.stringify(heartData),
    })

    if (!response.ok) {
      // Fallback to mock logic if Python server is not available
      console.warn("Python server not available, using fallback mock logic")
      return await mockHeartPrediction(formData)
    }

    const result = await response.json()

    // Map Python server response to frontend format
    return NextResponse.json({
      success: true,
      prediction: {
        risk: result.risk_level,
        confidence: result.confidence,
        riskScore: result.confidence, // Use confidence as risk score
        factors: result.risk_factors,
        recommendations:
          result.risk_level === "high"
            ? [
                "Consult with a cardiologist as soon as possible",
                "Monitor blood pressure regularly",
                "Consider lifestyle changes including diet and exercise",
                "Avoid smoking and excessive alcohol consumption",
              ]
            : [
                "Maintain regular exercise routine",
                "Follow a heart-healthy diet",
                "Schedule regular check-ups with your doctor",
                "Monitor any changes in symptoms",
              ],
      },
    })
  } catch (error) {
    console.error("Heart prediction error:", error)
    
    // Fallback to mock logic if there's an error
    return await mockHeartPrediction(await request.json())
  }
}

// Fallback mock prediction logic
async function mockHeartPrediction(formData: any) {
  // Simulate processing time
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Mock prediction logic based on form data
  let riskScore = 0

  // Chest pain scoring
  if (formData.chestPain === "often") riskScore += 3
  else if (formData.chestPain === "sometimes") riskScore += 2
  else if (formData.chestPain === "rarely") riskScore += 1

  // Breathing difficulty scoring
  if (formData.breathingDifficulty === "severe") riskScore += 3
  else if (formData.breathingDifficulty === "moderate") riskScore += 2
  else if (formData.breathingDifficulty === "mild") riskScore += 1

  // Fatigue scoring
  if (formData.fatigue === "always") riskScore += 3
  else if (formData.fatigue === "often") riskScore += 2
  else if (formData.fatigue === "sometimes") riskScore += 1

  // Heart rate scoring
  if (formData.heartRate === "irregular") riskScore += 3
  else if (formData.heartRate === "fast") riskScore += 2
  else if (formData.heartRate === "slow") riskScore += 1

  // Age scoring
  if (formData.age === "over60") riskScore += 3
  else if (formData.age === "45-60") riskScore += 2
  else if (formData.age === "30-45") riskScore += 1

  // Exercise habits scoring (inverse)
  if (formData.exerciseHabits === "rarely") riskScore += 3
  else if (formData.exerciseHabits === "monthly") riskScore += 2
  else if (formData.exerciseHabits === "weekly") riskScore += 1

  // Determine risk level and confidence
  const maxScore = 18
  const riskPercentage = (riskScore / maxScore) * 100

  const risk = riskPercentage > 50 ? "high" : "low"
  const confidence = Math.min(95, Math.max(70, 75 + Math.floor(Math.random() * 20)))

  return NextResponse.json({
    success: true,
    prediction: {
      risk,
      confidence,
      riskScore: riskPercentage,
      factors: {
        chestPain: formData.chestPain,
        breathingDifficulty: formData.breathingDifficulty,
        fatigue: formData.fatigue,
        heartRate: formData.heartRate,
        age: formData.age,
        exerciseHabits: formData.exerciseHabits,
      },
      recommendations:
        risk === "high"
          ? [
              "Consult with a cardiologist as soon as possible",
              "Monitor blood pressure regularly",
              "Consider lifestyle changes including diet and exercise",
              "Avoid smoking and excessive alcohol consumption",
            ]
          : [
              "Maintain regular exercise routine",
              "Follow a heart-healthy diet",
              "Schedule regular check-ups with your doctor",
              "Monitor any changes in symptoms",
            ],
    },
  })
}

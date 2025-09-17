import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()

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
  } catch (error) {
    console.error("Heart prediction error:", error)
    return NextResponse.json({ success: false, error: "Failed to process prediction" }, { status: 500 })
  }
}

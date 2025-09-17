import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1800))

    // Mock prediction logic based on form data
    let riskScore = 0

    // Hand shaking scoring
    if (formData.handShaking === "often") riskScore += 4
    else if (formData.handShaking === "sometimes") riskScore += 2
    else if (formData.handShaking === "rarely") riskScore += 1

    // Movement slowness scoring
    if (formData.movementSlowness === "significant") riskScore += 4
    else if (formData.movementSlowness === "moderate") riskScore += 3
    else if (formData.movementSlowness === "slight") riskScore += 1

    // Muscle stiffness scoring
    if (formData.muscleStiffness === "frequently") riskScore += 3
    else if (formData.muscleStiffness === "sometimes") riskScore += 2
    else if (formData.muscleStiffness === "morning") riskScore += 1

    // Balance problems scoring
    if (formData.balanceProblems === "severe") riskScore += 4
    else if (formData.balanceProblems === "frequent") riskScore += 3
    else if (formData.balanceProblems === "occasional") riskScore += 1

    // Voice changes scoring
    if (formData.voiceChanges === "monotone") riskScore += 3
    else if (formData.voiceChanges === "hoarse") riskScore += 2
    else if (formData.voiceChanges === "softer") riskScore += 1

    // Writing changes scoring
    if (formData.writingChanges === "difficult") riskScore += 3
    else if (formData.writingChanges === "shaky") riskScore += 2
    else if (formData.writingChanges === "smaller") riskScore += 1

    // Determine risk level and confidence
    const maxScore = 21
    const riskPercentage = (riskScore / maxScore) * 100

    const risk = riskPercentage > 45 ? "high" : "low"
    const confidence = Math.min(92, Math.max(75, 80 + Math.floor(Math.random() * 15)))

    return NextResponse.json({
      success: true,
      prediction: {
        risk,
        confidence,
        riskScore: riskPercentage,
        factors: {
          handShaking: formData.handShaking,
          movementSlowness: formData.movementSlowness,
          muscleStiffness: formData.muscleStiffness,
          balanceProblems: formData.balanceProblems,
          voiceChanges: formData.voiceChanges,
          writingChanges: formData.writingChanges,
        },
        recommendations:
          risk === "high"
            ? [
                "Consult with a neurologist for comprehensive evaluation",
                "Consider DaTscan or other specialized tests",
                "Start physical therapy to maintain mobility",
                "Join support groups for patients and families",
              ]
            : [
                "Monitor symptoms and track any changes",
                "Maintain regular physical activity",
                "Schedule routine neurological check-ups",
                "Practice balance and coordination exercises",
              ],
      },
    })
  } catch (error) {
    console.error("Parkinsons prediction error:", error)
    return NextResponse.json({ success: false, error: "Failed to process prediction" }, { status: 500 })
  }
}

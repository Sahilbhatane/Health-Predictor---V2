import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1600))

    // Mock prediction logic based on form data
    let riskScore = 0

    // Excessive thirst scoring
    if (formData.excessiveThirst === "often") riskScore += 3
    else if (formData.excessiveThirst === "sometimes") riskScore += 2
    else if (formData.excessiveThirst === "rarely") riskScore += 1

    // Frequent urination scoring
    if (formData.frequentUrination === "much") riskScore += 3
    else if (formData.frequentUrination === "moderate") riskScore += 2
    else if (formData.frequentUrination === "slight") riskScore += 1

    // Weight loss scoring
    if (formData.unexplainedWeightLoss === "significant") riskScore += 4
    else if (formData.unexplainedWeightLoss === "moderate") riskScore += 3
    else if (formData.unexplainedWeightLoss === "slight") riskScore += 1

    // Fatigue scoring
    if (formData.fatigue === "always") riskScore += 3
    else if (formData.fatigue === "often") riskScore += 2
    else if (formData.fatigue === "sometimes") riskScore += 1

    // Blurred vision scoring
    if (formData.blurredVision === "constantly") riskScore += 3
    else if (formData.blurredVision === "frequently") riskScore += 2
    else if (formData.blurredVision === "occasionally") riskScore += 1

    // Slow healing wounds scoring
    if (formData.slowHealingWounds === "very") riskScore += 3
    else if (formData.slowHealingWounds === "much") riskScore += 2
    else if (formData.slowHealingWounds === "slightly") riskScore += 1

    // Determine risk level and confidence
    const maxScore = 19
    const riskPercentage = (riskScore / maxScore) * 100

    const risk = riskPercentage > 50 ? "high" : "low"
    const confidence = Math.min(94, Math.max(78, 82 + Math.floor(Math.random() * 12)))

    return NextResponse.json({
      success: true,
      prediction: {
        risk,
        confidence,
        riskScore: riskPercentage,
        factors: {
          excessiveThirst: formData.excessiveThirst,
          frequentUrination: formData.frequentUrination,
          unexplainedWeightLoss: formData.unexplainedWeightLoss,
          fatigue: formData.fatigue,
          blurredVision: formData.blurredVision,
          slowHealingWounds: formData.slowHealingWounds,
        },
        recommendations:
          risk === "high"
            ? [
                "Schedule blood glucose testing immediately",
                "Consult with an endocrinologist",
                "Monitor blood sugar levels regularly",
                "Consider dietary changes and weight management",
              ]
            : [
                "Maintain a healthy diet and exercise routine",
                "Schedule regular blood sugar screenings",
                "Monitor weight and stay hydrated",
                "Be aware of diabetes risk factors",
              ],
      },
    })
  } catch (error) {
    console.error("Diabetes prediction error:", error)
    return NextResponse.json({ success: false, error: "Failed to process prediction" }, { status: 500 })
  }
}

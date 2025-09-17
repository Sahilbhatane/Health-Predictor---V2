"""
Input mapping functions for converting patient-friendly input to model features
"""
import numpy as np
from typing import List
from pydantic import BaseModel

# Request models
class DiabetesInput(BaseModel):
    excessiveThirst: str
    frequentUrination: str
    unexplainedWeightLoss: str
    fatigue: str
    blurredVision: str
    slowHealingWounds: str

class HeartInput(BaseModel):
    chestPain: str
    breathingDifficulty: str
    fatigue: str
    heartRate: str
    age: str
    exerciseHabits: str

class ParkinsonsInput(BaseModel):
    age: float
    speech_problems: str
    handwriting_changes: str
    tremors: str
    balance_issues: str
    stiffness: str

class CommonInput(BaseModel):
    symptoms: List[str]
    duration: str
    severity: str
    age: str
    medicalHistory: str

def map_diabetes_input(data: DiabetesInput) -> np.ndarray:
    """Map patient-friendly diabetes input to model features"""
    # Map qualitative responses to numerical values
    thirst_map = {"never": 0, "rarely": 1, "sometimes": 2, "often": 3}
    urination_map = {"no": 0, "slight": 1, "moderate": 2, "much": 3}
    weight_map = {"no": 0, "slight": 1, "moderate": 2, "significant": 3}
    fatigue_map = {"never": 0, "sometimes": 1, "often": 2, "always": 3}
    vision_map = {"never": 0, "occasionally": 1, "frequently": 2, "constantly": 3}
    healing_map = {"normal": 0, "slightly": 1, "much": 2, "very": 3}
    
    # Create feature array based on the diabetes dataset structure
    # Original features: Pregnancies,Glucose,BloodPressure,SkinThickness,Insulin,BMI,DiabetesPedigreeFunction,Age
    pregnancies = 1  # Default value
    glucose = 120 + (thirst_map.get(data.excessiveThirst, 0) * 20)
    blood_pressure = 80 + (fatigue_map.get(data.fatigue, 0) * 5)
    skin_thickness = 20
    insulin = 80 + (urination_map.get(data.frequentUrination, 0) * 30)
    bmi = 25 + (weight_map.get(data.unexplainedWeightLoss, 0) * 2)
    diabetes_pedigree = 0.5 + (vision_map.get(data.blurredVision, 0) * 0.2)
    age = 40 + (healing_map.get(data.slowHealingWounds, 0) * 5)
    
    features = np.array([[pregnancies, glucose, blood_pressure, skin_thickness, insulin, bmi, diabetes_pedigree, age]])
    return features

def map_heart_input(data: HeartInput) -> np.ndarray:
    """Map patient-friendly heart input to model features
    
    Based on dataset analysis:
    Healthy patients (target=0) vs Diseased patients (target=1):
    - age: 56.37 vs 53.23 (healthy patients are older!)
    - cp: 0.77 vs 1.13 (lower chest pain type)
    - thalach: 142.17 vs 154.81 (lower max heart rate)
    - exang: 0.40 vs 0.27 (more exercise angina)
    - oldpeak: 1.74 vs 1.26 (higher ST depression)
    """
    
    # Map qualitative responses to numerical values
    chest_pain_map = {"never": 0, "rarely": 1, "sometimes": 2, "often": 3}
    breathing_map = {"no": 0, "mild": 1, "moderate": 2, "severe": 3}
    fatigue_map = {"never": 0, "sometimes": 1, "often": 2, "always": 3}
    heart_rate_map = {"slow": 0, "normal": 1, "fast": 2, "very_fast": 3}
    age_map = {"under_30": 45, "30_50": 50, "50_70": 58, "over_70": 65}  # Adjusted to be more realistic
    exercise_map = {"daily": 0, "weekly": 1, "monthly": 2, "never": 3}
    
    # Heart dataset features: age,sex,cp,trestbps,chol,fbs,restecg,thalach,exang,oldpeak,slope,ca,thal
    age = age_map.get(data.age, 50)
    sex = 1  # Default male (1 = male, 0 = female)
    
    # Chest pain type (0=typical angina, 1=atypical, 2=non-anginal, 3=asymptomatic)
    # Higher values correlate with higher disease risk
    cp = chest_pain_map.get(data.chestPain, 0)
    
    # Resting blood pressure - healthy patients have slightly higher (133.92 vs 130.38)
    breathing_severity = breathing_map.get(data.breathingDifficulty, 0)
    if breathing_severity == 0:  # no breathing difficulty
        trestbps = 135  # healthy baseline
    else:
        trestbps = min(180, max(110, 130 + (breathing_severity * 8)))
    
    # Cholesterol - healthy patients have slightly higher (248.89 vs 243.45)
    fatigue_level = fatigue_map.get(data.fatigue, 0)
    if fatigue_level == 0:  # no fatigue
        chol = 250  # healthy baseline
    else:
        chol = min(450, max(180, 240 + (fatigue_level * 25)))
    
    # Fasting blood sugar > 120 mg/dl (0 = false, 1 = true)
    fbs = 1 if (fatigue_level >= 2 or breathing_severity >= 2) else 0
    
    # Resting electrocardiographic results (0=normal, 1=ST-T abnormality, 2=LV hypertrophy)
    restecg = min(2, max(0, (breathing_severity + fatigue_level) // 3))
    
    # Maximum heart rate achieved
    # KEY INSIGHT: Healthy patients have LOWER thalach (142.17 vs 154.81)
    heart_rate_level = heart_rate_map.get(data.heartRate, 1)
    exercise_level = exercise_map.get(data.exerciseHabits, 1)
    
    if heart_rate_level == 0:  # slow
        thalach = 135  # on the healthy side
    elif heart_rate_level == 1:  # normal
        if exercise_level <= 1:  # good exercise habits
            thalach = 140  # healthy baseline
        else:
            thalach = 150  # moderate
    elif heart_rate_level == 2:  # fast
        thalach = 160  # concerning
    else:  # very_fast
        thalach = 175  # high risk
    
    # Exercise induced angina (1 = yes, 0 = no)
    # INSIGHT: Healthy patients have MORE exercise angina (0.40 vs 0.27)
    # This seems counterintuitive but matches the data
    if exercise_level <= 1:  # good exercise habits
        exang = 1 if age > 55 else 0  # older healthy people more likely to have exercise angina
    else:  # poor exercise habits
        exang = 0  # less likely to experience exercise angina due to sedentary lifestyle
    
    # ST depression induced by exercise relative to rest
    # INSIGHT: Healthy patients have HIGHER oldpeak (1.74 vs 1.26)
    symptom_count = chest_pain_map.get(data.chestPain, 0) + breathing_map.get(data.breathingDifficulty, 0) + fatigue_map.get(data.fatigue, 0)
    
    if symptom_count == 0:  # no symptoms
        oldpeak = 1.8  # healthy baseline
    elif symptom_count <= 2:
        oldpeak = 1.5
    elif symptom_count <= 4:
        oldpeak = 1.2
    else:
        oldpeak = 0.8  # very symptomatic
    
    # Slope of peak exercise ST segment (0=upsloping, 1=flat, 2=downsloping)
    # Healthy mean=1.36, Diseased mean=1.44
    if symptom_count == 0:
        slope = 1  # healthy typical
    elif symptom_count <= 3:
        slope = 1
    else:
        slope = 2
    
    # Number of major vessels (0-4) colored by fluoroscopy
    # Healthy mean=0.90, Diseased mean=0.68
    if symptom_count == 0:
        ca = 1  # healthy typical
    elif symptom_count <= 2:
        ca = 1
    elif symptom_count <= 4:
        ca = 0
    else:
        ca = 0
    
    # Thalassemia: 0=normal, 1=fixed defect, 2=reversible defect, 3=not described
    # Healthy mode=3, Diseased mode=2
    if symptom_count == 0:
        thal = 3  # healthy typical
    elif symptom_count <= 2:
        thal = 2
    else:
        thal = 2
    
    features = np.array([[age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal]])
    return features

def map_parkinsons_input(data: ParkinsonsInput) -> np.ndarray:
    """Map patient-friendly Parkinson's input to model features"""
    # Map qualitative responses to numerical values
    speech_map = {"no": 0, "mild": 1, "moderate": 2, "severe": 3}
    handwriting_map = {"no": 0, "mild": 1, "moderate": 2, "severe": 3}
    tremor_map = {"no": 0, "mild": 1, "moderate": 2, "severe": 3}
    balance_map = {"no": 0, "mild": 1, "moderate": 2, "severe": 3}
    stiffness_map = {"no": 0, "mild": 1, "moderate": 2, "severe": 3}
    
    # Create a simplified feature vector based on typical Parkinson's measures
    base_features = [
        119.992, 157.302, 74.997, 0.00784, 0.00007, 0.0037, 0.00554, 0.01109,
        0.04374, 0.426, 0.02182, 0.0313, 0.02971, 0.06545, 0.02211, 21.033,
        0.414783, 0.815285, -4.813031, 0.266482, 2.301442, 0.284654
    ]
    
    # Adjust features based on symptoms
    symptom_multiplier = (
        speech_map.get(data.speech_problems, 0) +
        handwriting_map.get(data.handwriting_changes, 0) +
        tremor_map.get(data.tremors, 0) +
        balance_map.get(data.balance_issues, 0) +
        stiffness_map.get(data.stiffness, 0)
    ) / 5.0
    
    # Modify base features based on symptom severity
    adjusted_features = []
    for i, feature in enumerate(base_features):
        if i in [3, 4, 5, 6, 7, 8, 9, 13, 14]:  # Jitter and shimmer features
            adjusted_features.append(feature * (1 + symptom_multiplier))
        else:
            adjusted_features.append(feature)
    
    return np.array([adjusted_features])

def map_common_symptoms(data: CommonInput, symptom_columns) -> np.ndarray:
    """Map symptoms to the common diseases model format"""
    # Create a binary vector for symptoms
    symptom_vector = np.zeros(len(symptom_columns))
    
    # Map common symptom names to dataset columns
    symptom_mapping = {
        "fever": "fever",
        "headache": "headache",
        "cough": "cough",
        "sore throat": "sore_throat",
        "runny nose": "nasal_congestion",
        "body aches": "muscle_pain",
        "nausea": "nausea",
        "vomiting": "vomiting",
        "diarrhea": "diarrhea",
        "fatigue": "fatigue",
        "dizziness": "dizziness",
        "shortness of breath": "shortness_of_breath",
        "chest pain": "sharp_chest_pain",
        "abdominal pain": "sharp_abdominal_pain",
        "skin rash": "skin_rash",
        "joint pain": "joint_pain"
    }
    
    # Set 1 for reported symptoms
    for symptom in data.symptoms:
        symptom_key = symptom_mapping.get(symptom.lower())
        if symptom_key:
            # Handle both list and numpy array types for symptom_columns
            if hasattr(symptom_columns, 'tolist'):
                symptom_list = symptom_columns.tolist()
            else:
                symptom_list = list(symptom_columns)
            
            if symptom_key in symptom_list:
                idx = symptom_list.index(symptom_key)
                symptom_vector[idx] = 1
    
    return symptom_vector.reshape(1, -1)
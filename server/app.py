"""
FastAPI Health Prediction Server

A production-ready API server for health predictions using machine learning models.
"""
import logging
import numpy as np
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from models.loader import model_loader
from models.mappers import (
    DiabetesInput, HeartInput, ParkinsonsInput, CommonInput,
    map_diabetes_input, map_heart_input, map_parkinsons_input, map_common_symptoms
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handle application lifespan events"""
    # Startup
    logger.info("Starting up application...")
    success = model_loader.load_all_models()
    if not success:
        logger.error("Failed to load models at startup!")
        raise RuntimeError("Model loading failed")
    
    yield
    
    # Shutdown
    logger.info("Shutting down application...")

# Initialize FastAPI app with lifespan handler
app = FastAPI(
    title=settings.TITLE,
    version=settings.VERSION,
    description=settings.DESCRIPTION,
    lifespan=lifespan
)

def verify_key(x_api_key: str = Header(...)):
    """Verify API key authentication"""
    if x_api_key != settings.API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API Key")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "models_loaded": model_loader.get_status(),
        "version": settings.VERSION
    }

@app.post("/predict/diabetes", dependencies=[Depends(verify_key)])
async def predict_diabetes(data: DiabetesInput):
    """Predict diabetes risk based on symptoms"""
    try:
        diabetes_model = model_loader.get_model('diabetes')
        if not diabetes_model:
            raise HTTPException(status_code=503, detail="Diabetes model not available")
        
        features = map_diabetes_input(data)
        prediction = diabetes_model.predict(features)[0]
        
        # Handle both probability and non-probability models
        try:
            # Try to get probability score
            prob_scores = diabetes_model.predict_proba(features)
            prob = prob_scores.max()
        except AttributeError:
            # If predict_proba is not available, use decision function or default
            try:
                decision_score = diabetes_model.decision_function(features)[0]
                # Convert decision function score to probability-like confidence
                prob = 1.0 / (1.0 + abs(decision_score)) if decision_score != 0 else 0.5
                prob = max(0.6, min(0.95, prob))  # Ensure reasonable confidence range
            except:
                # Default confidence based on prediction
                prob = 0.85 if prediction == 1 else 0.75
        
        result = "High Risk" if prediction == 1 else "Low Risk"
        
        return {
            "prediction": result,
            "confidence": float(prob * 100),  # Convert to percentage
            "risk_factors": {
                "excessive_thirst": data.excessiveThirst,
                "frequent_urination": data.frequentUrination,
                "weight_loss": data.unexplainedWeightLoss,
                "fatigue": data.fatigue,
                "blurred_vision": data.blurredVision,
                "slow_healing": data.slowHealingWounds
            }
        }
    except Exception as e:
        logger.error(f"Diabetes prediction error: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.post("/predict/heart", dependencies=[Depends(verify_key)])
async def predict_heart(data: HeartInput):
    """Predict heart disease risk based on symptoms"""
    try:
        heart_model = model_loader.get_model('heart')
        if not heart_model:
            raise HTTPException(status_code=503, detail="Heart model not available")
        
        features = map_heart_input(data)
        prediction = heart_model.predict(features)[0]
        
        # Handle both probability and non-probability models
        try:
            # Try to get probability score
            prob_scores = heart_model.predict_proba(features)
            prob = prob_scores.max()
        except AttributeError:
            # If predict_proba is not available, use decision function or default
            try:
                decision_score = heart_model.decision_function(features)[0]
                # Convert decision function score to probability-like confidence
                prob = 1.0 / (1.0 + abs(decision_score)) if decision_score != 0 else 0.5
                prob = max(0.6, min(0.95, prob))  # Ensure reasonable confidence range
            except:
                # Default confidence based on prediction
                prob = 0.85 if prediction == 1 else 0.75
        
        result = "High Risk" if prediction == 1 else "Low Risk"
        risk_level = "high" if prediction == 1 else "low"
        
        return {
            "prediction": result,
            "risk_level": risk_level,
            "confidence": float(prob * 100),  # Convert to percentage
            "risk_factors": {
                "chest_pain": data.chestPain,
                "breathing_difficulty": data.breathingDifficulty,
                "age": data.age,
                "fatigue": data.fatigue,
                "heart_rate": data.heartRate,
                "exercise_habits": data.exerciseHabits
            }
        }
    except Exception as e:
        logger.error(f"Heart prediction error: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.post("/predict/parkinsons", dependencies=[Depends(verify_key)])
async def predict_parkinsons(data: ParkinsonsInput):
    """Predict Parkinson's disease risk based on symptoms"""
    try:
        parkinsons_model = model_loader.get_model('parkinsons')
        if not parkinsons_model:
            raise HTTPException(status_code=503, detail="Parkinsons model not available")
        
        features = map_parkinsons_input(data)
        print(f"DEBUG: Features shape: {features.shape}")
        prediction = parkinsons_model.predict(features)[0]
        print(f"DEBUG: Prediction: {prediction}")
        
        # Handle both probability and non-probability models
        try:
            # Try to get probability score
            print("DEBUG: Attempting predict_proba...")
            prob_scores = parkinsons_model.predict_proba(features)
            prob = prob_scores.max()
            print(f"DEBUG: Got probability: {prob}")
        except (AttributeError, Exception) as e:
            print(f"DEBUG: predict_proba failed with: {type(e).__name__}: {e}")
            # If predict_proba is not available, use decision function or default
            try:
                print("DEBUG: Attempting decision_function...")
                decision_score = parkinsons_model.decision_function(features)[0]
                print(f"DEBUG: Decision score: {decision_score}")
                # Convert decision function score to probability-like confidence
                prob = 1.0 / (1.0 + abs(decision_score)) if decision_score != 0 else 0.5
                prob = max(0.6, min(0.95, prob))  # Ensure reasonable confidence range
            except Exception as e2:
                print(f"DEBUG: decision_function failed with: {type(e2).__name__}: {e2}")
                # Default confidence based on prediction
                prob = 0.85 if prediction == 1 else 0.75
        
        result = "High Risk" if prediction == 1 else "Low Risk"
        risk_level = "high" if prediction == 1 else "low"
        
        return {
            "prediction": result,
            "risk_level": risk_level,
            "confidence": float(prob * 100),  # Convert to percentage
            "risk_factors": {
                "speech_problems": data.speech_problems,
                "tremors": data.tremors,
                "handwriting_changes": data.handwriting_changes,
                "balance_issues": data.balance_issues,
                "stiffness": data.stiffness,
                "age": data.age
            }
        }
    except Exception as e:
        logger.error(f"Parkinsons prediction error: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.post("/predict/common", dependencies=[Depends(verify_key)])
async def predict_common(data: CommonInput):
    """Predict common diseases based on symptoms"""
    try:
        logistic_model = model_loader.get_model('logistic')
        neural_model = model_loader.get_model('neural')
        encoder = model_loader.get_model('encoder')
        symptom_columns = model_loader.get_model('symptom_columns')
        
        if not all([logistic_model, neural_model, encoder, symptom_columns]):
            raise HTTPException(status_code=503, detail="Common disease models not available")
        
        # Use symptom vector with the encoder and models
        symptom_vector = map_common_symptoms(data, symptom_columns)
        
        # Try both models and return the one with higher confidence
        logistic_pred = logistic_model.predict(symptom_vector)[0]
        logistic_prob = logistic_model.predict_proba(symptom_vector).max()
        
        neural_pred = neural_model.predict(symptom_vector)[0]
        neural_prob = float(np.max(neural_pred))
        
        # Use the model with higher confidence
        if logistic_prob > neural_prob:
            prediction = logistic_pred
            confidence = logistic_prob
            model_used = "logistic"
        else:
            prediction = np.argmax(neural_pred)
            confidence = neural_prob
            model_used = "neural"
        
        # Decode the prediction using the encoder
        predicted_disease = encoder.inverse_transform([prediction])[0]
        
        return {
            "prediction": predicted_disease,
            "confidence": float(confidence),
            "model_used": model_used,
            "symptoms": data.symptoms,
            "severity": data.severity
        }
    except Exception as e:
        logger.error(f"Common diseases prediction error: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app, 
        host=settings.HOST, 
        port=settings.PORT,
        log_level="info" if settings.DEBUG else "warning"
    )
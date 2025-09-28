"""
Configuration settings for the FastAPI server
"""
import os
from typing import List

class Settings:
    """Application settings"""
    
    # API Configuration
    API_KEY: str = os.getenv("MODEL_API_KEY", "changeme")
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    
    # CORS Settings
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "https://health-predictor-v2.vercel.app/"
    ]
    
    # Model Paths
    DIABETES_MODEL_PATH: str = "Datasets/sav files/diabetes_model.sav"
    HEART_MODEL_PATH: str = "Datasets/sav files/heart_disease_model.sav"
    PARKINSONS_MODEL_PATH: str = "Datasets/sav files/parkinsons_model.sav"
    LOGISTIC_MODEL_PATH: str = "Datasets/pkl/logistic_regression_model.pkl"
    NEURAL_MODEL_PATH: str = "Datasets/pkl/neural_network_model.pkl"
    ENCODER_PATH: str = "Datasets/pkl/encoder.pkl"
    SYMPTOM_COLUMNS_PATH: str = "Datasets/pkl/symptom_columns.pkl"
    
    # Server Settings
    TITLE: str = "Health Predictor API"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "Machine Learning powered health prediction API"

# Global settings instance
settings = Settings()
"""
Model loading utilities for the health prediction API
"""
import joblib
import logging
import os
from pathlib import Path
from typing import Any, Dict, Optional

logger = logging.getLogger(__name__)

class ModelLoader:
    """Utility class for loading and managing ML models"""
    
    def __init__(self):
        self.models: Dict[str, Any] = {}
        self.loaded = False
        
        # Get the project root directory (parent of server directory)
        self.server_dir = Path(__file__).parent.parent
        self.project_root = self.server_dir.parent
        
    def _get_model_path(self, relative_path: str) -> Path:
        """Get absolute path for model files"""
        return self.project_root / relative_path
    
    def load_all_models(self) -> bool:
        """Load all required models"""
        try:
            logger.info("Loading ML models...")
            logger.info(f"Project root: {self.project_root}")
            
            # Load models with mmap mode for large files
            diabetes_path = self._get_model_path("Datasets/sav files/diabetes_model.sav")
            heart_path = self._get_model_path("Datasets/sav files/heart_disease_model.sav")
            parkinsons_path = self._get_model_path("Datasets/sav files/parkinsons_model.sav")
            
            logger.info(f"Loading diabetes model from: {diabetes_path}")
            self.models['diabetes'] = joblib.load(str(diabetes_path), mmap_mode="r")
            
            logger.info(f"Loading heart model from: {heart_path}")
            self.models['heart'] = joblib.load(str(heart_path), mmap_mode="r")
            
            logger.info(f"Loading parkinsons model from: {parkinsons_path}")
            self.models['parkinsons'] = joblib.load(str(parkinsons_path), mmap_mode="r")
            
            # Load other models
            logistic_path = self._get_model_path("Datasets/pkl/logistic_regression_model.pkl")
            neural_path = self._get_model_path("Datasets/pkl/neural_network_model.pkl")
            encoder_path = self._get_model_path("Datasets/pkl/encoder.pkl")
            symptom_path = self._get_model_path("Datasets/pkl/symptom_columns.pkl")
            
            logger.info(f"Loading logistic model from: {logistic_path}")
            self.models['logistic'] = joblib.load(str(logistic_path))
            
            logger.info(f"Loading neural model from: {neural_path}")
            self.models['neural'] = joblib.load(str(neural_path))
            
            logger.info(f"Loading encoder from: {encoder_path}")
            self.models['encoder'] = joblib.load(str(encoder_path))
            
            logger.info(f"Loading symptom columns from: {symptom_path}")
            self.models['symptom_columns'] = joblib.load(str(symptom_path))
            
            self.loaded = True
            logger.info("All models loaded successfully!")
            return True
            
        except Exception as e:
            logger.error(f"Error loading models: {e}")
            self.loaded = False
            return False
    
    def get_model(self, model_name: str) -> Optional[Any]:
        """Get a specific model by name"""
        return self.models.get(model_name)
    
    def is_loaded(self) -> bool:
        """Check if all models are loaded"""
        return self.loaded
    
    def get_status(self) -> Dict[str, bool]:
        """Get loading status of all models"""
        return {
            "diabetes": "diabetes" in self.models,
            "heart": "heart" in self.models,
            "parkinsons": "parkinsons" in self.models,
            "logistic": "logistic" in self.models,
            "neural_net": "neural" in self.models,
            "encoder": "encoder" in self.models,
            "symptoms": "symptom_columns" in self.models
        }

# Global model loader instance
model_loader = ModelLoader()
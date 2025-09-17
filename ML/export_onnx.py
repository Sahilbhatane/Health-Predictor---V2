from __future__ import annotations
import argparse
import os
import pickle
import joblib
from pathlib import Path
from typing import Any
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType
from datetime import datetime, timezone
import json
import numpy as np

# Map logical names to actual pickle/sav paths
BASE_DIR = Path(__file__).resolve().parent.parent
DATASETS_DIR = BASE_DIR / 'Datasets'
SAV_DIR = DATASETS_DIR / 'sav files'
PKL_DIR = DATASETS_DIR / 'pkl'

MODEL_PATHS = {
    'heart': SAV_DIR / 'heart_disease_model.sav',
    'diabetes': SAV_DIR / 'diabetes_model.sav',
    'parkinsons': SAV_DIR / 'parkinsons_model.sav',
    'common_logistic': PKL_DIR / 'logistic_regression_model.pkl',
    'common_neural': PKL_DIR / 'neural_network_model.pkl',
}

# Additional paths for encoders and metadata
ENCODER_PATH = PKL_DIR / 'encoder.pkl'
SYMPTOM_COLUMNS_PATH = PKL_DIR / 'symptom_columns.pkl'


def load_pickle(path: Path) -> Any:
    """Load a pickle/joblib file with error handling."""
    if not path.is_file():
        raise FileNotFoundError(f"Model file not found: {path}")
    try:
        # Try joblib first (used in Common.ipynb)
        return joblib.load(path)
    except:
        # Fall back to pickle (used in other notebooks)
        with open(path, 'rb') as f:
            return pickle.load(f)


def get_model_features(model_key: str, model) -> int:
    """Get the number of features for a model based on its type and key."""
    # Define expected features based on the datasets and notebooks
    FEATURE_COUNTS = {
        'diabetes': 8,  # Pregnancies,Glucose,BloodPressure,SkinThickness,Insulin,BMI,DiabetesPedigreeFunction,Age
        'heart': 13,    # age,sex,cp,trestbps,chol,fbs,restecg,thalach,exang,oldpeak,slope,ca,thal
        'parkinsons': 22,  # All features except 'name' and 'status'
        'common_logistic': None,  # Will be determined from symptom_columns.pkl
        'common_neural': None,    # Will be determined from symptom_columns.pkl
    }
    
    # For common models, load symptom columns to get feature count
    if model_key.startswith('common'):
        try:
            if SYMPTOM_COLUMNS_PATH.exists():
                symptom_columns = load_pickle(SYMPTOM_COLUMNS_PATH)
                return len(symptom_columns)
        except:
            pass
    
    # Try to get from model attribute
    if hasattr(model, 'n_features_in_'):
        return getattr(model, 'n_features_in_')
    
    # Fall back to predefined counts
    if model_key in FEATURE_COUNTS and FEATURE_COUNTS[model_key] is not None:
        return FEATURE_COUNTS[model_key]
    
    raise ValueError(f'Cannot determine feature count for model "{model_key}"')


def can_convert_to_onnx(model, model_key: str) -> bool:
    """Check if a model can be converted to ONNX."""
    # TensorFlow/Keras models cannot be converted with skl2onnx
    if hasattr(model, 'predict') and str(type(model)).find('tensorflow') != -1:
        return False
    if hasattr(model, 'predict') and str(type(model)).find('keras') != -1:
        return False
    
    # sklearn models should be convertible
    return True


def export_model(model_key: str, out_path: Path):
    """Export a single model to ONNX format."""
    model_path = MODEL_PATHS.get(model_key)
    if not model_path:
        raise ValueError(f"Unknown model key '{model_key}'. Choices: {sorted(MODEL_PATHS)}")
    
    model = load_pickle(model_path)
    
    # Check if model can be converted to ONNX
    if not can_convert_to_onnx(model, model_key):
        print(f"[export][SKIP] Model '{model_key}' cannot be converted to ONNX (TensorFlow/Keras model)")
        return False
    
    try:
        n_features = get_model_features(model_key, model)
        print(f"[export] Converting '{model_key}' model with {n_features} features -> ONNX")
        
        initial_type = [('input', FloatTensorType([None, n_features]))]
        onnx_model = convert_sklearn(model, initial_types=initial_type)
        
        out_path.parent.mkdir(parents=True, exist_ok=True)
        with open(out_path, 'wb') as f:
            f.write(onnx_model.SerializeToString())
        
        print(f"[export] Successfully wrote ONNX model to {out_path}")
        return True
        
    except Exception as e:
        print(f"[export][ERROR] Failed to convert '{model_key}': {e}")
        return False


def export_multiple(model_keys: list[str], out_dir: Path, write_manifest: bool):
    """Export multiple models to ONNX format."""
    out_dir.mkdir(parents=True, exist_ok=True)
    manifest_models = []
    successful_exports = 0
    
    for key in model_keys:
        target = out_dir / f"{key}.onnx"
        try:
            model_path = MODEL_PATHS.get(key)
            if not model_path:
                print(f"[export][WARN] Unknown model key '{key}', skipping")
                continue
                
            model = load_pickle(model_path) if model_path else None
            
            # Check if model can be converted
            if not can_convert_to_onnx(model, key):
                manifest_models.append({
                    'key': key,
                    'file': None,
                    'n_features': None,
                    'status': 'skipped',
                    'reason': 'TensorFlow/Keras model - not supported by skl2onnx'
                })
                continue
            
            success = export_model(key, target)
            if success:
                n_features = get_model_features(key, model)
                manifest_models.append({
                    'key': key,
                    'file': target.name,
                    'n_features': int(n_features) if isinstance(n_features, (int, float)) else None,
                    'status': 'success'
                })
                successful_exports += 1
            else:
                manifest_models.append({
                    'key': key,
                    'file': None,
                    'n_features': None,
                    'status': 'failed',
                    'reason': 'Conversion error'
                })
                
        except Exception as e:
            print(f"[export][WARN] Failed to export {key}: {e}")
            manifest_models.append({
                'key': key,
                'file': None,
                'n_features': None,
                'status': 'failed',
                'reason': str(e)
            })
    
    if write_manifest:
        # Also include metadata about encoders and auxiliary files
        metadata = {}
        if ENCODER_PATH.exists():
            metadata['encoder'] = str(ENCODER_PATH.relative_to(BASE_DIR))
        if SYMPTOM_COLUMNS_PATH.exists():
            metadata['symptom_columns'] = str(SYMPTOM_COLUMNS_PATH.relative_to(BASE_DIR))
            
        manifest = {
            'generated_at': datetime.now(timezone.utc).isoformat(),
            'total_models': len(model_keys),
            'successful_exports': successful_exports,
            'metadata': metadata,
            'models': manifest_models
        }
        with open(out_dir / 'models_manifest.json', 'w', encoding='utf-8') as f:
            json.dump(manifest, f, indent=2)
        print(f"[export] Wrote manifest with {successful_exports}/{len(model_keys)} successful exports -> {out_dir / 'models_manifest.json'}")


def export_auxiliary_files(out_dir: Path):
    """Export auxiliary files like encoders and symptom columns."""
    out_dir.mkdir(parents=True, exist_ok=True)
    
    aux_files = {
        'encoder.pkl': ENCODER_PATH,
        'symptom_columns.pkl': SYMPTOM_COLUMNS_PATH
    }
    
    for filename, source_path in aux_files.items():
        if source_path.exists():
            target_path = out_dir / filename
            import shutil
            shutil.copy2(source_path, target_path)
            print(f"[export] Copied auxiliary file: {filename}")
        else:
            print(f"[export][WARN] Auxiliary file not found: {filename}")


def list_available_models():
    """List all available models and their status."""
    print("Available models:")
    for key, path in MODEL_PATHS.items():
        status = "✓" if path.exists() else "✗"
        print(f"  {status} {key:15} -> {path}")
    
    print("\nAuxiliary files:")
    aux_files = {
        'encoder.pkl': ENCODER_PATH,
        'symptom_columns.pkl': SYMPTOM_COLUMNS_PATH
    }
    for name, path in aux_files.items():
        status = "✓" if path.exists() else "✗"
        print(f"  {status} {name:15} -> {path}")


def main():
    parser = argparse.ArgumentParser(description='Export sklearn models to ONNX (single or multiple)')
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument('--model', help='Single model key')
    group.add_argument('--models', nargs='+', help='List of model keys')
    group.add_argument('--all', action='store_true', help='Export all known model keys')
    group.add_argument('--list', action='store_true', help='List all available models and their status')
    parser.add_argument('--out', help='Single model ONNX output path (when using --model)')
    parser.add_argument('--out-dir', default='web/models', help='Output directory for multi/all export')
    parser.add_argument('--manifest', action='store_true', help='Write models_manifest.json (multi/all modes)')
    parser.add_argument('--include-aux', action='store_true', help='Include auxiliary files (encoders, etc.) in output directory')
    args = parser.parse_args()

    if args.list:
        list_available_models()
        return

    if args.model:
        out_path = Path(args.out or f'web/models/{args.model}.onnx')
        export_model(args.model, out_path)
        return

    out_dir = Path(args.out_dir)
    
    if args.models:
        export_multiple(args.models, out_dir, args.manifest)
    elif args.all:
        export_multiple(sorted(MODEL_PATHS.keys()), out_dir, args.manifest)
    
    if args.include_aux and (args.models or args.all):
        export_auxiliary_files(out_dir)


if __name__ == '__main__':
    main()

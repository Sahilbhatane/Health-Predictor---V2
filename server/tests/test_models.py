#!/usr/bin/env python3
"""
Test script to verify that all ML models can be loaded successfully
"""

import sys
import os

# Add the parent directory to the path so we can import from the server
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.loader import model_loader

def test_model_loading():
    """Test loading all required models"""
    
    print("Testing model loading...")
    
    # Change to the correct directory (parent of server)
    script_dir = os.path.dirname(os.path.abspath(__file__))
    server_dir = os.path.dirname(script_dir)
    parent_dir = os.path.dirname(server_dir)
    os.chdir(parent_dir)
    
    print(f"Working directory: {os.getcwd()}")
    
    # Use the model loader to test loading
    success = model_loader.load_all_models()
    
    print("\n" + "="*50)
    print("SUMMARY:")
    print("="*50)
    
    if success:
        print("SUCCESS: All models loaded successfully! The FastAPI server should work properly.")
        
        # Print model status
        status = model_loader.get_status()
        for model_name, loaded in status.items():
            status_emoji = "[OK]" if loaded else "[FAIL]"
            print(f"{status_emoji} {model_name}")
        
        return True
    else:
        print("WARNING: Some models failed to load. Please check the errors above.")
        return False

if __name__ == "__main__":
    success = test_model_loading()
    sys.exit(0 if success else 1)
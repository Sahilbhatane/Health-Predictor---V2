#!/usr/bin/env python3
"""
Quick test script to verify the FastAPI server endpoints
"""

import requests
import json
import time

BASE_URL = "http://localhost:8000"
API_KEY = "changeme"

def test_health_endpoint():
    """Test the health check endpoint"""
    print("Testing health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            data = response.json()
            print("✅ Health check passed")
            print(f"   Status: {data['status']}")
            print("   Models loaded:")
            for model, loaded in data['models_loaded'].items():
                status = "✅" if loaded else "❌"
                print(f"     {status} {model}")
            return True
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to server. Make sure it's running on http://localhost:8000")
        return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False

def test_diabetes_endpoint():
    """Test the diabetes prediction endpoint"""
    print("\nTesting diabetes prediction...")
    
    headers = {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY
    }
    
    data = {
        "excessiveThirst": "often",
        "frequentUrination": "much",
        "unexplainedWeightLoss": "moderate",
        "fatigue": "often",
        "blurredVision": "frequently",
        "slowHealingWounds": "much"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/predict/diabetes", headers=headers, json=data)
        if response.status_code == 200:
            result = response.json()
            print("✅ Diabetes prediction successful")
            print(f"   Prediction: {result['prediction']}")
            print(f"   Confidence: {result['confidence']:.2f}")
            return True
        else:
            print(f"❌ Diabetes prediction failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Diabetes prediction error: {e}")
        return False

def test_heart_endpoint():
    """Test the heart disease prediction endpoint"""
    print("\nTesting heart disease prediction...")
    
    headers = {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY
    }
    
    data = {
        "chestPain": "often",
        "breathingDifficulty": "moderate",
        "fatigue": "often",
        "heartRate": "fast",
        "age": "50_70",
        "exerciseHabits": "never"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/predict/heart", headers=headers, json=data)
        if response.status_code == 200:
            result = response.json()
            print("✅ Heart prediction successful")
            print(f"   Prediction: {result['prediction']}")
            print(f"   Confidence: {result['confidence']:.2f}")
            return True
        else:
            print(f"❌ Heart prediction failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Heart prediction error: {e}")
        return False

def test_common_endpoint():
    """Test the common diseases prediction endpoint"""
    print("\nTesting common diseases prediction...")
    
    headers = {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY
    }
    
    data = {
        "symptoms": ["fever", "headache", "cough", "fatigue"],
        "duration": "3-7 days",
        "severity": "moderate",
        "age": "30_50",
        "medicalHistory": "none"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/predict/common", headers=headers, json=data)
        if response.status_code == 200:
            result = response.json()
            print("✅ Common diseases prediction successful")
            print(f"   Prediction: {result['prediction']}")
            print(f"   Confidence: {result['confidence']:.2f}")
            print(f"   Model used: {result['model_used']}")
            return True
        else:
            print(f"❌ Common diseases prediction failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Common diseases prediction error: {e}")
        return False

def main():
    print("=== FastAPI Server Test Suite ===\n")
    
    # Test health endpoint first
    if not test_health_endpoint():
        print("\n❌ Server is not healthy. Please check the server logs.")
        return
    
    # Test prediction endpoints
    results = []
    results.append(test_diabetes_endpoint())
    results.append(test_heart_endpoint())
    results.append(test_common_endpoint())
    
    # Summary
    print("\n" + "="*50)
    print("TEST SUMMARY")
    print("="*50)
    
    success_count = sum(results) + 1  # +1 for health check
    total_count = len(results) + 1
    
    print(f"Passed: {success_count}/{total_count} tests")
    
    if success_count == total_count:
        print("🎉 All tests passed! The API is working correctly.")
    else:
        print("⚠️  Some tests failed. Please check the errors above.")

if __name__ == "__main__":
    main()
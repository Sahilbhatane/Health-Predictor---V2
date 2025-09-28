"""
Vercel-compatible FastAPI Health Prediction Server
"""
import os
import sys
from pathlib import Path

# Add the server directory to the path
current_dir = Path(__file__).parent
server_dir = current_dir.parent / "server"
sys.path.insert(0, str(server_dir))
sys.path.insert(0, str(current_dir.parent))

from mangum import Mangum

# Import the FastAPI app
try:
    from server.app import app
except ImportError:
    try:
        from app import app
    except ImportError:
        # Create a basic FastAPI app as fallback
        from fastapi import FastAPI
        app = FastAPI(title="Health Predictor API")
        
        @app.get("/")
        def read_root():
            return {"message": "Health Predictor API is running"}
        
        @app.get("/health")
        def health_check():
            return {"status": "healthy", "message": "API is working"}

# Vercel handler
handler = Mangum(app, lifespan="off")
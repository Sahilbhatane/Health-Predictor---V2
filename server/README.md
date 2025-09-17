# FastAPI Health Prediction Server

A production-ready FastAPI server for health prediction using machine learning models.

## Structure

```
server/
├── app.py              # Main FastAPI application
├── config.py          # Configuration settings
├── dev.py             # Development utilities
├── requirements.txt    # Python dependencies
├── README.md          # This file
├── models/            # Model utilities
│   ├── __init__.py
│   ├── loader.py      # Model loading utilities
│   └── mappers.py     # Input mapping functions
├── scripts/           # Utility scripts
│   └── start_server.bat  # Windows startup script
└── tests/             # Test files
    ├── __init__.py
    ├── test_api.py    # API endpoint tests
    └── test_models.py # Model loading tests
```

## Quick Start

### Method 1: Using Development Utilities

```bash
# Install dependencies
python dev.py install

# Test model loading
python dev.py test-models

# Start the server
python dev.py start
```

### Method 2: Manual Setup

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set environment variables:**
   ```bash
   set MODEL_API_KEY=your-secure-api-key
   ```

3. **Start the server:**
   ```bash
   python app.py
   ```

   Or use the Windows batch script:
   ```bash
   scripts\start_server.bat
   ```

## API Endpoints

- `GET /health` - Health check and model status
- `POST /predict/diabetes` - Diabetes risk prediction
- `POST /predict/heart` - Heart disease risk prediction  
- `POST /predict/parkinsons` - Parkinson's disease prediction
- `POST /predict/common` - Common diseases prediction

## Authentication

All prediction endpoints require an API key in the `X-API-Key` header.

## Testing

### Using Development Utilities

```bash
python dev.py test-models    # Test model loading
python dev.py test-api       # Test API endpoints (requires running server)
python dev.py health         # Check server health
```

### Manual Testing

Run the test suite:
```bash
python tests/test_models.py  # Test model loading
python tests/test_api.py     # Test API endpoints (requires running server)
```

## Configuration

The server can be configured using environment variables:

- `MODEL_API_KEY` - API key for authentication (default: "changeme")
- `HOST` - Server host (default: "0.0.0.0")
- `PORT` - Server port (default: 8000)
- `DEBUG` - Enable debug mode (default: False)

## Production Deployment

For production deployment:

1. Set a secure API key
2. Use a production WSGI server like Gunicorn
3. Configure SSL/TLS
4. Set up monitoring and logging
5. Use environment-specific configuration
# AI Health Predictor

[![License: BSD-2-Clause](https://img.shields.io/badge/License-BSD_2--Clause-orange.svg)](https://opensource.org/licenses/BSD-2-Clause)
[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-009485)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.8+-blue)](https://python.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178c6)](https://typescriptlang.org)

An advanced AI-powered health prediction system that uses machine learning to assess risk factors for heart disease, diabetes, Parkinson's disease, and common medical conditions. Built with Next.js frontend and FastAPI backend for professional medical environments.

## ✨ Features

- **AI-Powered Predictions** - Advanced ML models for health risk assessment
- **Multiple Health Conditions** - Heart disease, diabetes, Parkinson's, and common diseases
- **Professional Interface** - Clinical-grade input forms with medical terminology
- **Detailed Analytics** - Confidence scores, risk assessments, and sub-predictions
- **Secure API** - API key authentication and CORS protection
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Medical Disclaimers** - Comprehensive AI limitation warnings and professional consultation guidance
- **Modern UI** - Glassmorphism design with smooth animations using Framer Motion

##  Project Architecture

```
Trail/
├── 📁 Datasets/              # ML model files and training data
│   ├── data/                 # CSV datasets (diabetes, heart, parkinsons, etc.)
│   ├── pkl/                  # Pickled models and encoders
│   └── sav files/            # Saved model files
├── 📁 ML/                    # Jupyter notebooks for model training
├── 📁 frontend/              # Next.js frontend application
│   ├── app/                  # Next.js app directory
│   ├── components/           # React components
│   │   ├── forms/           # Prediction form components
│   │   └── ui/              # Reusable UI components
│   ├── hooks/               # Custom React hooks
│   └── lib/                 # Utility functions
└── 📁 server/               # FastAPI backend
    ├── models/              # Model loading and mapping utilities
    ├── scripts/             # Deployment and startup scripts
    └── tests/               # API and model tests
```

##  Quick Start

### Prerequisites

- **Node.js** 18+ with npm/pnpm
- **Python** 3.8+ with pip
- **Git** for version control

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Trail
```

### 2. Backend Setup (FastAPI)

```bash
# Navigate to server directory
cd server

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # Linux/Mac
# OR
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export MODEL_API_KEY=your-secure-api-key-here  # Linux/Mac
# OR
set MODEL_API_KEY=your-secure-api-key-here     # Windows

# Start the server
python app.py
```

**Alternative startup methods:**
```bash
# Using development utility
python dev.py start

# Using Windows batch script
scripts\start_server.bat
```

**Backend running at:** `http://localhost:8000`

### 3. Frontend Setup (Next.js)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
# OR
pnpm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
echo "NEXT_PUBLIC_API_KEY=your-secure-api-key-here" >> .env.local

# Start development server
npm run dev
# OR
pnpm dev
```

**Frontend running at:** `http://localhost:3000`

## Health Prediction Models

### 1. Heart Disease Prediction
- **Input**: 11 clinical parameters (age, sex, chest pain type, BP, cholesterol, ECG, etc.)
- **Model**: SVM classifier trained on cardiac dataset
- **Output**: Risk level, confidence score, and cardiac condition sub-predictions

### 2. Diabetes Prediction  
- **Input**: 8 clinical parameters (pregnancies, glucose, BMI, insulin, etc.)
- **Model**: SVM classifier trained on PIMA diabetes dataset
- **Output**: Risk assessment with diabetes type sub-predictions

### 3. Parkinson's Disease Prediction
- **Input**: 16 vocal biomarkers (MDVP frequency, jitter, shimmer, etc.)
- **Model**: SVM classifier using acoustic feature analysis
- **Output**: Neurological risk assessment with motor symptom analysis

### 4. Common Diseases Prediction
- **Input**: Symptom selection, duration, severity, demographics
- **Models**: Dual model system (Logistic Regression + Neural Network)
- **Output**: Disease prediction with confidence-based model selection

## API Endpoints

### Core Prediction Endpoints

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/predict/heart` | POST | ✅ API Key | Heart disease risk assessment |
| `/predict/diabetes` | POST | ✅ API Key | Diabetes risk prediction |
| `/predict/parkinsons` | POST | ✅ API Key | Parkinson's disease analysis |
| `/predict/common` | POST | ✅ API Key | Common diseases diagnosis |
| `/health` | GET | ❌ None | Server and model health check |

### API Documentation
- **Interactive Docs**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## Security Considerations

### API Security
- **API Key Authentication** - All prediction endpoints protected
- **CORS Protection** - Configured for specific origins
- **Input Validation** - Pydantic models validate all inputs
- **Rate Limiting** - Implement in production (recommended)

### Production Security Checklist
- [ ] Use strong, randomly generated API keys
- [ ] Enable HTTPS/TLS certificates
- [ ] Configure proper CORS origins
- [ ] Implement rate limiting and request throttling
- [ ] Set up monitoring and logging
- [ ] Use environment variables for sensitive data
- [ ] Regular security updates for dependencies

## Testing

### Backend Testing
```bash
cd server

# Test model loading
python dev.py test-models

# Test API endpoints (requires running server)
python dev.py test-api

# Run unit tests
python -m pytest tests/
```

### Frontend Testing
```bash
cd frontend

# Type checking
npm run build

# Linting
npm run lint
```

## Development

### Adding New Prediction Models

1. **Train your ML model** and save to `Datasets/pkl/`
2. **Update model loader** in `server/models/loader.py`
3. **Create input mapper** in `server/models/mappers.py`
4. **Add API endpoint** in `server/app.py`
5. **Create frontend form** in `frontend/components/forms/`

### Custom Styling

The project uses:
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for animations
- **Radix UI** for accessible components
- **Custom glassmorphism** effects

## Medical Disclaimer

**Important**: This application is for informational and educational purposes only. The AI predictions should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for medical decisions.

Key limitations:
- AI models may have inherent biases and limitations
- Results are based on training data and may not account for all medical factors
- Individual health conditions vary significantly
- Emergency medical situations require immediate professional care

## License

This project is licensed under the **BSD 2-Clause License**.

```
Copyright (c) 2024, AI Health Predictor Contributors
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript/Python best practices
- Add tests for new features
- Update documentation for API changes
- Ensure medical disclaimers are present for health-related features

## Support

- **Documentation**: Check API docs at `/docs` endpoint
- **Issues**: Open GitHub issues for bugs and feature requests
- **Security**: Report security vulnerabilities privately

## Acknowledgments

- Machine Learning models trained on open medical datasets
- Built with modern web technologies (Next.js, FastAPI, React)
- UI components powered by Radix UI and Tailwind CSS
- Analytics provided by Vercel Analytics

---
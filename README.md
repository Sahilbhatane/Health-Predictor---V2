# AI Health Predictor

[![License: BSD-2-Clause](https://img.shields.io/badge/License-BSD_2--Clause-orange.svg)](https://opensource.org/licenses/BSD-2-Clause)
[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-009485)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.8+-blue)](https://python.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178c6)](https://typescriptlang.org)

## Overview

An advanced AI-powered health prediction system that uses machine learning to assess risk factors for heart disease, diabetes, Parkinson's disease, and common medical conditions. This application features a modern Next.js frontend interface with a FastAPI backend, designed for professional medical environments and educational purposes.

The system combines clinical machine learning models with a user-friendly interface to provide preliminary health risk assessments. All predictions come with confidence scores and comprehensive medical disclaimers emphasizing the need for professional medical consultation.

## Key Features

**Prediction Models**
- Multiple AI-powered prediction engines for different health conditions
- Advanced machine learning models (SVM classifiers) for cardiovascular and metabolic diseases
- Neural network support for common disease prediction
- Confidence scoring and risk level assessment

**User Interface**
- Clinical-grade input forms with medical terminology and guidance
- Responsive design that works on desktop and mobile devices
- Modern glassmorphism design with smooth animations using Framer Motion
- Professional authentication system with Google OAuth integration
- Detailed analytics and risk assessment reports

**Security and Reliability**
- API key authentication for all prediction endpoints
- CORS protection and input validation
- Comprehensive error handling and logging
- Medical disclaimers and AI limitation warnings
- TypeScript for type safety across the application

## Project Structure

```
Health-Predictor-V2/
├── Datasets/                 Machine learning models and training data
│   ├── data/                CSV datasets (diabetes, heart, parkinsons, etc.)
│   ├── pkl/                 Pickled models and encoders
│   └── sav files/           Saved scikit-learn model files
│
├── ML/                      Jupyter notebooks for model training and analysis
│   ├── Diabetes.ipynb
│   ├── Heart.ipynb
│   ├── Parkinson's.ipynb
│   └── Common.ipynb
│
├── frontend/                Next.js application (React-based frontend)
│   ├── app/                 Next.js app directory with pages and layouts
│   ├── components/          Reusable React components
│   │   ├── forms/          Prediction form components
│   │   ├── auth/           Authentication components
│   │   └── ui/             Radix UI-based components
│   ├── hooks/              Custom React hooks
│   ├── lib/                Utility functions and helpers
│   ├── public/             Static assets
│   └── styles/             Global stylesheets
│
└── server/                  FastAPI backend application
    ├── app.py              Main FastAPI application
    ├── config.py           Configuration settings
    ├── models/             Model loading and prediction utilities
    ├── scripts/            Deployment and startup scripts
    └── tests/              API and model unit tests
```

## Quick Start Guide

## Quick Start Guide

This section will guide you through setting up the entire application from scratch.

### System Requirements

Before you begin, ensure you have the following installed on your system:

- **Node.js** version 18 or higher (includes npm) - Required for the frontend
- **Python** version 3.8 or higher - Required for the backend machine learning models
- **Git** for version control and cloning the repository
- **Package Manager**: Either npm or pnpm for Node.js dependencies

### Step 1: Clone the Repository

First, clone the project to your local machine:

```bash
git clone https://github.com/Sahilbhatane/Health-Predictor---V2.git
cd Health-Predictor---V2
```

### Step 2: Set Up the Backend (FastAPI)

The backend runs a FastAPI server on port 8000 and serves the machine learning models.

#### 2a. Create Python Virtual Environment

```bash
# Navigate to the server directory
cd server

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate

# On Linux/Mac:
source venv/bin/activate
```

#### 2b. Install Python Dependencies

```bash
# Install required packages from requirements.txt
pip install -r requirements.txt
```

#### 2c. Set Environment Variables

Set the API key for authentication (you can use any secure string):

```bash
# On Windows (PowerShell):
$env:MODEL_API_KEY = "your-secure-api-key-here"

# On Windows (Command Prompt):
set MODEL_API_KEY=your-secure-api-key-here

# On Linux/Mac:
export MODEL_API_KEY=your-secure-api-key-here
```

#### 2d. Start the Backend Server

```bash
# Start the FastAPI server
python app.py
```

**Expected Output:**
```
INFO:__main__:Starting up application...
INFO:models.loader:Loading ML models...
INFO:models.loader:All models loaded successfully!
Uvicorn running on http://127.0.0.1:8000
```

Alternative startup methods:

```bash
# Using development utility
python dev.py start

# Using Windows batch script
scripts\start_server.bat
```

The backend will now be running at: `http://localhost:8000`

### Step 3: Set Up the Frontend (Next.js)

The frontend is a React-based Next.js application that communicates with the backend API.

#### 3a. Navigate to Frontend Directory

```bash
# From the project root, go to frontend
cd ../frontend

# If you're still in server directory:
cd ../frontend
```

#### 3b. Install Node.js Dependencies

```bash
# Using npm
npm install

# OR using pnpm (if installed)
pnpm install
```

#### 3c. Create Environment Configuration

Create a `.env.local` file in the frontend directory with the following content:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_KEY=your-secure-api-key-here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

Generate the NEXTAUTH_SECRET:

```bash
# Using Node.js (cross-platform)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

For Google OAuth setup, see the [AUTHENTICATION_SETUP.md](AUTHENTICATION_SETUP.md) guide.

#### 3d. Start the Frontend Development Server

```bash
# Using npm
npm run dev

# OR using pnpm
pnpm dev
```

**Expected Output:**
```
> next dev
▲ Next.js 15.2.4
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
```

The frontend will now be running at: `http://localhost:3000`

### Step 4: Access the Application

Once both servers are running, open your web browser and visit:

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend Application | http://localhost:3000 | Web interface for predictions |
| Backend API | http://localhost:8000 | REST API for ML predictions |
| API Documentation | http://localhost:8000/docs | Interactive Swagger API docs |
| Alternative Docs | http://localhost:8000/redoc | ReDoc API documentation |

## Health Prediction Models

The application includes four specialized prediction models for different health conditions:

### 1. Heart Disease Prediction

**Input Parameters**: 11 clinical measurements
- Age, sex, chest pain type
- Blood pressure and cholesterol levels
- Maximum heart rate achieved
- ECG readings and previous angina
- ST depression and heart rate variability

**Model Type**: Support Vector Machine (SVM) classifier
**Output**: 
- Risk level classification
- Confidence score
- Cardiac condition sub-predictions

**Dataset**: Trained on cardiovascular disease dataset

### 2. Diabetes Prediction

**Input Parameters**: 8 clinical measurements
- Number of pregnancies
- Plasma glucose concentration
- Diastolic blood pressure
- Triceps skin fold thickness
- Insulin levels
- Body Mass Index (BMI)
- Diabetes pedigree function
- Age

**Model Type**: Support Vector Machine (SVM) classifier
**Output**:
- Diabetes risk assessment
- Risk level classification
- Diabetes type sub-predictions

**Dataset**: Trained on PIMA Indians diabetes dataset

### 3. Parkinson's Disease Prediction

**Input Parameters**: 16 vocal biomarkers
- Fundamental frequency measurements (MDVP)
- Jitter (frequency and percentage variation)
- Shimmer (amplitude variation)
- Noise-to-harmonics ratio
- Harmonic-to-noise ratio
- Recurrence period density entropy
- Detrended fluctuation analysis

**Model Type**: Support Vector Machine (SVM) classifier
**Output**:
- Neurological risk assessment
- Motor symptom analysis
- Parkinson's probability score

**Dataset**: Trained on acoustic features from voice recordings

### 4. Common Diseases Prediction

**Input Parameters**: Symptom information and demographics
- Symptom selection and severity
- Symptom duration
- Age and general health information

**Model Types**: Dual model system for enhanced accuracy
- Logistic Regression model
- Neural Network model
- Model selection based on confidence scores

**Output**:
- Disease prediction
- Confidence-based model selection
- Multiple disease candidates with probabilities

## API Endpoints Reference

### Core Prediction Endpoints

All prediction endpoints require API key authentication.

| Endpoint | Method | Authentication | Description |
|----------|--------|---------|-------------|
| `/predict/heart` | POST | API Key Required | Predict heart disease risk |
| `/predict/diabetes` | POST | API Key Required | Predict diabetes risk |
| `/predict/parkinsons` | POST | API Key Required | Predict Parkinson's disease risk |
| `/predict/common` | POST | API Key Required | Predict common diseases |
| `/health` | GET | Not Required | Server health check and model status |

### Authentication

All POST endpoints require the API key in the request header:

```bash
curl -X POST "http://localhost:8000/predict/heart" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secure-api-key-here" \
  -d '{"age": 50, "sex": 1, ...}'
```

### API Documentation

Once the backend is running, access interactive documentation:

- **Swagger UI** (Interactive): http://localhost:8000/docs
- **ReDoc** (Alternative): http://localhost:8000/redoc


## Security and Best Practices

### API Security Features

The application implements several security measures to protect data and API access:

**Authentication**
- API Key authentication required for all prediction endpoints
- Secure key generation and storage through environment variables
- Bearer token-style API key validation

**Data Protection**
- CORS (Cross-Origin Resource Sharing) protection configured for specific origins
- Request input validation using Pydantic models
- Type checking and validation of all input parameters
- Prevention of injection attacks and malicious payloads

**Application Security**
- Input sanitization for all user-provided data
- Secure session management with NextAuth.js
- Google OAuth 2.0 for third-party authentication
- HTTPS support for production deployments

### Production Deployment Checklist

Before deploying to a production environment, ensure you have completed the following:

- Generate and use strong, randomly generated API keys (at least 32 characters)
- Enable HTTPS/TLS certificates for all communications
- Configure appropriate CORS origins (only allow your frontend domains)
- Implement rate limiting to prevent API abuse
- Set up comprehensive monitoring and logging
- Store all sensitive data (API keys, secrets) in environment variables
- Keep all dependencies updated with security patches
- Regular security audits and penetration testing
- Enable request logging for audit trails
- Implement API key rotation policies

### Environment Variable Security

Never commit sensitive information to version control. Always use:

```env
# .env.local (Never commit this file)
MODEL_API_KEY=your-secure-generated-key
NEXTAUTH_SECRET=your-generated-secret
GOOGLE_CLIENT_SECRET=your-google-secret
```

Add `.env.local` to your `.gitignore` file.

## Testing and Quality Assurance

### Backend Testing

Run tests for the FastAPI backend and machine learning models:

```bash
cd server

# Test model loading and initialization
python dev.py test-models

# Test API endpoints (requires server to be running)
python dev.py test-api

# Run all unit tests with pytest
python -m pytest tests/

# Run with verbose output
python -m pytest tests/ -v
```

### Frontend Testing

Verify the Next.js frontend build and linting:

```bash
cd frontend

# Type checking and build verification
npm run build

# Run ESLint for code quality
npm run lint

# Format code with Prettier (if configured)
npm run format
```

### Manual Testing

Test the application manually through the web interface:

1. Navigate to http://localhost:3000
2. Sign in with demo credentials or Google OAuth
3. Fill out prediction forms for each health condition
4. Verify results are displayed correctly
5. Check API documentation at http://localhost:8000/docs

## Development Guide

### Architecture Overview

The application follows a modern architecture with clear separation of concerns:

**Frontend (Next.js + React)**
- Server-side rendering for better performance
- API routes for backend communication
- React hooks for state management
- TypeScript for type safety
- Tailwind CSS for styling
- Framer Motion for animations

**Backend (FastAPI + Python)**
- RESTful API design
- Pydantic for data validation
- Scikit-learn and Neural Networks for ML
- Comprehensive logging and error handling
- Modular model loading system

**Machine Learning**
- Jupyter notebooks for model experimentation
- Scikit-learn for traditional ML models
- Pre-trained model files for fast predictions
- Input preprocessing and feature scaling

### Adding New Prediction Models

To add a new health condition prediction to the system:

**Step 1: Train and Export Model**
- Train your machine learning model using the Jupyter notebooks in the `ML/` directory
- Export the trained model as a `.sav` (scikit-learn) or `.pkl` (pickle) file
- Save to `Datasets/pkl/` or `Datasets/sav files/`

**Step 2: Update Model Loader**
- Edit `server/models/loader.py`
- Add code to load your new model file
- Register the model in the model initialization routine

**Step 3: Create Input Mapper**
- Edit `server/models/mappers.py`
- Create a new mapper function for your model's input parameters
- Define the parameter names, types, and validation rules

**Step 4: Add API Endpoint**
- Edit `server/app.py`
- Create a new POST endpoint (e.g., `/predict/mynewcondition`)
- Add API key authentication and input validation
- Return prediction results with confidence scores

**Step 5: Create Frontend Form Component**
- Create a new form in `frontend/components/forms/`
- Use the same input parameters from your mapper
- Add medical guidance and parameter descriptions
- Display results with confidence scores and medical disclaimers

**Step 6: Add Route and Navigation**
- Create new route in `frontend/app/predict/`
- Update navigation components to include the new prediction type
- Add links in the main menu and prediction tabs

### Frontend Styling

The project uses modern CSS and UI frameworks for styling:

**Tailwind CSS**
- Utility-first CSS framework
- Responsive design classes
- Custom color and spacing configuration
- Located in `frontend/postcss.config.mjs` and `frontend/tailwind.config.js`

**Component Libraries**
- **Radix UI**: Accessible, unstyled UI components (primitives)
- **Shadcn/ui**: Pre-built Radix UI components with Tailwind styling
- Located in `frontend/components/ui/`

**Animations and Effects**
- **Framer Motion**: React animation library
- Smooth page transitions and element animations
- Glassmorphism effects for modern aesthetics

**Custom Styling**
- Global styles in `frontend/styles/globals.css`
- Component-specific styles co-located with components
- CSS modules for scoped styling when needed

### Frontend Theme Configuration

Theme settings are defined in component configuration files:

```json
// frontend/components.json
{
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "app/globals.css"
  },
  "aliases": {
    "@": "./",
    "@/components": "components",
    "@/lib": "lib"
  }
}
```

## Authentication and User Management

The application uses NextAuth.js for user authentication with multiple providers:

### Authentication Providers

**Google OAuth 2.0**
- Enterprise-grade authentication
- Secure token-based flow
- User profile and email access
- See [AUTHENTICATION_SETUP.md](AUTHENTICATION_SETUP.md) for detailed setup

**Demo Credentials**
- For testing and development
- Email: admin@healthpredictor.com
- Password: admin123

### Session Management

- Secure session tokens stored in HTTP-only cookies
- Automatic session expiration
- CSRF protection
- User data persisted across sessions

## Medical Disclaimer and Limitations

**IMPORTANT LEGAL NOTICE**

This application is designed for informational and educational purposes only. The AI predictions generated by this system should NOT be used as a substitute for professional medical advice, diagnosis, or treatment from qualified healthcare professionals.

### Key Limitations

**Model Limitations**
- AI models may have inherent biases and inaccuracies
- Results are based on historical training data which may not reflect all medical conditions
- Models cannot account for individual variations in health status
- Predictions provide probability scores, not definitive diagnoses

**Data Limitations**
- Predictions are based only on provided input parameters
- Models may not account for genetic, environmental, or lifestyle factors not in the dataset
- Training data may not represent all populations equally
- Regional variations in disease prevalence not captured

**Clinical Limitations**
- Individual health conditions vary significantly from person to person
- Co-occurring conditions and complications may not be detected
- Medication interactions and allergies not considered
- Rare diseases and atypical presentations may not be recognized

### When to Seek Professional Help

Please consult with qualified healthcare providers immediately if you experience:

- Chest pain or pressure
- Severe shortness of breath
- Loss of consciousness
- Severe bleeding or injuries
- Sudden neurological symptoms
- Any other emergency symptoms

### Recommended Use

This application should be used as:
- A preliminary health risk screening tool
- Educational material about health risk factors
- A starting point for discussion with healthcare providers
- A way to understand and track personal health metrics

Always combine AI predictions with:
- Professional medical consultation
- Physical examinations by healthcare providers
- Laboratory tests and diagnostic imaging as appropriate
- Consideration of personal and family medical history

## Project Technology Stack

### Frontend Technologies

- **Framework**: Next.js 15.2.4 (React meta-framework)
- **Language**: TypeScript 5.0+ (type-safe JavaScript)
- **Styling**: Tailwind CSS (utility-first CSS framework)
- **UI Components**: Radix UI and Shadcn/ui
- **Animations**: Framer Motion
- **Authentication**: NextAuth.js with Google OAuth
- **HTTP Client**: Built-in Fetch API
- **Package Manager**: npm or pnpm

### Backend Technologies

- **Framework**: FastAPI 0.104.1 (Python web framework)
- **Language**: Python 3.8+
- **Validation**: Pydantic (data validation library)
- **ML Framework**: Scikit-learn (machine learning)
- **Server**: Uvicorn ASGI server
- **API Documentation**: Swagger UI and ReDoc
- **Testing**: pytest

### Machine Learning Stack

- **Data Processing**: Pandas, NumPy
- **Model Training**: Scikit-learn, TensorFlow/Keras
- **Feature Engineering**: Scikit-learn preprocessing
- **Model Persistence**: Joblib, Pickle
- **Notebooks**: Jupyter Notebook
- **Visualization**: Matplotlib, Seaborn

### Development Tools

- **Version Control**: Git and GitHub
- **Code Editor**: VS Code recommended
- **Package Managers**: npm, pnpm for Node.js; pip for Python
- **Build Tools**: Next.js build system
- **Linting**: ESLint, Prettier (frontend); Pylint, Black (backend)



## License

This project is licensed under the **BSD 2-Clause License** - a permissive open-source license that allows both commercial and private use with minimal restrictions.

### License Terms

```
Copyright (c) 2024-2026, AI Health Predictor Contributors
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

For the full license text, see the [LICENSE](LICENSE) file in the repository.

## Contributing to the Project

We welcome contributions from developers, data scientists, and medical professionals. Whether you're fixing bugs, adding features, or improving documentation, your help is appreciated.

### How to Contribute

**1. Fork the Repository**

Click the "Fork" button on GitHub to create your own copy of the project.

**2. Create a Feature Branch**

Create a descriptive branch for your work:

```bash
git checkout -b feature/your-feature-name
```

Use one of these prefixes:
- `feature/` for new features
- `bugfix/` for bug fixes
- `docs/` for documentation improvements
- `refactor/` for code refactoring
- `test/` for test additions

**3. Make Your Changes**

Implement your changes following the development guidelines:

```bash
# Make your edits and test locally
git add .
git commit -m "Clear description of your changes"
```

**4. Push to Your Fork**

```bash
git push origin feature/your-feature-name
```

**5. Open a Pull Request**

Submit a pull request from your fork to the main repository with:
- Clear description of changes
- Reference to any related issues
- List of testing you performed
- Screenshots for UI changes

### Development Guidelines

**Code Quality**
- Follow TypeScript/Python best practices and conventions
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions focused and modular
- Avoid code duplication

**Testing Requirements**
- Add unit tests for new features
- Ensure existing tests continue to pass
- Update integration tests if needed
- Manually test UI changes across browsers
- Test on both desktop and mobile views

**Documentation**
- Update README for API changes
- Add docstrings to functions and classes
- Document new configuration options
- Update SETUP_GUIDE.md if setup procedures change
- Include medical disclaimers for health-related features

**Commit Messages**
- Use clear, descriptive commit messages
- Use present tense ("Add feature" not "Added feature")
- Reference related issues: "Fix #123"
- Keep commits focused on single changes

**Medical Content**
- Ensure medical disclaimers are present on new health features
- Have changes reviewed by someone familiar with medical context
- Validate against medical best practices
- Document any ML model changes thoroughly

## Getting Help and Support

### Documentation

Comprehensive documentation is available in multiple places:

**API Documentation**
- Interactive Swagger UI: http://localhost:8000/docs (when running locally)
- ReDoc alternative view: http://localhost:8000/redoc
- This README contains setup and feature documentation

**Setup Guides**
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Detailed installation instructions
- [AUTHENTICATION_SETUP.md](AUTHENTICATION_SETUP.md) - Google OAuth configuration
- [TASKS.md](TASKS.md) - Development tasks and progress tracking

**Project Documentation**
- [docs/](docs/) folder - Additional project documentation
- [docs/specs/](docs/specs/) - Detailed specifications
- [docs/plans/](docs/plans/) - Planning and roadmap documents

### Issue Reporting

Found a bug or have a feature request?

1. **Check existing issues** at https://github.com/Sahilbhatane/Health-Predictor---V2/issues
2. **Create a new issue** with:
   - Clear title describing the problem
   - Detailed description of the issue
   - Steps to reproduce (for bugs)
   - Your environment (OS, browser, Node version, Python version)
   - Screenshots or error logs if applicable

### Security Issues

Do NOT create public issues for security vulnerabilities.

Instead, please report security issues responsibly by:
- Emailing the project maintainer privately
- Including detailed information about the vulnerability
- Allowing time for a fix before public disclosure
- Following responsible disclosure practices

### Getting in Touch

For general questions or discussions:
- GitHub Discussions (if enabled)
- GitHub Issues with question label
- Check existing documentation first

## Project Acknowledgments

This project builds on the work and contributions of many developers and open-source projects:

### Core Technologies

We thank the maintainers of:
- **Next.js** - Modern React framework
- **FastAPI** - High-performance Python web framework
- **Scikit-learn** - Machine learning library
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component library
- **Framer Motion** - Animation library
- **NextAuth.js** - Authentication for Next.js

### Training Data and Datasets

The machine learning models are trained on publicly available medical datasets:
- PIMA Indians Diabetes Dataset
- Cleveland Heart Disease Dataset
- Parkinson's Disease Dataset
- UCI Machine Learning Repository

### Contributors

We appreciate all contributors who have helped improve this project through:
- Bug reports and fixes
- Feature implementations
- Documentation improvements
- Code reviews and suggestions
- Testing and validation

### Design and UX

The modern UI design draws inspiration from contemporary web design practices including:
- Glassmorphism design principles
- Smooth animation best practices
- Accessible component design
- Medical interface design standards

---

## Quick Reference

### Common Commands

**Frontend Development**
```bash
cd frontend
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run linter
```

**Backend Development**
```bash
cd server
python -m venv venv  # Create virtual environment
venv\Scripts\activate  # Activate (Windows)
pip install -r requirements.txt  # Install dependencies
python app.py        # Start server
python dev.py test-api  # Run API tests
```

**Project URLs**
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs
- GitHub: https://github.com/Sahilbhatane/Health-Predictor---V2

### Troubleshooting

**Node.js/npm issues**
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -r node_modules package-lock.json
npm install
```

**Python/pip issues**
```bash
# Create fresh virtual environment
python -m venv venv_new
venv_new\Scripts\activate
pip install -r requirements.txt
```

**Port already in use**
- Frontend (3000): Change in `next.config.mjs`
- Backend (8000): Change `app.py` host/port configuration

**Models not loading**
- Verify model files exist in `Datasets/sav files/` and `Datasets/pkl/`
- Check `server/models/loader.py` for correct file paths
- Review server logs for loading errors

### Resources

- **Python Official**: https://python.org
- **Node.js Official**: https://nodejs.org
- **Next.js Documentation**: https://nextjs.org/docs
- **FastAPI Documentation**: https://fastapi.tiangolo.com
- **Tailwind CSS Documentation**: https://tailwindcss.com/docs
- **Git Documentation**: https://git-scm.com/doc

---

**Last Updated**: May 2026

For the latest information and updates, visit the [GitHub repository](https://github.com/Sahilbhatane/Health-Predictor---V2).
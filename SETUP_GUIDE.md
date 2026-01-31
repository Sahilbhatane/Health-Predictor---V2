# Health Predictor V2 - Complete Setup & Running Guide

## 📋 Project Status

### ✅ **Backend (Flask) - RUNNING**
- **Status**: Active and serving on `http://localhost:5000`
- **Models Loaded**: 
  - ✓ Diabetes (SVM)
  - ✓ Heart Disease (SVM)
  - ✓ Parkinson's (SVM)
  - ✓ Logistic Regression
  - ✓ Encoders & Symptom Columns

### ⏳ **Frontend (Next.js) - REQUIRES NODE.JS**
- **Status**: Ready but blocked by missing Node.js
- **Would run on**: `http://localhost:3000`
- **Package Manager**: pnpm

---

## 🚀 Installation & Running Guide

### **Step 1: Install Node.js**

#### **Option A: Download from NodeJS.org (Recommended)**
1. Visit: https://nodejs.org/
2. Download **LTS Version** (v20.x or later)
3. Run the installer and follow the wizard
4. Restart your PowerShell/CMD terminal

#### **Option B: Using Chocolatey (Requires Admin)**
```powershell
# Run PowerShell as Administrator
choco install nodejs -y
```

#### **Verify Installation**
```powershell
node --version
npm --version
pnpm --version
```

---

### **Step 2: Install Project Dependencies**

#### **Backend (Python/Flask)**
```powershell
cd c:\Users\sahil\OneDrive\Desktop\CODE\Trail

# Activate virtual environment
.\.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r server/requirements.txt
```

#### **Frontend (Next.js/Node.js)**
```powershell
cd c:\Users\sahil\OneDrive\Desktop\CODE\Trail\frontend

# Install with pnpm
pnpm install

# OR with npm
npm install
```

---

### **Step 3: Start the Backend Server**

#### **Terminal 1: Backend**
```powershell
cd c:\Users\sahil\OneDrive\Desktop\CODE\Trail

# Activate virtual environment
.\.venv\Scripts\Activate.ps1

# Start Flask server
python server/app.py
```

**Expected Output:**
```
INFO:__main__:Starting up application...
INFO:models.loader:Loading ML models...
INFO:models.loader:All models loaded successfully!
* Running on http://localhost:5000
```

---

### **Step 4: Start the Frontend Development Server**

#### **Terminal 2: Frontend**
```powershell
cd c:\Users\sahil\OneDrive\Desktop\CODE\Trail\frontend

# Start Next.js dev server with pnpm
pnpm dev

# OR with npm
npm run dev
```

**Expected Output:**
```
> my-v0-project@0.1.0 dev
> next dev

▲ Next.js 15.2.4
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
```

---

## 📱 Accessing the Application

Once both servers are running:

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:3000 | Web interface for predictions |
| **Backend API** | http://localhost:5000 | ML prediction endpoints |

### **Available Prediction APIs:**
- `POST /predict/diabetes` - Diabetes risk prediction
- `POST /predict/heart` - Heart disease prediction
- `POST /predict/parkinsons` - Parkinson's disease prediction
- `POST /predict/common` - Common diseases prediction

---

## 🔧 Troubleshooting

### **Issue: `npm` or `pnpm` not recognized**
**Solution**: Node.js is not installed or not in PATH
- Download and install from https://nodejs.org/
- Restart your terminal after installation

### **Issue: Models failing to load**
**Solution**: Check model files exist
```powershell
# Check if model files exist
Get-ChildItem "C:\Users\sahil\OneDrive\Desktop\CODE\Trail\Datasets\sav files\"
Get-ChildItem "C:\Users\sahil\OneDrive\Desktop\CODE\Trail\Datasets\pkl\"
```

### **Issue: Port already in use**
**Solution**: Change port in server configuration
```python
# In server/app.py
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)  # Change 5001 to any available port
```

### **Issue: CORS errors from frontend**
**Solution**: Check backend is running and accessible
```powershell
# Test backend connectivity
Invoke-WebRequest http://localhost:5000/health
```

---

## 📊 Architecture Diagrams

Generated architecture visualizations are saved in:
```
c:\Users\sahil\OneDrive\Desktop\CODE\Trail\graphs\
```

**Generated Files:**
- `system_architecture.png` - System layers and components
- `ml_pipeline_flow.png` - ML training and deployment pipeline
- `data_flow_diagram.png` - Data flow between components
- `project_structure.png` - Directory structure
- `technology_stack.png` - Tech stack visualization
- `models_comparison.png` - Model performance comparison
- `api_endpoints.png` - REST API endpoints documentation

---

## 🎯 Model Performance

| Disease | Algorithm | Accuracy | Features | Samples |
|---------|-----------|----------|----------|---------|
| Diabetes | SVM | 78% | 8 | 768 |
| Heart Disease | LR + SVM | 85% | 13 | 303 |
| Parkinson's | SVM | 87% | 22 | 195 |
| Common Diseases | LR + MLP | 97% | 132 | 4920 |

---

## 📁 Key Files & Directories

```
Trail/
├── server/
│   ├── app.py                 # Main Flask application
│   ├── config.py             # Configuration settings
│   ├── requirements.txt       # Python dependencies
│   ├── models/
│   │   ├── loader.py         # ML model loading logic
│   │   └── mappers.py        # Input/output mapping
│   └── tests/                # API and model tests
├── frontend/
│   ├── package.json          # Node.js dependencies
│   ├── pnpm-lock.yaml       # pnpm lock file
│   ├── app/
│   │   ├── page.tsx         # Home page
│   │   └── api/             # API routes
│   └── components/
│       ├── forms/           # Prediction forms
│       └── ui/              # UI components
├── ML/
│   ├── Diabetes.ipynb       # Diabetes model training
│   ├── Heart.ipynb          # Heart model training
│   ├── Parkinson's.ipynb    # Parkinson's model training
│   ├── Common.ipynb         # Common diseases model
│   └── generate_architecture_diagrams.py  # Diagram generator
├── Datasets/
│   ├── data/                # CSV files
│   ├── pkl/                 # Pickled models
│   └── sav files/           # Saved model files
└── README.md                # Project documentation
```

---

## 🛠️ Development Workflow

### **Adding New Features**

1. **Backend Enhancement**:
   ```python
   # In server/app.py
   @app.route('/api/new-endpoint', methods=['POST'])
   def new_endpoint():
       # Add your logic here
       return {'status': 'success'}
   ```

2. **Frontend Component**:
   ```tsx
   // In frontend/components/MyComponent.tsx
   export default function MyComponent() {
       return (
           <div>
               {/* Your component JSX */}
           </div>
       );
   }
   ```

3. **Model Training**:
   - Use Jupyter notebooks in `ML/` directory
   - Train models using scikit-learn or TensorFlow
   - Export to `.sav` or `.pkl` format
   - Update model loader in `server/models/loader.py`

---

## 📚 Technologies Used

### **Frontend Stack**
- **Framework**: Next.js 15.2.4
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: React Hooks
- **Authentication**: NextAuth.js
- **Animations**: Framer Motion

### **Backend Stack**
- **Framework**: Flask
- **Language**: Python 3.8+
- **ML Libraries**: Scikit-learn, TensorFlow, Pandas
- **Data Processing**: NumPy, Pandas
- **Model Storage**: Pickle, Joblib

### **ML/AI**
- **Algorithms**: SVM, Logistic Regression, MLP Neural Networks
- **Data Format**: CSV → Pandas DataFrame
- **Model Evaluation**: Accuracy, Precision, Recall, F1-Score

---

## ✅ Verification Checklist

Before deploying to production:

- [ ] Python 3.8+ installed
- [ ] Node.js 18+ installed
- [ ] Virtual environment activated
- [ ] All dependencies installed (`pip install -r requirements.txt`)
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Both can communicate (CORS configured)
- [ ] All ML models loaded successfully
- [ ] API endpoints return responses
- [ ] Web interface is accessible

---

## 🆘 Support & Documentation

- **Flask Documentation**: https://flask.palletsprojects.com/
- **Next.js Documentation**: https://nextjs.org/docs
- **Scikit-learn Documentation**: https://scikit-learn.org/
- **Python Official Docs**: https://docs.python.org/3/

---

## 📝 Notes

- Backend can run independently without frontend
- All ML models are pre-trained and ready to use
- Architecture diagrams are in `graphs/` directory
- Test notebooks are in `ML/` directory
- API is CORS-enabled for frontend access
- Models handle version compatibility warnings gracefully

---

**Last Updated**: January 28, 2026
**Status**: Backend ✅ Running | Frontend ⏳ Ready (awaiting Node.js)

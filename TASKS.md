# Health Predictor V2 — Issues & Roadmap

> Auto-generated project audit — February 12 2026
> Format: GitHub Issue ready (copy title → issue title, desc → issue body)

---

## Critical Issues

---

### `#1`

**type** — ML  
**issue** — Parkinson's model always predicts "High Risk" regardless of input  
**desc** —  
**What's wrong:** The `map_parkinsons_input()` function in `server/models/mappers.py` uses hardcoded baseline feature values that resemble a Parkinson's-positive patient (e.g., high jitter/shimmer values). When all symptoms are "no", the multiplier is 0 and the base features remain unchanged — but those base values already sit in the Parkinson's-positive range. The SVM model was also trained without `probability=True`, so `predict_proba()` always fails and confidence defaults to a static 60%.

**Solution:**  
1. Retrain the SVM in `ML/Parkinson's.ipynb` with `svm.SVC(kernel='linear', probability=True)` so `predict_proba` works.  
2. Replace the hardcoded baseline in `map_parkinsons_input()` with **two reference vectors** — one derived from the mean of healthy patients (`status=0`) and one from the mean of Parkinson's patients (`status=1`) in the dataset. Interpolate between them based on the symptom severity multiplier:  
```python
healthy_baseline = [...]   # mean of status=0 rows
disease_baseline = [...]   # mean of status=1 rows
t = symptom_multiplier     # 0.0 (no symptoms) → 1.0 (all severe)
features = [(1-t)*h + t*d for h, d in zip(healthy_baseline, disease_baseline)]
```
3. Apply `StandardScaler` (fit on training data, save as pkl) and scale features before prediction.

---

### `#2`

**type** — ML  
**issue** — No feature scaling on any SVM model — accuracy ~15% below potential  
**desc** —  
**What's wrong:** All three `.sav` models (diabetes, heart, parkinsons) use `svm.SVC(kernel='linear')` but none of the training notebooks apply feature standardization. SVM relies on distance calculations and is highly sensitive to feature magnitude — `Insulin` ranges 0-800 while `DiabetesPedigreeFunction` ranges 0-2.5. This alone likely costs 10-15% accuracy.

**Solution:**  
In each notebook, add a `StandardScaler` pipeline before training:
```python
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('svm', svm.SVC(kernel='linear', probability=True))
])
pipeline.fit(X_train, Y_train)
joblib.dump(pipeline, 'model.sav')
```
Using a Pipeline ensures the scaler is saved with the model — no separate scaler file needed, and `model.predict()` calls auto-scale input. Re-export all three `.sav` files after retraining.

---

### `#3`

**type** — ML  
**issue** — Diabetes model accuracy is 68.6% — claimed 78% in diagrams  
**desc** —  
**What's wrong:** The diabetes SVM achieves only 68.6% test accuracy. The `diabetes.csv` dataset has physiologically impossible zeros in `BloodPressure`, `SkinThickness`, `Insulin`, `BMI` (missing values encoded as 0) that are never cleaned. The dataset was also augmented from 768 → 4500 rows which may introduce synthetic artifacts.

**Solution:**  
1. Replace zeros with `NaN` in columns where 0 is invalid, then impute using median or KNN imputer:
```python
cols_with_zeros = ['Glucose','BloodPressure','SkinThickness','Insulin','BMI']
df[cols_with_zeros] = df[cols_with_zeros].replace(0, np.nan)
from sklearn.impute import KNNImputer
imputer = KNNImputer(n_neighbors=5)
df[cols_with_zeros] = imputer.fit_transform(df[cols_with_zeros])
```
2. Add `StandardScaler` (see issue #2).  
3. Try alternative algorithms — `RandomForestClassifier` or `XGBClassifier` typically outperform linear SVM on tabular medical data.  
4. Add 5-fold stratified cross-validation instead of a single train/test split to get reliable accuracy estimates.  
5. Fix the hardcoded accuracy in `ML/generate_architecture_diagrams.py` to reflect actual metrics.

---

### `#4`

**type** — ML  
**issue** — Heart model accuracy is 66.8% — claimed 85% in diagrams  
**desc** —  
**What's wrong:** The heart SVM achieves only 66.8%. Like the other models, no scaling is applied, and the dataset is augmented from 303 → 4500 rows. The model also lacks `probability=True`, so confidence always falls back to a static 60%.

**Solution:**  
Same remediation as issues #2 and #3:  
1. Apply `StandardScaler` + retrain with `probability=True`.  
2. Try `RandomForestClassifier`, `GradientBoosting`, or `XGBClassifier` — these typically reach 85%+ on the Cleveland heart dataset when properly tuned.  
3. Add stratified 5-fold cross-validation and `GridSearchCV` for hyperparameter tuning.  
4. Update `generate_architecture_diagrams.py` with real accuracy numbers.

---

### `#5`

**type** — ML  
**issue** — Common diseases model gives low-confidence, implausible predictions  
**desc** —  
**What's wrong:** Testing `fever + headache + cough + fatigue` returns "white blood cell disease" at 10.8% confidence. Testing `chest pain + shortness of breath` returns "fracture of the rib" at 3.8% confidence. The symptom mapping in `map_common_symptoms()` only maps 16 human-readable symptom names to dataset column names, but the dataset has 377 symptom columns — most symptoms from the frontend never get mapped, producing nearly-empty feature vectors.

**Solution:**  
1. Expand the `symptom_mapping` dictionary in `mappers.py` to cover **all 377 symptom columns** (auto-generate it from `symptom_columns.pkl`):
```python
# In server startup or a one-time script
symptom_columns = joblib.load('symptom_columns.pkl')
# Print mapping candidates
for col in symptom_columns:
    print(col)  # Use these exact names in the frontend symptom list
```
2. Update the frontend `common-diseases-prediction-form.tsx` symptom options to use exact dataset column names.  
3. Add a fuzzy matching fallback using `difflib.get_close_matches()` for symptom names that don't exactly match.  
4. Consider retraining with `class_weight='balanced'` since some diseases likely have very few samples.

---

### `#6`

**type** — Frontend  
**issue** — 3 of 4 prediction forms discard real API responses and show mock data  
**desc** —  
**What's wrong:** The `handleSubmit` in `diabetes-prediction-form.tsx`, `parkinsons-prediction-form.tsx`, and `common-diseases-prediction-form.tsx` each make a real `fetch()` call but then immediately schedule a `setTimeout` that overwrites the result with hardcoded mock data at ~2 seconds. The actual API response is never displayed. Only `heart-prediction-form.tsx` correctly uses the real response.

**Solution:**  
In each broken form, remove the `setTimeout` mock block entirely. Follow the pattern from `heart-prediction-form.tsx`:
```tsx
// REMOVE this pattern from 3 forms:
setTimeout(() => {
  setResult({ /* mock data */ })
  setIsLoading(false)
}, 2000)

// KEEP only this pattern:
const response = await fetch('/api/predict/diabetes', { ... })
const data = await response.json()
setResult(data.prediction)
setIsLoading(false)
```
After removal, each form must also parse the real response shape correctly — map `data.prediction.risk`, `data.prediction.confidence`, etc. to the component state.

---

### `#7`

**type** — Frontend  
**issue** — Parkinson's frontend API route is 100% mock with no backend proxy  
**desc** —  
**What's wrong:** Unlike the diabetes and heart API routes in `frontend/app/api/predict/`, the Parkinson's route (`parkinsons/route.ts`) never calls the FastAPI server at all. It contains only mock scoring logic. Additionally, the field names don't align anywhere:  
- Form sends: `tremor`, `rigidity`, `bradykinesia`, `balanceProblems`, `speechChanges`, `handwritingChanges`  
- API route expects: `handShaking`, `movementSlowness`, `muscleStiffness`, `balanceProblems`, `voiceChanges`, `writingChanges`  
- Backend Pydantic model expects: `tremors`, `stiffness`, `speech_problems`, `balance_issues`, `handwriting_changes`, `age`

**Solution:**  
1. Rewrite `frontend/app/api/predict/parkinsons/route.ts` to mirror the diabetes/heart pattern — proxy to `${PYTHON_API_URL}/predict/parkinsons` with API key header.  
2. Standardize field names across all three layers. Use the backend Pydantic model as the source of truth:
```
Frontend form → Frontend API route → Backend
age           → age                → age
tremors       → tremors            → tremors
stiffness     → stiffness          → stiffness
speech_problems → speech_problems  → speech_problems
balance_issues → balance_issues    → balance_issues
handwriting_changes → handwriting_changes → handwriting_changes
```
3. Update the form component to send these exact field names.

---

### `#8`

**type** — Frontend  
**issue** — Common diseases frontend API route is 100% mock with no backend proxy  
**desc** —  
**What's wrong:** `frontend/app/api/predict/common-diseases/route.ts` implements elaborate rule-based logic but never calls the FastAPI `/predict/common` endpoint.

**Solution:**  
Rewrite to proxy to `${PYTHON_API_URL}/predict/common` following the same pattern as diabetes/heart routes. Ensure the request body matches the `CommonInput` Pydantic model: `{ symptoms: string[], duration: string, severity: string, age: string, medicalHistory: string }`.

---

### `#9`

**type** — Frontend  
**issue** — Double `request.json()` in catch blocks crashes fallback logic  
**desc** —  
**What's wrong:** In `diabetes/route.ts` and `heart/route.ts`, the `try` block calls `await request.json()` to consume the request body. If the backend fetch fails, the `catch` block calls `await request.json()` again — but the ReadableStream has already been consumed. This throws a second error, making the fallback mock logic unreachable.

**Solution:**  
Parse the request body once at the top of the handler and store it in a variable before the try/catch:
```typescript
export async function POST(request: Request) {
  const body = await request.json()  // Parse once
  try {
    const response = await fetch(`${PYTHON_API_URL}/predict/diabetes`, {
      body: JSON.stringify(body), // Reuse parsed body
      ...
    })
    ...
  } catch (error) {
    // body is already available here — no need to re-parse
    return NextResponse.json(fallbackResult(body))
  }
}
```

---

### `#10`

**type** — Frontend  
**issue** — Doctor mode clinical inputs are completely ignored  
**desc** —  
**What's wrong:** The diabetes, heart, and parkinson's forms have a "Doctor Mode" that accepts raw clinical values (Glucose, BloodPressure, Cholesterol, etc.). The `mode` field is sent in the request body, but the API routes and backend always apply the patient-mode qualitative-to-numeric mappers. Doctor-mode numeric features are never forwarded to the ML models.

**Solution:**  
1. In each frontend API route, check for `mode === 'doctor'` in the request body.  
2. When in doctor mode, pass numeric features directly as a flat array to a new backend endpoint or a query parameter:
```python
@app.post("/predict/diabetes", dependencies=[Depends(verify_key)])
async def predict_diabetes(data: DiabetesInput, mode: str = "patient"):
    if mode == "doctor":
        features = np.array([[data.pregnancies, data.glucose, ...]])  # Raw values
    else:
        features = map_diabetes_input(data)
```
3. Create separate Pydantic models for doctor-mode input (e.g., `DiabetesDoctorInput` with numeric fields matching the training data columns).

---

### `#11`

**type** — Security  
**issue** — No `.env.local` file — Google OAuth and production sessions will crash  
**desc** —  
**What's wrong:** The NextAuth config references `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXTAUTH_SECRET`, and `NEXTAUTH_URL` environment variables, but no `.env.local` file exists. Only an `.env.local.example` is present at the root. Google sign-in will crash at runtime, and JWT sessions won't work in production without `NEXTAUTH_SECRET`.

**Solution:**  
1. Copy `.env.local.example` to `frontend/.env.local` and fill in real values.  
2. For development, generate a secret: `openssl rand -base64 32`.  
3. Add Google OAuth credentials from [console.cloud.google.com](https://console.cloud.google.com).  
4. Required variables:
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXTAUTH_SECRET=generated-random-secret
NEXTAUTH_URL=http://localhost:3000
PYTHON_API_URL=http://localhost:8000
API_KEY=changeme
```

---

### `#12`

**type** — Security  
**issue** — API key defaults to "changeme" with inconsistent values across routes  
**desc** —  
**What's wrong:** The backend `config.py` defaults API_KEY to `"changeme"`. The frontend diabetes route also defaults to `"changeme"`, but the heart route defaults to `"your-api-key-here"`. When no env var is set, heart predictions will get a 401 error.

**Solution:**  
1. Standardize all frontend routes to use the same env var: `process.env.API_KEY || "changeme"`.  
2. For production, require the env var and fail fast instead of using a default:
```python
# config.py
API_KEY: str = os.environ["MODEL_API_KEY"]  # No default — crash if missing
```
3. Add validation in the frontend API routes to check the env var exists on startup.

---

### `#13`

**type** — Security  
**issue** — Hardcoded single-user credentials with no registration system  
**desc** —  
**What's wrong:** NextAuth credentials provider only accepts `admin@healthpredictor.com` / `admin123`. No user database, no registration flow, no password hashing. The sign-in page also claims "HIPAA Compliant" without any compliance infrastructure.

**Solution:**  
1. **Short term:** Add a simple user table in SQLite or PostgreSQL via Prisma ORM. Hash passwords with `bcrypt`. Wire NextAuth credentials provider to query the database.  
2. **Medium term:** Add a registration page at `/auth/signup` with email verification.  
3. Remove the "HIPAA Compliant" claim until actual compliance measures are in place (audit logging, encryption at rest, BAA agreements, access controls).  
4. Consider using NextAuth's built-in database adapters with `@auth/prisma-adapter`.

---

### `#14`

**type** — Security  
**issue** — Frontend API prediction routes have no authentication  
**desc** —  
**What's wrong:** Any unauthenticated request to `localhost:3000/api/predict/*` works — the Next.js API routes don't check for a valid NextAuth session before proxying to the backend.

**Solution:**  
Add session checking at the top of each API route:
```typescript
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  // ... proceed with prediction
}
```

---

### `#15`

**type** — ML  
**issue** — No cross-validation in any training notebook  
**desc** —  
**What's wrong:** All four notebooks use a single `train_test_split` to evaluate model performance. This gives unreliable accuracy estimates that vary based on the random split.

**Solution:**  
Add stratified k-fold cross-validation:
```python
from sklearn.model_selection import StratifiedKFold, cross_val_score

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
scores = cross_val_score(pipeline, X, Y, cv=cv, scoring='accuracy')
print(f"CV Accuracy: {scores.mean():.3f} ± {scores.std():.3f}")
```
Report mean ± std of CV scores instead of single-split accuracy.

---

### `#16`

**type** — ML  
**issue** — Duplicate model files in ML/ and Datasets/sav files/ are not identical  
**desc** —  
**What's wrong:** Both `ML/` and `Datasets/sav files/` contain `.sav` files for all three models. The server loads from `Datasets/sav files/` (older, Aug/Sep 2025) while `ML/` has newer versions (Jan 2026). File sizes differ by ~35 bytes — not exact copies. This creates confusion about which model version is actually being served.

**Solution:**  
1. Choose one canonical location — `Datasets/sav files/` — and delete the copies in `ML/`.  
2. Update notebooks to save directly to `Datasets/sav files/`.  
3. Add a model version tracking system — include a `model_metadata.json` alongside saved models:
```json
{
  "diabetes": { "version": "1.1", "trained": "2026-02-12", "accuracy_cv": 0.78, "sklearn_version": "1.4.0" },
  ...
}
```

---

### `#17`

**type** — ML  
**issue** — Augmented datasets may introduce synthetic bias  
**desc** —  
**What's wrong:** `diabetes.csv` was augmented from 768 → 4500 rows, `heart.csv` from 303 → 4500, `parkinsons.csv` from 195 → 4500. The augmentation method is unknown — if done via simple duplication or SMOTE without proper validation, it can inflate accuracy on augmented rows while not generalizing to real patients.

**Solution:**  
1. Document the augmentation method used (SMOTE, random oversampling, synthetic generation, etc.).  
2. Evaluate models on a **held-out portion of original (non-augmented) data** to get true accuracy.  
3. If using SMOTE, only apply it to the training set — never augment the test set.  
4. Consider using the original datasets with proper class balancing techniques instead of synthetic augmentation:
```python
from sklearn.utils.class_weight import compute_class_weight
class_weights = compute_class_weight('balanced', classes=np.unique(Y), y=Y)
model = svm.SVC(kernel='linear', class_weight='balanced', probability=True)
```

---

### `#18`

**type** — Frontend  
**issue** — AuthGuard component is effectively a no-op  
**desc** —  
**What's wrong:** `auth-guard.tsx` only gates content when `requiredForTabs` prop has entries. The default is `[]`, and prediction pages don't pass this prop — so all content is visible to unauthenticated users.

**Solution:**  
1. Wrap each prediction page in `AuthGuard`:
```tsx
<AuthGuard requiredForTabs={["prediction-results"]}>
  <DiabetesPredictionForm />
</AuthGuard>
```
2. Alternatively, use Next.js middleware for route-level protection:
```typescript
// middleware.ts
export { default } from "next-auth/middleware"
export const config = { matcher: ["/predict/:path*"] }
```

---

### `#19`

**type** — Frontend  
**issue** — Subscription modal payment is non-functional  
**desc** —  
**What's wrong:** `subscription-modal.tsx` shows pricing tiers (₹50/mo, ₹199/yr, Enterprise) but `handleSubscribe` only does `console.log()`. No payment gateway integration exists. No subscription state tracking.

**Solution:**  
1. Integrate Razorpay (India-focused) or Stripe for payment processing.  
2. Add a `subscriptions` table in the database linked to the user.  
3. Create a webhook endpoint `/api/webhooks/payment` to handle payment confirmations.  
4. Gate premium features behind subscription status checks:
```typescript
const { data: session } = useSession()
const isPremium = session?.user?.subscriptionStatus === 'active'
```

---

### `#20`

**type** — Backend  
**issue** — Debug print statements left in production code  
**desc** —  
**What's wrong:** `app.py` Parkinson's endpoint contains multiple `print(f"DEBUG: ...")` lines that leak internal information to server logs in production.

**Solution:**  
Replace all `print("DEBUG: ...")` with proper logger calls:
```python
logger.debug(f"Features shape: {features.shape}")
logger.debug(f"Prediction: {prediction}")
```
Set log level to `WARNING` in production via `config.py` (already configured — just remove the `print` statements).

---

### `#21`

**type** — Backend  
**issue** — No rate limiting or abuse protection on API endpoints  
**desc** —  
**What's wrong:** Any client with the API key can make unlimited requests. No request throttling, no abuse detection.

**Solution:**  
Add `slowapi` rate limiting:
```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.post("/predict/diabetes", dependencies=[Depends(verify_key)])
@limiter.limit("10/minute")
async def predict_diabetes(request: Request, data: DiabetesInput):
    ...
```
Add `slowapi` to `requirements.txt`.

---

### `#22`

**type** — Backend  
**issue** — No prediction logging or audit trail  
**desc** —  
**What's wrong:** Predictions are stateless — no history is stored. This prevents monitoring model drift, auditing usage, or providing users with their prediction history.

**Solution:**  
1. Add a lightweight SQLite/PostgreSQL database table for prediction logs.  
2. Log: timestamp, user_id (if authenticated), model name, input hash, prediction, confidence.  
3. Use `sqlmodel` or `sqlalchemy` for the ORM:
```python
class PredictionLog(SQLModel, table=True):
    id: int = Field(primary_key=True)
    timestamp: datetime
    user_id: str | None
    model: str
    prediction: str
    confidence: float
```

---

### `#23`

**type** — Backend  
**issue** — The `api/` folder at project root is empty  
**desc** —  
**What's wrong:** An empty `api/` directory exists at the project root alongside `server/`. It appears to be a placeholder or leftover. This creates confusion about project structure.

**Solution:**  
Either remove the empty `api/` folder or document its intended purpose. The actual API lives in `server/`.

---

### `#24`

**type** — Testing  
**issue** — Test suite is manual scripts, not automated pytest tests  
**desc** —  
**What's wrong:** `server/tests/test_api.py` and `test_models.py` are standalone scripts that use `requests` and `print` statements. They're not compatible with `pytest`, don't assert results programmatically, and can't be integrated into CI/CD.

**Solution:**  
Rewrite using `pytest` and `httpx` (FastAPI's recommended test client):
```python
import pytest
from httpx import AsyncClient, ASGITransport
from app import app

@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

@pytest.mark.asyncio
async def test_diabetes_high_risk(client):
    response = await client.post("/predict/diabetes",
        headers={"X-API-Key": "changeme"},
        json={"excessiveThirst": "often", ...})
    assert response.status_code == 200
    assert response.json()["prediction"] == "High Risk"
```
Add `pytest`, `httpx`, `pytest-asyncio` to `requirements.txt`.

---

### `#25`

**type** — ML  
**issue** — Architecture diagram accuracy values are hardcoded and incorrect  
**desc** —  
**What's wrong:** `ML/generate_architecture_diagrams.py` hardcodes: Diabetes 78%, Heart 85%, Parkinson's 87%, Common 97%. Actual tested accuracies are: 68.6%, 66.8%, 77.6%, 83.5%.

**Solution:**  
1. After retraining with proper scaling/tuning, update the values to match real metrics.  
2. Better: read accuracy from a `model_metadata.json` file instead of hardcoding:
```python
import json
with open('Datasets/model_metadata.json') as f:
    meta = json.load(f)
diabetes_acc = meta['diabetes']['accuracy_cv']
```

---

## Nice-to-Have Features

---

### Database & User System
- PostgreSQL or MongoDB for user accounts, prediction history, subscription tracking
- Prisma ORM on the frontend side, SQLModel on the backend
- Email verification flow, password reset  
- Role-based access: free-tier (limited predictions/day), premium (unlimited), admin

### Prediction History & Reports
- Save every prediction to user's history dashboard
- PDF report generation with prediction details, risk factors, recommendations
- Trend tracking — show how risk scores change over time with charts
- Shareable report links for sharing with healthcare providers

### CI/CD & DevOps
- GitHub Actions workflow: lint → test → build → deploy
- Docker + docker-compose for single-command local setup
- Separate staging and production environments
- Automated model retraining pipeline on new data

### Enhanced UI/UX
- Dark/light theme toggle (theme-provider exists but may not be fully wired)
- Loading skeletons instead of spinners
- Animated result cards with risk visualization (gauge charts, progress rings)
- Comparison view — run predictions for different symptom sets side by side
- Accessibility audit (ARIA labels, keyboard navigation, screen reader support)

### Monitoring & Observability
- Application monitoring (Sentry for errors, Vercel Analytics already included)
- Model performance monitoring — track prediction distribution drift over time
- API usage dashboard for admin panel
- Health check dashboard showing all model statuses live

### Medicine Recommendation Engine
- `medicine.csv` (24K drugs) is loaded but unused — build a post-prediction recommendation system
- After a disease prediction, suggest relevant medications with dosages, side effects, manufacturers
- Add drug interaction warnings
- Filter by prescription_required, price range, generic availability

### Multi-language Support
- i18n framework (next-intl) for Hindi, Marathi, and other regional languages
- Translatable symptom descriptions and result explanations
- RTL support for applicable languages

### Mobile App
- React Native or Expo wrapper around the existing Next.js app
- Push notifications for health check reminders
- Offline prediction capability using ONNX models (export_onnx.py already exists)

---

## Future Feature: LLM Integration

---

### Overview
Integrate a fine-tuned or API-based LLM (GPT-4o, Claude, Gemini, or open-source Llama/Mistral) to provide intelligent natural-language capabilities on top of the existing ML predictions.

### Use Cases

**1. Post-Prediction Explainer**  
After the ML model returns a prediction, pass the result + input symptoms to the LLM to generate a personalized, plain-English explanation:
> "Based on your symptoms — frequent chest pain, severe breathing difficulty, and sedentary lifestyle — the model identified a high cardiovascular risk (60% confidence). This doesn't mean you have heart disease, but it suggests you should consult a cardiologist. Key factors that increased your risk score were..."

**2. Conversational Symptom Intake (Chatbot)**  
Replace static dropdowns with a medical chatbot that collects symptoms through conversation:
```
User: "I've been having headaches and feeling dizzy for a week"
LLM: "I'm sorry to hear that. Can you tell me more — do you also experience nausea, sensitivity to light, or blurred vision?"
→ Extracted symptoms: [headache, dizziness] → fed to ML model
```

**3. Medical Q&A After Prediction**  
Allow users to ask follow-up questions about their results:
- "What lifestyle changes can reduce my diabetes risk?"
- "Should I get blood work done based on these results?"
- "What does this confidence score mean?"

**4. Smart Report Generation**  
LLM writes a full medical summary report combining ML predictions, risk factors, and recommendations — formatted for both patients and healthcare providers.

**5. Drug Recommendation Explanations**  
Feed `medicine.csv` data through RAG (Retrieval-Augmented Generation) to explain recommended medications in plain language, including side effects and alternatives.

### Recommended Architecture

```
Frontend Chat Widget
        ↓
  /api/chat (Next.js)
        ↓
  /chat endpoint (FastAPI)
        ↓
  ┌─────────────────┐
  │  LLM Service    │
  │  - System prompt│ ← medical context + safety guardrails
  │  - RAG pipeline │ ← medicine.csv + prediction history
  │  - Streaming    │ ← SSE for real-time responses
  └─────────────────┘
```

### Option A: API-Based (GPT-4o / Claude)
- **Pros:** Best quality, no infrastructure, fast to implement
- **Cons:** Per-token cost, data leaves your server, rate limits
- **Implementation:** OpenAI SDK or Anthropic SDK in FastAPI, stream responses via SSE
- **Cost:** ~$2-5 per 1M tokens (GPT-4o-mini) or ~$15/1M (GPT-4o)

### Option B: Self-Hosted Fine-Tuned (Llama 3 / Mistral)
- **Pros:** Full data control, no per-request cost, HIPAA-compatible
- **Cons:** Needs GPU server (A100/H100), fine-tuning effort, lower quality than GPT-4o
- **Implementation:** vLLM or Ollama for serving, fine-tune on medical QA datasets (MedQA, PubMedQA)
- **Cost:** ~$1-3/hr GPU compute (or one-time $500-2000 for fine-tuning on cloud)

### Option C: Hybrid
- Use **GPT-4o** for complex explanations and report generation
- Use **Llama 3 8B** locally for simple Q&A and symptom extraction
- Route based on complexity — save cost while maintaining quality

### Safety Guardrails (Critical for Medical LLM)
```python
SYSTEM_PROMPT = """You are a medical information assistant for Health Predictor.
RULES:
1. NEVER diagnose — always say "the model suggests" or "this indicates"
2. ALWAYS recommend consulting a healthcare professional
3. NEVER prescribe medication dosages
4. Include disclaimers about AI limitations
5. If the user describes an emergency, direct them to call emergency services
6. Do not store or reference patient identity information
"""
```

### Implementation Priority
1. **Phase 1:** Add post-prediction explanation using GPT-4o-mini API (lowest effort, highest impact)
2. **Phase 2:** Build RAG pipeline over medicine.csv for drug recommendations
3. **Phase 3:** Conversational symptom chatbot
4. **Phase 4:** Evaluate self-hosted model for cost optimization

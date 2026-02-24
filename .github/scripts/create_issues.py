"""
create_issues.py
Reads the TASKS.md issue definitions and creates any that don't already exist
as GitHub issues in this repository.

Usage (requires GITHUB_TOKEN and GITHUB_REPOSITORY env vars):
    python .github/scripts/create_issues.py

Set DRY_RUN=1 to only print what would be created without actually creating.
"""

import os
import sys
import json
import urllib.error
import urllib.parse
import urllib.request

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN", "")
GITHUB_REPOSITORY = os.environ.get("GITHUB_REPOSITORY", "Sahilbhatane/Health-Predictor---V2")
DRY_RUN = os.environ.get("DRY_RUN", "0") == "1"
API_BASE = "https://api.github.com"

if not GITHUB_TOKEN:
    print("ERROR: GITHUB_TOKEN environment variable is not set.")
    sys.exit(1)

OWNER, REPO = GITHUB_REPOSITORY.split("/", 1)

# ---------------------------------------------------------------------------
# GitHub API helpers
# ---------------------------------------------------------------------------

def gh_request(method: str, path: str, body: dict | None = None):
    url = f"{API_BASE}{path}"
    data = json.dumps(body).encode() if body else None
    req = urllib.request.Request(
        url,
        data=data,
        method=method,
        headers={
            "Authorization": f"Bearer {GITHUB_TOKEN}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "Content-Type": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as exc:
        body_text = exc.read().decode()
        print(f"  HTTP {exc.code} {method} {path}: {body_text[:200]}")
        raise


def get_all_issues():
    """Return a set of lower-cased issue titles currently in the repo."""
    titles = set()
    page = 1
    while True:
        items = gh_request("GET", f"/repos/{OWNER}/{REPO}/issues?state=all&per_page=100&page={page}")
        if not items:
            break
        for item in items:
            if "pull_request" not in item:
                titles.add(item["title"].strip().lower())
        if len(items) < 100:
            break
        page += 1
    return titles


def ensure_label(name: str, color: str, description: str):
    """Create the label if it doesn't already exist."""
    try:
        gh_request("GET", f"/repos/{OWNER}/{REPO}/labels/{urllib.parse.quote(name)}")
        print(f"  Label '{name}' already exists.")
    except urllib.error.HTTPError as exc:
        if exc.code == 404:
            if DRY_RUN:
                print(f"  [DRY RUN] Would create label '{name}'.")
                return
            gh_request("POST", f"/repos/{OWNER}/{REPO}/labels", {
                "name": name, "color": color, "description": description
            })
            print(f"  Created label '{name}'.")
        else:
            raise


def create_issue(title: str, body: str, labels: list[str]):
    if DRY_RUN:
        print(f"  [DRY RUN] Would create issue: {title!r}")
        return
    result = gh_request("POST", f"/repos/{OWNER}/{REPO}/issues", {
        "title": title,
        "body": body,
        "labels": labels,
    })
    print(f"  Created issue #{result['number']}: {title!r}")


# ---------------------------------------------------------------------------
# Issue definitions — sourced directly from TASKS.md
# ---------------------------------------------------------------------------

ISSUES = [
    {
        "title": "Parkinson's frontend API route is 100% mock with no backend proxy",
        "labels": ["Frontend"],
        "body": """\
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
""",
    },
    {
        "title": "Common diseases frontend API route is 100% mock with no backend proxy",
        "labels": ["Frontend"],
        "body": """\
**What's wrong:** `frontend/app/api/predict/common-diseases/route.ts` implements elaborate rule-based logic but never calls the FastAPI `/predict/common` endpoint.

**Solution:**
Rewrite to proxy to `${PYTHON_API_URL}/predict/common` following the same pattern as diabetes/heart routes. Ensure the request body matches the `CommonInput` Pydantic model: `{ symptoms: string[], duration: string, severity: string, age: string, medicalHistory: string }`.
""",
    },
    {
        "title": "Double `request.json()` in catch blocks crashes fallback logic",
        "labels": ["Frontend"],
        "body": """\
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
""",
    },
    {
        "title": "Doctor mode clinical inputs are completely ignored",
        "labels": ["Frontend"],
        "body": """\
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
""",
    },
    {
        "title": "No `.env.local` file — Google OAuth and production sessions will crash",
        "labels": ["Security"],
        "body": """\
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
""",
    },
    {
        "title": "API key defaults to \"changeme\" with inconsistent values across routes",
        "labels": ["Security"],
        "body": """\
**What's wrong:** The backend `config.py` defaults API_KEY to `"changeme"`. The frontend diabetes route also defaults to `"changeme"`, but the heart route defaults to `"your-api-key-here"`. When no env var is set, heart predictions will get a 401 error.

**Solution:**
1. Standardize all frontend routes to use the same env var: `process.env.API_KEY || "changeme"`.
2. For production, require the env var and fail fast instead of using a default:
```python
# config.py
API_KEY: str = os.environ["MODEL_API_KEY"]  # No default — crash if missing
```
3. Add validation in the frontend API routes to check the env var exists on startup.
""",
    },
    {
        "title": "Hardcoded single-user credentials with no registration system",
        "labels": ["Security"],
        "body": """\
**What's wrong:** NextAuth credentials provider only accepts `admin@healthpredictor.com` / `admin123`. No user database, no registration flow, no password hashing. The sign-in page also claims "HIPAA Compliant" without any compliance infrastructure.

**Solution:**
1. **Short term:** Add a simple user table in SQLite or PostgreSQL via Prisma ORM. Hash passwords with `bcrypt`. Wire NextAuth credentials provider to query the database.
2. **Medium term:** Add a registration page at `/auth/signup` with email verification.
3. Remove the "HIPAA Compliant" claim until actual compliance measures are in place (audit logging, encryption at rest, BAA agreements, access controls).
4. Consider using NextAuth's built-in database adapters with `@auth/prisma-adapter`.
""",
    },
    {
        "title": "Frontend API prediction routes have no authentication",
        "labels": ["Security"],
        "body": """\
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
""",
    },
    {
        "title": "No cross-validation in any training notebook",
        "labels": ["ML"],
        "body": """\
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
""",
    },
    {
        "title": "Duplicate model files in ML/ and Datasets/sav files/ are not identical",
        "labels": ["ML"],
        "body": """\
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
""",
    },
    {
        "title": "Augmented datasets may introduce synthetic bias",
        "labels": ["ML"],
        "body": """\
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
""",
    },
    {
        "title": "AuthGuard component is effectively a no-op",
        "labels": ["Frontend"],
        "body": """\
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
""",
    },
    {
        "title": "Subscription modal payment is non-functional",
        "labels": ["Frontend"],
        "body": """\
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
""",
    },
    {
        "title": "Debug print statements left in production code",
        "labels": ["Backend"],
        "body": """\
**What's wrong:** `app.py` Parkinson's endpoint contains multiple `print(f"DEBUG: ...")` lines that leak internal information to server logs in production.

**Solution:**
Replace all `print("DEBUG: ...")` with proper logger calls:
```python
logger.debug(f"Features shape: {features.shape}")
logger.debug(f"Prediction: {prediction}")
```
Set log level to `WARNING` in production via `config.py` (already configured — just remove the `print` statements).
""",
    },
    {
        "title": "No prediction logging or audit trail",
        "labels": ["Backend"],
        "body": """\
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
""",
    },
    {
        "title": "The `api/` folder at project root is empty",
        "labels": ["Backend"],
        "body": """\
**What's wrong:** An empty `api/` directory exists at the project root alongside `server/`. It appears to be a placeholder or leftover. This creates confusion about project structure.

**Solution:**
Either remove the empty `api/` folder or document its intended purpose. The actual API lives in `server/`.
""",
    },
    {
        "title": "Architecture diagram accuracy values are hardcoded and incorrect",
        "labels": ["ML"],
        "body": """\
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
""",
    },
]

# Labels that need to exist (name → (color, description))
REQUIRED_LABELS = {
    "Security": ("d73a4a", "Security-related issues"),
}

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------


def main():
    print(f"Repository : {OWNER}/{REPO}")
    print(f"Dry run    : {DRY_RUN}")
    print()

    # 1. Ensure required labels exist
    print("=== Ensuring labels ===")
    for label_name, (color, desc) in REQUIRED_LABELS.items():
        ensure_label(label_name, color, desc)
    print()

    # 2. Fetch existing issue titles
    print("=== Fetching existing issues ===")
    existing_titles = get_all_issues()
    print(f"  Found {len(existing_titles)} existing issues.")
    print()

    # 3. Create missing issues
    print("=== Creating missing issues ===")
    created = 0
    skipped = 0
    for issue in ISSUES:
        title = issue["title"]
        if title.strip().lower() in existing_titles:
            print(f"  SKIP (exists): {title!r}")
            skipped += 1
        else:
            print(f"  Creating: {title!r}")
            create_issue(title, issue["body"], issue["labels"])
            created += 1

    print()
    print(f"Done — created: {created}, skipped (already existed): {skipped}")


if __name__ == "__main__":
    main()

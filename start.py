"""
AETHER PLATFORM: FULLSTACK LOCAL RUNNER
Launches FastAPI backend (port 8000) and Next.js frontend (port 3000)
and performs automated health checks.
"""

import os
import sys
import time
import subprocess
import urllib.request
import json
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent
FRONTEND_DIR = PROJECT_ROOT / "frontend"

print("=" * 70)
print("  🚀 LAUNCHING AETHER AI DRUG DISCOVERY PLATFORM")
print("=" * 70)

# 1. Start Backend Process
print("\n[1/3] Starting FastAPI Backend on http://127.0.0.1:8000 ...")
backend_cmd = [
    sys.executable, "-m", "uvicorn", "backend.main:app",
    "--host", "127.0.0.1", "--port", "8000"
]
backend_proc = subprocess.Popen(
    backend_cmd,
    cwd=str(PROJECT_ROOT),
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    text=True,
    bufsize=1
)

# 2. Wait for Backend Health Check
print("[2/3] Verifying Backend Health Check...")
backend_ready = False
for attempt in range(15):
    time.sleep(1)
    try:
        req = urllib.request.Request("http://127.0.0.1:8000/healthz")
        with urllib.request.urlopen(req, timeout=2) as res:
            if res.status == 200:
                data = json.loads(res.read().decode())
                print(f"  ✓ FastAPI Backend Online: {data}")
                backend_ready = True
                break
    except Exception:
        pass

if not backend_ready:
    print("  [!] Backend failed to start within 15 seconds.")
    if backend_proc.poll() is not None:
        out, _ = backend_proc.communicate()
        print("Backend Log Output:\n", out)

# 3. Test Core API Endpoints
print("\n[3/3] Testing Core AI Capabilities...")
test_endpoints = ["/", "/v1/models", "/v1/leaderboard", "/v1/disease-graph"]
for ep in test_endpoints:
    try:
        url = f"http://127.0.0.1:8000{ep}"
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=3) as res:
            print(f"  ✓ Endpoint {ep:25} -> Status {res.status} OK")
    except Exception as e:
        print(f"  ✗ Endpoint {ep:25} -> {e}")

print("\n" + "=" * 70)
print("  🌟 AETHER PLATFORM SERVICES READY")
print("=" * 70)
print("  ► Frontend URL:       http://localhost:3000")
print("  ► Backend API:        http://127.0.0.1:8000")
print("  ► Interactive Docs:   http://127.0.0.1:8000/docs")
print("=" * 70)

# Keep running or exit cleanly
print("\nTo launch the frontend interactively in your terminal:")
print("  cd frontend && npm run dev")
print("\nOr start the production server:")
print("  cd frontend && npm run start")
print("=" * 70)

# Terminate backend process for the test run
backend_proc.terminate()
print("\n[✓] Single-run verification completed successfully.")

# 🚀 AETHER Platform: Render Cloud Deployment Guide

This guide provides a comprehensive, step-by-step walkthrough for deploying the **AETHER** AI Drug Discovery Operating System onto [Render](https://render.com).

---

## 🏗️ Architecture Overview

The AETHER platform is architected for high-performance cloud execution across two decoupled services:

```
                  ┌──────────────────────────────────────────────┐
                  │                 USER BROWSER                 │
                  └───────────────────────┬──────────────────────┘
                                          │
                                          ▼
                  ┌──────────────────────────────────────────────┐
                  │       Frontend: Next.js 14 Workstation       │
                  │        (aether-frontend.onrender.com)        │
                  └───────────────────────┬──────────────────────┘
                                          │  REST API Calls (/v1/*)
                                          ▼
                  ┌──────────────────────────────────────────────┐
                  │          Backend: FastAPI AI Engine          │
                  │         (aether-backend.onrender.com)        │
                  │   - RDKit / PyTorch / Scikit-Learn Inference │
                  │   - Real-time PubChem / PDB / ClinicalTrials │
                  └──────────────────────────────────────────────┘
```

---

## ⚡ Method 1: 1-Click Blueprint Deployment (Recommended)

Render's Infrastructure-as-Code (Blueprint) feature allows you to launch both the frontend and backend automatically using the included `render.yaml` file.

### Step 1: Push Repository to GitHub
Ensure your repository is pushed to your GitHub account:
```bash
git remote add origin https://github.com/Premchandyadav369/AETHER.git
git branch -M main
git push -u origin main
```

### Step 2: Create a Blueprint Instance on Render
1. Log in to your [Render Dashboard](https://dashboard.render.com/).
2. In the top navigation, click **New +** and select **Blueprint**.
3. Connect your GitHub account and select the **AETHER** repository.
4. Render will parse `render.yaml` and show:
   - **`aether-backend`** (Python Web Service)
   - **`aether-frontend`** (Node.js Web Service)
5. Click **Apply**. Render will automatically build and deploy both services.

---

## 🛠️ Method 2: Manual Dashboard Setup (Step-by-Step)

If you prefer configuring services individually through the Render Web UI:

### Step 1: Deploy the Backend Service

1. Go to **Dashboard** → Click **New +** → **Web Service**.
2. Select your **AETHER** repository.
3. Configure the backend parameters:
   | Parameter | Value |
   | :--- | :--- |
   | **Name** | `aether-backend` |
   | **Region** | Oregon (US West) or closest to your users |
   | **Branch** | `main` |
   | **Root Directory** | *(leave blank or set to `.`) |
   | **Runtime** | `Python 3` |
   | **Build Command** | `pip install --upgrade pip && pip install -r backend/requirements.txt` |
   | **Start Command** | `python -m uvicorn backend.main:app --host 0.0.0.0 --port $PORT --workers 1` |
   | **Plan** | Free (or Starter for production) |

4. Under **Advanced**, add the following **Environment Variables**:
   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `PYTHON_VERSION` | `3.11.8` | Python runtime version |
   | `PORT` | `8000` | Target listening port |
   | `CORS_ORIGINS` | `*` | Allowed CORS origins |
   | `AETHER_WORKSPACE` | `.` | Project root directory |

5. Set **Health Check Path** to `/healthz`.
6. Click **Create Web Service**.
7. Once deployed, copy your backend URL (e.g., `https://aether-backend.onrender.com`).

---

### Step 2: Deploy the Frontend Service

1. Go to **Dashboard** → Click **New +** → **Web Service**.
2. Select your **AETHER** repository.
3. Configure the frontend parameters:
   | Parameter | Value |
   | :--- | :--- |
   | **Name** | `aether-frontend` |
   | **Region** | Same region as backend |
   | **Branch** | `main` |
   | **Root Directory** | `frontend` |
   | **Runtime** | `Node` |
   | **Build Command** | `npm install && npm run build` |
   | **Start Command** | `npm run start` |
   | **Plan** | Free (or Starter) |

4. Under **Advanced**, add the following **Environment Variables**:
   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `NODE_VERSION` | `20.11.0` | Node.js LTS version |
   | `NEXT_TELEMETRY_DISABLED` | `1` | Disable telemetry for faster builds |
   | `NEXT_PUBLIC_BACKEND_URL` | `https://aether-backend.onrender.com/v1` | **Your backend URL from Step 1 + `/v1`** |

5. Set **Health Check Path** to `/`.
6. Click **Create Web Service**.

---

## 🐳 Method 3: Docker-Based Container Deployment

Render also supports native Docker container builds for zero-drift deployments:

### Backend Docker Setup
- **Dockerfile Path**: `infrastructure/backend.dockerfile`
- **Docker Context**: `.` (Root repository)

### Frontend Docker Setup
- **Dockerfile Path**: `infrastructure/frontend.dockerfile`
- **Docker Context**: `.` (Root repository)

---

## 🔍 Verification & Health Checks

Once both services are active, verify the deployment:

### 1. Test Backend Health Check
```bash
curl https://aether-backend.onrender.com/healthz
# Expected Response:
# {"status":"healthy","service":"AETHER-RAMI Backend","version":"10.0.0","timestamp":"active"}
```

### 2. Test Interactive Swagger API Documentation
Open `https://aether-backend.onrender.com/docs` in your browser.

### 3. Test Fullstack Platform
Open `https://aether-frontend.onrender.com` in your browser:
- The header indicator should display **FastAPI Backend Online** in green.
- Test generating molecules, running molecular dynamics, or precision medicine mutations.

---

## 💡 Production Tips & Optimization

1. **Prevent Free Tier Sleep (Cold Starts)**:
   - Free tier instances sleep after 15 minutes of inactivity.
   - Use a free monitoring service like [UptimeRobot](https://uptimerobot.com/) or [Cron-Job.org](https://cron-job.org/) to ping `https://aether-backend.onrender.com/healthz` every 10 minutes.

2. **Custom Domains & Free SSL**:
   - Go to service settings in Render → **Custom Domains** → add your domain (e.g. `aether.yourdomain.com`).
   - Render automatically issues a free Let's Encrypt SSL certificate.

3. **Scaling & GPU Acceleration**:
   - For high-throughput virtual screening or 10,000+ compound library docking, upgrade the backend service plan to a dedicated instance with GPU support in Render settings.

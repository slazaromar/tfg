# ⚽ TacticAI — Intelligent Football Lineup Recommendation System

A full-stack application that generates AI-powered recommended lineups for football matches based on player characteristics.

## 🚀 Quick Start

### Requirements
- **Docker** (v24.0+)
- **Git**

### Installation & Execution

```bash
# Clone the repository
git clone https://github.com/your-org/tacticai.git
cd tacticai

# Start the application
docker compose up --build
```

### Access

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:3000 |
| Backend API | http://localhost:4000 |
| Recommendation Engine | http://localhost:8000 |
| API Documentation | http://localhost:8000/docs |

### Test Credentials

```
Email:    admin@tacticai.com
Password: Admin1234!
```

## 📖 Setup & Troubleshooting

For detailed setup instructions and troubleshooting, see [INSTALL.md](INSTALL.md).

## 🏗️ Architecture

- **Frontend**: React SPA
- **Backend**: Node.js + Express REST API
- **Recommendation Engine**: FastAPI with ML scoring
- **Database**: PostgreSQL with Redis caching
- **Infrastructure**: Docker Compose

### Prerequisites
- Docker & Docker Compose
- Node.js 18+
- Python 3.11+
- Git

### 1. Clone the repository
```bash
git clone https://github.com/your-org/tactic-ai.git
cd tactic-ai
```

### 2. Configure environment variables
```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Start all services
```bash
docker-compose up --build
```

### 4. Access the application
| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:4000 |
| Recommendation Engine | http://localhost:8000 |
| API Docs (FastAPI) | http://localhost:8000/docs |
| pgAdmin | http://localhost:5050 |

---

## 🔐 Authentication

JWT-based authentication with access tokens (15 min) and refresh tokens (7 days).

**Default credentials (development):**
- Email: `admin@tacticai.com`
- Password: `Admin1234!`

---

## 📊 Recommendation Algorithm

The recommendation engine scores each available player using a weighted formula:

$$\text{Score} = w_1 \cdot \text{FormRating} + w_2 \cdot \text{RoleScore} + w_3 \cdot \text{ContractScore} + w_4 \cdot \text{OverallRating}$$

| Factor | Weight | Description |
|--------|--------|-------------|
| Form Rating | 40% | Recent match performance (1–10) |
| Team Role | 30% | Starter > Rotation > Reserve > Youth |
| Contract Stability | 20% | Years remaining on contract |
| Overall Rating | 10% | General player quality (1–100) |

Players who are injured or suspended are automatically excluded.

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Axios, TailwindCSS |
| Backend | Node.js 18, Express 4, JWT, bcrypt |
| Recommendation | Python 3.11, FastAPI, Pandas, NumPy |
| Database | PostgreSQL 15 |
| Cache | Redis 7 |
| Infrastructure | AWS CloudFormation (ECS, RDS, ElastiCache, ALB) |
| Containerization | Docker, Docker Compose |
| CI/CD | GitHub Actions |

---

## 🌿 Git Workflow

```
main          ← production releases
develop       ← integration branch
feature/*     ← new features
fix/*         ← bug fixes
hotfix/*      ← critical production fixes
```

---

## ☁️ AWS Infrastructure

- **VPC** — Isolated network with public/private subnets across 2 AZs
- **ECS Fargate** — Serverless containers for all services
- **RDS PostgreSQL** — Multi-AZ managed database
- **ElastiCache Redis** — Managed Redis cluster
- **ALB** — Application Load Balancer with SSL termination
- **ECR** — Container registry
- **Secrets Manager** — Secure credential storage

### Deploy Infrastructure
```bash
cd infrastructure
./deploy.sh --env production --region eu-west-1
```

---

## 🧪 Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# Recommendation engine tests
cd recommendation-engine && pytest
```

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

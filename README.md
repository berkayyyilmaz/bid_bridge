# 🚢 Bid Bridge - Maritime Logistics Platform

[![Build Status](https://github.com/berkay/bid_bridge/workflows/CI/badge.svg)](https://github.com/berkay/bid_bridge/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue.svg)](https://www.postgresql.org/)

> A modern SaaS platform for maritime logistics companies to streamline the export shipping quotation process.

## 📖 Overview

Bid Bridge is a comprehensive platform that digitalizes the quotation process for maritime transportation companies. It enables cargo owners (exporters) to collect, compare, and select the best offers from various logistics firms, while providing logistics companies with an efficient way to submit competitive bids.

### 🎯 Key Features

- **📝 Job Creation**: Cargo owners can create shipping jobs with custom fields and requirements
- **💰 Quote Management**: Logistics companies can submit detailed quotes with pricing and transit times
- **📊 Comparison Tools**: Advanced filtering and comparison features for quote evaluation
- **⏰ Deadline Management**: Automated deadline enforcement for quote submissions
- **📧 Notifications**: Email-based communication system for all stakeholders
- **🏢 Multi-tenant**: Company-based data isolation and custom field management

## 🏗️ Architecture

```
┌─────────────────┐    HTTPS    ┌─────────────────┐    REST API    ┌─────────────────┐
│                 │ ────────────▶│                 │ ──────────────▶│                 │
│   Next.js 14    │              │  Spring Boot 3  │                │  PostgreSQL 15  │
│   Frontend      │◀────────────│    Backend      │◀──────────────│    Database     │
│                 │              │                 │                │                 │
└─────────────────┘              └─────────────────┘                └─────────────────┘
```

### Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| **Frontend** | Next.js, React, TypeScript, TailwindCSS | 14.x, 18.x, 5.x, 3.4.x |
| **Backend** | Java, Spring Boot, Spring Security, JPA/Hibernate | 17, 3.3.x |
| **Database** | PostgreSQL, Redis | 15.x, 7.x |
| **DevOps** | Docker, Kubernetes, GitHub Actions | Latest |
| **Testing** | JUnit 5, Testcontainers, Jest | Latest |

## 🚀 Quick Start

### Prerequisites

- Java 17+
- Node.js 18+
- PostgreSQL 15+
- Docker & Docker Compose

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/berkay/bid_bridge.git
   cd bid_bridge
   ```

2. **Start the database**
   ```bash
   docker-compose up -d postgres
   ```

3. **Setup Backend**
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

4. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080

## 📊 Database Schema

The platform uses a PostgreSQL database with the following core entities:

- **Companies**: Organization profiles and settings
- **Users**: User accounts with role-based access
- **Jobs**: Shipping job definitions with custom fields
- **Quotes**: Bid submissions from logistics companies
- **Notifications**: System-generated alerts and updates

For detailed schema information, see [database.md](docs/database.md).

## 🔧 Development

### Project Structure

```
bid_bridge/
├── frontend/          # Next.js application
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/           # Spring Boot application
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
├── docs/              # Project documentation
└── docker-compose.yml
```

### Running Tests

**Backend Tests**
```bash
cd backend
./mvnw test
```

**Frontend Tests**
```bash
cd frontend
npm test
```

### Code Quality

- **Frontend**: ESLint + Prettier with Airbnb configuration
- **Backend**: Spotless + Google Java Format
- **Pre-commit**: Husky hooks for automated checks

## 📚 Documentation

- [Product Requirements Document](docs/prd.md)
- [System Architecture](docs/architecture.md)
- [Database Design](docs/database.md)
- [Technology Stack](docs/tech-stack.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/) format:
```
type(scope?): subject

Examples:
feat(auth): add JWT token validation
fix(quotes): resolve deadline calculation bug
docs: update API documentation
```

## 🧪 Testing

- **Backend**: 80%+ line coverage with JaCoCo
- **Frontend**: 70%+ line coverage with Jest
- **Integration**: Testcontainers for database testing
- **E2E**: Playwright for end-to-end testing

## 🚢 Deployment

### Docker

```bash
# Build and run with Docker Compose
docker-compose up --build

# Production deployment
docker-compose -f docker-compose.prod.yml up -d
```

### Kubernetes

```bash
# Apply Kubernetes manifests
kubectl apply -f k8s/
```

## 📈 Roadmap

- [x] **MVP**: Core job and quote management
- [ ] **Notifications**: Email and in-app notifications
- [ ] **Advanced Analytics**: Reporting and insights
- [ ] **Mobile App**: React Native application
- [ ] **API v2**: GraphQL API implementation
- [ ] **Microservices**: Service decomposition for scale

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

- 📧 Email: support@bidbridge.com
- 💬 Discord: [Join our community](https://discord.gg/bidbridge)
- 🐛 Issues: [GitHub Issues](https://github.com/berkay/bid_bridge/issues)

---

Made with ❤️ by the Bid Bridge team

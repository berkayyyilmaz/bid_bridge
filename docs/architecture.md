# Sistem Mimarisi

## 1. Genel Bakış
Kapsam – çift konteyner (monorepo) mimarisi:  
* **Frontend (Nx → Next.js 14 + TypeScript)**  
* **Backend (Spring Boot 3.3, Java 17)**  
Yatayda **PostgreSQL 15** veritabanı ve **Redis** (ops.) önbelleği; dikeyde CI/CD (GitHub Actions) → Docker / Compose → prod için K8s.

## 2. Dizin Yerleşimi
frontend/   # Next.js (app router)
backend/    # Spring Boot monolith (MVC + Hexagonal servis katmanı)
docs/       # belge ve modeller (bu dosya dâhil)
.cursor/    # Cursor kural ve ayarları (aynı zamanda frontend ve backend içinde de mevcut kendilerine ait)

## 3. İletişim Akışı
[Browser] → HTTPS → Next.js (SSR / API route) ─► /api/* → Reverse-Proxy (traefik) → Spring Boot
Spring Boot ──► JPA/Hibernate ─► PostgreSQL

> Frontend, sunucu taraflı render (SSR) & statik sayfayı karma çalıştırır; sadece iş mantığı gerektiren istekleri `/api` ile backend’e iletir.

## 4. Katmanlandırma (Backend)
* **Controller** → **Service** → **Repository (JPA)**  
* DTO <-> Entity haritalama için MapStruct  
* Domain servisleri “port/adapter” prensibine göre test edilebilir tutulur.

## 5. Veri Modeli ve Eskiz
High-level ER diyagramı docs/database.md’de; ana tablolar: **users**, **companies**, **jobs**, **quotes**.

## 6. Çapraz Konular
* Güvenlik: Spring Security + JWT; CSRF, CORS sınırlı beyaz liste  
* Gözlemlenebilirlik: Actuator + Micrometer (Prometheus)  
* Test: JUnit 5, Testcontainers (PostgreSQL), REST-assured  
* CI/CD: GitHub Actions → Docker Build + Push → Staging (k8s)  
* Infra kodu: Terraform (opsiyonel)

## 7. Gelişim Yol Haritası
1. **MVP**: kimlik yönetimi + teklif CRUD  
2. **Bildirim servisi** (e-posta)  
3. **Çoklu tenant mimarisi / şirket bazlı alanlar**  
4. **Ölçekleme – ayrı BFF katmanı veya gRPC mikroservis ayırımı**
# Product Requirements Document (PRD)

## 1. Introduction

Bu proje, deniz taşımacılığı yapan firmaların ihracat yükleri için teklif alma sürecini dijitalleştirmeyi amaçlayan bir SaaS platformudur. Uygulama, yük sahiplerinin (iş sahipleri) taşıma işleri için uygun teklifleri farklı lojistik firmalarından toplayabildiği, gelen teklifleri karşılaştırabildiği ve seçilen firma ile operasyonel süreci başlatabildiği bir yapı sunar. Platform; Next.js (React 18, TypeScript, TailwindCSS) frontend ve Java 17 (Spring Boot, JPA/Hibernate) backend teknolojileriyle geliştirilmekte olup, PostgreSQL veritabanı kullanılmaktadır.

## 2. User Stories

### Persona 1: Yük Sahibi (İhracat Firması)

- US1: Yük sahibi olarak, yeni bir taşıma işi oluşturabilmek istiyorum ki farklı firmalardan teklif alayım.
- US2: Yük sahibi olarak, tekliflerin deadline tarihine kadar toplanmasını ve teklifleri karşılaştırarak uygun olanı seçebilmek istiyorum.
- US3: Yük sahibi olarak, teklif verecek firmalardan gelen dokümanları görebilmek istiyorum.
- US4: Yük sahibi olarak, kendi işlerimde özel alanlar (yükleme yeri, liman vs.) tanımlayabilmek istiyorum.

### Persona 2: Taşıma Firması (Forwarder / Lojistik Şirketi)

- US5: Lojistik firması olarak, davet edildiğim bir iş için teklif verebilmek istiyorum.
- US6: Lojistik firması olarak, geçmişte verdiğim tekliflerin durumlarını izleyebilmek istiyorum.
- US7: Lojistik firması olarak, teklif verirken iş sahibinin tanımladığı özel alanlara göre bilgi girebilmek istiyorum.

## 3. Acceptance Criteria

- [ ] Yük sahibi yeni bir iş oluşturabilmelidir.
- [ ] İş oluştururken deadline tarihi belirlenebilmelidir.
- [ ] Her iş için teklif verebilecek firmalara davet gönderilebilmelidir.
- [ ] Lojistik firmaları, davet aldıkları işlere teklif verebilmelidir.
- [ ] Teklif formu, iş sahibinin tanımladığı özel alanlara göre dinamik olarak oluşturulmalıdır.
- [ ] Tüm teklifler, iş sahibine listelenebilir ve filtrelenebilir şekilde sunulmalıdır.
- [ ] İş sahibi, teklif seçimi sonrası kazanan firmayı belirleyip süreci sonlandırabilmelidir.
- [ ] Teklif süreci ile ilgili e-posta bildirimleri sistem tarafından tetiklenmelidir.

## 4. Constraints (Teknik & İş)

### Teknik Kısıtlar

- Frontend: Next.js + TypeScript + Tailwind CSS kullanılacaktır.
- Backend: Java 17, Spring Boot, JPA/Hibernate kullanılacaktır.
- Veritabanı: PostgreSQL kullanılacaktır.
- E-posta servisi, SMTP üzerinden yapılandırılacaktır.

### İş Kısıtları

- Firmaların kullanıcı hesapları manuel olarak oluşturulacaktır.
- Deadline sonrası teklif verilemeyecek şekilde sistem kısıtlanacaktır.

## 5. Technical Specs

### Veritabanı Yapısı (Özet)

- `jobs`: İş tanımları
- `companies`: Firma bilgileri
- `quotes`: Teklifler

### Mimarî
[ Next.js Frontend ]
       |
       V
[ Spring Boot REST API ]
       |
       V
[ PostgreSQL DB ]

# VocabVault - Kisisel Kelime Ogrenme PWA

Kullanicilarin kendi kelime kutuphanelerini olusturup, **SM-2 spaced repetition** algoritmasi ile pratik yapabildikleri bir Progressive Web App.

---

## Teknoloji Stack'i

| Katman | Teknoloji | Versiyon |
|--------|-----------|----------|
| **Frontend** | React + TypeScript | React 19, TS 5.9 |
| **Build Tool** | Vite | 7.3 |
| **Styling** | Tailwind CSS | 4.2 |
| **Routing** | React Router | 7.x |
| **PWA** | vite-plugin-pwa (Workbox) | 1.2 |
| **Backend API** | Cloudflare Workers + Hono | Hono 4.4 |
| **Database** | Cloudflare D1 (SQLite at edge) | - |
| **Auth** | JWT (jose kutuphanesi) | jose 5.6 |
| **State Yonetimi** | React Context + Hooks | - |
| **Hosting** | Cloudflare Pages (frontend) + Workers (API) | - |

---

## Proje Yapisi

```
vocabvault/
├── frontend/                          # React PWA
│   ├── public/
│   │   └── icons/                     # PWA ikonlari
│   ├── src/
│   │   ├── App.tsx                    # Router yapilandirmasi
│   │   ├── main.tsx                   # Uygulama giris noktasi
│   │   ├── index.css                  # Tailwind import + global stiller
│   │   │
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.tsx      # Email/sifre giris formu
│   │   │   │   ├── RegisterForm.tsx   # Kayit formu
│   │   │   │   └── ProtectedRoute.tsx # Auth guard bieseni
│   │   │   │
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx         # Ust navigasyon cubugu
│   │   │   │   ├── BottomNav.tsx      # Mobil alt navigasyon (4 sekme)
│   │   │   │   └── Layout.tsx         # Sayfa sarmalayici
│   │   │   │
│   │   │   ├── words/
│   │   │   │   ├── WordForm.tsx       # Kelime ekleme/duzenleme modal formu
│   │   │   │   ├── WordCard.tsx       # Tek kelime karti (dogruluk badge'i ile)
│   │   │   │   ├── WordList.tsx       # Kelime listesi konteyneri
│   │   │   │   └── WordSearch.tsx     # Arama, dil filtresi, siralama
│   │   │   │
│   │   │   ├── practice/
│   │   │   │   ├── Flashcard.tsx      # Kart cevirme modu (animasyonlu)
│   │   │   │   ├── Quiz.tsx           # 4 sikli coktan secmeli mod
│   │   │   │   ├── PracticeSetup.tsx  # Pratik ayarlari (mod, filtre, sayi, yon)
│   │   │   │   ├── PracticeResult.tsx # Oturum sonuc ekrani
│   │   │   │   └── ProgressBar.tsx    # Ilerleme cubugu
│   │   │   │
│   │   │   └── stats/
│   │   │       ├── StatsOverview.tsx  # 6 istatistik karti grid'i
│   │   │       ├── WordStats.tsx      # Kelime bazli performans listesi
│   │   │       └── AccuracyChart.tsx  # Dogruluk dagilim cubugu
│   │   │
│   │   ├── pages/
│   │   │   ├── HomePage.tsx           # Dashboard (ozet + hizli aksiyonlar)
│   │   │   ├── WordsPage.tsx          # Kelime kutuphanesi sayfasi
│   │   │   ├── PracticePage.tsx       # Pratik sayfasi (setup/pratik/sonuc)
│   │   │   ├── StatsPage.tsx          # Istatistikler sayfasi
│   │   │   ├── LoginPage.tsx          # Giris sayfasi
│   │   │   └── RegisterPage.tsx       # Kayit sayfasi
│   │   │
│   │   ├── hooks/
│   │   │   ├── useWords.ts            # Kelime CRUD + filtreleme hook'u
│   │   │   ├── usePractice.ts         # Pratik oturumu yonetimi
│   │   │   └── useStats.ts            # Istatistik veri hook'lari
│   │   │
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx         # Auth state (user, login, register, logout)
│   │   │
│   │   ├── services/
│   │   │   ├── api.ts                 # Fetch wrapper (JWT header, error handling)
│   │   │   └── sm2.ts                 # SM-2 algoritmasi (frontend)
│   │   │
│   │   ├── types/
│   │   │   └── index.ts               # Tum TypeScript tip tanimlari
│   │   │
│   │   └── utils/
│   │       ├── languages.ts           # 15 desteklenen dil listesi
│   │       └── constants.ts           # API_BASE, TOKEN_KEY, esik degerleri
│   │
│   ├── vite.config.ts                 # Vite + Tailwind + PWA + proxy ayarlari
│   ├── tsconfig.json
│   └── package.json
│
└── worker/                            # Cloudflare Worker (Backend API)
    ├── src/
    │   ├── index.ts                   # Hono app giris noktasi + CORS
    │   │
    │   ├── routes/
    │   │   ├── auth.ts                # POST /register, /login, GET /me
    │   │   ├── words.ts               # GET/POST/PUT/DELETE /words, /words/due, /words/weak
    │   │   ├── practice.ts            # POST /result, /sessions, GET /sessions
    │   │   └── stats.ts               # GET /overview, /words
    │   │
    │   ├── middleware/
    │   │   └── auth.ts                # JWT dogrulama middleware
    │   │
    │   ├── services/
    │   │   └── sm2.ts                 # SM-2 algoritmasi (backend)
    │   │
    │   └── db/
    │       ├── schema.sql             # D1 tablo semalari + indeksler
    │       └── migrations/
    │
    ├── wrangler.toml                  # Cloudflare Worker yapilandirmasi
    ├── tsconfig.json
    └── package.json
```

---

## Veritabani Semasi (Cloudflare D1 - SQLite)

### `users` - Kullanicilar
| Kolon | Tip | Aciklama |
|-------|-----|----------|
| id | TEXT (PK) | UUID |
| email | TEXT (UNIQUE) | Kullanici email'i |
| password_hash | TEXT | SHA-256 hash |
| source_lang | TEXT | Varsayilan kaynak dil (default: 'tr') |
| target_lang | TEXT | Varsayilan hedef dil (default: 'en') |
| created_at | TEXT | Olusturulma tarihi |

### `words` - Kelimeler
| Kolon | Tip | Aciklama |
|-------|-----|----------|
| id | TEXT (PK) | UUID |
| user_id | TEXT (FK) | Kullanici ID |
| source_word | TEXT | Kaynak dildeki kelime |
| target_word | TEXT | Hedef dildeki kelime (ceviri) |
| source_lang | TEXT | Kaynak dil kodu ('tr', 'en', 'de', ...) |
| target_lang | TEXT | Hedef dil kodu |
| example_sentence | TEXT | Ornek cumle (opsiyonel) |
| notes | TEXT | Kullanici notu (opsiyonel) |
| created_at | TEXT | Eklenme tarihi |

### `word_progress` - SM-2 Tekrar Verileri
| Kolon | Tip | Aciklama |
|-------|-----|----------|
| id | TEXT (PK) | UUID |
| word_id | TEXT (FK, UNIQUE) | Kelime ID |
| user_id | TEXT (FK) | Kullanici ID |
| ease_factor | REAL | SM-2 kolaylik faktoru (min 1.3, default 2.5) |
| interval | INTEGER | Gun cinsinden tekrar araligi |
| repetitions | INTEGER | Ardisik dogru tekrar sayisi |
| next_review | TEXT | Sonraki tekrar tarihi (YYYY-MM-DD) |
| total_correct | INTEGER | Toplam dogru cevap |
| total_attempts | INTEGER | Toplam deneme |
| last_reviewed | TEXT | Son tekrar tarihi |

### `practice_sessions` - Pratik Oturumlari
| Kolon | Tip | Aciklama |
|-------|-----|----------|
| id | TEXT (PK) | UUID |
| user_id | TEXT (FK) | Kullanici ID |
| mode | TEXT | 'flashcard' veya 'quiz' |
| total_words | INTEGER | Oturumdaki toplam kelime |
| correct_count | INTEGER | Dogru cevap sayisi |
| accuracy | REAL | Dogruluk yuzdesi (0-100) |
| duration_seconds | INTEGER | Oturum suresi (saniye) |
| completed_at | TEXT | Tamamlanma tarihi |

**Indeksler:** `idx_words_user`, `idx_word_progress_user`, `idx_word_progress_next_review`, `idx_practice_sessions_user`

---

## API Endpoint'leri

### Auth (`/api/auth`)
| Method | Endpoint | Aciklama |
|--------|----------|----------|
| POST | `/auth/register` | Yeni kullanici kaydi (email + sifre) |
| POST | `/auth/login` | Giris, JWT token doner |
| GET | `/auth/me` | Mevcut kullanici bilgisi |

### Words (`/api/words`) - JWT gerekli
| Method | Endpoint | Aciklama |
|--------|----------|----------|
| GET | `/words` | Kelime listesi (search, source_lang, target_lang, sort parametreleri) |
| POST | `/words` | Yeni kelime ekle |
| PUT | `/words/:id` | Kelime guncelle |
| DELETE | `/words/:id` | Kelime sil |
| GET | `/words/due` | Bugün tekrari gelen kelimeler (SM-2 next_review <= bugun) |
| GET | `/words/weak` | Dusuk dogruluk oranindaki kelimeler (<%60) |

### Practice (`/api/practice`) - JWT gerekli
| Method | Endpoint | Aciklama |
|--------|----------|----------|
| POST | `/practice/result` | Tek kelime sonucu kaydet (SM-2 guncelle) |
| POST | `/practice/sessions` | Oturum sonucu kaydet |
| GET | `/practice/sessions` | Gecmis pratik oturumlari |

### Stats (`/api/stats`) - JWT gerekli
| Method | Endpoint | Aciklama |
|--------|----------|----------|
| GET | `/stats/overview` | Genel istatistikler (toplam kelime, ort. dogruluk, vb.) |
| GET | `/stats/words` | Kelime bazli performans listesi |

---

## SM-2 Spaced Repetition Algoritmasi

Anki'nin temel aldigi SuperMemo SM-2 algoritmasi kullanilir. Her kelime icin su degerler tutulur:

- **ease_factor**: Kolaylik katsayisi (min 1.3, baslangic 2.5)
- **interval**: Tekrar araligi (gun)
- **repetitions**: Ardisik dogru cevap sayisi

### Kalite Degerlendirmesi (quality: 0-5)

**Flashcard modu:**
| Buton | Quality | Anlam |
|-------|---------|-------|
| Bilmedim | 1 | Hic bilmedi, sifirla |
| Zor | 2 | Zor buldugu, sifirla |
| Bildim | 4 | Dogru bildi |
| Kolay | 5 | Kolayca bildi |

**Quiz modu:**
| Sonuc | Quality |
|-------|---------|
| Yanlis | 1 |
| Dogru | 4 |

### Algoritma Mantigi
- **quality >= 3** (dogru): Tekrar araliklarini artir
  - 1. tekrar: 1 gun
  - 2. tekrar: 6 gun
  - Sonraki: `interval * ease_factor`
- **quality < 3** (yanlis): Sifirla, 1 gun sonra tekrar goster

---

## Ozellikler

### Kelime Yonetimi
- Kelime ekleme, duzenleme, silme
- 15 dil arasinda cift yonlu dil secimi
- Ornek cumle ve not ekleme
- Arama, dil filtresi, siralama (alfabetik / dogruluk / tarih)

### Pratik Modlari
- **Flashcard**: Kart cevirme animasyonu, 4 kademe degerlendirme
- **Quiz**: 4 sikli coktan secmeli, anlik geri bildirim
- Filtre secenekleri: Tum kelimeler, bugunun tekrarlari, zayif kelimeler, yeni kelimeler
- Kelime sayisi: 10 / 20 / 50 / Tumu
- Yon: Kaynak->Hedef veya Hedef->Kaynak

### Istatistikler
- Genel ozet: toplam kelime, tekrar edilen, ort. dogruluk, bugun tekrar, zayif kelimeler
- Kelime bazli performans tablosu (dogru/toplam, yuzde, son tekrar)
- Dogruluk dagilim grafigi (yesil/turuncu/kirmizi/gri)
- Renk kodlama: >%70 yesil, %40-70 turuncu, <%40 kirmizi

### Desteklenen Diller (15)
Turkce, Ingilizce, Almanca, Fransizca, Ispanyolca, Italyanca, Portekizce, Rusca, Japonca, Korece, Cince, Arapca, Hollandaca, Isvecce, Lehce

---

## Calistirma

### Gereksinimler
- Node.js 20+ veya 22+
- npm

### Gelistirme Ortami

```bash
# 1. Frontend bagimliliklari
cd vocabvault/frontend
npm install

# 2. Worker bagimliliklari
cd ../worker
npm install

# 3. Veritabani migration (lokal D1)
npm run db:migrate

# 4. Worker'i baslat (port 8787)
npm run dev

# 5. Baska terminal - Frontend'i baslat (port 5173)
cd ../frontend
npm run dev
```

Uygulama `http://localhost:5173` adresinde acilir. Frontend proxy ile API isteklerini `localhost:8787`'ye yonlendirir.

### Production Deploy

```bash
# Frontend -> Cloudflare Pages
cd frontend
npm run build
# dist/ klasorunu Cloudflare Pages'e deploy et

# Worker -> Cloudflare Workers
cd ../worker
npm run deploy
```

---

## Mimari Kararlar

| Karar | Neden |
|-------|-------|
| **PWA** (mobil uygulama degil) | Hizli baslangic, platform bagimsiz, app store gerektirmez |
| **Cloudflare D1** (SQLite) | Edge'de calisir, sifir bakim, ucretsiz katman yeterli |
| **Hono** (Express degil) | Cloudflare Workers icin optimize, hafif, hizli |
| **JWT** (session degil) | Stateless, edge-uyumlu, D1 ile session store gerekmez |
| **Context + Hooks** (Redux degil) | Basit state ihtiyaci, ek kutuphane gereksiz |
| **Tailwind CSS** | Utility-first, hizli gelistirme, kucuk bundle |
| **SM-2** (Leitner degil) | Bilimsel olarak kanitlanmis, Anki'nin temeli |

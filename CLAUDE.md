# Vobilo — Projektkontext

## Vad är Vobilo?

Vobilo (vobilo.se) är en säljportal för lag och klasser. Modellen liknar Elevkassan/Klasskassan:
- En klass eller ett lag registrerar sig och får en unik säljsida (`/salj/[slug]`)
- De säljer produkter (hushållsprodukter, gadgets) till familj och vänner
- Laget tjänar ~40–50 kr per såld produkt
- Inköpspris ca 30–45 kr, säljpris 79–149 kr

## Affärsmodell

| Roll | Beskrivning |
|---|---|
| **Group** | Lag/klass som säljer. Har en slug och en kampanj. |
| **Seller** | Den som administrerar gruppen (tränare, lärare). |
| **Buyer** | Privatperson som köper via gruppens länk. |
| **Admin** | Vobilo-ägaren (miggodon). |

## Produkter (startuppsättning, ~15 st)

| Produkt | Inköp ca | Säljpris |
|---|---|---|
| Hamburgerpress | 35 kr | 99 kr |
| Bagagevåg | 40 kr | 99 kr |
| Gympåse/ryggsäck | 45 kr | 129 kr |
| Kryddkvarnar (set) | 40 kr | 99 kr |
| Magnetlist för knivar | 35 kr | 99 kr |
| Silikonspatlar (3-pack) | 30 kr | 79 kr |
| Kabelorganiserare/clips | 20 kr | 69 kr |
| Powerbank | 45 kr | 149 kr |
| Hopfällbar mugg | 35 kr | 99 kr |
| Bluetooth-högtalare | 45 kr | 149 kr |
| LED-pannlampa | 25 kr | 79 kr |
| Knivslip | 20 kr | 69 kr |
| Digital köksvåg | 35 kr | 99 kr |
| Hopfällbara shoppingpåsar (3-pack) | 20 kr | 79 kr |
| Termosmugg med lock | 40 kr | 119 kr |

## Tech Stack

| Del | Val |
|---|---|
| Framework | Next.js 15 (App Router, TypeScript) |
| Styling | Tailwind CSS |
| Databas | PostgreSQL |
| ORM | Prisma |
| Auth | NextAuth.js v5 (beta) |
| Deploy | Docker + Coolify på VPS |

## Repo-struktur

```
vobilo/
├── CLAUDE.md                  ← denna fil, håll uppdaterad
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── prisma/
│   └── schema.prisma
└── src/
    ├── app/
    │   ├── (public)/          ← publik butik
    │   │   └── salj/[slug]/   ← unik gruppsida
    │   ├── (admin)/           ← säljar-dashboard
    │   ├── (auth)/            ← login/register
    │   └── api/               ← API-routes
    ├── components/
    ├── lib/
    │   ├── db.ts              ← Prisma-klient (singleton)
    │   └── auth.ts            ← NextAuth-config
    └── types/
```

## Datamodell

- **Group** — lag/klass, har `slug` (unik URL), kopplad till campaigns och orders
- **User** — köpare eller säljare, kopplad till en group
- **Product** — produkter med buy/sell-pris
- **Campaign** — en säljkampanj per grupp med start/slut-datum
- **Order** → **OrderItem** — en order tillhör en user + group + campaign

## Design

- Färger: gult + blått, somrig känsla
- Typografi-baserad logo (ingen grafisk logga ännu)
- Målgrupp: föräldrar, tränare, klasslärare

## GitHub

- Repo: https://github.com/miggodon/vobilo
- All kod går via GitHub — det är source of truth
- Håll CLAUDE.md uppdaterad vid arkitekturändringar

## Köra lokalt

```bash
cp .env.example .env
docker-compose up -d db
npx prisma migrate dev
npm run dev
```

## Driftsättning (Coolify)

- Bygg med Dockerfile
- Sätt env-variabler: DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL
- Kör `prisma migrate deploy` som release-kommando

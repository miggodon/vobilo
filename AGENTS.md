# AGENTS – Vobilo (vobilo.se)

Handoff för Hermes / Codex / Claude. **Live MVP** sedan 2026-06-23 — ändra drift bara med Migges OK.

## Var saker lever

| Vad | Var |
|-----|-----|
| Repo (sanning) | `github.com/miggodon/vobilo` → server: `/opt/vobilo` |
| Prod-URL | https://vobilo.se (Cloudflare → Hetzner **89.167.32.193** → Coolify Traefik) |
| App | Docker `vobilo-app` (profil `docker-app`), port 3000 internt |
| DB | Docker `vobilo-db`, Postgres 15, volym `postgres_data`, host `127.0.0.1:54329` |
| Secrets | `/opt/vobilo/.env` (ej i git) — `POSTGRES_PASSWORD`, `NEXTAUTH_*`, `DATABASE_URL` i container |
| Traefik | Labels på `vobilo-app`; fil-routing **av**: `/data/coolify/proxy/dynamic/vobilo.yaml.disabled` |
| Host-fallback | `vobilo.service` **disabled**; använd inte port 3002 längre |

## Vanliga kommandon

```bash
cd /opt/vobilo
git pull
# Bygg (kräver npm run build på host först — image kopierar .next/standalone)
npm ci && npx prisma generate && npm run build
docker compose --profile docker-app build app
docker compose --profile docker-app up -d
docker compose up -d db   # db utan profil

# Migrering + seed (vid schemaändring)
docker compose --profile setup run --rm setup

# Loggar
docker logs -f vobilo-app
```

- Container-migrering: sätt `RUN_MIGRATIONS=1` på app **eller** kör `setup`-profilen (default `RUN_MIGRATIONS=0` i entrypoint).
- Docker-data-volym: `/mnt/HC_Volume_105565947` — efter panel-grow: `sudo resize2fs /dev/sdb`.

## Sessionsstart

1. `git pull` i `/opt/vobilo`
2. Läs denna fil + avsnittet **TODO** nedan
3. Verifiera snabbt: `curl -sI https://vobilo.se | head -1`

---

## TODO – från live MVP till färdig produkt

Prioritet uppifrån. **Inget här är påbörjat** om inte annat står i git-logg.

### Produkt / affär
- [ ] **Betalning** (Swish/kort) — orders är bara `PENDING` i DB
- [ ] **E-post** (orderbekräftelse, välkomst, påminnelser)
- [ ] **Admin/export** — leverans, orderstatus, gruppöversikt
- [ ] **Sälj-sida** `/salj/[slug]` — hämta grupp från DB (idag delvis mock-namn)
- [ ] **Landningstext** — “länk inom 24 h” vs `/starta` som skapar slug direkt
- [ ] Ev. **demo-grupp** i seed för smoke-test utan manuell registrering

### Teknik / säkerhet
- [ ] **Middleware** — skydda exakt `/dashboard` (matcher `/dashboard/:path*` missar root)
- [ ] **DB-backup** — schemalagd `pg_dump` från `vobilo-db`
- [ ] **Övervakning** — alert om `vobilo-app` / `vobilo-db` nere
- [ ] **Root-disk** `/` fortfarande ~96 % — städ/images eller väx systemdisk
- [ ] **Prisma i container** — full `migrate` i image eller alltid via `setup`-profil (dokumenterat ovan)

### Juridiskt / drift
- [ ] Integritet/cookie (t.ex. Complianz-liknande om tracking tillkommer)
- [ ] Villkor/kontakt vid riktig försäljning
- [ ] README deploy — ersätt create-next-app-boilerplate med Vobilo-specifik drift

### Verifierat fungerande (2026-06-23)
- HTTPS 200, `vobilo-app` + `vobilo-db` healthy
- 15 produkter seedade; 0 grupper tills någon använder `/starta`
- Flöde: `/starta` → grupp+säljare+kampanj → `/salj/{slug}` → `POST /api/orders` (kräver existerande grupp)
- NextAuth credentials efter registrering; `/logga-in` → dashboard

---

*Senast uppdaterad: 2026-06-23 (Hermes) — lämna drift som den är tills Migge prioriterar TODO.*
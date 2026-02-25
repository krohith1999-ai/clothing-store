# Clothing Store

A full-stack clothing store with a **React** frontend (Vite) and **Spring Boot** backend.

## Stack

- **Frontend:** React 18, React Router, Vite. UI: Cormorant Garamond + DM Sans, warm neutral palette.
- **Backend:** Spring Boot 3.2, JPA. **Database:** Supabase (PostgreSQL) or H2 for local dev.

## Run the project

### 1. Backend (Spring Boot)

Requires **Java 17+**.

#### Using Supabase (default)

1. Create a project at [supabase.com](https://supabase.com).
2. In the dashboard go to **Project Settings → Database**.
3. Copy the **Connection string** (URI). It looks like:
   `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`
   For direct connection (recommended for Spring): use **Host** `db.[ref].supabase.co`, port **5432**, database **postgres**, user **postgres**, and your database password.
4. Set these environment variables (or add to `backend/.env` and load them; Spring Boot does not load `.env` by default, so export them or use an env file loader):

   ```bash
   SUPABASE_DB_URL=jdbc:postgresql://db.YOUR_PROJECT_REF.supabase.co:5432/postgres?sslmode=require
   SUPABASE_DB_USER=postgres
   SUPABASE_DB_PASSWORD=your-database-password
   ```

   Replace `YOUR_PROJECT_REF` and `your-database-password` with your project’s reference (in the Supabase URL) and the Database password from the dashboard.
5. From the `backend` folder run:

   ```bash
   mvnw.cmd spring-boot:run
   ```

   On first run, the `products` table is created and sample products are inserted.

#### Local only (no Supabase)

To run with an in-memory H2 database (no Supabase needed):

```bash
cd backend
mvnw.cmd spring-boot:run -Dspring.profiles.active=local
```

API runs at **http://localhost:8080**. Sample products are loaded on first run.

### 2. Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

App runs at **http://localhost:5173**. Vite is configured to proxy `/api` to the backend.

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | All products. Optional: `?category=...` or `?search=...` |
| GET | `/api/products/categories` | List of category names |
| GET | `/api/products/{id}` | Single product by ID |
| POST | `/api/orders` | Create order (checkout); returns order id and total. |

## Features

- **Home:** Hero and featured products, store map.
- **Shop:** Product grid with category filter and search.
- **Product detail:** Image, description, quantity, add to cart.
- **Cart:** List items, change quantity, remove; proceed to checkout.
- **Checkout:** Shipping form and order summary; order saved to DB. Optional **receipt email** (see below).

### Receipt email

After an order is placed, the backend can send an HTML receipt to the customer’s email. To enable it:

1. Configure SMTP in `application.properties` (or env vars). Example for Gmail:
   - `spring.mail.host=smtp.gmail.com`
   - `spring.mail.port=587`
   - `spring.mail.username=your@gmail.com`
   - `spring.mail.password=your-app-password` (use an [App Password](https://support.google.com/accounts/answer/185833), not your normal password)
   - `spring.mail.properties.mail.smtp.auth=true`
   - `spring.mail.properties.mail.smtp.starttls.enable=true`
   - `app.mail.from=your@gmail.com`

2. See `application-mail.example.properties` for a full example. If mail is not configured, orders still succeed; no email is sent.

---

## Deploy to production

Your **database (Supabase)** is already in the cloud. To put the app on the internet you deploy the **backend** and **frontend** separately, then point the frontend at the backend URL.

### 1. Deploy the backend (Spring Boot)

Host the API on a Java-friendly platform. Examples:

| Platform | Notes |
|----------|--------|
| [Render](https://render.com) | Free tier: Web Service, build command `./mvnw -B package`, start `java -jar target/*.jar`. Add env vars for Supabase and (optional) mail. |
| [Railway](https://railway.app) | Connect repo, set root to `backend`, add env vars. |
| [Fly.io](https://fly.io) | Add a `Dockerfile` in `backend/` or use `fly launch` and set build/run. |

**Required environment variables** (set in the platform’s dashboard):

- `SPRING_PROFILES_ACTIVE=supabase` (or rely on default if you use Supabase)
- Supabase DB: copy from your `application-supabase.properties` (or use the same env vars the app already supports for DB and mail).
- **CORS:** set `APP_CORS_ALLOWED_ORIGINS` to your frontend URL(s), comma-separated, e.g.  
  `https://your-app.vercel.app,https://your-app.netlify.app`

After deploy, note the backend URL (e.g. `https://your-api.onrender.com`).

### 2. Deploy the frontend (React / Vite)

Host the built static files on a front-end host. Examples:

| Platform | Notes |
|----------|--------|
| [Vercel](https://vercel.com) | Connect GitHub repo, set **Root Directory** to `frontend`, **Build Command** `npm run build`, **Output Directory** `dist`. Add env var below. |
| [Netlify](https://netlify.com) | Connect repo, base directory `frontend`, build command `npm run build`, publish directory `frontend/dist`. Add env var below. |
| [Cloudflare Pages](https://pages.cloudflare.com) | Connect repo, build config: root `frontend`, command `npm run build`, output `dist`. Add env var below. |

**Required environment variable** (set in the platform’s dashboard):

- **`VITE_API_URL`** = your backend URL with no trailing slash, e.g. `https://your-api.onrender.com`  

The frontend will call `VITE_API_URL/api/...` in production. Without this, it will try `/api` on the same host (only works if you proxy or serve both from one place).

### 3. Build and run backend as a single JAR (for Render/Railway/etc.)

The backend must be built with Maven and run as a JAR. Ensure `pom.xml` has the Spring Boot plugin (it does). Then:

```bash
cd backend
./mvnw -B package -DskipTests
java -jar target/clothing-store-api-1.0.0.jar
```

Platforms like Render can use the same: **Build** `./mvnw -B package -DskipTests`, **Start** `java -jar target/clothing-store-api-1.0.0.jar`. Set all env vars (Supabase, mail, `APP_CORS_ALLOWED_ORIGINS`) in the dashboard.

### 4. Quick checklist

- [ ] Backend deployed and returning e.g. `GET /api/products` successfully.
- [ ] `APP_CORS_ALLOWED_ORIGINS` on backend includes your frontend URL.
- [ ] Frontend deployed with `VITE_API_URL` set to that backend URL.
- [ ] Supabase (and optional mail) env vars set on the backend in production.

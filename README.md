# CLMS — Original Operator System + Separate Admin Panel

## Important
The original Operator/User frontend and backend files are retained. New Admin pages are additive. Existing Operator routes/components/data models are not replaced.

## Admin routes
- `/admin` — Admin Login
- `/admin/dashboard` — real operator/income/expense summary
- `/admin/operators` — operator search/create/activate/deactivate
- `/admin/income-vouchers` — admin voucher view
- `/admin/expense-vouchers` — admin voucher view
- `/admin/reports` — financial summary
- `/admin/settings` — admin information

## Access control
The backend already protects user-management endpoints with JWT + RolesGuard + ADMIN. The backend also rejects creating ADMIN accounts through the operator creation endpoint. The frontend AdminGuard is only an additional UI guard; backend authorization remains authoritative.

## Vercel + Railway
Frontend: Vercel. Backend: Railway.

Vercel frontend uses `/api/v1` and the included `vercel.json` proxies API requests to the Railway backend. This keeps browser requests same-origin and avoids changing the existing Operator API paths.

Railway environment variables:
- DATABASE_URL
- DIRECT_URL
- ADMIN_NAME
- ADMIN_EMAIL
- ADMIN_PASSWORD
- JWT_SECRET
- REFRESH_TOKEN_SECRET
- FRONTEND_URL=https://shakilsoftmp.vercel.app
- COOKIE_SAME_SITE=lax
- NODE_ENV=production

Do not commit real secrets.

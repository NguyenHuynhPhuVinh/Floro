# 8. Deployment Architecture

- **Frontend:** The Next.js app is automatically deployed to Vercel upon pushes to the `main` branch.
- **Backend:** Supabase database migrations and Row Level Security policies are deployed via the Supabase CLI.
- **Environments:**
  - **Development:** Local machine.
  - **Preview:** Vercel automatically creates a preview deployment for each Pull Request.
  - **Production:** Live environment on the main domain.

# Quick Fix: WalletConnect Project ID Error

## The Error

```
Error: No projectId found. Every dApp must now provide a WalletConnect Cloud projectId
```

## Quick Solution (2 minutes)

### Step 1: Get WalletConnect Project ID

1. Go to: https://cloud.walletconnect.com
2. Sign up or log in
3. Click **"Create New Project"**
4. Enter project name: `BaseFlow`
5. Click **"Create"**
6. **Copy the Project ID** (long string)

### Step 2: Add to .env.local

1. Open `frontend/.env.local` (create it if it doesn't exist)
2. Add or update this line:
   ```bash
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=paste_your_project_id_here
   ```
3. Save the file

### Step 3: Restart Dev Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
cd frontend
npm run dev
```

## Complete .env.local Example

Create `frontend/.env.local` with:

```bash
NEXT_PUBLIC_CHAIN_ID=84532
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_ROUTER_ADDRESS=0xD9a60b0Bc8d8C7F9Bd1aab40B0486756eAF997C3
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_actual_project_id_from_walletconnect
```

Replace `your_actual_project_id_from_walletconnect` with the ID you copied from WalletConnect Cloud.

## Still Having Issues?

- Make sure the file is named `.env.local` (with the dot)
- Make sure it's in the `frontend` directory
- Restart the dev server after creating/editing the file
- Check for typos in the variable name


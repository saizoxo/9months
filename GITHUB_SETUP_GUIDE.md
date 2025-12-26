# 🌌 Deploying "Nine Months to Us" to GitHub Pages

Follow this guide to host your cosmic anniversary experience on GitHub. This setup allows you to update memories by simply pushing files to your repository.

## 1. Create Your Repository
1. Log in to [GitHub](https://github.com).
2. Create a new repository named `nine-months-to-us`.
3. Set it to **Private** (recommended for personal memories) or **Public**.

## 2. Push Your Code
Initialize your local project and push to GitHub:
```bash
git init
git add .
git commit -m "Initial cosmic launch"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/nine-months-to-us.git
git push -u origin main
```

## 3. Configure Gemini API Key
To keep your API key safe:
1. Go to your GitHub Repository **Settings**.
2. Navigate to **Secrets and variables** > **Actions**.
3. Click **New repository secret**.
4. Name: `API_KEY`
5. Value: *Paste your Google AI Studio API Key*.

## 4. Automated Deployment (GitHub Actions)
Create a file at `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install and Build
        run: |
          npm install
          npm run build
        env:
          API_KEY: ${{ secrets.API_KEY }}

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## 5. Enable GitHub Pages
1. Go to **Settings** > **Pages**.
2. Under **Build and deployment** > **Source**, select **GitHub Actions**.
3. Once the Action finishes, your site will be live at `https://YOUR_USERNAME.github.io/nine-months-to-us/`.

## 6. Syncing Memories via Assets
As mentioned in the app's Sync Info, you can add memories without coding:
1. Create a folder: `public/assets/memories/`
2. Add files using this naming convention:
   - `month-1_type-photo_Our_First_Date.jpg`
   - `month-3_type-voice_Message_For_You.mp3`
   - `month-5_type-text_Late_Night_Thought.txt`
3. Push these files to GitHub. The site will rebuild and the stars will align!

## 🛠️ Local Development on Android (Termux)
Since you mentioned running on a Redmi Pad with Termux:
1. Install Node.js: `pkg install nodejs`
2. Clone repo: `git clone YOUR_REPO_URL`
3. Install: `npm install`
4. Run: `npm run dev`
5. Access via `http://localhost:5173` in your tablet's browser.

---
*Happy 9 Months, Sarib & Shreya!* 🥂
# 🚀 HireMe Team Setup Guide

## 1. Clone the Repository

👉 This downloads the project to your computer

⚠️ Do NOT create the HireMe folder yourself

```bash
git clone https://github.com/blessonbinoy2005/HireMe.git
cd HireMe
```

---

## 2. Create Your Own Branch

👉 This creates your personal workspace (so you don’t mess up main)

❗ Never work on `main`

```bash
git checkout -b your-name-feature
```

Example:

```bash
git checkout -b john-login-page
```

---

## 3. Install Dependencies

👉 This installs all required packages (needed to run the app)

### Client

```bash
cd client
npm install
```

### Server

```bash
cd ../server
npm install
```

---

## 4. Run the Project

👉 This starts the website locally on your computer

### Start backend

```bash
cd server
node server.js
```

### Start frontend (new terminal)

```bash
cd client
npm start
```

---

## 5. Before You Start Work

👉 This updates your branch with the latest code from main

```bash
git checkout main
git pull origin main
git checkout your-name-feature
git merge main
```

---

## 6. Make Changes & Commit

👉 This saves your changes locally

```bash
git add .
git commit -m "describe your changes"
```

---

## 7. Push Your Branch

👉 This uploads your work to GitHub

```bash
git push origin your-name-feature
```

---

## 8. Open a Pull Request

👉 This asks Blesson to review and add your code to main

1. Go to GitHub
2. Click **Compare & pull request**
3. Base = `main`, Compare = your branch
4. Add description
5. Submit

---

## ⚠️ IMPORTANT RULES

* ❌ Do NOT push directly to `main`
* ❌ Do NOT merge your own pull request
* ✅ Only **Blesson** will review and merge PRs
* ✅ Always work on your own branch
* ✅ Pull latest changes before starting

---

## 🔄 If Your Branch Is Behind

👉 This updates your branch if others made changes

```bash
git checkout main
git pull origin main
git checkout your-name-feature
git merge main
```

---

## ✅ Example Workflow

```bash
git clone https://github.com/blessonbinoy2005/HireMe.git
cd HireMe
git checkout -b alex-homepage

cd client
npm install
cd ../server
npm install

# make changes

git add .
git commit -m "updated homepage UI"
git push origin alex-homepage
```

---

You're all set 🚀

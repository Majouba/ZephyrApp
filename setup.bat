@echo off
echo ======================================================
echo 🔄 Mise à jour et installation des dépendances...
npm install

:: Vérifie si 'concurrently' est installé
echo ======================================================
echo ⚙️ Vérification de 'concurrently'...
npm list concurrently >nul 2>&1
if errorlevel 1 (
    echo 🛠️ 'concurrently' non trouvé. Installation en cours...
    npm install concurrently --save-dev
) else (
    echo ✅ 'concurrently' déjà installé.
)

:: Vérifie si 'react-toastify' est installé
echo ======================================================
echo ⚙️ Vérification de 'react-toastify'...
npm list react-toastify >nul 2>&1
if errorlevel 1 (
    echo 🛠️ 'react-toastify' non trouvé. Installation en cours...
    npm install react-toastify --save
) else (
    echo ✅ 'react-toastify' déjà installé.
)

:: Lancer le backend et le frontend
echo ======================================================
echo 🚀 Lancement du serveur backend et frontend...
npx concurrently "node server.js" "npm run dev"

:: Afficher les URLs
echo ======================================================
echo 🌐 Accédez à Swagger : http://localhost:5000/api-docs
echo 🌐 Accédez à l'application : http://localhost:5173
echo ======================================================

pause

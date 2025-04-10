@echo off
:: Configuration du script
setlocal enabledelayedexpansion
cls
title Setup ZephyrApp
echo ======================================================
echo 🔄 Mise à jour et installation des dépendances...
npm install

:: Vérifie si le fichier .env existe
echo ======================================================
echo ⚙️ Vérification du fichier .env...
if exist .env (
    echo ✅ Le fichier .env est présent.
) else (
    echo ❌ Le fichier .env est manquant. Veuillez le créer et ajouter la clé API.
    echo Exemple : VITE_API_KEY=VotreCleAPI
    pause
    exit /b
)

:: Fonction de vérification et d'installation des packages npm
set packages=concurrently react-toastify react-loader-spinner react-leaflet leaflet lodash.debounce

for %%p in (%packages%) do (
    echo ======================================================
    echo ⚙️ Vérification de "%%p"...
    npm list %%p >nul 2>&1
    if errorlevel 1 (
        echo 🛠️ "%%p" non trouvé. Installation en cours...
        npm install %%p --save
    ) else (
        echo ✅ "%%p" déjà installé.
    )
)

:: Vérifie si le backend est configuré
echo ======================================================
echo ⚙️ Vérification du backend...
if not exist server.js (
    echo ❌ Le fichier "server.js" est introuvable. Assurez-vous que le backend est configuré.
    pause
    exit /b
) else (
    echo ✅ Le backend est correctement configuré.
)

:: Vérifie si le frontend est configuré
echo ======================================================
echo ⚙️ Vérification du frontend...
if not exist src\index.html (
    echo ❌ Le fichier "index.html" est introuvable dans le frontend. Vérifiez votre configuration.
    pause
    exit /b
) else (
    echo ✅ Le frontend est correctement configuré.
)

:: Lancer le backend et le frontend
echo ======================================================
echo 🚀 Lancement du serveur backend et frontend...
npx concurrently "npm run start-backend" "npm run dev-all"

:: Afficher les URLs
echo ======================================================
echo 🌐 Accédez à Swagger : http://localhost:5000/api-docs
echo 🌐 Accédez à l'application : http://localhost:5173
echo ======================================================

pause

@echo off
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

:: Vérifie si 'react-loader-spinner' est installé
echo ======================================================
echo ⚙️ Vérification de 'react-loader-spinner'...
npm list react-loader-spinner >nul 2>&1
if errorlevel 1 (
    echo 🛠️ 'react-loader-spinner' non trouvé. Installation en cours...
    npm install react-loader-spinner --save
) else (
    echo ✅ 'react-loader-spinner' déjà installé.
)

:: Vérifie si 'react-leaflet' et 'leaflet' sont installés
echo ======================================================
echo ⚙️ Vérification de 'react-leaflet' et 'leaflet'...
npm list react-leaflet >nul 2>&1
if errorlevel 1 (
    echo 🛠️ 'react-leaflet' non trouvé. Installation en cours...
    npm install react-leaflet --save
) else (
    echo ✅ 'react-leaflet' déjà installé.
)

npm list leaflet >nul 2>&1
if errorlevel 1 (
    echo 🛠️ 'leaflet' non trouvé. Installation en cours...
    npm install leaflet --save
) else (
    echo ✅ 'leaflet' déjà installé.
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

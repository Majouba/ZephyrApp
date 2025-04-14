// src/services/gdacsService.js (FRONTEND)
export async function getDisasterAlerts() {
    try {
      const res = await fetch('http://localhost:5000/api/gdacs/alerts');
      const data = await res.json();
  
      return Array.isArray(data.alerts) ? data.alerts : [];
    } catch (error) {
      console.error('❌ Erreur GDACS frontend : Failed to fetch');
      return [];
    }
  }
  
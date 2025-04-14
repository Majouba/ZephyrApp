import { getDisasterAlerts } from '../services/gdacsService.js';

const testGDACS = async () => {
  const alerts = await getDisasterAlerts();
  console.log('📢 Données GDACS récupérées :', alerts);
};

testGDACS();

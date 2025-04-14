import express from 'express';
import fetch from 'node-fetch';
import { XMLParser } from 'fast-xml-parser';

const router = express.Router();

router.get('/alerts', async (req, res) => {
  try {
    const xmlRes = await fetch('https://www.gdacs.org/xml/rss.xml');
    const xmlText = await xmlRes.text();

    const parser = new XMLParser({ ignoreAttributes: false });
    const json = parser.parse(xmlText);

    const items = json?.rss?.channel?.item || [];

    const alerts = items.map((item) => ({
      title: item.title,
      description: item.description,
      countries: item['gdacs:country']?.toLowerCase().split(',').map(c => c.trim()) || [],
    }));

    res.status(200).json({ alerts });
  } catch (err) {
    console.error('Erreur backend GDACS :', err);
    res.status(500).json({ error: 'Erreur serveur GDACS' });
  }
});

export default router;

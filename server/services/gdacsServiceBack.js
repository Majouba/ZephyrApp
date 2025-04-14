// src/services/gdacsService.js (BACKEND)
import { XMLParser } from 'fast-xml-parser';

export async function getDisasterAlerts() {
  try {
    const res = await fetch('https://www.gdacs.org/xml/rss.xml');
    const xml = await res.text();

    const parser = new XMLParser();
    const data = parser.parse(xml);

    const items = data?.rss?.channel?.item || [];

    return items.map(item => ({
      title: item['gdacs:title'] || item.title || '',
      description: item['gdacs:description'] || item.description || '',
      countries: item['gdacs:country']
        ? item['gdacs:country'].split(',').map(c => c.trim().toLowerCase())
        : [],
      link: item.link || ''
    }));
  } catch (error) {
    console.error('❌ Erreur lors du parsing GDACS :', error.message);
    return [];
  }
}

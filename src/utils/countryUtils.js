// src/utils/gdacsUtils.js
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';

countries.registerLocale(enLocale);

/**
 * Récupère le nom du pays à partir de son code ISO (ex: 'FR' -> 'france').
 */
export function getCountryNameFromCode(code) {
  if (!code) return null;

  const name = countries.getName(code.toUpperCase(), 'en');
  return name ? name.toLowerCase() : null;
}

/**
 * Traduit partiellement les textes d'alerte GDACS en français.
 */
export function traduireAlerte(texte) {
  if (!texte) return '';

  return texte
    .replace(/Drought/gi, 'Sécheresse')
    .replace(/Flood/gi, 'Inondation')
    .replace(/Earthquake/gi, 'Tremblement de terre')
    .replace(/Cyclone/gi, 'Cyclone')
    .replace(/Green/gi, 'faible (niveau Vert)')
    .replace(/Orange/gi, 'modérée (niveau Orange)')
    .replace(/Red/gi, 'grave (niveau Rouge)')
    .replace(/is on going/gi, 'est en cours')
    .replace(/alert level is/gi, 'le niveau d’alerte est');
}

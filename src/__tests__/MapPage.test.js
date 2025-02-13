import React from 'react';
import { render, screen } from '@testing-library/react';
import MapPage from '../pages/MapPage/MapPage';
import '@testing-library/jest-dom'; // Ajoute des assertions supplémentaires comme toBeInTheDocument

describe('MapPage Component', () => {
  test('renders the heading and paragraph', () => {
    render(<MapPage />);
    
    // Vérifie que le titre est rendu correctement
    expect(screen.getByRole('heading', { name: /Page Carte/i })).toBeInTheDocument();
    
    // Vérifie que le paragraphe est rendu correctement
    expect(screen.getByText(/Affichage de la carte ici\./i)).toBeInTheDocument();
  });
});

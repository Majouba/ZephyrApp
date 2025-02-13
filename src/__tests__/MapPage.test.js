import { render } from '@testing-library/react';
import MapPage from '../pages/MapPage'; // Mets à jour le chemin si nécessaire

describe('MapPage Component', () => {
  test('renders without crashing', () => {
    render(<MapPage />);
  });
});
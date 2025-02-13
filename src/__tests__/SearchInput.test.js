import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchInput from '../components/SearchInput/SearchInput';
import '@testing-library/jest-dom';  // Ajoute des assertions comme toBeInTheDocument

describe('SearchInput Component', () => {
  test('renders input and button correctly', () => {
    render(<SearchInput city="" setCity={jest.fn()} onSearch={jest.fn()} />);
    expect(screen.getByPlaceholderText("Entrez le nom d'une ville")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /rechercher/i })).toBeInTheDocument();
  });

  test('calls setCity when input value changes', () => {
    const setCityMock = jest.fn();
    render(<SearchInput city="" setCity={setCityMock} onSearch={jest.fn()} />);
    fireEvent.change(screen.getByPlaceholderText("Entrez le nom d'une ville"), { target: { value: 'Paris' } });
    expect(setCityMock).toHaveBeenCalledWith('Paris');
  });

  test('calls onSearch when button is clicked', () => {
    const onSearchMock = jest.fn();
    render(<SearchInput city="Paris" setCity={jest.fn()} onSearch={onSearchMock} />);
    fireEvent.click(screen.getByRole('button', { name: /rechercher/i }));
    expect(onSearchMock).toHaveBeenCalled();
  });
});

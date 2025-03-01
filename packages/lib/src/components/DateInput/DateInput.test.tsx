import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DateInput } from './DateInput';

describe('DateInput Component', () => {
  test('renders the button with the correct label', () => {
    render(<DateInput></DateInput>);
    const div = screen.getByRole('DateInput', { name: /click me/i });
    //expect(div).toBeInTheDocument();
  });
});
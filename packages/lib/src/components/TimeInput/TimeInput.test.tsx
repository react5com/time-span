import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TimeInput } from './TimeInput';

describe('TimeInput Component', () => {
  test('renders the button with the correct label', () => {
    render(<TimeInput ></TimeInput>);
    const div = screen.getByRole('TimeInput', { name: /click me/i });
  });
});
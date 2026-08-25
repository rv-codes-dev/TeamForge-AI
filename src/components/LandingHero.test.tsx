import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LandingHero } from './LandingHero';
import React from 'react';

describe('LandingHero', () => {
  it('renders headlines correctly', () => {
    const mockOnTryDemo = vi.fn();
    render(<LandingHero onTryDemo={mockOnTryDemo} />);
    expect(screen.getByText(/Architect winning squads./i)).toBeTruthy();
  });

  it('calls onTryDemo when demo button is clicked', () => {
    const mockOnTryDemo = vi.fn();
    render(<LandingHero onTryDemo={mockOnTryDemo} />);
    
    const demoButton = screen.getByText(/Launch 10-Min Demo/i);
    fireEvent.click(demoButton);
    expect(mockOnTryDemo).toHaveBeenCalled();
  });

  it('calls onOpenAuth when signup button is clicked', () => {
    const mockOnTryDemo = vi.fn();
    const mockOnOpenAuth = vi.fn();
    render(<LandingHero onTryDemo={mockOnTryDemo} onOpenAuth={mockOnOpenAuth} />);
    
    const signupButton = screen.getByText(/Create Account/i);
    fireEvent.click(signupButton);
    expect(mockOnOpenAuth).toHaveBeenCalledWith('signup');
  });
});

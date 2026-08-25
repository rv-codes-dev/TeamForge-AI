import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TeamScoreGauge } from './TeamScoreGauge';
import React from 'react';
import { TeamMetrics } from '../types';

describe('TeamScoreGauge', () => {
  it('renders overall score correctly', () => {
    const mockMetrics: TeamMetrics = {
      overallScore: 85,
      skillCoverage: 90,
      complementarity: 80,
      projectInterest: 80,
      availability: 85,
      experience: 85,
      resilienceScore: 80,
      readinessStatus: 'READY TO BUILD',
    };
    render(<TeamScoreGauge metrics={mockMetrics} />);
    expect(screen.getByText('85')).toBeTruthy();
  });

  it('renders stress tested state', () => {
    const mockMetrics: TeamMetrics = {
      overallScore: 72,
      skillCoverage: 70,
      complementarity: 75,
      projectInterest: 80,
      availability: 80,
      experience: 65,
      resilienceScore: 80,
      readinessStatus: 'NEEDS IMPROVEMENT',
    };
    render(<TeamScoreGauge metrics={mockMetrics} isStressTested={true} scoreDelta={-13} />);
    expect(screen.getByText('72')).toBeTruthy();
    expect(screen.getByText('-13% lost')).toBeTruthy();
  });
});

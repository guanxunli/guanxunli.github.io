import type { Metadata } from 'next';
import CourseMaterialsPage from '@/components/teaching/CourseMaterialsPage';

export const metadata: Metadata = {
  title: 'Bayesian Statistics',
};

export default function BayesianStatisticsMaterials() {
  return (
    <CourseMaterialsPage
      courseTitle="Bayesian Statistics"
      terms={['2025 Spring', '2026 Spring']}
      pdfBasePath="/assets/teaching/bayesian-statistics"
    />
  );
}

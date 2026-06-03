import type { Metadata } from 'next';
import CourseMaterialsPage from '@/components/teaching/CourseMaterialsPage';

export const metadata: Metadata = {
  title: 'Non-parametric Statistics',
};

export default function NonParametricStatisticsMaterials() {
  return (
    <CourseMaterialsPage
      courseTitle="Non-parametric Statistics"
      terms={['2025 Spring', '2025 Fall', '2026 Spring']}
      pdfBasePath="/assets/teaching/non-parametric-statistics"
    />
  );
}

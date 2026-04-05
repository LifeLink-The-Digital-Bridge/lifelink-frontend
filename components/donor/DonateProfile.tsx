import React from 'react';
import { DetailsView } from '../common/DetailsView';
import { formatDonorDetails } from '../../utils/detailsFormatter';

interface ModernDonateProfileProps {
  donorData: any;
}

export function DonateProfile({ donorData }: ModernDonateProfileProps) {
  const sections = formatDonorDetails(donorData);
  return <DetailsView sections={sections} />;
}

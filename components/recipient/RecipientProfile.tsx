import React from "react";
import { DetailsView } from '../common/DetailsView';
import { formatRecipientDetails } from '../../utils/detailsFormatter';

interface RecipientProfileProps {
  recipient: any;
}

export function RecipientProfile({ recipient }: RecipientProfileProps) {
  const sections = formatRecipientDetails(recipient);
  return <DetailsView sections={sections} />;
}

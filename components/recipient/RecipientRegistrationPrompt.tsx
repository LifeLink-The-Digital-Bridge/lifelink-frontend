import React from 'react';
import { RegistrationPrompt } from '../common/RegistrationPrompt';

export function RecipientRegistrationPrompt() {
  return (
    <RegistrationPrompt
      iconName="user-plus"
      title="Become a Recipient"
      subtitle="Register as a recipient to receive blood donations when you need them most."
      benefits={[
        'Get help from donors in your community',
        'Fast and secure registration process',
        'Track your blood requests',
        'Receive notifications for matching donors',
      ]}
      buttonText="Register as Recipient"
      buttonIcon="user-plus"
      navigationRoute="/navigation/recipientscreens/RecipientScreen"
    />
  );
}

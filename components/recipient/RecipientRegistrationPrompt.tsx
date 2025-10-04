import React from 'react';
import { RegistrationPrompt } from '../common/RegistrationPrompt';

export function RecipientRegistrationPrompt() {
  return (
    <RegistrationPrompt
      iconName="user-plus"
      title="Become a Recipient"
      subtitle="Register as a recipient to receive blood, organs, or tissue donations when you need them most."
      benefits={[
        'Priority matching with compatible donors',
        'Real-time notifications for available matches',
        'Secure medical profile management',
        'Access to specialized healthcare networks',
      ]}
      buttonText="Register as Recipient"
      buttonIcon="user-plus"
      navigationRoute="/navigation/RecipientScreen"
    />
  );
}

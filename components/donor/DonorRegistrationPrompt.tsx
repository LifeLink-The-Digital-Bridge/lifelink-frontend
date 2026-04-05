import React from 'react';
import { RegistrationPrompt } from '../common/RegistrationPrompt';

export function DonorRegistrationPrompt() {
  return (
    <RegistrationPrompt
      iconName="heart"
      title="Become a Donor"
      subtitle="Join thousands of people making a difference by registering as a donor and helping save lives."
      benefits={[
        'Help save lives in your community',
        'Fast and secure registration process',
        'Track your donation history',
        'Receive notifications for urgent needs',
      ]}
      buttonText="Register as Donor"
      buttonIcon="heart"
      navigationRoute="/navigation/donorscreens/donorScreen"
    />
  );
}

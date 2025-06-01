import React from "react";
import AppLayout from "../../components/AppLayout";
import RecipientHubScreen from "../navigation/hubs/recipientHubScreen";
export default function receiveScreen() {
  return (
    <AppLayout title="Receive">
      <RecipientHubScreen />
    </AppLayout>
  );
}

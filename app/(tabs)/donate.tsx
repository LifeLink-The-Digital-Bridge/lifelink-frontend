import React from "react";
import AppLayout from "../../components/AppLayout";
import DonateHubScreen from "../navigation/hubs/donateHubScreen";

export default function donateScreen() {
  return (
    <AppLayout hideHeader>
      <DonateHubScreen />
    </AppLayout>
  );
}


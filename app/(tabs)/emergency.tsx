import React from "react";
import AppLayout from "../../components/AppLayout";
import EmergencyAccessScreen from "../navigation/healthscreens/EmergencyAccessScreen";

export default function EmergencyTab() {
  return (
    <AppLayout>
      <EmergencyAccessScreen />
    </AppLayout>
  );
}

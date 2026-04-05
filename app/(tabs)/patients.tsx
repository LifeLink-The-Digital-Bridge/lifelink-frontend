import React from "react";
import AppLayout from "../../components/AppLayout";
import DoctorPatientsScreen from "../navigation/healthscreens/DoctorPatientsScreen";

export default function PatientsTab() {
  return (
    <AppLayout>
      <DoctorPatientsScreen />
    </AppLayout>
  );
}

import ProfileScreen from "../navigation/profileScreen";
import React from "react";
import AppLayout from "../../components/AppLayout";

export default function ProfileTab() {
  return (
    <AppLayout hideHeader>
      <ProfileScreen />
    </AppLayout>
  );
}

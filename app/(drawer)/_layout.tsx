import { Drawer } from 'expo-router/drawer';

export default function DrawerLayout() {
  return <Drawer>
    <Drawer.Screen name="(tabs)" options={{ drawerLabel: "Home" }} />
    <Drawer.Screen name="raiseFund" options={{ drawerLabel: "Raise Fund" }} />
    <Drawer.Screen name="DonationStatusScreen" options={{ drawerLabel: "My Donations" }} />
    <Drawer.Screen name="RecipientStatusScreen" options={{ drawerLabel: "Receiver Requests" }} />
    <Drawer.Screen name="ManualMatchScreen" options={{ drawerLabel: "Manual Match" }} />
  </Drawer>;
}

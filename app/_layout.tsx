import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function Layout() {
  return (
    <>
      {/* This makes the battery/time icons at the top white */}
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        {/* This ensures the index (calculator) is the only screen */}
        <Stack.Screen name="index" />
      </Stack>
    </>
  );
}

import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hide();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }
  return (
    <Stack initialRouteName="index">
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="Onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="welcome" options={{ headerShown:false}}/>
      <Stack.Screen name="login"/>
      <Stack.Screen name="signup"/>
      <Stack.Screen name="home" options={{ headerShown:false}}/>
      <Stack.Screen name="favorites" options={{ headerShown:false}}/>
      <Stack.Screen name="available-buses" options={{ headerShown:false}}/>
      <Stack.Screen name="routes" options={{ headerShown:false}}/>
      <Stack.Screen name="search" options={{ headerShown:false}}/>
      <Stack.Screen name="profile" options={{ headerShown:false}}/>
      <Stack.Screen name="history" options={{ headerShown:false}}/>
      <Stack.Screen name="report" options={{ headerShown:false}}/>
      <Stack.Screen name="qns" options={{ headerShown:false}}/>
    </Stack>
  );
}

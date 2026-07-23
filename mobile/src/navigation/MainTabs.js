import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import ScanScreen from "../screens/ScanScreen";

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#5B2A86",
        tabBarIcon: ({ color, size }) => {
          const icon = route.name === "Home" ? "qr-code" : "camera";
          return <Ionicons name={icon} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: "My QR" }} />
      <Tab.Screen name="Scan" component={ScanScreen} options={{ title: "Scan" }} />
    </Tab.Navigator>
  );
}

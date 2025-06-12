import Ionicons from "@expo/vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./homeScreen";
// import Species from "./speciesScreen";
import SpeciesNavigator from "./speciesNavigator";
import Report from "./reportsScreen";
import Profile from "./profileScreen";
import IdentifyNavigator from "./identifyNavigator";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import ProfileNavigator from "./profileNavigator";

const TabNav = createBottomTabNavigator();

export default function MainNavigator() {
  return (
    <TabNav.Navigator
      screenOptions={({ route }) => ({
        // animation: 'fade',
        headerStyle: {
          backgroundColor: "#001A1A",
        },
        headerTintColor: "#fff",
        tabBarActiveTintColor: "#408080",
        tabBarInactiveTintColor: "#99B2B2",
        tabBarStyle: {
          backgroundColor: "#F2FFFF",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          paddingBottom: 4,
          fontWeight: "600",
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;

          switch (route.name) {
            case "Home":
              iconName = focused ? "home" : "home-outline";
              break;
            case "Species":
              iconName = focused ? "leaf" : "leaf-outline";
              break;
            case "Identify":
              iconName = focused ? "camera" : "camera-outline";
              break;
            case "Reports":
              iconName = focused ? "bookmark" : "bookmark-outline";
              break;
            case "More":
              iconName = "menu";
              break;
            default:
              iconName = "help-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <TabNav.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <TabNav.Screen
        name="Species"
        component={SpeciesNavigator}
        options={{ headerShown: false }}
      />
      <TabNav.Screen
        name="Identify"
        component={IdentifyNavigator}
        // options={{ headerShown: false }}
        options={({ route }) => {
          const routeName =
            getFocusedRouteNameFromRoute(route) ?? "IdentifyMain";

          return {
            tabBarStyle:
              routeName === "CameraScreen"
                ? { display: "none" }
                : { backgroundColor: "#F2FFFF" },
            headerShown: false,
          };
        }}
      />
      <TabNav.Screen
        name="Reports"
        component={Report}
        options={{ headerShown: false }}
      />
      <TabNav.Screen
        name="More"
        component={ProfileNavigator}
        options={{ headerShown: false }}
      />
    </TabNav.Navigator>
  );
}

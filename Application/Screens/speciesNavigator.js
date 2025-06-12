import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Species from "./speciesScreen";
import SpeciesIndividual from "./speciesIndividual";
// import { getFocusedRouteNameFromRoute } from '@react-navigation/native';


const Stack = createNativeStackNavigator();

export default function SpeciesNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="SpeciesScreen"
    >
      <Stack.Screen name="SpeciesScreen" component={Species} />
      <Stack.Screen name="SpeciesIndividual" component={SpeciesIndividual} />
    </Stack.Navigator>
  );
}
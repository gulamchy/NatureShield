import { createNativeStackNavigator } from "@react-navigation/native-stack";
import IdentifyScreen from "./identifyScreen";
import CameraScreen from "./cameraScreen";
import PicturePreview from "./picturePreview";
import ResultScreen from './resultScreen';
import ResultReport from "./resultReport";
// import { getFocusedRouteNameFromRoute } from '@react-navigation/native';


const Stack = createNativeStackNavigator();

export default function IdentifyNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="IdentifyMain"
    >
      <Stack.Screen name="IdentifyMain" component={IdentifyScreen} />
      <Stack.Screen name="CameraScreen" component={CameraScreen} />
      <Stack.Screen name="PicturePreview" component={PicturePreview} />
      <Stack.Screen name="ResultScreen" component={ResultScreen} />
      <Stack.Screen name="ResultReport" component={ResultReport} />
    </Stack.Navigator>
  );
}
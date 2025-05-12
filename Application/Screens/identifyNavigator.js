import { createNativeStackNavigator } from '@react-navigation/native-stack';
import IdentifyScreen from './identifyScreen';
import CameraScreen from './cameraScreen';
// import ResultScreen from './resultScreen';

const Stack = createNativeStackNavigator();

export default function IdentifyNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='IdentifyMain'>
      <Stack.Screen name="IdentifyMain" component={IdentifyScreen} />
      <Stack.Screen name="CameraScreen" component={CameraScreen} />
      {/* <Stack.Screen name="ResultScreen" component={resultScreen} /> */}
    </Stack.Navigator>
  );
}

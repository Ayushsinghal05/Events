import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Auth from './components/Auth';
import Home from './components/Home';
import Events from './components/Events'
import AddEvents from './components/AddEvents';
import { AuthProvider } from './components/AuthContext';

export type RootStackParamList = {
  Auth: undefined;
  Home: undefined;
  Events: undefined;
  AddEvents: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <Stack.Navigator initialRouteName="Auth">
            <Stack.Screen name="Auth" component={Auth} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Events" component={Events} />
            <Stack.Screen name="AddEvents" component={AddEvents} />
        </Stack.Navigator>
        </AuthProvider>
    </NavigationContainer>
  );
}

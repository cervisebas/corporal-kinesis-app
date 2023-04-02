/**
 * @format
 */

import { AppRegistry, DeviceEventEmitter, ToastAndroid } from 'react-native';
import App from './src/Index';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';

const onMessageReceived = (_message)=>{
    ToastAndroid.show('Actualizando...', ToastAndroid.SHORT);
    DeviceEventEmitter.emit('tab1reload');
}
messaging().onMessage(onMessageReceived);
messaging().setBackgroundMessageHandler(async(m)=>onMessageReceived(m));

AppRegistry.registerComponent(appName, () => App);

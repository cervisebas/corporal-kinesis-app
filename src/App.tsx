import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SystemNavigationBar from "react-native-system-navigation-bar";
import { Alert, LogBox, StatusBar, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import Client from './screens/client';
import Profesional from './screens/profesional';
import CombinedTheme from './Theme';
import { Account } from './scripts/ApiCorporal';
import { ExtraContents } from './ExtraContents';
import SplashScreen from 'react-native-splash-screen';
import { setLoadNow } from './scripts/Global';
import DeviceInfo from "react-native-device-info";
import { decode } from 'base-64';
import { getNavigationBarHeight } from 'react-native-android-navbar-height';

const App = ()=>{
    const [openSession, setOpenSession] = useState(false);
    const [marginTop, setMarginTop] = React.useState(0);
    const [marginBottom, setMarginBottom] = React.useState(0);    
    const [showVerify, setShowVerify] = useState(true);
    const [textVerify, setTextVerify] = useState('Cargando');
    const [textAnimVerify, setTextAnimVerify] = useState(true);
    LogBox.ignoreAllLogs();
    setTimeout(()=>SplashScreen.hide(), 128);
    const Stack = createNativeStackNavigator();
    SystemNavigationBar.setNavigationColor('#0f4577', true);
    Account.verify().then((value)=>{
        if (value) { var dataUser: any = value; setTextVerify(`Accediendo como "${decode(dataUser.email).slice(0, 5)}...${decode(dataUser.email).slice(decode(dataUser.email).indexOf('@'), decode(dataUser.email).length)}"`); }
        setTimeout(()=>{ setOpenSession(!value); if (value) { setLoadNow(true); } setShowVerify(false); }, 2500);
    }).catch((error)=>{
        setTextVerify(error.cause);
        setTextAnimVerify(false);
    });
    setTimeout(async() => {
        if (await DeviceInfo.getApiLevel() < 26) {
          setMarginTop(StatusBar.currentHeight || 24);
          setMarginBottom(await getNavigationBarHeight());
        }
    });

    return(<View style={{ flex: 1, marginTop, marginBottom }}>
        <StatusBar barStyle={'light-content'} backgroundColor={'#0f4577'} />
        <PaperProvider theme={CombinedTheme}>
            <NavigationContainer theme={CombinedTheme}>
                <ExtraContents
                    openSession={openSession}
                    closeSession={()=>setOpenSession(false)}
                    setLoadData={(data)=>setLoadNow(data)}
                    showVerify={showVerify}
                    textVerify={textVerify}
                    animTextVerify={textAnimVerify}
                />
                <Stack.Navigator initialRouteName="h" screenOptions={{ headerShown: false, animation: 'slide_from_bottom', gestureEnabled: false }} >
                    <Stack.Screen name="h" component={Client} />
                    <Stack.Screen name="n" component={Profesional} />
                </Stack.Navigator>
            </NavigationContainer>
        </PaperProvider>
    </View>);
};
export default App;
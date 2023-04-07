import React, { useContext, useEffect, useState } from 'react';
import { EventArg, NavigationContainer } from '@react-navigation/native';
import { NativeStackNavigationOptions, createNativeStackNavigator } from '@react-navigation/native-stack';
import SystemNavigationBar from "react-native-system-navigation-bar";
import { DeviceEventEmitter, EmitterSubscription, StatusBar, StatusBarStyle, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import Client from './screens/client';
import Profesional from './screens/profesional';
import { Account, ChangeLogSystem, Notification } from './scripts/ApiCorporal';
import { ExtraContents } from './ExtraContents';
import { setLoadNow } from './scripts/Global';
import { decode } from 'base-64';
import VersionCheck from 'react-native-version-check';
import SplashScreen from './screens/SplashScreen';
import { ThemeContext } from './providers/ThemeProvider';
import GlobalComponents from './GlobalComponents';
import { GlobalRef } from './GlobalRef';
import { refSession } from './ExtraContentsRefs';
import { refProfesional } from './screens/profesionalRef';

const Stack = createNativeStackNavigator();

const _screenOptions: NativeStackNavigationOptions = {
    headerShown: false,
    animation: 'fade_from_bottom',
    gestureEnabled: false
};

var event: EmitterSubscription | undefined = undefined;
var event2: EmitterSubscription | undefined = undefined;

export default React.memo(function App() {
    // Context's
    const { theme, navTheme, themeStatus, setThemeStatus } = useContext(ThemeContext);
    // State's
    const [showVerify, setShowVerify] = useState<boolean>(false);
    const [textAnimVerify, setTextAnimVerify] = useState<string|undefined>(undefined);
    const [viewDialogUpdate, setViewDialogUpdate] = useState<boolean>(false);
    const [storeUrl, setStoreUrl] = useState<string>('');
    const [index, setIndex] = useState(0);
    // State's StatusBar and NavBar
    const [statusColor, setStatusColor] = useState(themeStatus[0].color);
    const [statusStyle, setStatusStyle] = useState<StatusBarStyle>((themeStatus[0].style == 'light')? 'light-content': 'dark-content');
    const [navColor, setNavColor] = useState(themeStatus[1].color);
    const [navStyle, setNavStyle] = useState(themeStatus[1].style);

    // Functions Extra Contentents
    function _closeDialogUpdate() { setViewDialogUpdate(false); }

    // Funtions
    function verifyAccount() {
        setShowVerify(true);
        Account.verify().then((value)=>{
            setTextAnimVerify(`Accediendo como "${decode(value.email).slice(0, 5)}...${decode(value.email).slice(decode(value.email).indexOf('@'), decode(value.email).length)}"`);
            setTimeout(()=>{
                if (!value) refSession.current?.open(); else refSession.current?.close();
                setShowVerify(false);
                if (value) {
                    setLoadNow(true);
                    ChangeLogSystem.getVerify().then((value)=>{
                        if (value) {
                            //setChangeLoadView(true);
                            ChangeLogSystem.setNewVersion();
                        }
                    });
                }
            }, 2500);
        }).catch((error)=>{
            if (error.action == 1) return refSession.current?.open();
            setTextAnimVerify(error.cause);
            setTimeout(()=>refSession.current?.close(), 1500);
        });
    }
    function changeScreen({ data }: EventArg<"state", undefined, unknown>) {
        const _index = (data as any).state.index;
        if (_index == index) return;
        if (_index == 0) return setThemeStatus([{ color: theme.colors.background, style: 'light' }, { color: theme.colors.elevation.level2, style: 'light' }]);
        if (_index == 1) return setThemeStatus([{ color: theme.colors.background, style: 'light' }, { color: theme.colors.background, style: 'light' }]);
    }

    useEffect(()=>{
        event = DeviceEventEmitter.addListener('nowVerify', verifyAccount);
        //event2 = DeviceEventEmitter.addListener('openChangeLog', ()=>setChangeLoadView(true));
        Notification.init();
        VersionCheck.needUpdate({ ignoreErrors: true }).then((value)=>{
            if (value.isNeeded) {
                setViewDialogUpdate(true);
                setStoreUrl(value.storeUrl);
            }
        });
        return ()=>{
            setLoadNow(false);
            event?.remove();
            event2?.remove();
        };
    }, []);
    
    useEffect(()=>{
        const stStyle = (themeStatus[0].style == 'light')? 'light-content': 'dark-content';
        if (statusColor !== themeStatus[0].color) setStatusColor(themeStatus[0].color);
        if (statusStyle !== stStyle) setStatusStyle(stStyle);
        if (navColor !== themeStatus[1].color) setNavColor(themeStatus[1].color);
        if (navStyle !== themeStatus[1].style) setNavStyle(themeStatus[1].style);
    }, [themeStatus]);
    /* ########## Color StatusBar/StatusNavigationBar ########## */
    SystemNavigationBar.setNavigationColor(navColor, navStyle);
    StatusBar.setBackgroundColor(statusColor, false);
    StatusBar.setBarStyle(statusStyle, false);
    //console.log(navColor, navStyle, statusColor, statusStyle);
    /* ######################################################### */

    return(<View style={{ flex: 1, position: 'relative', backgroundColor: theme.colors.background }}>
        <PaperProvider theme={theme}>
            <NavigationContainer theme={navTheme}>
                <ExtraContents
                    showVerify={showVerify}
                    textVerify={textAnimVerify}
                    viewDialogUpdate={viewDialogUpdate}
                    closeDialogUpdate={_closeDialogUpdate}
                    storeUrl={storeUrl}
                    reVerify={verifyAccount}
                />
                <GlobalComponents ref={GlobalRef} />
                <SplashScreen init={verifyAccount} />
                <Stack.Navigator initialRouteName="c" screenOptions={_screenOptions} screenListeners={{ state: changeScreen }}>
                    <Stack.Screen name="c" children={(cProps)=><Client {...cProps} />} />
                    <Stack.Screen name="p" children={(cProps)=><Profesional ref={refProfesional} {...cProps} />} />
                </Stack.Navigator>
            </NavigationContainer>
        </PaperProvider>
    </View>);
});
import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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

const Stack = createNativeStackNavigator();

var event: EmitterSubscription | undefined = undefined;
var event2: EmitterSubscription | undefined = undefined;

export default React.memo(function App() {
    // Context's
    const { theme, navTheme, themeStatus } = useContext(ThemeContext);
    // State's
    const [openSession, setOpenSession] = useState<boolean>(false);
    const [showVerify, setShowVerify] = useState<boolean>(false);
    const [textAnimVerify, setTextAnimVerify] = useState<string|undefined>(undefined);
    const [changeLoadView, setChangeLoadView] = useState<boolean>(false);
    const [viewDialogUpdate, setViewDialogUpdate] = useState<boolean>(false);
    const [storeUrl, setStoreUrl] = useState<string>('');
    // State's StatusBar and NavBar
    const [statusColor, setStatusColor] = useState(themeStatus[0].color);
    const [statusStyle, setStatusStyle] = useState<StatusBarStyle>((themeStatus[0].style == 'light')? 'light-content': 'dark-content');
    const [navColor, setNavColor] = useState(themeStatus[1].color);
    const [navStyle, setNavStyle] = useState(themeStatus[1].style);

    // Functions Extra Contentents
    function _closeSession() { setOpenSession(false); }
    function _closeChangeLoad() { setChangeLoadView(false); }
    function _closeDialogUpdate() { setViewDialogUpdate(false); }

    // Funtions
    function verifyAccount() {
        setShowVerify(true);
        Account.verify().then((value)=>{
            setTextAnimVerify(`Accediendo como "${decode(value.email).slice(0, 5)}...${decode(value.email).slice(decode(value.email).indexOf('@'), decode(value.email).length)}"`);
            setTimeout(()=>{
                setOpenSession(!value);
                setShowVerify(false);
                if (value) {
                    setLoadNow(true);
                    ChangeLogSystem.getVerify().then((value)=>{
                        if (value) {
                            setChangeLoadView(true);
                            ChangeLogSystem.setNewVersion();
                        }
                    });
                }
            }, 2500);
        }).catch((error)=>{
            if (error.action == 1) return setOpenSession(true);
            setTextAnimVerify(error.cause);
            setTimeout(_closeSession, 1500);
        });
    }

    useEffect(()=>{
        event = DeviceEventEmitter.addListener('nowVerify', verifyAccount);
        event2 = DeviceEventEmitter.addListener('openChangeLog', ()=>setChangeLoadView(true));
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
        console.log(themeStatus);
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
                    openSession={openSession}
                    closeSession={_closeSession}
                    setLoadData={setLoadNow}
                    showVerify={showVerify}
                    textVerify={textAnimVerify}
                    visibleChangeLoad={changeLoadView}
                    closeChangeLoad={_closeChangeLoad}
                    viewDialogUpdate={viewDialogUpdate}
                    closeDialogUpdate={_closeDialogUpdate}
                    storeUrl={storeUrl}
                />
                <SplashScreen init={verifyAccount} />
                <Stack.Navigator initialRouteName="c" screenOptions={{ headerShown: false, animation: 'fade_from_bottom', gestureEnabled: false }} >
                    <Stack.Screen name="c" children={(cProps)=><Client {...cProps} />} />
                    <Stack.Screen name="p" children={(cProps)=><Profesional {...cProps} />} />
                </Stack.Navigator>
            </NavigationContainer>
        </PaperProvider>
    </View>);
});
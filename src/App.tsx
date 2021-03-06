import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SystemNavigationBar from "react-native-system-navigation-bar";
import { DeviceEventEmitter, EmitterSubscription, StatusBar, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import Client from './screens/client';
import Profesional from './screens/profesional';
import CombinedTheme from './Theme';
import { Account, ChangeLogSystem, Notification } from './scripts/ApiCorporal';
import { ExtraContents } from './ExtraContents';
import SplashScreen from 'react-native-splash-screen';
import { setLoadNow } from './scripts/Global';
import DeviceInfo from "react-native-device-info";
import { decode } from 'base-64';
import { getNavigationBarHeight } from 'react-native-android-navbar-height';
import VersionCheck from 'react-native-version-check';
import 'react-native-gesture-handler';

type IProps = {};
type IState = {
    marginTop: number;
    marginBottom: number;

    openSession: boolean;
    showVerify: boolean;
    textAnimVerify: string | undefined;

    changeLoadView: boolean;

    viewDialogUpdate: boolean;
    storeUrl: string;
};
const Stack = createNativeStackNavigator();
export default class App extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            marginTop: 0,
            marginBottom: 0,
            openSession: false,
            showVerify: true,
            textAnimVerify: undefined,
            changeLoadView: false,
            viewDialogUpdate: false,
            storeUrl: ''
        };
    }
    private event: EmitterSubscription | null = null;
    private event2: EmitterSubscription | null = null;
    verifyAccount() {
        Account.verify().then((value)=>{
            if (value) this.setState({ textAnimVerify: `Accediendo como "${decode(value.email).slice(0, 5)}...${decode(value.email).slice(decode(value.email).indexOf('@'), decode(value.email).length)}"` });
            setTimeout(()=>this.setState({ openSession: !value, showVerify: false }, ()=>(value) && setLoadNow(true)), 2500);
            setTimeout(()=>(value)&&ChangeLogSystem.getVerify().then((value)=>(value) && this.setState({ changeLoadView: true }, ()=>ChangeLogSystem.setNewVersion())), 200);
        }).catch((error)=>{
            if (error.action == 1) return this.setState({ openSession: true });
            this.setState({ textAnimVerify: error.cause }, ()=>setTimeout(()=>this.setState({ openSession: true }), 1500));
        });
    }
    componentDidMount() {
        setTimeout(()=>SplashScreen.hide(), 128);
        SystemNavigationBar.setNavigationColor('#0f4577', true);
        this.verifyAccount();
        this.event = DeviceEventEmitter.addListener('nowVerify', ()=>this.verifyAccount());
        this.event2 = DeviceEventEmitter.addListener('openChangeLog', ()=>this.setState({ changeLoadView: true }));
        Notification.init();
        (!__DEV__)&&VersionCheck.needUpdate({ ignoreErrors: true }).then((value)=>(value.isNeeded)&&this.setState({ viewDialogUpdate: true, storeUrl: value.storeUrl }));
        console.log(`Dev Mode: ${__DEV__}`);
        setTimeout(async() =>(await DeviceInfo.getApiLevel() < 26) && this.setState({ marginTop: StatusBar.currentHeight || 24, marginBottom: await getNavigationBarHeight() }));
    }
    componentWillUnmount() {
        setLoadNow(false);
        this.setState({
            marginTop: 0,
            marginBottom: 0,
            openSession: false,
            showVerify: true,
            textAnimVerify: undefined
        });
        this.event?.remove();
        this.event2?.remove();
        DeviceEventEmitter.removeAllListeners();
    }
    render(): React.ReactNode {
        return(<View style={{ flex: 1, marginTop: this.state.marginTop, marginBottom: this.state.marginBottom }}>
            <StatusBar barStyle={'light-content'} backgroundColor={'#0f4577'} />
            <PaperProvider theme={CombinedTheme}>
                <NavigationContainer theme={CombinedTheme}>
                    <ExtraContents
                        openSession={this.state.openSession}
                        closeSession={()=>this.setState({ openSession: false })}
                        setLoadData={(data)=>setLoadNow(data)}
                        showVerify={this.state.showVerify}
                        textVerify={this.state.textAnimVerify}
                        visibleChangeLoad={this.state.changeLoadView}
                        closeChangeLoad={()=>this.setState({ changeLoadView: false })}
                        viewDialogUpdate={this.state.viewDialogUpdate}
                        closeDialogUpdate={()=>this.setState({ viewDialogUpdate: false })}
                        storeUrl={this.state.storeUrl}
                    />
                    <Stack.Navigator initialRouteName="c" screenOptions={{ headerShown: false, animation: 'fade_from_bottom', gestureEnabled: false }} >
                        <Stack.Screen name="c" component={Client} />
                        <Stack.Screen name="p" component={Profesional} />
                    </Stack.Navigator>
                </NavigationContainer>
            </PaperProvider>
        </View>);
    }
}

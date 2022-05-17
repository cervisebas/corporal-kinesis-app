import React, { Component } from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SystemNavigationBar from "react-native-system-navigation-bar";
import { DeviceEventEmitter, EmitterSubscription, Linking, StatusBar, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import Client from './screens/client';
import Profesional from './screens/profesional';
import CombinedTheme from './Theme';
import { Account, ChangeLogSystem } from './scripts/ApiCorporal';
import { ExtraContents } from './ExtraContents';
import SplashScreen from 'react-native-splash-screen';
import { setLoadNow } from './scripts/Global';
import DeviceInfo from "react-native-device-info";
import { decode } from 'base-64';
import { getNavigationBarHeight } from 'react-native-android-navbar-height';
import VersionCheck from 'react-native-version-check';

type IProps = {};
type IState = {
    marginTop: number;
    marginBottom: number;

    openSession: boolean;
    showVerify: boolean;
    showTextAnimVerify: boolean;
    textAnimVerify: string;

    changeLoadView: boolean;
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
            showTextAnimVerify: true,
            textAnimVerify: 'Cargando',

            changeLoadView: false
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
            this.setState({ textAnimVerify: error.cause, showTextAnimVerify: false }, ()=>setTimeout(()=>this.setState({ openSession: true }), 1500));
        });
    }
    componentDidMount() {
        setTimeout(()=>SplashScreen.hide(), 128);
        SystemNavigationBar.setNavigationColor('#0f4577', true);
        this.verifyAccount();
        setTimeout(async() =>(await DeviceInfo.getApiLevel() < 26) && this.setState({ marginTop: StatusBar.currentHeight || 24, marginBottom: await getNavigationBarHeight() }));
        this.event = DeviceEventEmitter.addListener('nowVerify', ()=>this.verifyAccount());
        this.event2 = DeviceEventEmitter.addListener('openChangeLog', ()=>this.setState({ changeLoadView: true }));
        VersionCheck.needUpdate({ ignoreErrors: true }).then((value)=>(value.isNeeded)&&Linking.openURL(value.storeUrl));
    }
    componentWillUnmount() {
        setLoadNow(false);
        this.setState({
            marginTop: 0,
            marginBottom: 0,
            openSession: false,
            showVerify: true,
            showTextAnimVerify: true,
            textAnimVerify: 'Cargando'
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
                        animTextVerify={this.state.showTextAnimVerify}
                        visibleChangeLoad={this.state.changeLoadView}
                        closeChangeLoad={()=>this.setState({ changeLoadView: false })}
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

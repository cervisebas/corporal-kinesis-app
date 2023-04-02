import React, { PureComponent } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SystemNavigationBar from "react-native-system-navigation-bar";
import { DeviceEventEmitter, EmitterSubscription, StatusBar, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import Client from './screens/client';
import Profesional from './screens/profesional';
import { Account, ChangeLogSystem, Notification } from './scripts/ApiCorporal';
import { ExtraContents } from './ExtraContents';
import { setLoadNow } from './scripts/Global';
import { decode } from 'base-64';
import VersionCheck from 'react-native-version-check';
import 'react-native-gesture-handler';
import SplashScreen from './screens/SplashScreen';
import { ThemeContext, ThemeContextType } from './providers/ThemeProvider';

type IProps = {};
type IState = {
    openSession: boolean;
    showVerify: boolean;
    textAnimVerify: string | undefined;

    changeLoadView: boolean;

    viewDialogUpdate: boolean;
    storeUrl: string;
};
const Stack = createNativeStackNavigator();
export default class App extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            openSession: false,
            showVerify: false,
            textAnimVerify: undefined,
            changeLoadView: false,
            viewDialogUpdate: false,
            storeUrl: ''
        };
        this.verifyAccount = this.verifyAccount.bind(this);
    }
    private event: EmitterSubscription | null = null;
    private event2: EmitterSubscription | null = null;
    static contextType: React.Context<ThemeContextType> = ThemeContext;
    verifyAccount() {
        this.setState({ showVerify: true });
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
        SystemNavigationBar.setNavigationColor('#0f4577', 'light', 'navigation');
        this.event = DeviceEventEmitter.addListener('nowVerify', this.verifyAccount);
        this.event2 = DeviceEventEmitter.addListener('openChangeLog', ()=>this.setState({ changeLoadView: true }));
        Notification.init();
        VersionCheck.needUpdate({ ignoreErrors: true }).then((value)=>(value.isNeeded)&&this.setState({ viewDialogUpdate: true, storeUrl: value.storeUrl }));
        console.log(`Dev Mode: ${__DEV__}`);
    }
    componentWillUnmount() {
        setLoadNow(false);
        this.event?.remove();
        this.event2?.remove();
    }
    render(): React.ReactNode {
        const { theme, navTheme } = this.context;
        console.log(`App primary: ${theme.colors.primary}`);
        return(<View style={{ flex: 1, position: 'relative', backgroundColor: theme.colors.background }}>
            <StatusBar barStyle={'light-content'} backgroundColor={'#0f4577'} />
            <PaperProvider theme={theme}>
                <NavigationContainer theme={navTheme}>
                    <ExtraContents
                        openSession={this.state.openSession}
                        closeSession={()=>this.setState({ openSession: false })}
                        setLoadData={setLoadNow}
                        showVerify={this.state.showVerify}
                        textVerify={this.state.textAnimVerify}
                        visibleChangeLoad={this.state.changeLoadView}
                        closeChangeLoad={()=>this.setState({ changeLoadView: false })}
                        viewDialogUpdate={this.state.viewDialogUpdate}
                        closeDialogUpdate={()=>this.setState({ viewDialogUpdate: false })}
                        storeUrl={this.state.storeUrl}
                    />
                    <SplashScreen init={this.verifyAccount} />
                    <Stack.Navigator initialRouteName="c" screenOptions={{ headerShown: false, animation: 'fade_from_bottom', gestureEnabled: false }} >
                        <Stack.Screen name="c" children={(cProps)=><Client {...cProps} />} />
                        <Stack.Screen name="p" children={(cProps)=><Profesional {...cProps} />} />
                    </Stack.Navigator>
                </NavigationContainer>
            </PaperProvider>
        </View>);
    }
}

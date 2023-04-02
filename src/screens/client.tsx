import React, { PureComponent, createRef, useContext, useEffect, useState } from "react";
import { DeviceEventEmitter, EmitterSubscription, StyleSheet, View } from "react-native";
import { BottomNavigation, FAB } from "react-native-paper";
import { Permission } from "../scripts/ApiCorporal";
import Options from "./pages/pages/options";
import { LoadNow } from "../scripts/Global";
import { Tab1 } from "./pages/Tab1";
import { Tab2 } from "./pages/Tab2";
import LoadingComponent, { LoadingComponentRef } from "./components/LoadingComponent";
import { ThemeContext } from "../providers/ThemeProvider";

type IProps = {
    navigation: any;
    route: any;
};

export default React.memo(function Client(props: IProps) {
    // Context's
    const { theme } = useContext(ThemeContext);
    // States
    const [index, setIndex] = React.useState(0);
    const [loadingAdmin, setLoadingAdmin] = useState(true);
    const [showButtonAdmin, setShowButtonAdmin] = useState(true);
    // Ref's
    const refLoadingComponent = createRef<LoadingComponentRef>();
    const refOthersComponents = createRef<OthersComponents>();
    // Variables
    var event: EmitterSubscription | undefined = undefined;
    
    const routes = [
        { key: 'statistics', title: 'Estadísticas', focusedIcon: 'chart-timeline-variant-shimmer', unfocusedIcon: 'chart-timeline-variant' },
        { key: 'account', title: 'Mi cuenta', focusedIcon: 'account', unfocusedIcon: 'account-outline' }
    ];
    const renderScene = ({ route }: any) => {
        switch (route.key) {
            case 'statistics':
                return(<Tab1 showLoading={showLoading} />);
            case 'account':
                return(<Tab2 showLoading={showLoading} openOptions={showViewOptions} />);
        }
    };
    function verifyAdmin() {
        Permission.get().then((value)=>{
            var permission = parseInt(value);
            if (permission >= 2) setShowButtonAdmin(true); else setShowButtonAdmin(false);
            setLoadingAdmin(false);
        }).catch(()=>{
            setShowButtonAdmin(false);
            setLoadingAdmin(false);
        });
    };
    
    const readyVerifyAdmin = setInterval(()=>{
        if (LoadNow == true) {
            verifyAdmin();
            clearInterval(readyVerifyAdmin);
        }
    }, 512);

    function showViewOptions() { refOthersComponents.current?.open(); }
    function showLoading(visible: boolean, message?: string) { refLoadingComponent.current?.controller(visible, message); }

    useEffect(()=>{
        event = DeviceEventEmitter.addListener('goToHome', ()=>setIndex(0));
        return ()=>{
            event?.remove();
        };
    }, []);

    return(<View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <LoadingComponent ref={refLoadingComponent} />
        <OthersComponents
            ref={refOthersComponents}
            showLoading={showLoading}
        />
        <BottomNavigation
            navigationState={{ index, routes }}
            onIndexChange={setIndex}
            renderScene={renderScene}
            sceneAnimationEnabled={true}
        />
        <FAB
            style={styles.fab}
            loading={loadingAdmin}
            disabled={loadingAdmin}
            visible={showButtonAdmin}
            icon={'account-lock'}
            onPress={()=>props.navigation.navigate('p')}
        />
    </View>);
});

type IProps2 = {
    showLoading: (view: boolean, text: string)=>any;
};
type IState2 = { visible: boolean; };
class OthersComponents extends PureComponent<IProps2, IState2> {
    constructor(props: IProps2) {
        super(props);
        this.state = {
            visible: false
        };
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
    }
    open() { this.setState({ visible: true }); }
    close() { this.setState({ visible: false }); }
    render(): React.ReactNode {
        return(<>
            <Options
                show={this.state.visible}
                close={this.close}
                showLoading={this.props.showLoading}
            />
        </>);
    }
}

const styles = StyleSheet.create({
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 80
    },
});
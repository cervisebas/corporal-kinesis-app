import React, { PureComponent, useEffect, useState } from "react";
import { DeviceEventEmitter, EmitterSubscription, StyleSheet, View } from "react-native";
import { BottomNavigation, FAB } from "react-native-paper";
import { Permission } from "../scripts/ApiCorporal";
import Options from "./pages/pages/options";
import { LoadNow } from "../scripts/Global";
import { Tab1 } from "./pages/Tab1";
import { Tab2 } from "./pages/Tab2";
import { refEditAccount, refOptions, refStatistic, refViewModeDetails } from "./clientRefs";
import Statistic from "./pages/statistics/statistic";
import ViewModeDetails from "./pages/pages/viewMoreDetails";
import EditAccount from "./pages/pages/editAccount";

type IProps = {
    navigation: any;
    route: any;
};

export default React.memo(function Client(props: IProps) {
    // States
    const [index, setIndex] = React.useState(0);
    const [loadingAdmin, setLoadingAdmin] = useState(true);
    const [showButtonAdmin, setShowButtonAdmin] = useState(true);
    // Variables
    var event: EmitterSubscription | undefined = undefined;
    
    const [routes] = useState([
        { key: 'statistics', title: 'Estadísticas', focusedIcon: 'chart-timeline-variant-shimmer', unfocusedIcon: 'chart-timeline-variant' },
        { key: 'account', title: 'Mi cuenta', focusedIcon: 'account', unfocusedIcon: 'account-outline' }
    ]);
    const renderScene = ({ route }: any) => {
        switch (route.key) {
            case 'statistics':
                return(<Tab1 />);
            case 'account':
                return(<Tab2 />);
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

    useEffect(()=>{
        event = DeviceEventEmitter.addListener('goToHome', ()=>setIndex(0));
        return ()=>{
            event?.remove();
        };
    }, []);

    return(<View style={{ flex: 1 }}>
        <BottomNavigation
            navigationState={{ index, routes }}
            onIndexChange={setIndex}
            renderScene={renderScene}
            sceneAnimationEnabled={true}
        />
        <FAB
            style={styles.fab}
            loading={loadingAdmin}
            visible={showButtonAdmin}
            icon={'account-lock'}
            onPress={()=>(!loadingAdmin)&&props.navigation.navigate('p')}
        />
        <Statistic ref={refStatistic} />
        <ViewModeDetails ref={refViewModeDetails} />
        <Options ref={refOptions} />
        <EditAccount ref={refEditAccount} />
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
                /*show={this.state.visible}
                close={this.close}
                showLoading={this.props.showLoading}*/
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
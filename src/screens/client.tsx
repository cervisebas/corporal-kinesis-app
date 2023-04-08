import React, { useEffect, useState } from "react";
import { DeviceEventEmitter, EmitterSubscription, StyleSheet, View } from "react-native";
import { BottomNavigation, FAB } from "react-native-paper";
import { Permission } from "../scripts/ApiCorporal";
import { LoadNow } from "../scripts/Global";
import { Tab1 } from "./pages/Tab1";
import Tab2 from "./pages/Tab2";
import { refEditAccount, refStatistic, refViewModeDetails } from "./clientRefs";
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
                return(<Tab2 focused={index == 1} />);
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
        <EditAccount ref={refEditAccount} />
    </View>);
});

const styles = StyleSheet.create({
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 80
    },
});
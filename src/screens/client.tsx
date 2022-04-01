import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { BottomNavigation, FAB } from "react-native-paper";
import LoadingController from "../components/loading/loading-controller";
import { Global } from "../scripts/Global";
import { Tab1 } from "./pages/Tab1";
import { Tab2 } from "./pages/Tab2";
import { Tab3 } from "./pages/Tab3";
import { Tab4 } from "./pages/Tab4";

type IProps = {
    navigation: any;
    route: any;
    loading: (show: boolean, title: string)=>any;
};

const Client = (props: IProps) => {
    const [index, setIndex] = React.useState(0);
    const [viewLoading, setViewLoading] = useState(false);
    const [textLoading, setTextLoading] = useState('');
    const [routes] = React.useState([
        { key: 'statistics', title: 'Estadísticas', icon: 'chart-bar' },
        { key: 'schedules-shifts', title: 'Horarios/Turnos', icon: 'calendar-month' },
        { key: 'planning', title: 'Planificación', icon: 'book-open-variant' },
        { key: 'payments', title: 'Pagos', icon: 'cash-multiple' }
    ]);
    const renderScene = ({ route }: any) => {
        switch (route.key) {
            case 'statistics':
                return(<Tab1 showLoading={(show, text)=>{ setViewLoading(show); setTextLoading(text); }} />);
            case 'schedules-shifts':
                return(<Tab2 />);
            case 'planning':
                return(<Tab3 />);
            case 'payments':
                return <Tab4 />;
        }
    };

    return(<View style={{ flex: 2 }}>
        <Global
            loadingView={viewLoading}
            loadingText={textLoading}
        />
        <BottomNavigation
            navigationState={{ index, routes }}
            onIndexChange={setIndex}
            renderScene={renderScene}
            barStyle={{ backgroundColor: '#1663AB' }}
        />
        <FAB
            style={styles.fab}
            icon={'account-lock'}
            onPress={()=>props.navigation.navigate('p')}
        />
    </View>);
};

const styles = StyleSheet.create({
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 56,
    },
});

export default Client;
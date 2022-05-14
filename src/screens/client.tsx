import React, { Component, useState } from "react";
import { StyleSheet, View } from "react-native";
import { BottomNavigation, FAB } from "react-native-paper";
import { Permission } from "../scripts/ApiCorporal";
import { Global } from "../scripts/Global";
import Options from "./pages/pages/options";
import { LoadNow } from "../scripts/Global";
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
    const [viewOptions, setViewOptions] = useState(false);
    const [textLoading, setTextLoading] = useState('');

    const [loadingAdmin, setLoadingAdmin] = useState(true);
    const [showButtonAdmin, setShowButtonAdmin] = useState(true);
    
    const [routes] = React.useState([
        { key: 'statistics', title: 'Estadísticas', icon: 'chart-bar' },
        { key: 'schedules-shifts', title: 'Horarios/Turnos', icon: 'calendar-month' },
        { key: 'planning', title: 'Planificación', icon: 'book-open-variant' },
        { key: 'payments', title: 'Pagos', icon: 'cash-multiple' }
    ]);
    const renderScene = ({ route }: any) => {
        switch (route.key) {
            case 'statistics':
                return(<Tab1
                    showLoading={(show, text)=>{ setViewLoading(show); setTextLoading(text); }}
                    openOptions={()=>setViewOptions(true)}
                />);
            case 'schedules-shifts':
                return(<Tab2 />);
            case 'planning':
                return(<Tab3 />);
            case 'payments':
                return <Tab4 />;
        }
    };
    const verifyAdmin = ()=>{
        Permission.get().then((value)=>{
            var permission = parseInt(value);
            if (permission >= 2) setShowButtonAdmin(true); else setShowButtonAdmin(false);
            setLoadingAdmin(false);
        }).catch(()=>{
            setShowButtonAdmin(false);
            setLoadingAdmin(false);
        });
    };
    
    var readyVerifyAdmin = setInterval(()=>{
        if (LoadNow == true) {
            verifyAdmin();
            clearInterval(readyVerifyAdmin);
        }
    }, 512);

    return(<View style={{ flex: 2 }}>
        <Global
            loadingView={viewLoading}
            loadingText={textLoading}
        />
        <OthersComponents
            showOptions={viewOptions}
            closeOptions={()=>setViewOptions(false)}
            showLoading={(view, text)=>{ setViewLoading(view); setTextLoading(text); }}
        />
        <BottomNavigation
            navigationState={{ index, routes }}
            onIndexChange={setIndex}
            renderScene={renderScene}
            barStyle={{ backgroundColor: '#1663AB' }}
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
};

type IProps2 = {
    showOptions: boolean;
    closeOptions: ()=>any;
    showLoading: (view: boolean, text: string)=>any;
};
class OthersComponents extends Component<IProps2> {
    constructor(props: IProps2) {
        super(props);
    }
    render(): React.ReactNode {
        return(<>
            <Options
                show={this.props.showOptions}
                close={()=>this.props.closeOptions()}
                showLoading={(show, text)=>this.props.showLoading(show, text)}
            />
        </>);
    }
}

const styles = StyleSheet.create({
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 56
    },
});

export default Client;
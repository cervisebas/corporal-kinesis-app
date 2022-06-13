import React, { Component, useState } from "react";
import { DeviceEventEmitter, StyleSheet, View } from "react-native";
import { BottomNavigation, FAB } from "react-native-paper";
import { Permission } from "../scripts/ApiCorporal";
import { Global } from "../scripts/Global";
import Options from "./pages/pages/options";
import { LoadNow } from "../scripts/Global";
import { Tab1 } from "./pages/Tab1";
import { Tab2 } from "./pages/Tab2";

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
        { key: 'account', title: 'Mi cuenta', icon: 'account-outline' }
    ]);
    const renderScene = ({ route }: any) => {
        switch (route.key) {
            case 'statistics':
                return(<Tab1
                    showLoading={(show, text)=>{ setViewLoading(show); setTextLoading(text); }}
                />);
            case 'account':
                return(<Tab2
                    showLoading={(show, text)=>{ setViewLoading(show); setTextLoading(text); }}
                    openOptions={()=>setViewOptions(true)}
                />);
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

    DeviceEventEmitter.addListener('goToHome', ()=>setIndex(0));

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
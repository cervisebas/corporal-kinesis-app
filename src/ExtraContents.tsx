import React, { Component } from "react";
import { DeviceEventEmitter, EmitterSubscription, Linking, View } from "react-native";
import { Paragraph } from "react-native-paper";
import { MaterialDialog } from "./components/material-dialog";
import { ChangeLog } from "./screens/ChangeLog";
import Information from "./screens/information";
import { Session } from "./screens/session";
import { VerifyScreen } from "./screens/verify";
import { Global } from "./scripts/Global";
import CombinedTheme from "./Theme";

type IProps = {
    // Session
    openSession: boolean;
    closeSession: ()=>any;
    setLoadData: (data: boolean)=>any;

    // Verify
    showVerify: boolean;
    textVerify: string | undefined;

    // ChangeLoad
    visibleChangeLoad: boolean;
    closeChangeLoad: ()=>any;

    viewDialogUpdate: boolean;
    closeDialogUpdate: ()=>any;
    storeUrl: string;
};
type IState = {
    // Loading
    viewLoading: boolean;
    textLoading: string;
    // Information
    showInfoApp: boolean;
};

export class ExtraContents extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            viewLoading: false,
            textLoading: '',
            showInfoApp: false
        };
    }
    private event: EmitterSubscription | null = null;
    componentDidMount() {
        this.event = DeviceEventEmitter.addListener('open-information', ()=>this.setState({ showInfoApp: true }));
    }
    componentWillUnmount() {
        this.event?.remove();
        this.setState({
            viewLoading: false,
            textLoading: '',
            showInfoApp: false
        });
    }
    render(): React.ReactNode {
        return(<View>
            <Session
                visible={this.props.openSession}
                close={()=>this.props.closeSession()}
                setLoading={(view, text)=>this.setState({ viewLoading: view, textLoading: text })}
                setLoadData={(data)=>this.props.setLoadData(data)}
            />
            <VerifyScreen
                visible={this.props.showVerify}
                textShow={this.props.textVerify}
            />
            <Global
                loadingView={this.state.viewLoading}
                loadingText={this.state.textLoading}
            />
            <ChangeLog
                visible={this.props.visibleChangeLoad}
                close={()=>this.props.closeChangeLoad()}
            />
            <Information visible={this.state.showInfoApp} close={()=>this.setState({ showInfoApp: false })} />
            <MaterialDialog
                visible={this.props.viewDialogUpdate}
                title={"Se ha encontrado una nueva actualizaci??n"}
                titleColor={'#FFFFFF'}
                onOk={()=>Linking.openURL(this.props.storeUrl).then(()=>this.props.closeDialogUpdate())}
                okLabel={'Actualizar'}
                onCancel={()=>this.props.closeDialogUpdate()}
                cancelLabel={'M??s tarde'}
                backgroundColor={CombinedTheme.colors.background}
                colorAccent={CombinedTheme.colors.accent}>
                    <Paragraph>{"Se recomienda actualizar a la versi??n mas reciente de la aplicaci??n para garantizar el buen funcionamiento de la misma y para mantener las novedades al d??a.\nPara actualizar la aplicaci??n ahora presione en ???Actualizar??? y lo llevaremos a la tienda, de lo contrario presione en ???M??s tarde??? para record??rselo la pr??xima vez que entre en la aplicaci??n."}</Paragraph>
            </MaterialDialog>
        </View>);
    }
}
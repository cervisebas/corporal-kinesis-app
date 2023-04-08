import React, { Component } from "react";
import { Linking } from "react-native";
import { Paragraph } from "react-native-paper";
import { MaterialDialog } from "./components/material-dialog";
import ChangeLog from "./screens/ChangeLog";
import Information from "./screens/information";
import Session from "./screens/session";
import VerifyScreen from "./screens/verify";
import CombinedTheme from "./Theme";
import { refChangeLog, refInformation, refSession } from "./ExtraContentsRefs";

type IProps = {
    // Session
    reVerify: ()=>void;

    // Verify
    showVerify: boolean;
    textVerify: string | undefined;

    viewDialogUpdate: boolean;
    closeDialogUpdate: ()=>any;
    storeUrl: string;
};
type IState = {};

export class ExtraContents extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {};
    }
    render(): React.ReactNode {
        return(<>
            <VerifyScreen
                visible={this.props.showVerify}
                textShow={this.props.textVerify}
            />
            <Session ref={refSession} reVerify={this.props.reVerify} />
            <ChangeLog ref={refChangeLog} />
            <Information ref={refInformation} />
            <MaterialDialog
                visible={this.props.viewDialogUpdate}
                title={"Se ha encontrado una nueva actualización"}
                titleColor={'#FFFFFF'}
                onOk={()=>Linking.openURL(this.props.storeUrl).then(this.props.closeDialogUpdate)}
                okLabel={'Actualizar'}
                onCancel={this.props.closeDialogUpdate}
                cancelLabel={'Más tarde'}
                backgroundColor={CombinedTheme.colors.background}
                colorAccent={CombinedTheme.colors.accent}>
                    <Paragraph>{"Se recomienda actualizar a la versión mas reciente de la aplicación para garantizar el buen funcionamiento de la misma y para mantener las novedades al día.\nPara actualizar la aplicación ahora presione en “Actualizar” y lo llevaremos a la tienda, de lo contrario presione en “Más tarde” para recordárselo la próxima vez que entre en la aplicación."}</Paragraph>
            </MaterialDialog>
        </>);
    }
}
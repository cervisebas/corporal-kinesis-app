import React, { Component, ReactNode } from "react";
import CustomModal from "../../components/CustomModal";
import { Appbar, Avatar, Button, Card, List, Provider as PaperProvider, RadioButton } from "react-native-paper";
import CombinedTheme from "../../../Theme";
import { DeviceEventEmitter, ToastAndroid, View } from "react-native";
import { HostServer, Permission } from "../../../scripts/ApiCorporal";
import { decode } from "base-64";
import DialogError from "../../components/DialogError";

type IProps = {
    visible: boolean;
    close: ()=>any;
    closeComplete: ()=>any;
    infoUser: {
        id: string;
        name: string;
        image: string;
        birthday: string;
        actualStatus: string;
    } | undefined;
    showLoading: (visible: boolean, text: string, after?: ()=>any)=>any;
};
type IState = {
    newPermission: string;
    actualTagUser: string;

    errorView: boolean;
    errorTitle: string;
    errorMessage: string;
};
export default class ChangePermissionsUser extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            newPermission: '0',
            actualTagUser: '',
            errorView: false,
            errorTitle: '',
            errorMessage: ''
        };
    }
    componentWillUnmount() {
        this.setState({
            newPermission: '0',
            actualTagUser: '',
            errorView: false,
            errorTitle: '',
            errorMessage: ''
        });
    }
    adminTag(type: string): string {
        var tag: string = '';
        switch (type) {
            case '0':
                tag = 'Cliente';
                break;
            case '1':
                tag = 'Entrenador';
                break;
            case '2':
                tag = 'Entrenador y editor';
                break;
            case '3':
                tag = 'Entrenador y administrador';
                break;
            case '4':
                tag = 'Administrador total';
                break;
        }
        return tag;
    }
    loadNow() {
        if (this.props.infoUser) {
            this.setState({
                actualTagUser: this.adminTag(this.props.infoUser.actualStatus),
                newPermission: this.props.infoUser.actualStatus
            });
        }
    }
    updatePermissions() {
        if (this.props.infoUser) {
            if (this.state.newPermission == this.props.infoUser.actualStatus) return ToastAndroid.show('No se han detectado cambios', ToastAndroid.SHORT);
            this.props.showLoading(true, 'Cambiando permisos del usuario...', ()=>(this.props.infoUser)&&
                Permission.admin_updateAccount(this.props.infoUser.id, this.state.newPermission)
                    .then(()=>this.props.showLoading(false, '', ()=>{ this.props.close(); DeviceEventEmitter.emit('adminPage2Reload'); }))
                    .catch((error)=>this.props.showLoading(false, '', ()=>this.props.showLoading(false, '', ()=>this.setState({ errorView: true, errorTitle: 'Ocurrió un error', errorMessage: error.cause }, ()=>this.loadNow()))))
            );
        }
    }
    render(): ReactNode {
        return(<CustomModal visible={this.props.visible} onShow={()=>this.loadNow()} onClose={()=>this.props.closeComplete()} onRequestClose={()=>this.props.close()}>
            <PaperProvider theme={CombinedTheme}>
                <View style={{ flex: 1, backgroundColor: CombinedTheme.colors.background }}>
                    <Appbar.Header style={{ backgroundColor: '#1663AB' }}>
                        <Appbar.BackAction onPress={()=>this.props.close()} />
                        <Appbar.Content title={'Buscar cliente'} />
                    </Appbar.Header>
                    {(this.props.infoUser)&&<View style={{ flex: 2 }}>
                        <Card style={{ marginTop: 16, marginLeft: 8, marginRight: 8 }}>
                            <Card.Content>
                                <List.Item
                                    title={decode(this.props.infoUser.name)}
                                    description={this.state.actualTagUser}
                                    left={(props)=><Avatar.Image {...props} size={64} source={{ uri: `${HostServer}/images/accounts/${(this.props.infoUser)? decode(this.props.infoUser.image): ''}` }} />}
                                />
                            </Card.Content>
                        </Card>
                        <View style={{ marginTop: 12, paddingLeft: 8, paddingRight: 8 }}>
                            <RadioButton.Group onValueChange={(value)=>this.setState({ newPermission: value })} value={this.state.newPermission}>
                                <RadioButton.Item mode={'android'} label="Cliente" value="0" />
                                <RadioButton.Item mode={'android'} label="Entrenador" value="1" />
                                <RadioButton.Item mode={'android'} label="Entrenador y editor" value="2" />
                                <RadioButton.Item mode={'android'} label="Entrenador y administrador" value="3" />
                                <RadioButton.Item mode={'android'} label="Administrador total" value="4" />
                            </RadioButton.Group>
                            <Button mode={'contained'} style={{ marginLeft: 8, marginRight: 8, marginTop: 12 }} onPress={()=>this.updatePermissions()}>
                                Guardar
                            </Button>
                        </View>
                        <DialogError show={this.state.errorView} close={()=>this.setState({ errorView: false })} title={this.state.errorTitle} message={this.state.errorMessage} />
                    </View>}
                </View>
            </PaperProvider>
        </CustomModal>);
    }
}
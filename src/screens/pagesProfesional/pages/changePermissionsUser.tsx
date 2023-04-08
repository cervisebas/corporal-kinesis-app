import React, { Component, ReactNode } from "react";
import CustomModal from "../../components/CustomModal";
import { Appbar, Avatar, Button, Card, List, RadioButton } from "react-native-paper";
import { DeviceEventEmitter, ToastAndroid, View } from "react-native";
import { HostServer, Permission } from "../../../scripts/ApiCorporal";
import { decode } from "base-64";
import { GlobalRef } from "../../../GlobalRef";
import { ThemeContext, ThemeContextType } from "../../../providers/ThemeProvider";

type IProps = {};
type IState = {
    visible: boolean;
    
    newPermission: string;
    actualTagUser: string;

    infoUser: {
        id: string;
        name: string;
        image: string;
        birthday: string;
        actualStatus: string;
    } | undefined;
};
export default class ChangePermissionsUser extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            visible: false,
            newPermission: '0',
            actualTagUser: '',
            infoUser: undefined
        };
        this.updatePermissions = this.updatePermissions.bind(this);
        this.close = this.close.bind(this);
    }
    static contextType = ThemeContext;
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
    componentDidUpdate(_prevProps: Readonly<IProps>, prevState: Readonly<IState>, _snapshot?: any): void {
        if (prevState.visible !== this.state.visible && this.state.visible) this.loadNow();
    }
    loadNow() {
        if (this.state.infoUser) {
            this.setState({
                actualTagUser: this.adminTag(this.state.infoUser.actualStatus),
                newPermission: this.state.infoUser.actualStatus
            });
        }
    }
    updatePermissions() {
        if (!this.state.infoUser) return;
        if (this.state.newPermission == this.state.infoUser.actualStatus) return ToastAndroid.show('No se han detectado cambios', ToastAndroid.SHORT);
        GlobalRef.current?.loadingController(true, 'Cambiando permisos del usuario...');
        Permission.admin_updateAccount(this.state.infoUser.id, this.state.newPermission)
            .then(()=>{
                GlobalRef.current?.loadingController(false);
                this.close();
                DeviceEventEmitter.emit('adminPage2Reload');
            })
            .catch((error)=>{
                GlobalRef.current?.loadingController(false);
                GlobalRef.current?.showSimpleAlert('Ocurrió un error', error.cause);
                this.loadNow();
            });
    }

    // Controller
    close() {
        this.setState({
            visible: false
        });
    }
    open(data: { id: string; name: string; image: string; birthday: string; actualStatus: string; }) {
        this.setState({ visible: true, infoUser: data });
    }

    render(): ReactNode {
        const { theme } = this.context as ThemeContextType;
        return(<CustomModal visible={this.state.visible} onRequestClose={this.close}>
            <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
                <Appbar.Header style={{ backgroundColor: theme.colors.background }}>
                    <Appbar.BackAction onPress={this.close} />
                    <Appbar.Content title={'Buscar cliente'} />
                </Appbar.Header>
                {(this.state.infoUser)&&<View style={{ flex: 2 }}>
                    <Card style={{ marginTop: 16, marginLeft: 8, marginRight: 8 }}>
                        <Card.Content>
                            <List.Item
                                title={decode(this.state.infoUser.name)}
                                description={this.state.actualTagUser}
                                left={(props)=><Avatar.Image {...props} size={64} source={{ uri: `${HostServer}/images/accounts/${(this.state.infoUser)? decode(this.state.infoUser.image): ''}` }} />}
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
                        <Button mode={'contained'} style={{ marginLeft: 8, marginRight: 8, marginTop: 12 }} onPress={this.updatePermissions}>
                            Guardar
                        </Button>
                    </View>
                </View>}
            </View>
        </CustomModal>);
    }
}
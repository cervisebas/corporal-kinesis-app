import { decode } from "base-64";
import React, { Component } from "react";
import { View, ToastAndroid, Text, StyleSheet, Dimensions, DeviceEventEmitter } from "react-native";
import { Appbar, TextInput, Button, Snackbar } from "react-native-paper";
import { Exercise } from "../../../scripts/ApiCorporal";
import CombinedTheme from "../../../Theme";
import CustomModal from "../../components/CustomModal";

type IProps = {
    visible: boolean;
    close: ()=>any;
    data: {
        idExercise: string;
        message: string;
        title: string;
    };
};
type IState = {
    name: string;
    alertName: boolean;
    description: string;
    alertDescription: boolean;
    isLoading: boolean;
    isError: boolean;
    showAlert: boolean;
    messageAlert: string;
    textButton: string;
};

const { width } = Dimensions.get('window');

export default class EditExcercise extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            name: '',
            alertName: false,
            description: '',
            alertDescription: false,
            isLoading: false,
            isError: false,
            showAlert: false,
            messageAlert: '',
            textButton: 'Enviar'
        };
    }
    closeModal() {
        if (this.state.isLoading) return ToastAndroid.show('Espere...', ToastAndroid.SHORT);
        this.setState({
            name: '',
            alertName: false,
            description: '',
            alertDescription: false,
            isLoading: false,
            isError: false,
            showAlert: false,
            messageAlert: '',
            textButton: 'Enviar'
        }, ()=>this.props.close());
    }
    async checkInputs(): Promise<boolean> {
        if (this.state.name.length < 4) {
            this.setState({ alertName: true, showAlert: true, messageAlert: 'El nombre ingresado es muy corto.' });
            return false;
        }
        if (this.state.description.length != 0) {
            if (this.state.description.length < 6) {
                this.setState({ alertDescription: true, showAlert: true, messageAlert: 'La descripción ingresada es muy corta.' });
                return false;
            }
        }
        return true;
    }
    async sendResults() {
        if (!await this.checkInputs()) return;
        this.setState({ isLoading: true, isError: false, showAlert: false, messageAlert: '', textButton: 'Enviando...' }, ()=>{
            Exercise.edit(this.props.data.idExercise, this.state.name, (this.state.description.length !== 0)? this.state.description: 'none')
                .then(()=>this.setState({
                    name: '',
                    description: '',
                    isLoading: false,
                    showAlert: true,
                    messageAlert: 'Ejercicio guardado correctamente...',
                    textButton: 'Enviar'
                }, ()=>{
                    DeviceEventEmitter.emit('adminPage3Reload');
                    DeviceEventEmitter.emit('adminPage1Reload');
                    this.closeModal();
                }))
                .catch((error)=>this.setState({
                    isLoading: false,
                    isError: true,
                    showAlert: true,
                    messageAlert: error.cause,
                    textButton: 'Enviar'
                }))
        });
    }
    render(): React.ReactNode {
        return(<CustomModal visible={this.props.visible} onShow={()=>this.setState({ name: decode(this.props.data.title), description: (decode(this.props.data.message) == 'none')? '': decode(this.props.data.message) })} onRequestClose={()=>this.closeModal()} animationIn={'slideInLeft'} animationOut={'slideOutRight'}>
            <View style={{ ...styles.content, backgroundColor: CombinedTheme.colors.background }}>
                <Appbar.Header style={{ backgroundColor: '#1663AB' }}>
                    <Appbar.BackAction onPress={()=>this.closeModal()}/>
                    <Appbar.Content title={'Editar ejercicio'} />
                </Appbar.Header>
                <View style={{ paddingBottom: 8 }}>
                    <TextInput
                        style={styles.textInput}
                        mode={'outlined'}
                        label={'Nombre'}
                        textContentType={'nickname'}
                        error={this.state.alertName}
                        keyboardType={'default'}
                        value={this.state.name}
                        disabled={this.state.isLoading}
                        onChangeText={(text)=>this.setState({ name: text, alertName: false })} />
                    <TextInput
                        style={styles.textInput}
                        mode={'outlined'}
                        label={'Descripción (Opcional)'}
                        multiline={true}
                        numberOfLines={8}
                        keyboardType={'default'}
                        value={this.state.description}
                        disabled={this.state.isLoading}
                        onChangeText={(text)=>this.setState({ description: text })} />
                    <View style={{ width: '100%', alignItems: 'center' }}>
                        <Button
                            loading={this.state.isLoading}
                            mode={'contained'}
                            disabled={this.state.isLoading}
                            style={{ width: (width / 2), marginTop: 8 }}
                            onPress={()=>(!this.state.isLoading)? this.sendResults(): ToastAndroid.show('Espere...', ToastAndroid.SHORT)}>{this.state.textButton}</Button>
                    </View>
                </View>
                <Snackbar
                    visible={this.state.showAlert}
                    style={{ backgroundColor: '#1663AB' }}
                    onDismiss={()=>this.setState({ showAlert: false })}
                    action={{
                        label: 'OCULTAR',
                        onPress: ()=>this.setState({ showAlert: false })
                    }}
                    duration={(this.state.isError)? 6000: 3000}>
                    <Text>{this.state.messageAlert}</Text>
                </Snackbar>
            </View>
        </CustomModal>);
    }
}

const styles = StyleSheet.create({
    textInput: {
        marginLeft: 16,
        marginRight: 16,
        marginBottom: 4,
        marginTop: 4,
    },
    content: {
        marginLeft: 8,
        marginRight: 8,
        borderRadius: 8,
        overflow: 'hidden',
        shadowColor: "#FFFFFF",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3
    }
});
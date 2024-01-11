import React, { Component, ReactNode } from "react";
import { DeviceEventEmitter, Dimensions, Keyboard, StyleSheet, ToastAndroid, TouchableWithoutFeedback, View } from "react-native";
import { Appbar, Button, TextInput } from "react-native-paper";
import { Exercise } from "../../../scripts/ApiCorporal";
import CustomModal from "../../components/CustomModal";
import { GlobalRef } from "../../../GlobalRef";
import { ThemeContext, ThemeContextType } from "../../../providers/ThemeProvider";

type IProps = {};
type IState = {
    visible: boolean;
    name: string;
    alertName: boolean;
    description: string;
    alertDescription: boolean;
    isLoading: boolean;
    isError: boolean;
    textButton: string;
};


export default class AddNewExercise extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            visible: false,
            name: '',
            alertName: false,
            description: '',
            alertDescription: false,
            isLoading: false,
            isError: false,
            textButton: 'Enviar'
        };
        this.sendResults = this.sendResults.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.close = this.close.bind(this);
    }
    static contextType = ThemeContext;
    closeModal() {
        if (this.state.isLoading) return ToastAndroid.show('Espere...', ToastAndroid.SHORT);
        this.setState({
            name: '',
            alertName: false,
            description: '',
            alertDescription: false,
            isLoading: false,
            isError: false,
            textButton: 'Enviar'
        }, this.close);
    }
    async checkInputs(): Promise<boolean> {
        if (this.state.name.length < 4) {
            GlobalRef.current?.showSimpleAlert('El nombre ingresado es muy corto.', '');
            this.setState({ alertName: true });
            return false;
        }
        if (this.state.description.length != 0) {
            if (this.state.description.length < 6) {
                GlobalRef.current?.showSimpleAlert('La descripción ingresada es muy corta.', '');
                this.setState({ alertDescription: true });
                return false;
            }
        }
        return true;
    }
    async sendResults() {
        if (!await this.checkInputs()) return;
        this.setState({ isLoading: true, isError: false, textButton: 'Enviando...' }, ()=>{
            Exercise.set(this.state.name, (this.state.description.length !== 0)? this.state.description: 'none')
                .then(()=>{
                    GlobalRef.current?.showSimpleAlert('Ejercicio guardado correctamente.', '');
                    this.setState({
                        name: '',
                        description: '',
                        isLoading: false,
                        textButton: 'Enviar'
                    }, ()=>{
                        DeviceEventEmitter.emit('adminPage3Reload');
                        DeviceEventEmitter.emit('adminPage1Reload');
                    });
                })
                .catch((error)=>{
                    GlobalRef.current?.showSimpleAlert('Ocurrió un error.', error.cause);
                    this.setState({
                        isLoading: false,
                        isError: true,
                        textButton: 'Enviar'
                    });
                });
        });
    }

    // Controller
    open() { this.setState({ visible: true }); }
    close() { this.setState({ visible: false }); }

    render(): ReactNode {
        const { theme } = this.context as ThemeContextType;
        const { width } = Dimensions.get('window');
        return(<CustomModal visible={this.state.visible} onRequestClose={this.closeModal}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={[styles.content, { backgroundColor: theme.colors.background }]}>
                    <Appbar.Header style={{ backgroundColor: theme.colors.background }}>
                        <Appbar.BackAction onPress={this.closeModal}/>
                        <Appbar.Content title={'Añadir nuevo ejercicio'} />
                    </Appbar.Header>
                    <View>
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
                        <View style={{ width: '100%', alignItems: 'center', marginBottom: 16 }}>
                            <Button
                                loading={this.state.isLoading}
                                mode={'contained'}
                                disabled={this.state.isLoading}
                                style={{ width: (width / 2), marginTop: 8 }}
                                onPress={(!this.state.isLoading)? this.sendResults: undefined}>{this.state.textButton}</Button>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
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
        flex: 1
    }
});
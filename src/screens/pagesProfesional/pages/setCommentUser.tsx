import { encode } from "base-64";
import React, { Component } from "react";
import { ToastAndroid } from "react-native";
import { Button, Dialog, TextInput } from "react-native-paper";
import { Comment } from "../../../scripts/ApiCorporal";
import { GlobalRef } from "../../../GlobalRef";

type IProps = {};
type IState = {
    visible: boolean;
    text: string;
    alert: boolean;
    clientId: string;
};

export default class SetCommentUser extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            visible: false,
            text: '',
            alert: false,
            clientId: '-1'
        };
        this.sendComment = this.sendComment.bind(this);
        this.close = this.close.bind(this);
        this._onChangeText = this._onChangeText.bind(this);
    }
    sendComment() {
        if (this.state.text.length >= 10) return this.send();
        this.setState({ alert: true });
        ToastAndroid.show('El comentario por lo menos debe de contener 10 caracteres o más.', ToastAndroid.SHORT);
    }
    send() {
        GlobalRef.current?.loadingController(true, 'Enviando mensaje...');
        this.setState({ visible: false });
        Comment.admin_create(this.state.clientId, encode(this.state.text))
            .then(()=>{
                GlobalRef.current?.loadingController(false);
                ToastAndroid.show('Comentario enviado correctamente.', ToastAndroid.SHORT);
                this.setState({ text: '' });
            })
            .catch((error)=>{
                GlobalRef.current?.loadingController(false);
                ToastAndroid.show(`Ocurrio un error: ${error.cause}`, ToastAndroid.SHORT);
                this.setState({ visible: true  });
            });
    }
    _onChangeText(text: string) {
        this.setState({ text, alert: false });
    }

    // Controller
    open(clientId: string) {
        this.setState({
            visible: true,
            clientId
        });
    }
    close() { this.setState({ visible: false }); }


    render(): React.ReactNode {
        return(<Dialog visible={this.state.visible} dismissable={false}>
            <Dialog.Title>Añadir comentario</Dialog.Title>
            <Dialog.Content>
                <TextInput
                    dense={true}
                    mode={'outlined'}
                    label={'Escriba aquí...'}
                    multiline={true}
                    numberOfLines={5}
                    keyboardType={'default'}
                    maxLength={255}
                    error={this.state.alert}
                    onChangeText={this._onChangeText}
                />
            </Dialog.Content>
            <Dialog.Actions>
                <Button onPress={this.close}>Cancelar</Button>
                <Button onPress={this.sendComment}>Enviar</Button>
            </Dialog.Actions>
        </Dialog>);
    }
}
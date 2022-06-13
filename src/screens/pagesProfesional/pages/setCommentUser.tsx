import { encode } from "base-64";
import React, { Component } from "react";
import { ToastAndroid } from "react-native";
import { Button, Dialog, TextInput } from "react-native-paper";

type IProps = {
    visible: boolean;
    close: ()=>any;
    send: (text: string)=>any;
};
type IState = {
    text: string;
    alert: boolean;
};

export default class SetCommentUser extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            text: '',
            alert: false
        };
    }
    sendComment() {
        if (this.state.text.length >= 10) {
            this.props.send(encode(this.state.text));
        } else {
            this.setState({ alert: true });
            ToastAndroid.show('El comentario por lo menos debe de contener 10 caracteres o más.', ToastAndroid.LONG);
        }
    }
    dialogClose() {
        this.setState({
            text: '',
            alert: false
        });
    }
    render(): React.ReactNode {
        return(<Dialog visible={this.props.visible} dismissable={false}>
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
                    onChangeText={(text)=>this.setState({ text: text, alert: false })}
                />
            </Dialog.Content>
            <Dialog.Actions>
                <Button onPress={()=>this.props.close()}>Cancelar</Button>
                <Button onPress={()=>this.sendComment()}>Enviar</Button>
            </Dialog.Actions>
        </Dialog>);
    }
}
import { encode } from "base-64";
import React, { Component, RefObject } from "react";
import { createRef } from "react";
import { ToastAndroid, TextInput as TextInputReact } from "react-native";
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
    private refTextInput: any;
    sendComment() {
        if (this.state.text.length >= 10) {
            this.props.send(encode(this.state.text));
        } else {
            this.setState({ alert: true });
            ToastAndroid.show('El comentario por lo menos debe de contener 10 caracteres o más.', ToastAndroid.LONG);
        }
    }
    componentDidUpdate() {
        if (this.props.visible == true) {
            if (!this.refTextInput.isFocused()) {
                this.refTextInput.forceFocus();
            }
        }
    }
    render(): React.ReactNode {
        return(<Dialog visible={this.props.visible} dismissable={false}>
            <Dialog.Title>Añadir comentario</Dialog.Title>
            <Dialog.Content>
                <TextInput
                    ref={(ref: any)=>this.refTextInput = ref}
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
import React, { Component, ReactNode } from "react";
import { Button, Dialog, Paragraph, Portal, Provider as PaperProvider } from "react-native-paper";
import CombinedTheme from "../../Theme";

type IProps = {
    show: boolean;
    close: ()=>any;
    title: string;
    message: string;
};
type IState = {};
export default class DialogError extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }
    render(): ReactNode {
        return(<PaperProvider theme={CombinedTheme}>
            <Portal>
                <Dialog visible={this.props.show} onDismiss={this.props.close}>
                    <Dialog.Title>{this.props.title}</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>{this.props.message}</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={this.props.close}>Aceptar</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </PaperProvider>);
    }
}
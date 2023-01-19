import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Button, Dialog, Paragraph } from "react-native-paper";

export type AlertDialogRef = {
    open: (title: string, message:  string)=>void;
};

export default React.memo(forwardRef(function AlertDialog(_props: any, ref: React.Ref<AlertDialogRef>) {
    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');

    function open(title: string, message: string) {
        setVisible(true);
        setTitle(title);
        setMessage(message);
    }
    function close() {
        setVisible(false);
    }
    useImperativeHandle(ref, ()=>({ open }));

    return(<Dialog visible={visible} onDismiss={close}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
            <Paragraph>{message}</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
            <Button onPress={close}>Aceptar</Button>
        </Dialog.Actions>
    </Dialog>);
}));
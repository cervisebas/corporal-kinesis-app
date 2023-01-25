import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Snackbar, Text } from "react-native-paper";

export type CustomSnackbarRef = {
    open: (text: string)=>void;
};

export default React.memo(forwardRef(function CustomSnackbar(_props: any, ref: React.Ref<CustomSnackbarRef>) {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    
    function open(message: string) {
        setVisible(true);
        setMessage(message);
    }
    function close() { setVisible(false); }
    useImperativeHandle(ref, ()=>({ open }));

    return(<Snackbar visible={visible} onDismiss={close} style={{ backgroundColor: '#1663AB' }} action={{ label: 'OCULTAR', onPress: close }}><Text>{message}</Text></Snackbar>);
}));
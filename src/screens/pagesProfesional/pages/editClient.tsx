import React, { forwardRef, useImperativeHandle, useState } from "react";
import { StyleSheet, View } from "react-native";
import CustomModal from "../../components/CustomModal";
import CombinedTheme from "../../../Theme";
import { Appbar } from "react-native-paper";

type IProps = {};
export type EditClientProfessionalRef = {
    open: ()=>void;
};

export default React.memo(forwardRef(function EditClientProfessional(_props: IProps, ref: React.Ref<EditClientProfessionalRef>) {
    const [visible, setVisible] = useState(false);

    function close() {
        setVisible(false);
    }
    function open() {
        setVisible(true);
    }

    useImperativeHandle(ref, ()=>({ open }));

    return(<CustomModal visible={visible} onRequestClose={close}>
        <View style={styles.content}>
            <Appbar.Header style={styles.header}>
                <Appbar.BackAction onPress={close} />
                <Appbar.Content title={'Editar usuario'} />
            </Appbar.Header>
            <View style={styles.content}>
                
            </View>
        </View>
    </CustomModal>);
}));

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#1663AB'
    },
    content: {
        flex: 1,
        backgroundColor: CombinedTheme.colors.background
    }
});
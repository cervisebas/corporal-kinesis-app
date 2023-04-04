import React, { forwardRef, useContext, useImperativeHandle, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { ThemeContext } from "../providers/ThemeProvider";
import CustomModal from "../screens/components/CustomModal";

type IProps = {};
export type LoadingComponentRef = {
    open: (message: string)=>void;
    close: ()=>void;
};

export default React.memo(forwardRef(function LoadingComponent(_props: IProps, ref: React.Ref<LoadingComponentRef>) {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('Cargando...');
    const { theme } = useContext(ThemeContext);

    function open(mess: string) {
        setVisible(true);
        setMessage(mess);
    }
    function close() {
        setVisible(false);
    }

    useImperativeHandle(ref, ()=>({ open, close }));

    return(<CustomModal visible={visible} useBackdrop={true} backdropColor={theme.colors.backdrop} animationIn={'fadeIn'} animationOut={'fadeOut'}>
        <View style={styles.modal}>
            <View>
                <View style={[styles.content, { backgroundColor: theme.colors.elevation.level3, borderRadius: 7 * theme.roundness }]}>
                    <ActivityIndicator size={'large'} />
                    <Text style={styles.message}>{message}</Text>
                </View>
            </View>
        </View>
    </CustomModal>);
}));

const styles = StyleSheet.create({
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingBottom: 24,
        paddingTop: 24,
        paddingLeft: 32,
        paddingRight: 32,
        elevation: 24,
        maxWidth: 350
    },
    message: {
        marginLeft: 24,
        fontSize: 16
    },
    modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Card, Title } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

type IProps5 = {
    onPress: ()=>any;
    style?: StyleProp<ViewStyle>;
    title: string;
    icon: string;
    disabled?: boolean;
};

export default React.memo(function CustomCard2(props: IProps5) {
    return(<Card style={props.style} accessible={true} onPress={(!props.disabled)? props.onPress: undefined}>
        <View style={styles.content}>
            <Icon size={28} color={'#FFFFFF'} name={props.icon} />
            <Title style={styles.title}>{props.title}</Title>
        </View>
    </Card>);
});

const styles = StyleSheet.create({
    content: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        position: 'relative'
    },
    title: {
        marginLeft: 8,
        fontSize: 18
    }
});
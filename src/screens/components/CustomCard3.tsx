import React, { useContext, useState } from "react";
import { LayoutChangeEvent, StyleProp, View, ViewStyle } from "react-native";
import { Card, Text, Title } from "react-native-paper";
import { ThemeContext } from "../../providers/ThemeProvider";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

type IProps = {
    onPress: ()=>any;
    style?: StyleProp<ViewStyle>;
    title: string;
};

export default React.memo(function CustomCard3(props: IProps) {
    // Context
    const { theme } = useContext(ThemeContext);
    // State's
    const [width, setWidth] = useState(0);
    const [width2, setWidth2] = useState(0);
    const [color, setColor] = useState(theme.colors.background);

    function _onLayout1({ nativeEvent: { layout } }: LayoutChangeEvent) { setWidth(layout.width); }
    function _onLayout2({ nativeEvent: { layout } }: LayoutChangeEvent) { setWidth2(layout.width); }
    function _onPressStart() { setColor('rgb(213, 0, 0)'); }
    function _onPressEnd() { setColor(theme.colors.background); }

    return(<Card
        onLayout={_onLayout1}
        style={props.style}
        accessible={true}
        onPress={props.onPress}
        onTouchStart={_onPressStart}
        onTouchEnd={_onPressEnd}>
        <Card.Content style={{ justifyContent: 'center' }}>
            <View style={{ width: width - width2 - 40, overflow: 'hidden' }}>
                <Title style={{ color: '#FFFFFF' }} numberOfLines={1}>{props.title}</Title>
            </View>
            <View onLayout={_onLayout2} style={{ position: 'absolute', right: 16, height: 24, alignItems: 'center', flexDirection: 'row' }}>
                <Text style={{ fontWeight: '700', color: color }}>Ver más detalles</Text>
                <Icon name="arrow-right" size={24} color={color} style={{ marginLeft: 8 }} />
            </View>
        </Card.Content>
    </Card>);
});
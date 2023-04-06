import React, { useContext } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Card, IconButton, MD2Colors, Paragraph, Title } from "react-native-paper";
import { ThemeContext } from "../../providers/ThemeProvider";

type IProps = {
    onPress?: ()=>any;
    style?: StyleProp<ViewStyle>;
    title: string;
    value: string;
    iconName: string;
};

export default React.memo(function CustomCard4(props: IProps) {
    const { theme } = useContext(ThemeContext);
    return(<Card style={props.style} accessible={true} onPress={props.onPress}>
        <Card.Content>
            <Title>{props.value}</Title>
            <Paragraph>{props.title}</Paragraph>
            <IconButton
                icon={props.iconName}
                iconColor={MD2Colors.blue500}
                size={26}
                style={{ position: 'absolute', right: 6, top: 18, backgroundColor: theme.colors.background }}
            />
        </Card.Content>
    </Card>);
});
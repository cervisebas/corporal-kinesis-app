import React, { useContext, useEffect, useState } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Card, IconButton, MD2Colors, Paragraph, Title } from "react-native-paper";
import { ThemeContext } from "../../providers/ThemeProvider";

type IProps = {
    onPress: ()=>any;
    style?: StyleProp<ViewStyle>;
    title: string;
    value: string;
    status: number;
};

export default React.memo(function CustomCard1(props: IProps) {
    const { theme } = useContext(ThemeContext);
    // State's
    const [icon, setIcon] = useState('chart-bubble');
    const [iconColor, setIconColor] = useState(MD2Colors.red500);

    useEffect(()=>{
        switch (props.status) {
            case -5:
                setIcon('timer-sand');
                setIconColor(theme.colors.primary);
                break;
            case -1:
                setIcon('chart-bubble');
                setIconColor(MD2Colors.red500);
                break;
            case 0:
                setIcon('chart-timeline-variant');
                setIconColor(MD2Colors.yellow500);
                break;
            case 1:
                setIcon('arrow-up');
                setIconColor(MD2Colors.green500);
                break;
            case 2:
                setIcon('arrow-down');
                setIconColor(MD2Colors.red500);
                break;
            default:
                setIcon('chart-timeline-variant-shimmer');
                setIconColor(MD2Colors.blue500);
                break;
        }
    }, [props.status]);

    return(<Card style={props.style} accessible={true} onPress={props.onPress}>
        <Card.Content>
            <Title>{props.value}</Title>
            <Paragraph>{props.title}</Paragraph>
            <IconButton
                icon={icon}
                iconColor={iconColor}
                size={32}
                style={{ position: 'absolute', right: 6, top: 18, backgroundColor: theme.colors.background }}
            />
        </Card.Content>
    </Card>);
});
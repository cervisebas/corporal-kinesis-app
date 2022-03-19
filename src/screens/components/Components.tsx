import React, { PureComponent } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { Card, Colors, IconButton, Paragraph, Title } from "react-native-paper";
import CombinedTheme from "../../Theme";

type IProps0 = {
    onPress: ()=>any;
    style?: StyleProp<ViewStyle>;
    title: string;
    value: string;
    status: number;
};
class CustomCard1 extends PureComponent<IProps0> {
    constructor(props: IProps0) { super(props); }
    render(): React.ReactNode {
        return(<Card style={this.props.style} accessible={true} onPress={()=>this.props.onPress()}>
            <Card.Content>
                <Title>{this.props.value}</Title>
                <Paragraph>{this.props.title}</Paragraph>
                <IconButton
                    icon={(this.props.status == -5)? 'timer-sand': (this.props.status == 0)? 'chart-timeline-variant': (this.props.status == 1)? 'arrow-up': (this.props.status == 2)? 'arrow-down': 'chart-timeline-variant-shimmer'}
                    color={(this.props.status == -5)? CombinedTheme.colors.accent: (this.props.status == 0)? Colors.yellow500: (this.props.status == 1)? Colors.green500: (this.props.status == 2)? Colors.red500: Colors.blue500}
                    size={32}
                    style={{ position: 'absolute', right: 6, top: 18, backgroundColor: CombinedTheme.colors.background }}
                />
            </Card.Content>
        </Card>);
    }
}

export {
    CustomCard1
};
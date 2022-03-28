import React, { PureComponent } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { Avatar, Card, Colors, Text, IconButton, Paragraph, Title } from "react-native-paper";
import { NoComment } from "../../assets/icons";
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
                    icon={(this.props.status == -5)? 'timer-sand': (this.props.status == -1)? 'chart-bubble': (this.props.status == 0)? 'chart-timeline-variant': (this.props.status == 1)? 'arrow-up': (this.props.status == 2)? 'arrow-down': 'chart-timeline-variant-shimmer'}
                    color={(this.props.status == -5)? CombinedTheme.colors.accent: (this.props.status == -1)? Colors.red500: (this.props.status == 0)? Colors.yellow500: (this.props.status == 1)? Colors.green500: (this.props.status == 2)? Colors.red500: Colors.blue500}
                    size={32}
                    style={{ position: 'absolute', right: 6, top: 18, backgroundColor: CombinedTheme.colors.background }}
                />
            </Card.Content>
        </Card>);
    }
}

type IProps1 = {
    accountName: string;
    date: string;
    comment: string;
};
class CustomCardComments extends PureComponent<IProps1> {
    constructor(props: IProps1) {
        super(props);
    }
    render(): React.ReactNode {
        return(<Card style={{ marginLeft: 12, marginBottom: 12, marginRight: 12 }}>
            <Card.Title
                title={this.props.accountName}
                subtitle={this.props.date}
                subtitleStyle={{ marginLeft: 8, fontSize: 11 }}
                titleStyle={{ fontSize: 16 }}
                left={(props)=><Avatar.Image {...props} size={40} source={require('../../assets/profile.png')} />}
            />
            <Card.Content><Text>{this.props.comment}</Text></Card.Content>
        </Card>);
    }
}
type IProps2 = { message: string; style?: StyleProp<ViewStyle> };
class EmptyListComments extends PureComponent<IProps2> {
    constructor(props: IProps2) {
        super(props);
    }
    render(): React.ReactNode {
        return(<View style={[this.props.style, { width: '100%', paddingTop: 16, paddingBottom: 16, justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }]}>
            <NoComment width={96} height={96} />
            <Title style={{ marginTop: 12 }}>{this.props.message}</Title>
        </View>);
    }
}

export {
    CustomCard1,
    CustomCardComments,
    EmptyListComments
};
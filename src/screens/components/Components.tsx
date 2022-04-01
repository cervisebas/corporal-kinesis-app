import React, { PureComponent } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { Avatar, Card, Colors, Text, IconButton, Paragraph, Title, List } from "react-native-paper";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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
type IProps2 = { message: string; icon: any; style?: StyleProp<ViewStyle> };
class EmptyListComments extends PureComponent<IProps2> {
    constructor(props: IProps2) { super(props); }
    render(): React.ReactNode {
        return(<View style={[this.props.style, { width: '100%', paddingTop: 32, paddingBottom: 16, justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }]}>
            {this.props.icon}
            <Title style={{ marginTop: 12 }}>{this.props.message}</Title>
        </View>);
    }
}
type IProps3 = { value: string; label: string; icon: string; color: string; loading: boolean; };
type IState3 = { mount: boolean; };
class CustomItemList extends PureComponent<IProps3, IState3> {
    constructor(props: IProps3) {
        super(props);
        this.state = { mount: false };
    }
    componentDidMount() { this.setState({ mount: true }); }
    componentWillUnmount() { this.setState({ mount: false }); }
    render(): React.ReactNode {
        return(<View>
            {(this.state.mount)? (!this.props.loading)? <List.Item
                style={{ paddingLeft: 16 }}
                title={this.props.label}
                titleStyle={{ fontSize: 12, color: '#727272' }}
                left={()=><View style={{ width: (this.props.value.length < 2)? 24 : 16 * this.props.value.length, height: 48, alignItems: 'center', justifyContent: 'center' }}><Title>{this.props.value}</Title></View>}
                right={()=><List.Icon color={this.props.color} icon={this.props.icon} />}
            />: <CustomItemListLoading />: <></>}
        </View>);
    }
}
type IState4 = { mount: boolean; value: number; };
class CustomItemListLoading extends PureComponent<any, IState4> {
    constructor(props: any) {
        super(props);
        this.state = {
            mount: false,
            value: this.numbers[Math.floor(Math.random() * (this.numbers.length - 0)) + 0]
        };
    }
    private numbers: number[] = [48, 64, 80, 96];
    componentDidMount() { this.setState({ mount: true }); }
    componentWillUnmount() { this.setState({ mount: false }); }
    render(): React.ReactNode {
        return(<View>
            {(this.state.mount)? <List.Item
                style={{ paddingLeft: 16 }}
                title={()=><SkeletonPlaceholder backgroundColor={'#1F1F1F'} highlightColor={'#727272'}><SkeletonPlaceholder.Item width={90} height={12} borderRadius={2} /></SkeletonPlaceholder>}
                titleStyle={{ color: '#727272' }}
                left={()=><View style={{ height: 48, alignItems: 'center', justifyContent: 'center' }}><SkeletonPlaceholder backgroundColor={'#111111'} highlightColor={'#F2F2F2'}><SkeletonPlaceholder.Item width={this.state.value} height={36} borderRadius={4} /></SkeletonPlaceholder></View>}
                right={()=><List.Icon color={Colors.yellow500} icon={'chart-timeline-variant'} />}
            />: <></>}
        </View>);
    }
}

type IProps5 = { onPress: ()=>any; style?: StyleProp<ViewStyle>; title: string; icon: string; };
class CustomCard2 extends PureComponent<IProps5> {
    constructor(props: IProps5) { super(props); }
    render(): React.ReactNode {
        return(<Card style={this.props.style} accessible={true} onPress={()=>this.props.onPress()}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%', position: 'relative' }}>
                <Icon size={36} color={'#FFFFFF'} name={this.props.icon} />
                <Title style={{ marginLeft: 8 }}>{this.props.title}</Title>
            </View>
        </Card>);
    }
}

type IProps6 = {
    title: string;
};
class CustomItemList2 extends PureComponent<IProps6> {
    constructor(props: IProps6) {
        super(props);
    }
    render(): React.ReactNode {
        return(<List.Item
            left={(props)=><Avatar.Image {...props} size={48} source={require('../../assets/profile.png')} />}
            title={this.props.title}
            right={()=><IconButton icon={'dots-vertical'} />}
        />);
    }
}

export {
    CustomCard1,
    CustomCardComments,
    EmptyListComments,
    CustomItemList,
    CustomCard2,
    CustomItemList2
};
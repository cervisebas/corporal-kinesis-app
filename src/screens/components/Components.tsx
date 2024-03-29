import { decode } from "base-64";
import React, { PureComponent, useContext, useState } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { Avatar, Card, MD2Colors, Text, IconButton, Paragraph, Title, List, Menu, Button } from "react-native-paper";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { HostServer } from "../../scripts/ApiCorporal";
import ImageLazyLoad from "./ImageLazyLoad";
import { ThemeContext } from "../../providers/ThemeProvider";

type IProps1 = {
    accountName: string;
    date: string;
    edit: boolean;
    comment: string;
    source: any;
};
class CustomCardComments extends PureComponent<IProps1> {
    constructor(props: IProps1) {
        super(props);
    }
    render(): React.ReactNode {
        return(<Card style={{ marginLeft: 8, marginBottom: 10, marginRight: 8 }}>
            <Card.Title
                title={this.props.accountName}
                subtitle={`${this.props.date}${(this.props.edit)? ' (editado)': ''}`}
                subtitleStyle={{ marginLeft: 8, fontSize: 11 }}
                titleStyle={{ fontSize: 16 }}
                left={(props)=><Avatar.Image {...props} size={40} source={this.props.source} />}
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
        return(<View style={{ height: 72 }}>
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
                right={()=><List.Icon color={MD2Colors.yellow500} icon={'chart-timeline-variant'} />}
            />: <></>}
        </View>);
    }
}

type IProps6 = { title: string; image: string; onPress: ()=>any; actionDelete: ()=>any; actionComment: ()=>any; };
const CustomItemList2 = React.memo(function(props: IProps6) {
    const [viewMenu, setViewMenu] = useState(false);

    function showMenu() {
        setViewMenu(true);
    }
    function hideMenu() {
        setViewMenu(false);
    }
    function menu1() { hideMenu(); props.onPress(); }
    function menu2() { hideMenu(); props.actionComment(); }
    function menu3() { hideMenu(); props.actionDelete(); }
    function rightMenu() {
        return(<Menu
            visible={viewMenu}
            onDismiss={hideMenu}
            anchor={<IconButton onPress={showMenu} icon={'dots-vertical'} />}>
            <Menu.Item onPress={menu1} title={"Ver perfil"} />
            <Menu.Item onPress={menu2} title={"Dejar comentario"} />
            <Menu.Item style={{ backgroundColor: MD2Colors.red500 }} onPress={menu3} title={"Eliminar"} />
        </Menu>);
    }
    function leftAvatar(lProps: any) {
        return(<ImageLazyLoad
            {...lProps}
            size={48}
            circle={true}
            resizeMode={'cover'}
            source={{ uri: `${HostServer}/images/accounts/${decode(props.image)}` }}
        />);
    }

    return(<List.Item
        title={props.title}
        onPress={props.onPress}
        onLongPress={showMenu}
        left={leftAvatar}
        right={rightMenu}
    />);
});

type IProps7 = {
    message: string;
    style?: StyleProp<ViewStyle>;
};
class CustomShowError extends PureComponent<IProps7> {
    constructor(props: IProps7) { super(props); }
    render(): React.ReactNode {
        return(<View style={[this.props.style, { width: '100%', justifyContent: 'center', alignItems: 'center', flex: 1, flexDirection: 'column' }]}>
            <Icon name={'alert-circle-outline'} size={96} color={'#FFFFFF'} />
            <Title style={{ marginTop: 12 }}>{this.props.message}</Title>
        </View>);
    }
}

type IProps9 = {
    accountName: string;
    date: string;
    edit: boolean;
    comment: string;
    source: any;
    buttonEdit?: ()=>any;
    buttonDelete?: ()=>any;
};
class CustomCardComments2 extends PureComponent<IProps9> {
    constructor(props: IProps9) {
        super(props);
    }
    render(): React.ReactNode {
        return(<Card style={{ marginLeft: 10, marginBottom: 10, marginRight: 10 }}>
            <Card.Title
                title={this.props.accountName}
                subtitle={`${this.props.date}${(this.props.edit)? ' (editado)': ''}`}
                subtitleStyle={{ marginLeft: 8, fontSize: 11 }}
                titleStyle={{ fontSize: 16 }}
                left={(props)=><Avatar.Image {...props} size={40} source={this.props.source} />}
                right={(props)=><IconButton {...props} icon={'clipboard-text-clock-outline'}/>}
            />
            <Card.Content><Text>{this.props.comment}</Text></Card.Content>
            <Card.Actions style={{ alignItems: 'flex-end' }}>
                <Button onPress={()=>(this.props.buttonEdit)&&this.props.buttonEdit()}>Editar</Button>
                <Button onPress={()=>(this.props.buttonDelete)&&this.props.buttonDelete()}>Borrar</Button>
            </Card.Actions>
        </Card>);
    }
}

type IProps10 = { title: string; actionDelete: ()=>any; actionViewDescription: ()=>any; actionEdit?: ()=>any; };
type IState10 = { viewMenu: boolean; };
class CustomItemList4 extends PureComponent<IProps10, IState10> {
    constructor(props: IProps10) {
        super(props);
        this.state = {
            viewMenu: false
        };
    }
    render(): React.ReactNode {
        return(<List.Item
            title={this.props.title}
            onPress={()=>this.props.actionViewDescription()}
            left={(props)=><List.Icon {...props} icon={'calendar-outline'} />}
            style={{ height: 64 }}
            right={()=><Menu
                visible={this.state.viewMenu}
                onDismiss={()=>this.setState({ viewMenu: false })}
                anchor={<IconButton onPress={()=>this.setState({ viewMenu: true })} icon={'dots-vertical'} />}>
                <Menu.Item onPress={()=>this.setState({ viewMenu: false }, ()=>this.props.actionViewDescription())} title={"Ver descripción"} />
                <Menu.Item onPress={()=>this.setState({ viewMenu: false }, ()=>(this.props.actionEdit)&&this.props.actionEdit())} title={"Editar"} />
                <Menu.Item style={{ backgroundColor: MD2Colors.red500 }} onPress={()=>this.setState({ viewMenu: false }, ()=>this.props.actionDelete())} title={"Borrar"} />
            </Menu>}
        />);
    }
}

type IProps13 = {
    onPress?: ()=>any;
    style?: StyleProp<ViewStyle>;
    title: string;
    paragraph: string;
};
class CustomCard5 extends PureComponent<IProps13> {
    constructor(props: IProps13) { super(props); }
    render(): React.ReactNode {
        return(<Card style={this.props.style} accessible={true} onPress={(this.props.onPress)&&this.props.onPress}>
            <Card.Content>
                <Title>{this.props.title}</Title>
                <Paragraph>{this.props.paragraph}</Paragraph>
            </Card.Content>
        </Card>);
    }
}

type CustomType1 = { title: string; value: string; marginLeft?: number; };
export const MiniCustomCard = React.memo(function MiniCustomCard(props: CustomType1) {
    const { theme } = useContext(ThemeContext);
    return(<Card style={{ backgroundColor: theme.colors.elevation.level3, height: 48, marginTop: 4, marginBottom: 4, marginLeft: props.marginLeft??6, marginRight: 6 }}>
        <Card.Content style={{ padding: 0, margin: 0 }}>
            <Text><Text style={{ fontWeight: '700' }}>{props.title}</Text> {props.value}</Text>
        </Card.Content>
    </Card>);
});

type IProps15 = {
    style?: StyleProp<ViewStyle>;
    title: string;
    subtitle: string;
    message: string;
};
type IState15 = {};

class CustomItemList6 extends PureComponent<IProps15, IState15> {
    constructor(props: IProps15) {
        super(props);
    }
    render(): React.ReactNode {
        return(<Card accessible={true} style={[{ marginLeft: 8, marginRight: 8, marginTop: 12 }, this.props.style]} theme={{ dark: true }}>
            <Card.Title title={this.props.title} subtitle={this.props.subtitle} subtitleStyle={{ marginLeft: 4 }} />
            <Card.Content>
                <Paragraph>{this.props.message}</Paragraph>
            </Card.Content>
        </Card>);
    }
}

type IProps16 = {
    icon?: string;
    title: string;
    color?: string;
    onPress?: ()=>any;
};
type IState16 = {};

class CardButton1 extends PureComponent<IProps16, IState16> {
    constructor(props: IProps16) {
        super(props);
    }
    render(): React.ReactNode {
        return(<Card style={{ marginTop: 8, marginLeft: 8, marginRight: 8, overflow: 'hidden' }}>
            <List.Item
                left={(this.props.icon)? (props)=><List.Icon {...props} icon={String(this.props.icon)} color={this.props.color} />: undefined}
                title={this.props.title}
                titleStyle={(this.props.color)? { color: this.props.color }: undefined}
                onPress={this.props.onPress}
            />
        </Card>);
    }
}

export {
    CustomCardComments,
    EmptyListComments,
    CustomItemList,
    CustomItemList2,
    CustomShowError,
    CustomCardComments2,
    CustomItemList4,
    CustomCard5,
    CustomItemList6,
    CardButton1
};
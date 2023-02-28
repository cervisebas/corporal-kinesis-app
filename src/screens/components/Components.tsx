import { decode } from "base-64";
import React, { PureComponent, useState } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { Avatar, Card, Colors, Text, IconButton, Paragraph, Title, List, Menu, Button } from "react-native-paper";
import { AvatarImageSource } from "react-native-paper/lib/typescript/components/Avatar/AvatarImage";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { HostServer } from "../../scripts/ApiCorporal";
import CombinedTheme from "../../Theme";
import ImageLazyLoad from "./ImageLazyLoad";

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
    edit: boolean;
    comment: string;
    source: AvatarImageSource;
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
                right={()=><List.Icon color={Colors.yellow500} icon={'chart-timeline-variant'} />}
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
            <Menu.Item style={{ backgroundColor: Colors.red500 }} onPress={menu3} title={"Eliminar"} />
        </Menu>);
    }
    function leftAvatar(lProps: { color: string; style: { marginLeft: number; marginRight: number; marginVertical?: number | undefined; }; }) {
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
        style={{ height: 64 }}
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

type IProps8 = { title: string; subtitle: string; type: string; image: string; onPress: ()=>any; };
class CustomItemList3 extends PureComponent<IProps8> {
    constructor(props: IProps8) {
        super(props);
    }
    render(): React.ReactNode {
        return(<List.Item
            title={this.props.title}
            description={this.props.subtitle}
            onPress={()=>this.props.onPress()}
            style={{ height: 72 }}
            left={(props)=><Avatar.Image {...props} size={56} source={(!this.props.image)? require('../../assets/profile.webp'): { uri: `${HostServer}/images/accounts/${decode(this.props.image)}` }} />}
            right={(props)=><List.Icon {...props} icon={(this.props.type == '0')? 'account-outline': 'shield-crown-outline'} />}
        />);
    }
}

type IProps9 = {
    accountName: string;
    date: string;
    edit: boolean;
    comment: string;
    source: AvatarImageSource;
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
                <Menu.Item style={{ backgroundColor: Colors.red500 }} onPress={()=>this.setState({ viewMenu: false }, ()=>this.props.actionDelete())} title={"Borrar"} />
            </Menu>}
        />);
    }
}

type IProps11 = {
    onPress: ()=>any;
    style?: StyleProp<ViewStyle>;
    title: string;
};
type IState11 = {
    clickColor: string;
    heightComponent: number;
    widthCard: number;
    widthViewButton: number;
};
class CustomCard3 extends PureComponent<IProps11, IState11> {
    constructor(props: IProps11) {
        super(props);
        this.state = {
            clickColor: CombinedTheme.colors.background,
            heightComponent: 68,
            widthCard: 0,
            widthViewButton: 0
        };
    }
    onPressClick() {
        this.setState({ clickColor: 'rgb(213, 0, 0)' }, ()=>{
            this.props.onPress();
            setTimeout(()=>this.setState({ clickColor: CombinedTheme.colors.background }), 150);
        });
    }
    render(): React.ReactNode {
        return(<Card onLayout={({ nativeEvent })=>this.setState({ heightComponent: nativeEvent.layout.height, widthCard: nativeEvent.layout.width })} style={this.props.style} accessible={true} onPress={()=>this.onPressClick()}>
            <Card.Content style={{ justifyContent: 'center' }}>
                <View style={{ width: (this.state.widthCard - this.state.widthViewButton) - 40, overflow: 'hidden' }}>
                    <Title numberOfLines={1}>{this.props.title}</Title>
                </View>
                <View style={{ position: 'absolute', right: 16, height: 24, alignItems: 'center', flexDirection: 'row' }}>
                    <Text style={{ fontWeight: '700', color: this.state.clickColor }}>Ver más detalles</Text>
                    <Icon name="arrow-right" size={24} color={this.state.clickColor} style={{ marginLeft: 8 }} />
                </View>
            </Card.Content>
        </Card>);
    }
}

type IProps12 = {
    onPress?: ()=>any;
    style?: StyleProp<ViewStyle>;
    title: string;
    value: string;
    iconName: string;
};
class CustomCard4 extends PureComponent<IProps12> {
    constructor(props: IProps12) { super(props); }
    render(): React.ReactNode {
        return(<Card style={this.props.style} accessible={true} onPress={(this.props.onPress)&&this.props.onPress}>
            <Card.Content>
                <Title>{this.props.value}</Title>
                <Paragraph>{this.props.title}</Paragraph>
                <IconButton
                    icon={this.props.iconName}
                    color={Colors.blue500}
                    size={26}
                    style={{ position: 'absolute', right: 6, top: 18, backgroundColor: CombinedTheme.colors.background }}
                />
            </Card.Content>
        </Card>);
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
export class MiniCustomCard extends PureComponent<CustomType1> {
    constructor(props: CustomType1) {
        super(props);
    }
    render(): React.ReactNode {
        return(<Card style={{ backgroundColor: CombinedTheme.colors.accent, height: 48, marginTop: 4, marginBottom: 4, marginLeft: (this.props.marginLeft)? this.props.marginLeft: 6, marginRight: 6 }}>
            <Card.Content style={{ padding: 0, margin: 0 }}>
                <Text><Text style={{ fontWeight: '700' }}>{this.props.title}</Text> {this.props.value}</Text>
            </Card.Content>
        </Card>);
    }
}

/*type IProps14 = {
    data: trainings;
    editButton?: ()=>any;
    viewButton?: ()=>any;
    deleteButton?: ()=>any;
};
type IState14 = { title: string; };

class CustomItemList5 extends PureComponent<IProps14, IState14> {
    constructor(props: IProps14) {
        super(props);
        this.state = {
            title: 'Cargando...'
        };
    }
    componentDidMount() {
        var date: Date = moment(decode(this.props.data.date), 'DD/MM/YYYY').toDate();
        var strDate: string = moment(date).format('dddd D [de] MMMM [del] YYYY');
        this.setState({ title: strDate.charAt(0).toUpperCase() + strDate.slice(1) });
    }
    render(): React.ReactNode {
        return(<Card style={{ marginLeft: 8, marginRight: 8, marginTop: 12, height: 182 }} theme={{ dark: true }}>
            <Card.Title
                title={this.state.title}
                subtitle={decode(this.props.data.exercise.name)}
                subtitleStyle={{ marginLeft: 4 }}
                right={(props)=><IconButton {...props} icon={'trash-can-outline'} onPress={()=>(this.props.deleteButton)&&this.props.deleteButton()} />}
            />
            <Card.Content>
                <ScrollView horizontal={true}>
                    <MiniCustomCard title={'RDS:'} value={decode(this.props.data.rds)} marginLeft={8} />
                    <MiniCustomCard title={'RPE:'} value={decode(this.props.data.rpe)} />
                    <MiniCustomCard title={'PULSO:'} value={decode(this.props.data.pulse)} />
                    <MiniCustomCard title={'REPS:'} value={decode(this.props.data.repetitions)} />
                    <MiniCustomCard title={'KLG:'} value={decode(this.props.data.kilage)} />
                    <MiniCustomCard title={'TLG:'} value={decode(this.props.data.tonnage)} />
                </ScrollView>
            </Card.Content>
            <Card.Actions>
                <Button style={{ display: 'none' }} onPress={()=>(this.props.editButton)&&this.props.editButton()}>Editar</Button>
                <Button onPress={()=>(this.props.viewButton)&&this.props.viewButton()}>Ver detalles</Button>
            </Card.Actions>
        </Card>);
    }
}*/

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
                onPress={()=>(this.props.onPress)&&this.props.onPress()}
            />
        </Card>);
    }
}

export {
    CustomCard1,
    CustomCardComments,
    EmptyListComments,
    CustomItemList,
    CustomItemList2,
    CustomShowError,
    CustomItemList3,
    CustomCardComments2,
    CustomItemList4,
    CustomCard3,
    CustomCard4,
    CustomCard5,
    CustomItemList6,
    CardButton1
};
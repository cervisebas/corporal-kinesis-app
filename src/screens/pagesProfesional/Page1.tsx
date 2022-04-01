import React from "react";
import { Component, ReactNode } from "react";
import { Dimensions, FlatList, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Appbar } from "react-native-paper";
import { CustomCard2, CustomItemList2 } from "../components/Components";

const { width, height } = Dimensions.get('window');
const percent = (px: number, per: number)=>(per * px)/100;

type IProps = {
    navigation: any;
    route: any;
};
type IState = {};

export default class Page1 extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
    }
    private styleCard: StyleProp<ViewStyle> = { width: percent(width, 50) - 18, marginTop: 18, backgroundColor: '#ED7035', height: 72 };
    render(): ReactNode {
        return(<View style={{ flex: 1 }}>
            <Appbar style={{ backgroundColor: '#1663AB', height: 56 }}>
                <Appbar.Action icon="menu" onPress={()=>this.props.navigation.openDrawer()} />
                <Appbar.Content title={'Inicio'}  />
            </Appbar>
            <View style={{ ...styles.cardRowContent, width: width }}>
                <View style={styles.cardContents}>
                    <CustomCard2 style={this.styleCard} icon={'plus'} title={'Cargar'} onPress={()=>console.log('Press')} />
                </View>
                <View style={styles.cardContents}>
                    <CustomCard2 style={this.styleCard} icon={'magnify'} title={'Buscar'} onPress={()=>console.log('Press')} />
                </View>
            </View>
            <FlatList
                data={[].constructor(25)}
                renderItem={({ item, index })=><CustomItemList2 key={index} title={`Prueba titulo de usuario ${index}`} />}
            />
        </View>);
    }
};

const styles = StyleSheet.create({
    cardRowContent: {
        flexDirection: 'row',
        marginBottom: 16
    },
    cardContents: {
        flexDirection: 'column',
        alignItems: 'center',
        width: '50%'
    },
    cardComment: {
        marginLeft: 12,
        marginBottom: 12,
        marginRight: 12
    }
});
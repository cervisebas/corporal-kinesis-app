import React, { Component } from "react";
import { View, ScrollView, StyleSheet, Dimensions, StyleProp, ViewStyle } from "react-native";
import { Appbar, Divider, Menu } from "react-native-paper";
import { Training } from "../../scripts/ApiCorporal";
import { DetailsTrainings, statisticData } from "../../scripts/ApiCorporal/types";
import { LoadNow } from "../../scripts/Global";
import { CustomCard1 } from "../components/Components";
import { Statistics } from "./statistics/statistic";

type IProps = {
    showLoading: (show: boolean, text: string)=>any;
};
type IState = {
    visiblemenu: boolean;
    showLoading: boolean;
    loadAnimation: string;
    dataShow: DetailsTrainings;
    visibleStatistics: boolean;
    titleStatistics: string;
    statistics: statisticData;
};

const { width, height } = Dimensions.get('window');
const percent = (px: number, per: number)=>(per * px)/100;

export class Tab1 extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            visiblemenu: false,
            loadAnimation: 'Cargando',
            showLoading: true,
            dataShow: {
                date: { value: '', status: -1 },
                session_number: { value: '', status: -1 },
                rds: { value: '', status: -1 },
                rpe: { value: '', status: -1 },
                pulse: { value: '', status: -1 },
                repetitions: { value: '', status: -1 },
                kilage: { value: '', status: -1 },
                tonnage: { value: '', status: -1 }
            },
            visibleStatistics: false,
            titleStatistics: '',
            statistics: { singles: [], separate: { labels: [], values: [] } }
        };
    }
    private waitingLoad = setInterval(()=>this.checkLoad(), 512);
    private animationLoading = setInterval(()=>this.setState({ loadAnimation: (this.state.loadAnimation.length == 8)? 'Cargando.': (this.state.loadAnimation.length == 9)? 'Cargando..': (this.state.loadAnimation.length == 10)? 'Cargando...': 'Cargando' }), 256);
    
    checkLoad() {
        if (LoadNow) {
            setTimeout(()=>this.goLoading(), 256);
            clearInterval(this.waitingLoad);
        }
    }
    goReLoading() {
        this.animationLoading = setInterval(()=>this.setState({ loadAnimation: (this.state.loadAnimation.length == 8)? 'Cargando.': (this.state.loadAnimation.length == 9)? 'Cargando..': (this.state.loadAnimation.length == 10)? 'Cargando...': 'Cargando' }), 256);
        this.setState({ showLoading: true, visiblemenu: false }, ()=>this.goLoading());
    }
    goStatistics(data: number, titleStatistics: string) {
        this.props.showLoading(true, 'Cargando estadísticas...');
        Training.getAllOne(data).then((value)=>{
            this.props.showLoading(false, '');
            this.setState({
                visibleStatistics: true,
                titleStatistics: titleStatistics,
                statistics: value
            });
        });
    }
    goLoading() {
        Training.getActual().then((value)=>{
            var reserve = { date: { value: '-', status: -1 }, session_number: { value: '-', status: -1 }, rds: { value: '-', status: -1 }, rpe: { value: '-', status: -1 }, pulse: { value: '-', status: -1 }, repetitions: { value: '-', status: -1 }, kilage: { value: '-', status: -1 }, tonnage: { value: '-', status: -1 } };
            this.setState({ dataShow: (value)? {
                date: value.date,
                session_number: value.session_number,
                rds: value.rds,
                rpe: value.rpe,
                pulse: value.pulse,
                repetitions: value.repetitions,
                kilage: value.kilage,
                tonnage: value.tonnage
            }: reserve, showLoading: false });
            clearInterval(this.animationLoading);
        }).catch((e)=>{
            console.log(e);
            var reserve = { date: { value: 'n/a', status: -1 }, session_number: { value: 'n/a', status: -1 }, rds: { value: 'n/a', status: -1 }, rpe: { value: 'n/a', status: -1 }, pulse: { value: 'n/a', status: -1 }, repetitions: { value: 'n/a', status: -1 }, kilage: { value: 'n/a', status: -1 }, tonnage: { value: 'n/a', status: -1 } };
            this.setState({ dataShow: reserve, showLoading: false });
        });
    }
    render(): React.ReactNode {
        const styleCard: StyleProp<ViewStyle> = { width: percent(width, 50) - 18, marginTop: 18, backgroundColor: '#ED7035', height: 96 };
        return(<View style={{ flex: 2 }}>
            <Appbar.Header style={{ backgroundColor: '#1663AB' }}>
                <Appbar.Content title="Estadísticas" />
                <Menu visible={this.state.visiblemenu} onDismiss={()=>this.setState({ visiblemenu: false })} anchor={<Appbar.Action icon="dots-vertical" color={'#FFFFFF'} onPress={()=>this.setState({ visiblemenu: true })} />} >
                    <Menu.Item onPress={()=>this.goReLoading()} title="Actualizar" icon={'refresh'} />
                    <Menu.Item onPress={() => {}} title="Opciones" icon={'cog'} />
                    <Divider />
                    <Menu.Item onPress={() => {}} title="¿Qué es esto?" icon={'information-outline'} />
                </Menu>
            </Appbar.Header>
            <ScrollView>
                <View style={styles.cardRowContent}>
                    <View style={styles.cardContents}>
                        <CustomCard1 style={styleCard} title={'RDS'} status={(this.state.showLoading)? -5: this.state.dataShow.rds.status} value={(this.state.showLoading)? this.state.loadAnimation: this.state.dataShow.rds.value} onPress={()=>this.goStatistics(3, 'RDS')} />
                        <CustomCard1 style={styleCard} title={'Pulso'} status={(this.state.showLoading)? -5: this.state.dataShow.pulse.status} value={(this.state.showLoading)? this.state.loadAnimation: this.state.dataShow.pulse.value} onPress={()=>this.goStatistics(5, 'Pulso')} />
                        <CustomCard1 style={styleCard} title={'Kilaje'} status={(this.state.showLoading)? -5: this.state.dataShow.kilage.status} value={(this.state.showLoading)? this.state.loadAnimation: this.state.dataShow.kilage.value} onPress={()=>this.goStatistics(7, 'Kilaje')} />
                    </View>
                    <View style={styles.cardContents}>
                        <CustomCard1 style={styleCard} title={'RPE'} status={(this.state.showLoading)? -5: this.state.dataShow.rpe.status} value={(this.state.showLoading)? this.state.loadAnimation: this.state.dataShow.rpe.value} onPress={()=>this.goStatistics(4, 'RPE')} />
                        <CustomCard1 style={styleCard} title={'Repeticiones'} status={(this.state.showLoading)? -5: this.state.dataShow.repetitions.status} value={(this.state.showLoading)? this.state.loadAnimation: this.state.dataShow.repetitions.value} onPress={()=>this.goStatistics(6, 'Repeticiones')} />
                        <CustomCard1 style={styleCard} title={'Tonelaje'} status={(this.state.showLoading)? -5: this.state.dataShow.tonnage.status} value={(this.state.showLoading)? this.state.loadAnimation: this.state.dataShow.tonnage.value} onPress={()=>this.goStatistics(8, 'Tonelaje')} />
                    </View>
                </View>

            </ScrollView>
            <Statistics
                visible={this.state.visibleStatistics}
                datas={this.state.statistics}
                title={this.state.titleStatistics}
                close={()=>this.setState({ visibleStatistics: false })}
            />
        </View>);
    }
};

const styles = StyleSheet.create({
    cardRowContent: {
        flexDirection: 'row',
        width: width
    },
    cardContents: {
        flexDirection: 'column',
        alignItems: 'center',
        width: '50%'
    }
});
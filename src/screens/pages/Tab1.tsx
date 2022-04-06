import React, { Component, PureComponent } from "react";
import { View, FlatList } from "react-native";
import { Appbar, Divider, List, Menu } from "react-native-paper";
import { NoComment } from "../../assets/icons";
import { Training } from "../../scripts/ApiCorporal";
import { DetailsTrainings, statisticData } from "../../scripts/ApiCorporal/types";
import { LoadNow } from "../../scripts/Global";
import { CustomCardComments, EmptyListComments } from "../components/Components";
import HeaderStatistics from "./elements/HeaderStatistics";
import { Statistics } from "./statistics/statistic";

type IProps = {
    showLoading: (show: boolean, text: string)=>any;
};
type IState = {
    visiblemenu: boolean;
    showLoading: boolean;
    dataShow: DetailsTrainings;
    visibleStatistics: boolean;
    titleStatistics: string;
    statistics: statisticData;
};

export class Tab1 extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            visiblemenu: false,
            showLoading: true,
            dataShow: { date: { value: '', status: -1 }, session_number: { value: '', status: -1 }, rds: { value: '', status: -1 }, rpe: { value: '', status: -1 }, pulse: { value: '', status: -1 }, repetitions: { value: '', status: -1 }, kilage: { value: '', status: -1 }, tonnage: { value: '', status: -1 } },
            visibleStatistics: false,
            titleStatistics: '',
            statistics: { singles: [], separate: { labels: [], values: [] } }
        };
    }
    private loading = setInterval(()=>{ if (LoadNow) setTimeout(()=>this.goLoading(), 256) }, 512);
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
            this.setState({ dataShow: (value)? { date: value.date, session_number: value.session_number, rds: value.rds, rpe: value.rpe, pulse: value.pulse, repetitions: value.repetitions, kilage: value.kilage, tonnage: value.tonnage }: reserve, showLoading: false });
            clearInterval(this.loading);
        }).catch(()=>{
            var reserve = { date: { value: 'n/a', status: -1 }, session_number: { value: 'n/a', status: -1 }, rds: { value: 'n/a', status: -1 }, rpe: { value: 'n/a', status: -1 }, pulse: { value: 'n/a', status: -1 }, repetitions: { value: 'n/a', status: -1 }, kilage: { value: 'n/a', status: -1 }, tonnage: { value: 'n/a', status: -1 } };
            this.setState({ dataShow: reserve, showLoading: false });
            clearInterval(this.loading);
        });
    }
    render(): React.ReactNode {
        return(<View style={{ flex: 2 }}>
            <Appbar.Header style={{ backgroundColor: '#1663AB' }}>
                <Appbar.Content title="Estadísticas" />
                <Menu visible={this.state.visiblemenu} onDismiss={()=>this.setState({ visiblemenu: false })} anchor={<Appbar.Action icon="dots-vertical" color={'#FFFFFF'} onPress={()=>this.setState({ visiblemenu: true })} />} >
                    <Menu.Item onPress={()=>this.setState({ showLoading: true, visiblemenu: false }, ()=>this.goLoading())} title="Actualizar" icon={'refresh'} />
                    <Menu.Item onPress={() => {}} title="Opciones" icon={'cog'} />
                    <Divider />
                    <Menu.Item onPress={() => {}} title="¿Qué es esto?" icon={'information-outline'} />
                </Menu>
            </Appbar.Header>
            <FlatList
                data={[].constructor(25)}
                ListHeaderComponent={<HeaderStatistics dataShow={this.state.dataShow} showLoading={this.state.showLoading} goStatistics={(data, title)=>this.goStatistics(data, title)} />}
                ListEmptyComponent={()=><EmptyListComments message={'No hay comentarios para mostrar'} icon={<NoComment width={96} height={96} />} style={{ marginTop: 32 }} />}
                renderItem={({ index })=><CustomCardComments key={index} accountName="Nombre y apellido" date="12/05/2022 15:23 hs" comment="Proident veniam labore anim dolore eiusmod enim esse non ipsum consequat officia pariatur pariatur. Enim in dolor laboris deserunt duis. Nisi dolor incididunt eu ullamco est magna minim et officia enim dolore esse. Lorem sint officia minim minim. Ad consectetur aliqua ut proident nostrud elit excepteur cupidatat deserunt incididunt." />}
            />
            <Statistics
                visible={this.state.visibleStatistics}
                datas={this.state.statistics}
                title={this.state.titleStatistics}
                close={()=>this.setState({ visibleStatistics: false })}
            />
        </View>);
    }
};
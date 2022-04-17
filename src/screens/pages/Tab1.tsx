import { decode, encode } from "base-64";
import moment from "moment";
import React, { Component } from "react";
import { View, FlatList } from "react-native";
import { Appbar, Divider, Menu, ProgressBar, Snackbar, Text } from "react-native-paper";
import { NoComment } from "../../assets/icons";
import { Comment, Training } from "../../scripts/ApiCorporal";
import { commentsData, DetailsTrainings, statisticData } from "../../scripts/ApiCorporal/types";
import { LoadNow } from "../../scripts/Global";
import CombinedTheme from "../../Theme";
import { CustomCardComments, EmptyListComments } from "../components/Components";
import HeaderStatistics from "./elements/HeaderStatistics";
import { Statistics } from "./statistics/statistic";

type IProps = {
    showLoading: (show: boolean, text: string)=>any;
    openOptions: ()=>any;
};
type IState = {
    visiblemenu: boolean;
    showLoading: boolean;
    dataShow: DetailsTrainings;
    visibleStatistics: boolean;
    titleStatistics: string;
    statistics: statisticData;

    // Dialog Error
    dialogShow: boolean;
    messageDialog: string;

    // Comments
    commentsLoading: boolean;
    dataComments: commentsData[];
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
            statistics: { singles: [], separate: { labels: [], values: [] } },
            dialogShow: false,
            messageDialog: '',
            commentsLoading: true,
            dataComments: []
        };
    }
    private timeLoad: number = 512;
    private loading = setInterval(()=>{ if (LoadNow == true) setTimeout(()=>this.goLoading(), 256) }, this.timeLoad);
    private _isMount: boolean = true;
    componentWillUnmount() {
        this._isMount = false;
        this.setState({
            visiblemenu: false,
            showLoading: true,
            dataShow: { date: { value: '', status: -1 }, session_number: { value: '', status: -1 }, rds: { value: '', status: -1 }, rpe: { value: '', status: -1 }, pulse: { value: '', status: -1 }, repetitions: { value: '', status: -1 }, kilage: { value: '', status: -1 }, tonnage: { value: '', status: -1 } },
            visibleStatistics: false,
            titleStatistics: '',
            statistics: { singles: [], separate: { labels: [], values: [] } },
            dialogShow: false,
            messageDialog: '',
            commentsLoading: true,
            dataComments: []
        });
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
        }).catch((error)=>{
            this.props.showLoading(false, '');
            this.setState({ dialogShow: true, messageDialog: error.cause });
        });
    }
    goLoading() {
        Training.getActual().then((value)=>{
            var reserve = { date: { value: '-', status: -1 }, session_number: { value: '-', status: -1 }, rds: { value: '-', status: -1 }, rpe: { value: '-', status: -1 }, pulse: { value: '-', status: -1 }, repetitions: { value: '-', status: -1 }, kilage: { value: '-', status: -1 }, tonnage: { value: '-', status: -1 } };
            this.setState({ dataShow: (value)? { date: value.date, session_number: value.session_number, rds: value.rds, rpe: value.rpe, pulse: value.pulse, repetitions: value.repetitions, kilage: value.kilage, tonnage: value.tonnage }: reserve, showLoading: false });
            clearInterval(this.loading);
        }).catch((error)=>{
            var reserve = { date: { value: 'n/a', status: -1 }, session_number: { value: 'n/a', status: -1 }, rds: { value: 'n/a', status: -1 }, rpe: { value: 'n/a', status: -1 }, pulse: { value: 'n/a', status: -1 }, repetitions: { value: 'n/a', status: -1 }, kilage: { value: 'n/a', status: -1 }, tonnage: { value: 'n/a', status: -1 } };
            this.setState({ dataShow: reserve, showLoading: false, dialogShow: true, messageDialog: error.cause });
            clearInterval(this.loading);
            var loadNow = LoadNow;
            this.timeLoad *= 2;
            this.loading = setInterval(()=>{ if (loadNow = true) setTimeout(()=>this.goLoading(), 256) }, this.timeLoad);
        });
        Comment.getAll().then((value)=>this.setState({ commentsLoading: false, dataComments: value })).catch((error)=>{
            var commentError: commentsData[] = [{ id: '-1', id_training: '0', id_issuer: '1', comment: encode('Al parecer ocurrió un error al cargar los comentarios :(\n\nPor favor, vuelve a intentarlo actualizando la sección de estadísticas en el botón de tres puntos ubicado en la parte de arriba en la derecha de la aplicación, si el problema persiste comunícate con el equipo de Corporal Kinesis o vuelve a intentarlo más tarde.'), date: encode(moment(new Date()).format('DD/MM/YYYY')) }];
            this.setState({ dialogShow: true, messageDialog: error.cause, dataComments: commentError, commentsLoading: false });
        });
    }
    render(): React.ReactNode {
        return((this._isMount)? <View style={{ flex: 2 }}>
            <Appbar.Header style={{ backgroundColor: '#1663AB' }}>
                <Appbar.Content title="Estadísticas" />
                <Menu visible={this.state.visiblemenu} onDismiss={()=>this.setState({ visiblemenu: false })} anchor={<Appbar.Action icon="dots-vertical" color={'#FFFFFF'} onPress={()=>this.setState({ visiblemenu: true })} />} >
                    <Menu.Item onPress={()=>this.setState({ showLoading: true, commentsLoading: true, visiblemenu: false }, ()=>this.goLoading())} title="Actualizar" icon={'refresh'} />
                    <Menu.Item onPress={()=>this.setState({ visiblemenu: false }, ()=>this.props.openOptions())} title="Opciones" icon={'cog'} />
                    <Divider />
                    <Menu.Item onPress={() => {}} title="¿Qué es esto?" icon={'information-outline'} />
                </Menu>
            </Appbar.Header>
            <FlatList
                data={this.state.dataComments}
                ListHeaderComponent={<HeaderStatistics dataShow={this.state.dataShow} showLoading={this.state.showLoading} goStatistics={(data, title)=>this.goStatistics(data, title)} />}
                ListEmptyComponent={()=>(!this.state.commentsLoading)? <EmptyListComments message={'No hay comentarios para mostrar'} icon={<NoComment width={96} height={96} />} style={{ marginTop: 32 }} />: <View><ProgressBar indeterminate={true} /></View>}
                renderItem={({ item, index })=><CustomCardComments
                    key={index}
                    accountName={'Equipo Corporal Kinesis'}
                    date={decode(item.date)}
                    comment={decode(item.comment)}
                />}
            />
            <Statistics
                visible={this.state.visibleStatistics}
                datas={this.state.statistics}
                title={this.state.titleStatistics}
                close={()=>this.setState({ visibleStatistics: false })}
            />
            <Snackbar
                visible={this.state.dialogShow}
                theme={CombinedTheme}
                duration={7000}
                style={{ backgroundColor: '#1663AB' }}
                onDismiss={()=>this.setState({ dialogShow: false })}
                action={{ label: 'Aceptar', onPress: ()=>this.setState({ dialogShow: false }) }}>
                <Text>{this.state.messageDialog}</Text>
            </Snackbar>
        </View>: <></>);
    }
};
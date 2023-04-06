import { encode } from "base-64";
import moment from "moment";
import React, { Component } from "react";
import { View, EmitterSubscription, DeviceEventEmitter } from "react-native";
import { Appbar, Snackbar, Text } from "react-native-paper";
import { Comment, Training } from "../../scripts/ApiCorporal";
import { commentsData, DetailsTrainings, statisticData2 } from "../../scripts/ApiCorporal/types";
import { LoadNow } from "../../scripts/Global";
import CombinedTheme from "../../Theme";
import ViewMoreDetails from "./pages/viewMoreDetails";
import { ThemeContext } from "../../providers/ThemeProvider";
import Tab1ListComments from "./elements/Tab1ListComments";
import { refStatistic, refViewModeDetails } from "../clientRefs";
import { GlobalRef } from "../../GlobalRef";

type IProps = {
    showLoading: (show: boolean, text: string)=>any;
};
type IState = {
    visiblemenu: boolean;
    showLoading: boolean;
    dataShow: DetailsTrainings;
    visibleStatistics: boolean;
    titleStatistics: string;
    statistics2: statisticData2[];
    refreshing: boolean;

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
            dataShow: this.reserve1,
            visibleStatistics: false,
            titleStatistics: '',
            statistics2: [],
            refreshing: false,
            dialogShow: false,
            messageDialog: '',
            commentsLoading: true,
            dataComments: []
        };
        this.goLoading = this.goLoading.bind(this);
        this.goStatistics = this.goStatistics.bind(this);
        this._onRefresing = this._onRefresing.bind(this);
        this._openDetails = this._openDetails.bind(this);
    }
    private event: EmitterSubscription | null = null;
    private timeLoad: number = 512;
    private loading = setInterval(()=>{ if (LoadNow == true) setTimeout(()=>this.goLoading(), 256) }, this.timeLoad);
    private reserve1 = { id: '-1', date: { value: '-', status: -1, difference: undefined }, session_number: { value: '-', status: -1, difference: undefined }, rds: { value: '-', status: -1, difference: undefined }, rpe: { value: '-', status: -1, difference: undefined }, pulse: { value: '-', status: -1, difference: undefined }, repetitions: { value: '-', status: -1, difference: undefined }, kilage: { value: '-', status: -1, difference: undefined }, tonnage: { value: '-', status: -1, difference: undefined }, exercise: { name: 'No disponible', status: -1, description: '' } };
    private reserve2 = { id: '-1', date: { value: 'n/a', status: -1, difference: undefined }, session_number: { value: 'n/a', status: -1, difference: undefined }, rds: { value: 'n/a', status: -1, difference: undefined }, rpe: { value: 'n/a', status: -1, difference: undefined }, pulse: { value: 'n/a', status: -1, difference: undefined }, repetitions: { value: 'n/a', status: -1, difference: undefined }, kilage: { value: 'n/a', status: -1, difference: undefined }, tonnage: { value: 'n/a', status: -1, difference: undefined }, exercise: { name: 'No disponible', status: -1, description: '' } };
    static contextType = ThemeContext;
    componentDidMount() {
        this.event = DeviceEventEmitter.addListener('tab1reload', ()=>{
            this.setState({ showLoading: true, commentsLoading: true, dataComments: [], visiblemenu: false }, this.goLoading);
        });
    }
    componentWillUnmount() {
        this.event?.remove();
    }
    goStatistics(data: number, titleStatistics: string) {
        GlobalRef.current?.loadingController(true, 'Cargando estadísticas...');
        Training.getAllOne2(data).then((value)=>{
            GlobalRef.current?.loadingController(false);
            refStatistic.current?.open(titleStatistics, this.state.dataShow.exercise.name, value);
        }).catch((error)=>{
            GlobalRef.current?.loadingController(false);
            this.setState({ dialogShow: true, messageDialog: error.cause });
        });
    }
    goLoading() {
        clearInterval(this.loading);
        Training.getActual().then((value)=>{
            this.setState({
                dataShow: (value)? { id: value.id, date: value.date, session_number: value.session_number, rds: value.rds, rpe: value.rpe, pulse: value.pulse, repetitions: value.repetitions, kilage: value.kilage, tonnage: value.tonnage, exercise: value.exercise }: this.reserve1,
                showLoading: false
            });
            (this.state.refreshing)&&this.setState({ refreshing: false });
        }).catch((error)=>{
            this.setState({ dataShow: this.reserve2, showLoading: false, dialogShow: true, messageDialog: error.cause });
            (this.state.refreshing)&&this.setState({ refreshing: false });
            clearInterval(this.loading);
            var loadNow = LoadNow;
            this.timeLoad *= 2;
            this.loading = setInterval(()=>{ if (loadNow = true) setTimeout(this.goLoading, 256) }, this.timeLoad);
        });
        Comment.getAll().then((value)=>this.setState({ commentsLoading: false, dataComments: value })).catch((error)=>{
            var commentError: commentsData[] = [{
                id: '-1',
                id_training: '0',
                id_issuer: '1',
                comment: encode('Al parecer ocurrió un error al cargar los comentarios :(\n\nPor favor, vuelve a intentarlo actualizando la sección de estadísticas en el botón de tres puntos ubicado en la parte de arriba en la derecha de la aplicación, si el problema persiste comunícate con el equipo de Corporal Kinesis o vuelve a intentarlo más tarde.'),
                date: encode(moment(new Date()).format('DD/MM/YYYY')),
                edit: false,
                accountData: {
                    name: encode('Equipo Corporal Kinesis'),
                    image: '',
                    birthday: ''
                }
            }];
            this.setState({ dialogShow: true, messageDialog: error.cause, dataComments: commentError, commentsLoading: false });
        });
    }
    _onRefresing() { this.setState({ refreshing: true }, this.goLoading); }
    _openDetails() {
        const _comment = this.state.dataComments.find((value)=>value.id_training == this.state.dataShow.id);
        refViewModeDetails.current?.open(this.state.dataShow, _comment);
    }
    
    render(): React.ReactNode {
        const { theme } = this.context;
        return(<View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <Appbar.Header style={{ backgroundColor: theme.colors.background }}>
                <Appbar.Content title="Estadísticas" />
            </Appbar.Header>
            <Tab1ListComments
                refreshing={this.state.refreshing}
                loading={this.state.showLoading}
                data={this.state.dataShow}
                commentsLoading={this.state.commentsLoading}
                dataComment={this.state.dataComments}
                onRefresing={this._onRefresing}
                openDetails={this._openDetails}
                goStatistics={this.goStatistics}            
            />
            {/*<ViewMoreDetails
                visible={this.state.viewMoreDetailsVisible}
                close={()=>this.setState({ viewMoreDetailsVisible: false })}
                dataShow={this.state.dataShow}
                commentData={this.state.dataComments.find((value)=>value.id_training == this.state.dataShow.id)}
            />*/}
            <Snackbar
                visible={this.state.dialogShow}
                theme={CombinedTheme}
                duration={7000}
                style={{ backgroundColor: '#1663AB' }}
                onDismiss={()=>this.setState({ dialogShow: false })}
                action={{ label: 'Aceptar', onPress: ()=>this.setState({ dialogShow: false }) }}>
                <Text>{this.state.messageDialog}</Text>
            </Snackbar>
        </View>);
    }
};
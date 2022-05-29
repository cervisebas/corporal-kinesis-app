import { decode, encode } from "base-64";
import moment from "moment";
import React, { Component } from "react";
import { View, FlatList, EmitterSubscription, DeviceEventEmitter } from "react-native";
import { Appbar, Divider, Menu, ProgressBar, Snackbar, Text } from "react-native-paper";
import utf8 from "utf8";
import { NoComment } from "../../assets/icons";
import { Comment, HostServer, Training } from "../../scripts/ApiCorporal";
import { commentsData, DetailsTrainings, statisticData, statisticData2 } from "../../scripts/ApiCorporal/types";
import { LoadNow } from "../../scripts/Global";
import CombinedTheme from "../../Theme";
import { CustomCardComments, EmptyListComments } from "../components/Components";
import HeaderStatistics from "./elements/HeaderStatistics";
import ViewMoreDetails from "./pages/viewMoreDetails";
import { Statistics2 } from "./statistics/statistic2";

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
    statistics2: statisticData2[];

    // Dialog Error
    dialogShow: boolean;
    messageDialog: string;

    // Comments
    commentsLoading: boolean;
    dataComments: commentsData[];

    // View More Details
    viewMoreDetailsVisible: boolean;
};

const decodeUtf8 = (str: string)=>{
    try {
        return utf8.decode(str);
    } catch {
        return str;
    }
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
            statistics: { singles: [], separate: { labels: [], values: [] }, exercises: [] },
            statistics2: [],
            dialogShow: false,
            messageDialog: '',
            commentsLoading: true,
            dataComments: [],
            viewMoreDetailsVisible: false
        };
    }
    private event: EmitterSubscription | null = null;
    private timeLoad: number = 512;
    private loading = setInterval(()=>{ if (LoadNow == true) setTimeout(()=>this.goLoading(), 256) }, this.timeLoad);
    private _isMount: boolean = true;
    private reserve1 = { id: '-1', date: { value: '-', status: -1, difference: undefined }, session_number: { value: '-', status: -1, difference: undefined }, rds: { value: '-', status: -1, difference: undefined }, rpe: { value: '-', status: -1, difference: undefined }, pulse: { value: '-', status: -1, difference: undefined }, repetitions: { value: '-', status: -1, difference: undefined }, kilage: { value: '-', status: -1, difference: undefined }, tonnage: { value: '-', status: -1, difference: undefined }, exercise: { name: 'No disponible', status: -1, description: '' } };
    private reserve2 = { id: '-1', date: { value: 'n/a', status: -1, difference: undefined }, session_number: { value: 'n/a', status: -1, difference: undefined }, rds: { value: 'n/a', status: -1, difference: undefined }, rpe: { value: 'n/a', status: -1, difference: undefined }, pulse: { value: 'n/a', status: -1, difference: undefined }, repetitions: { value: 'n/a', status: -1, difference: undefined }, kilage: { value: 'n/a', status: -1, difference: undefined }, tonnage: { value: 'n/a', status: -1, difference: undefined }, exercise: { name: 'No disponible', status: -1, description: '' } };
    componentDidMount() {
        this.event = DeviceEventEmitter.addListener('tab1reload', ()=>{
            this.setState({ showLoading: true, commentsLoading: true, dataComments: [], visiblemenu: false }, ()=>this.goLoading());
        });
    }
    componentWillUnmount() {
        this._isMount = false;
        this.timeLoad = 512;
        this.setState({
            visiblemenu: false,
            showLoading: true,
            dataShow: this.reserve1,
            visibleStatistics: false,
            titleStatistics: '',
            statistics: { singles: [], separate: { labels: [], values: [] }, exercises: [] },
            dialogShow: false,
            messageDialog: '',
            commentsLoading: true,
            dataComments: []
        });
        this.event?.remove();
    }
    goStatistics(data: number, titleStatistics: string) {
        this.props.showLoading(true, 'Cargando estadísticas...');
        Training.getAllOne2(data).then((value)=>{
            this.props.showLoading(false, '');
            this.setState({
                visibleStatistics: true,
                titleStatistics: titleStatistics,
                statistics2: value
            });
        }).catch((error)=>{
            this.props.showLoading(false, '');
            this.setState({ dialogShow: true, messageDialog: error.cause });
        });
    }
    goLoading() {
        Training.getActual().then((value)=>{
            this.setState({ dataShow: (value)? { id: value.id, date: value.date, session_number: value.session_number, rds: value.rds, rpe: value.rpe, pulse: value.pulse, repetitions: value.repetitions, kilage: value.kilage, tonnage: value.tonnage, exercise: value.exercise }: this.reserve1, showLoading: false });
            clearInterval(this.loading);
        }).catch((error)=>{
            this.setState({ dataShow: this.reserve2, showLoading: false, dialogShow: true, messageDialog: error.cause });
            clearInterval(this.loading);
            var loadNow = LoadNow;
            this.timeLoad *= 2;
            this.loading = setInterval(()=>{ if (loadNow = true) setTimeout(()=>this.goLoading(), 256) }, this.timeLoad);
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
    calcYears(date: string): string {
        var dateNow = new Date();
        var processDate = moment(date, 'DD-MM-YYYY').toDate();
        var years = dateNow.getFullYear() - processDate.getFullYear();
        var months = dateNow.getMonth() - processDate.getMonth();
        if (months < 0 || (months === 0 && dateNow.getDate() < processDate.getDate())) years--;
        return String(years);
    }
    render(): React.ReactNode {
        return((this._isMount)? <View style={{ flex: 2 }}>
            <Appbar.Header style={{ backgroundColor: '#1663AB' }}>
                <Appbar.Content title="Estadísticas" />
                <Menu visible={this.state.visiblemenu} onDismiss={()=>this.setState({ visiblemenu: false })} anchor={<Appbar.Action icon="dots-vertical" color={'#FFFFFF'} onPress={()=>this.setState({ visiblemenu: true })} />} >
                    <Menu.Item onPress={()=>this.setState({ showLoading: true, commentsLoading: true, dataComments: [], visiblemenu: false }, ()=>this.goLoading())} title="Actualizar" icon={'refresh'} />
                    <Menu.Item onPress={()=>this.setState({ visiblemenu: false }, ()=>this.props.openOptions())} title="Opciones" icon={'cog'} />
                    <Divider />
                    <Menu.Item onPress={() => {}} title="¿Qué es esto?" icon={'information-outline'} />
                </Menu>
            </Appbar.Header>
            <FlatList
                data={this.state.dataComments}
                ListHeaderComponent={<HeaderStatistics dataShow={this.state.dataShow} showLoading={this.state.showLoading} goStatistics={(data, title)=>this.goStatistics(data, title)} openDetails={()=>this.setState({ viewMoreDetailsVisible: true })} />}
                ListEmptyComponent={()=>(!this.state.commentsLoading)? <EmptyListComments message={'No hay comentarios para mostrar'} icon={<NoComment width={96} height={96} />} style={{ marginTop: 32 }} />: <View><ProgressBar indeterminate={true} /></View>}
                renderItem={({ item, index })=><CustomCardComments
                    key={index}
                    source={(item.id !== '-1')? { uri: `${HostServer}/images/accounts/${decode(item.accountData.image)}` }: require('../../assets/profile.png')}
                    accountName={(item.id !== '-1')? `${decode(item.accountData.name)} (${this.calcYears(decode(item.accountData.birthday))} años)`: decode(item.accountData.name)}
                    edit={item.edit}
                    date={decode(item.date)}
                    comment={decodeUtf8(decode(item.comment))}
                />}
            />
            <Statistics2
                visible={this.state.visibleStatistics}
                exercise={this.state.dataShow.exercise.name}
                datas={this.state.statistics2}
                title={this.state.titleStatistics}
                close={()=>this.setState({ visibleStatistics: false })}
            />
            <ViewMoreDetails
                visible={this.state.viewMoreDetailsVisible}
                close={()=>this.setState({ viewMoreDetailsVisible: false })}
                dataShow={this.state.dataShow}
                commentData={this.state.dataComments.find((value)=>value.id_training == this.state.dataShow.id)}
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
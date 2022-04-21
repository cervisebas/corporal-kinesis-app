import React, { PureComponent, ReactNode } from "react";
import { Dimensions, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Title } from "react-native-paper";
import { DetailsTrainings } from "../../../scripts/ApiCorporal/types";
import { CustomCard1 } from "../../components/Components";

type IProps = {
    goStatistics: (data: number, titleStatistics: string)=>any;
    showLoading: boolean;
    dataShow: DetailsTrainings;
};
type IState = {
    loadAnimation: string;
};

const { width } = Dimensions.get('window');
const percent = (px: number, per: number)=>(per * px)/100;

export default class HeaderStatistics extends PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            loadAnimation: 'Cargando'
        };
    }
    private animText: any = 0;
    private styleCard: StyleProp<ViewStyle> = { width: percent(width, 50) - 18, marginTop: 18, backgroundColor: '#ED7035', height: 96 };
    private _isMount: boolean = true;
    componentDidMount() {
        this._isMount = true;
        this.animText = setInterval(()=>this.setState({ loadAnimation: (this.state.loadAnimation.length == 8)? 'Cargando.': (this.state.loadAnimation.length == 9)? 'Cargando..': (this.state.loadAnimation.length == 10)? 'Cargando...': 'Cargando' }), 256);
    }
    componentWillUnmount() {
        this._isMount = false;
        this.animText = 0;
        clearInterval(this.animText);
        this.setState({ loadAnimation: 'Cargando' });
    }
    render(): ReactNode {
        return(<>
            {(this._isMount)?<View style={{ flexDirection: 'column' }}>
                <View style={{ ...styles.cardRowContent, width: width }}>
                    <View style={styles.cardContents}>
                        <CustomCard1 style={this.styleCard} title={'RDS'} status={(this.props.showLoading)? -5: this.props.dataShow.rds.status} value={(this.props.showLoading)? this.state.loadAnimation: this.props.dataShow.rds.value} onPress={()=>this.props.goStatistics(3, 'RDS')} />
                        <CustomCard1 style={this.styleCard} title={'Pulso'} status={(this.props.showLoading)? -5: this.props.dataShow.pulse.status} value={(this.props.showLoading)? this.state.loadAnimation: this.props.dataShow.pulse.value} onPress={()=>this.props.goStatistics(5, 'Pulso')} />
                        <CustomCard1 style={this.styleCard} title={'Kilaje'} status={(this.props.showLoading)? -5: this.props.dataShow.kilage.status} value={(this.props.showLoading)? this.state.loadAnimation: this.props.dataShow.kilage.value} onPress={()=>this.props.goStatistics(7, 'Kilaje')} />
                    </View>
                    <View style={styles.cardContents}>
                        <CustomCard1 style={this.styleCard} title={'RPE'} status={(this.props.showLoading)? -5: this.props.dataShow.rpe.status} value={(this.props.showLoading)? this.state.loadAnimation: this.props.dataShow.rpe.value} onPress={()=>this.props.goStatistics(4, 'RPE')} />
                        <CustomCard1 style={this.styleCard} title={'Repeticiones'} status={(this.props.showLoading)? -5: this.props.dataShow.repetitions.status} value={(this.props.showLoading)? this.state.loadAnimation: this.props.dataShow.repetitions.value} onPress={()=>this.props.goStatistics(6, 'Repeticiones')} />
                        <CustomCard1 style={this.styleCard} title={'Tonelaje'} status={(this.props.showLoading)? -5: this.props.dataShow.tonnage.status} value={(this.props.showLoading)? this.state.loadAnimation: this.props.dataShow.tonnage.value} onPress={()=>this.props.goStatistics(8, 'Tonelaje')} />
                    </View>
                </View>
                <Title style={{ marginLeft: 8, marginBottom: 8 }}>Comentarios:</Title>
            </View>: <></>}
        </>);
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
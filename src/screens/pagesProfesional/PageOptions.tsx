import React, { Component } from "react";
import { DeviceEventEmitter, RefreshControl, ScrollView, View } from "react-native";
import { Appbar, List, Provider as PaperProvider, Snackbar, Switch, Text } from "react-native-paper";
import { Options } from "../../scripts/ApiCorporal";
import { TypeOptions } from "../../scripts/ApiCorporal/types";
import CombinedTheme from "../../Theme";

type IProps = {
    navigation: any;
    route: any;
};
type IState = {
    switch1: boolean;
    switch1_2: boolean;
    switch2: boolean;
    switch3: boolean;

    showSnackBar: boolean;
    textSnackBar: string;

    options: TypeOptions | undefined;
    isLoading: boolean;
};

export default class PageOptions extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            switch1: false,
            switch1_2: false,
            switch2: false,
            switch3: false,

            showSnackBar: false,
            textSnackBar: '',

            options: undefined,
            isLoading: true
        };
        this.onSwitchs = this.onSwitchs.bind(this);
    }
    loadData() {
        Options.getAll().then((value)=>this.setState({
            switch1: value.viewAdmins1,
            switch2: value.viewAdmins2,
            switch3: value.activeFilters,
            options: value,
            isLoading: false
        })).catch(()=>this.setState({
            showSnackBar: true,
            textSnackBar: 'Ocurrió un error inesperado.',
            isLoading: true
        }));
    }
    componentDidMount() {
        this.loadData();
    }
    onSwitchs() {
        var options: TypeOptions = {
            viewAdmins1: this.state.switch1,
            viewDev: this.state.switch1_2,
            viewAdmins2: this.state.switch2,
            activeFilters: this.state.switch3
        };
        Options.set(options)
            .then(()=>{
                this.loadData();
                DeviceEventEmitter.emit('adminPage1Reload');
                DeviceEventEmitter.emit('adminPage2Reload');
            })
            .catch(()=>this.setState({ showSnackBar: true, textSnackBar: 'Ocurrió un error inesperado.' }));
    }
    render(): React.ReactNode {
        return(<PaperProvider theme={CombinedTheme}>
            <View style={{ flex: 1, backgroundColor: CombinedTheme.colors.background }}>
                <Appbar.Header style={{ backgroundColor: '#1663AB' }}>
                    <Appbar.Action icon="menu" onPress={this.props.navigation.openDrawer} />
                    <Appbar.Content title="Opciones" />
                </Appbar.Header>
                <View style={{ flex: 2, overflow: 'hidden' }}>
                    <ScrollView refreshControl={<RefreshControl colors={[CombinedTheme.colors.accent]} refreshing={this.state.isLoading} onRefresh={()=>this.loadData()} />}>
                        <List.Section>
                            <List.Subheader>Lista clientes</List.Subheader>
                            <List.Item
                                title={"Ocultar admins del inicio"}
                                description={'Esto ocultara los administradores de la lista del inicio, esto no afecta a la búsqueda.'}
                                descriptionNumberOfLines={3}
                                disabled={this.state.isLoading}
                                left={()=><List.Icon icon="eye-remove-outline" />}
                                right={()=><Switch
                                    value={this.state.switch1}
                                    disabled={this.state.isLoading}
                                    onValueChange={()=>this.setState({ switch1: !this.state.switch1 }, this.onSwitchs)}
                                />}
                            />
                            <List.Item
                                title={"Ocultar desarrollador"}
                                description={'Esto ocultara al desarrolador de la lista del inicio y de la lista de cargas, esto no afecta a la búsqueda.'}
                                descriptionNumberOfLines={4}
                                disabled={this.state.isLoading}
                                left={()=><List.Icon icon="eye-remove-outline" />}
                                right={()=><Switch
                                    value={this.state.switch1_2}
                                    disabled={this.state.isLoading}
                                    onValueChange={()=>this.setState({ switch1_2: !this.state.switch1_2 }, this.onSwitchs)}
                                />}
                            />
                            <List.Item
                                title={"Ocultar admins de las cargas"}
                                description={'Esto ocultara los administradores de la lista de cargas. Tener esta opción activa podrá ocasionar lentitud al momento de abrir la ventana.'}
                                descriptionNumberOfLines={5}
                                disabled={this.state.isLoading}
                                left={()=><List.Icon icon="eye-remove-outline" />}
                                right={()=><Switch
                                    value={this.state.switch2}
                                    disabled={this.state.isLoading}
                                    onValueChange={()=>this.setState({ switch2: !this.state.switch2 }, this.onSwitchs)}
                                />}
                            />
                            <List.Item
                                title={"Activar siempre el filtro"}
                                description={'Activa siempre el filtro de administradores en la ventana “administradores”.'}
                                descriptionNumberOfLines={3}
                                disabled={this.state.isLoading}
                                left={()=><List.Icon icon="account-filter-outline" />}
                                right={()=><Switch
                                    value={this.state.switch3}
                                    disabled={this.state.isLoading}
                                    onValueChange={()=>this.setState({ switch3: !this.state.switch3 }, this.onSwitchs)}
                                />}
                            />
                        </List.Section>
                    </ScrollView>
                </View>
                <Snackbar visible={this.state.showSnackBar} style={{ backgroundColor: '#1663AB' }} onDismiss={()=>this.setState({ showSnackBar: false })}><Text>{this.state.textSnackBar}</Text></Snackbar>
            </View>
        </PaperProvider>);
    }
}
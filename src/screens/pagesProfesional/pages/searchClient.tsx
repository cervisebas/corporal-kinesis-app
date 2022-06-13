import React, { Component, ReactNode } from "react";
import { decode } from "base-64";
import { DeviceEventEmitter, ListRenderItemInfo, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Button, Appbar, Searchbar, Provider as PaperProvider, Dialog, Paragraph, Portal, Snackbar, Text, Divider } from "react-native-paper";
import { dataListUsers } from "../../../scripts/ApiCorporal/types";
import CombinedTheme from "../../../Theme";
import { CustomItemList2 } from "../../components/Components";
import filter from 'lodash.filter';
import CustomModal from "../../components/CustomModal";
import SetCommentUser from "./setCommentUser";
import { Account, Comment } from "../../../scripts/ApiCorporal";
import DialogError from "../../components/DialogError";

type IProps = {
    show: boolean;
    close: ()=>any;
    listUsers: dataListUsers[];
    goDetailsClient: (idClient: string)=>any;
    showLoading: (visible: boolean, message: string, after?: ()=>any)=>any;
    showSnackOut: (text: string)=>any;
};
type IState = {
    searchQuery: string;
    listUsers: dataListUsers[];

    idActualDeleteClient: string;
    idActualSendComment: string;

    showQuestionDeleteUser: boolean;
    showSendComment: boolean;


    showSnackBar: boolean;
    textSnackBar: string;

    errorView: boolean;
    errorTitle: string;
    errorMessage: string;
};
export default class SearchClient extends Component<IProps, IState> {
    constructor(props : IProps) {
        super(props);
        this.state = {
            searchQuery: '',
            listUsers: [],
            idActualDeleteClient: '0',
            idActualSendComment: '0',
            showQuestionDeleteUser: false,
            showSendComment: false,
            showSnackBar: false,
            textSnackBar: '',
            errorView: false,
            errorTitle: '',
            errorMessage: ''
        };
        this._renderItem = this._renderItem.bind(this);
    }
    componentWillUnmount() {
        this.setState({
            searchQuery: '',
            listUsers: [],
            idActualDeleteClient: '0',
            idActualSendComment: '0',
            textSnackBar: '',
            errorTitle: '',
            errorMessage: ''
        });
    }
    onChangeSearch(Query: string) {
        if (this.state.searchQuery.length > Query.length) return this.setState({ searchQuery: Query, listUsers: this.props.listUsers });
        this.setState({ searchQuery: Query });
    }
    goSearch(Query: string) {
        const formattedQuery = Query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const data = filter(this.props.listUsers, (user)=>this.contains(decode(user.name).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""), formattedQuery));
        this.setState({ listUsers: data });
    }
    contains(nameUser: string, query: string) {
        if (nameUser.includes(query) || nameUser.includes(query) || nameUser.includes(query)) {
            return true;
        }
        return false;
    }
    loadData() { this.setState({ listUsers: this.props.listUsers }); }

    deleteClient(idClient: string) {
        this.props.showLoading(true, 'Borrando información del cliente...', ()=>
            Account.admin_delete(idClient)
                .then(()=>this.props.showLoading(true, 'Borrando información del cliente...', ()=>this.setState({ idActualDeleteClient: '' }, ()=>{
                    this.props.showLoading(false, '');
                    this.props.showSnackOut('Usuario borrado correctamente.');
                    this.closeModal();
                    DeviceEventEmitter.emit('adminPage1Reload');
                })))
                .catch((error)=>this.setState({ errorView: true, errorTitle: 'Ocurrio un error', errorMessage: error.cause }, ()=>this.props.showLoading(false, '')))
        );
    }
    sendComment(comment: string) {
        this.props.showLoading(true, 'Enviando mensaje...', ()=>
            Comment.admin_create(this.state.idActualSendComment, comment)
                .then(()=>this.props.showLoading(false, '', ()=>this.setState({ showSnackBar: true, textSnackBar: 'Comentario enviado correctamente.', idActualDeleteClient: '' })))
                .catch((error)=>this.props.showLoading(false, '', ()=>this.setState({ errorView: true, errorTitle: 'Ocurrio un error', errorMessage: error.cause })))
        );
    }
    closeModal() {
        this.props.close();
        this.setState({
            searchQuery: '',
            listUsers: [],
            idActualDeleteClient: '0',
            idActualSendComment: '0',
            showQuestionDeleteUser: false,
            showSendComment: false,
            showSnackBar: false,
            textSnackBar: '',
            errorView: false,
            errorTitle: '',
            errorMessage: ''
        });
    }

    /*###### FlatList Control ######*/
    _getItemLayout(_i: any, index: number) { return { length: 64, offset: 64 * index, index }; }
    _keyExtractor(item: dataListUsers, _i: number) { return `p1-admin-${item.id}`; }
    _renderItem({ item }: ListRenderItemInfo<dataListUsers>) {
        return(<CustomItemList2
            key={`p1-admin-${item.id}`}
            title={decode(item.name)}
            image={item.image}
            onPress={()=>this.props.goDetailsClient(item.id)}
            actionDelete={()=>this.setState({ idActualDeleteClient: item.id, showQuestionDeleteUser: true })}
            actionComment={()=>this.setState({ idActualSendComment: item.id, showSendComment: true })}
        />);
    }    
    /*##############################*/

    render(): ReactNode {
        return(<CustomModal visible={this.props.show} onShow={()=>this.loadData()} onRequestClose={()=>this.closeModal()}>
            <PaperProvider theme={CombinedTheme}>
                <View style={{ flex: 1, backgroundColor: CombinedTheme.colors.background }}>
                    <Appbar.Header style={{ backgroundColor: '#1663AB' }}>
                        <Appbar.BackAction onPress={()=>this.closeModal()} />
                        <Appbar.Content title={'Buscar cliente'} />
                    </Appbar.Header>
                    <View style={{ flex: 2 }}>
                        <FlatList
                            data={this.state.listUsers}
                            keyExtractor={this._keyExtractor}
                            getItemLayout={this._getItemLayout}
                            removeClippedSubviews={true}
                            ItemSeparatorComponent={(props)=><Divider {...props} />}
                            ListHeaderComponent={<Searchbar
                                value={this.state.searchQuery}
                                style={{ marginTop: 8, marginLeft: 8, marginRight: 8, marginBottom: 12 }}
                                placeholder={'Escribe para buscar...'}
                                onChangeText={(query: string)=>this.onChangeSearch(query)}
                                onSubmitEditing={({ nativeEvent })=>this.goSearch(nativeEvent.text)}
                            />}
                            renderItem={this._renderItem}
                        />
                        <DialogError show={this.state.errorView} close={()=>this.setState({ errorView: false })} title={this.state.errorTitle} message={this.state.errorMessage} />
                        <Snackbar visible={this.state.showSnackBar} style={{ backgroundColor: '#1663AB' }} onDismiss={()=>this.setState({ showSnackBar: false })}><Text>{this.state.textSnackBar}</Text></Snackbar>
                        <Portal>
                            <Dialog visible={this.state.showQuestionDeleteUser}>
                                <Dialog.Title>¡¡Advertencia!!</Dialog.Title>
                                <Dialog.Content>
                                    <Paragraph>{'¿Estás de acuerdo que quieres borrar este usuario junto a toda su información?\n\nEsta acción no se podrá deshacer luego de una vez realizada.'}</Paragraph>
                                </Dialog.Content>
                                <Dialog.Actions>
                                    <Button onPress={()=>this.setState({ showQuestionDeleteUser: false })}>Cancelar</Button>
                                    <Button onPress={()=>this.setState({ showQuestionDeleteUser: false }, ()=>this.deleteClient(this.state.idActualDeleteClient))}>Aceptar</Button>
                                </Dialog.Actions>
                            </Dialog>
                            <SetCommentUser
                                visible={this.state.showSendComment}
                                close={()=>this.setState({ showSendComment: false, idActualSendComment: '' })}
                                send={(text)=>this.setState({ showSendComment: false }, ()=>this.sendComment(text))}
                            />
                        </Portal>
                    </View>
                </View>
            </PaperProvider>
        </CustomModal>);
    }
}
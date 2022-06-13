import { decode, encode } from "base-64";
import React, { Component } from "react";
import { FlatList, ToastAndroid, View } from "react-native";
import { Button, Appbar, Dialog, Paragraph, Portal, Provider as PaperProvider, TextInput } from "react-native-paper";
import utf8 from "utf8";
import { NoList } from "../../../assets/icons";
import { Comment, HostServer } from "../../../scripts/ApiCorporal";
import { commentsData } from "../../../scripts/ApiCorporal/types";
import CombinedTheme from "../../../Theme";
import { CustomCardComments2, EmptyListComments } from "../../components/Components";
import CustomModal from "../../components/CustomModal";

type IProps = {
    show: boolean;
    close: ()=>any;
    closeComplete: ()=>any;
    data: commentsData[];
    reloadData: ()=>any;
    goLoading: (show: boolean, text: string, after?: ()=>any)=>any;
};
type IState = {
    errorView: boolean;
    errorTitle: string;
    errorMessage: string;
    confirmView: boolean;
    actualId: string;

    // Edit Comment
    showEditComment: boolean;
    valueEditComment: string;
    setEditComment: {
        id: string;
        actualComment: string;
        actualDate: string;
    };
};

const decodeUtf8 = (str: string)=>{ try { return utf8.decode(str); } catch { return str; } };
const encodeUtf8 = (str: string)=>{ try { return utf8.encode(str); } catch { return str; } };

export default class ViewComments extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            errorView: false,
            errorTitle: '',
            errorMessage: '',
            confirmView: false,
            actualId: '',
            showEditComment: false,
            valueEditComment: '',
            setEditComment: {
                id: '0',
                actualComment: '',
                actualDate: '00/00/0000'
            }
        };
    }
    listEmptyComponent() { return(<View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}><EmptyListComments icon={<NoList width={96} height={96} />} message={'No hay comentarios...'} /></View>); }
    deleteComment(id: string) {
        this.props.goLoading(true, 'Borrando comentario...', ()=>
            Comment.admin_delete(id)
                .then(()=>this.props.goLoading(false, '', ()=>this.props.reloadData()))
                .catch((error)=>this.props.goLoading(false, '', ()=>this.setState({ errorView: true, errorTitle: 'Ocurrio un error', errorMessage: error.cause })))
        );
    }
    editComment() {
        this.props.goLoading(true, 'Editando comentario...', ()=>
            Comment.admin_modify(this.state.setEditComment.id, encode(encodeUtf8(this.state.valueEditComment)))
                .then(()=>this.setState({ valueEditComment: '', setEditComment: { id: '0', actualComment: '', actualDate: '00/00/0000' } },this.props.goLoading(false, '', ()=>this.props.reloadData())))
                .catch((error)=>this.props.goLoading(false, '', ()=>this.setState({ errorView: true, errorTitle: 'Ocurrio un error', errorMessage: error.cause })))
        );
    }
    goDelete(data: commentsData) {
        return (data.id_training == '0' || data.id_training == '-1')? this.setState({ confirmView: true, actualId: data.id }): ToastAndroid.show('No se puede eliminar este comentario', ToastAndroid.SHORT);
    }
    goEdit(data: commentsData) {
        return (data.id_training == '0' || data.id_training == '-1')? this.setState({ showEditComment: true, valueEditComment: decodeUtf8(decode(data.comment)), setEditComment: { id: data.id, actualComment: decodeUtf8(decode(data.comment)), actualDate: decode(data.date) } }): ToastAndroid.show('No se puede editar este comentario', ToastAndroid.SHORT);
    }
    render(): React.ReactNode {
        return(<CustomModal visible={this.props.show} onRequestClose={()=>this.props.close()} onClose={()=>this.props.closeComplete()}>
            <PaperProvider theme={CombinedTheme}>
                <View style={{ flex: 1, backgroundColor: CombinedTheme.colors.background }}>
                    <Appbar.Header style={{ backgroundColor: '#1663AB' }}>
                        <Appbar.BackAction onPress={()=>this.props.close()} />
                        <Appbar.Content title={'Comentarios'} />
                    </Appbar.Header>
                    <View style={{ flex: 2 }}>
                        <FlatList
                            data={this.props.data}
                            keyExtractor={(item)=>`viewC-admin-${item.id}`}
                            contentContainerStyle={{ paddingTop: (this.props.data.length !== 0)? 16: undefined, flex: (this.props.data.length == 0)? 3: undefined }}
                            ListEmptyComponent={<this.listEmptyComponent />}
                            renderItem={({ item })=><CustomCardComments2
                                key={`viewC-admin-${item.id}`}
                                accountName={decode(item.accountData.name)}
                                source={{ uri: `${HostServer}/images/accounts/${decode(item.accountData.image)}` }}
                                edit={item.edit}
                                comment={decodeUtf8(decode(item.comment))}
                                date={decode(item.date)}
                                buttonDelete={()=>this.goDelete(item)}
                                buttonEdit={()=>this.goEdit(item)}
                            />}
                        />
                        <Portal>
                            <Dialog visible={this.state.errorView} onDismiss={()=>this.setState({ errorView: false })}>
                                <Dialog.Title>{this.state.errorTitle}</Dialog.Title>
                                <Dialog.Content>
                                    <Paragraph>{this.state.errorMessage}</Paragraph>
                                </Dialog.Content>
                                <Dialog.Actions>
                                    <Button onPress={()=>this.setState({ errorView: false })}>Aceptar</Button>
                                </Dialog.Actions>
                            </Dialog>
                            <Dialog visible={this.state.confirmView} onDismiss={()=>this.setState({ confirmView: false })}>
                                <Dialog.Title>Advertencia de confirmación</Dialog.Title>
                                <Dialog.Content>
                                    <Paragraph>¿Estas seguro que quieres borrar este comentario?</Paragraph>
                                </Dialog.Content>
                                <Dialog.Actions>
                                    <Button onPress={()=>this.setState({ confirmView: false })}>Cancelar</Button>
                                    <Button onPress={()=>this.setState({ confirmView: false }, ()=>this.deleteComment(this.state.actualId))}>Aceptar</Button>
                                </Dialog.Actions>
                            </Dialog>
                            <Dialog visible={this.state.showEditComment} onDismiss={()=>this.setState({ showEditComment: false })}>
                                <Dialog.Title>Editar comentario ({this.state.setEditComment.actualDate})</Dialog.Title>
                                <Dialog.Content>
                                    <TextInput
                                        multiline={true}
                                        numberOfLines={5}
                                        value={this.state.valueEditComment}
                                        onChangeText={(text)=>this.setState({ valueEditComment: text })}
                                        placeholder={'Escribe aquí...'}
                                    />
                                </Dialog.Content>
                                <Dialog.Actions>
                                    <Button onPress={()=>this.setState({ showEditComment: false })}>Cancelar</Button>
                                    <Button onPress={()=>this.setState({ showEditComment: false }, ()=>this.editComment())}>Editar</Button>
                                </Dialog.Actions>
                            </Dialog>
                        </Portal>
                    </View>
                </View>
            </PaperProvider>
        </CustomModal>);
    }
}
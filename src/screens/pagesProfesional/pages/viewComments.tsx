import { decode, encode } from "base-64";
import React, { forwardRef, useContext, useImperativeHandle, useState } from "react";
import { FlatList, ListRenderItemInfo, View } from "react-native";
import { Button, Appbar, Dialog, Portal, TextInput } from "react-native-paper";
import utf8 from "utf8";
import { NoList } from "../../../assets/icons";
import { Comment, HostServer } from "../../../scripts/ApiCorporal";
import { commentsData } from "../../../scripts/ApiCorporal/types";
import { CustomCardComments2, EmptyListComments } from "../../components/Components";
import CustomModal from "../../components/CustomModal";
import { ThemeContext } from "../../../providers/ThemeProvider";
import { GlobalRef } from "../../../GlobalRef";

const decodeUtf8 = (str: string)=>{ try { return utf8.decode(str); } catch { return str; } };
const encodeUtf8 = (str: string)=>{ try { return utf8.encode(str); } catch { return str; } };

export type ViewCommentsRef = {
    open: (data: commentsData[], clientId: string)=>void;
    close: ()=>void;
};

export default React.memo(forwardRef(function ViewComments(_props: any, ref: React.Ref<ViewCommentsRef>) {
    // Context's
    const { theme } = useContext(ThemeContext);
    // State's
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState<commentsData[]>([]);
    const [clientId, setClientId] = useState('-1');
    const [actualId, setActualId] = useState('');
    const [showEditComment, setShowEditComment] = useState(false);
    const [valueEditComment, setValueEditComment] = useState('');
    const [editComment, setEditComment] = useState<{ id: string; actualComment: string; actualDate: string; }>({
        id: '0',
        actualComment: '',
        actualDate: '00/00/0000'
    });

    function reload() {
        GlobalRef.current?.loadingController(true, 'Obteniendo información...');
        Comment.admin_getAllAccount(clientId)
            .then((value)=>{
                setData(value.reverse());
                GlobalRef.current?.loadingController(false);
            })
            .catch((error)=>{
                GlobalRef.current?.loadingController(false);
                GlobalRef.current?.showSimpleAlert('Ocurrio un error', error.cause);
            });
    }
    
    function deleteComment() {
        GlobalRef.current?.loadingController(true, 'Borrando comentario...');
        Comment.admin_delete(actualId)
            .then(()=>{
                reload();
                GlobalRef.current?.loadingController(false);
            })
            .catch((error)=>{
                GlobalRef.current?.loadingController(false);
                GlobalRef.current?.showSimpleAlert('Ocurrio un error', error.cause);
            });
    }
    function _editComment() {
        GlobalRef.current?.loadingController(true, 'Editando comentario...');
        Comment.admin_modify(editComment.id, encode(encodeUtf8(valueEditComment)))
            .then(()=>{
                GlobalRef.current?.loadingController(false);
                setValueEditComment('');
                setEditComment({ id: '0', actualComment: '', actualDate: '00/00/0000' });
                reload();
            })
            .catch((error)=>{
                GlobalRef.current?.loadingController(false);
                GlobalRef.current?.showSimpleAlert('Ocurrio un error', error.cause);
            });
    }
    function _goDelete(_data: commentsData) {
        setActualId(_data.id);
        GlobalRef.current?.showDoubleAlert('Advertencia de confirmación', '¿Estas seguro que quieres borrar este comentario?', deleteComment);
    }
    function _goEdit(data: commentsData) {
        setShowEditComment(true);
        setValueEditComment(decodeUtf8(decode(data.comment)));
        setEditComment({
            id: data.id,
            actualComment: decodeUtf8(decode(data.comment)),
            actualDate: decode(data.date)
        });
    }

    function _keyExtractor(item: commentsData, index: number) {
        return `viewC-admin-${item.id}`;
    }
    function _renderItem({ item }: ListRenderItemInfo<commentsData>) {
        return(<CustomCardComments2
            key={`viewC-admin-${item.id}`}
            accountName={decode(item.accountData.name)}
            source={{ uri: `${HostServer}/images/accounts/${decode(item.accountData.image)}` }}
            edit={item.edit}
            comment={decodeUtf8(decode(item.comment))}
            date={decode(item.date)}
            buttonDelete={()=>_goDelete(item)}
            buttonEdit={()=>_goEdit(item)}
        />);
    }

    function _closeEditComment() { setShowEditComment(false); }
    function _goEditComment() { setShowEditComment(false); _editComment(); }

    function close() { setVisible(false); }
    function open(_data: commentsData[], _clientId: string) {
        setData(_data);
        setClientId(_clientId);
        setVisible(true);
    }
    useImperativeHandle(ref, ()=>({ open, close }));

    return(<CustomModal visible={visible} onRequestClose={close} onClose={close}>
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <Appbar.Header style={{ backgroundColor: theme.colors.background }}>
                <Appbar.BackAction onPress={close} />
                <Appbar.Content title={'Comentarios'} />
            </Appbar.Header>
            <View style={{ flex: 2 }}>
                <FlatList
                    data={data}
                    keyExtractor={_keyExtractor}
                    contentContainerStyle={{ paddingTop: (data.length !== 0)? 8: undefined, flex: (data.length == 0)? 3: undefined }}
                    ListEmptyComponent={<ListEmptyComponent />}
                    renderItem={_renderItem}
                />
                <Portal>
                    <Dialog visible={showEditComment} onDismiss={_closeEditComment}>
                        <Dialog.Title>Editar comentario ({editComment.actualDate})</Dialog.Title>
                        <Dialog.Content>
                            <TextInput
                                mode={'outlined'}
                                multiline={true}
                                numberOfLines={5}
                                value={valueEditComment}
                                onChangeText={setValueEditComment}
                                placeholder={'Escribe aquí...'}
                            />
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={_closeEditComment}>Cancelar</Button>
                            <Button onPress={_goEditComment}>Editar</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </View>
        </View>
    </CustomModal>);
}));

const ListEmptyComponent = React.memo(function ListEmptyComponent() {
    return(<View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
        <EmptyListComments
            icon={<NoList
                width={96}
                height={96}
            />}
            message={'No hay ejercicios cargados...'}
        />
    </View>);
});
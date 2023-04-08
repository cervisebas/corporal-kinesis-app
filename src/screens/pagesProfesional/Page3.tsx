import { decode } from "base-64";
import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from "react"
import { DeviceEventEmitter, FlatList, ListRenderItemInfo, RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { Appbar, ActivityIndicator, Paragraph, Divider, FAB } from "react-native-paper";
import { Exercise } from "../../scripts/ApiCorporal";
import { dataExercise } from "../../scripts/ApiCorporal/types";
import { CustomShowError } from "../components/Components";
import AddNewExercise from "./pages/addNewExcercise";
import EditExcercise from "./pages/editExcercise";
import CustomModal from "../components/CustomModal";
import { ThemeContext } from "../../providers/ThemeProvider";
import CustomItemList4 from "../components/CustomItemList4";
import { GlobalRef } from "../../GlobalRef";

type IProps = {
    navigation: any;
    route: any;
};

export default React.memo(function Page3(props: IProps) {
    // Context's
    const { theme } = useContext(ThemeContext);
    // State's
    const [list, setList] = useState<dataExercise[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [messageError, setMessageError] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    // Ref's
    const refViewDescription = useRef<ViewDescriptionRef>(null);
    const refAddNewExercise = useRef<AddNewExercise>(null);
    const refEditExcercise = useRef<EditExcercise>(null);

    // Function's
    function loadData(re?: boolean) {
        setIsError(false);
        if (re === true) setRefreshing(true); else {
            setIsLoading(true);
            setList([]);
        }
        Exercise.getAll()
            .then((_list)=>{
                setList(_list);
                setIsLoading(false);
                setRefreshing(false);
            })
            .catch((error)=>{
                setIsError(true);
                setIsLoading(false);
                setMessageError(error.cause);
            })
    }
    function _refreshing() {
        loadData(true);
    }

    // Actions
    function _addNewExcercise() {
        refAddNewExercise.current?.open();
    }
    function _editExcercise(data: { idExercise: string; title: string; message: string; }) {
        refEditExcercise.current?.open(data);
    }
    function _viewDescription(_title: string, _description?: string) {
        const _des = _description??'No hay descripción disponible.';
        refViewDescription.current?.open(_title, _des);
    }
    function _onDelete(_idExcercise: string) {
        GlobalRef.current?.showDoubleAlert('¡¡Advertencia!!', '¿Estás seguro/a que quieres borrar este ejercicio?', function deleteNow() {
            GlobalRef.current?.loadingController(true, 'Eliminando ejercicio...');
            Exercise.delete(_idExcercise)
                .then(()=>{
                    GlobalRef.current?.loadingController(false);
                    GlobalRef.current?.showSimpleAlert('Ejercicio eliminado correctamente', '');
                    _refreshing();
                    DeviceEventEmitter.emit('adminPage1Reload');
                })
                .catch((error)=>{
                    GlobalRef.current?.loadingController(false);
                    GlobalRef.current?.showSimpleAlert('Ocurrió un error', error.cause);
                });
        });
    }

    // FlatList
    function _keyExtractor(item: dataExercise) { return `p3-admin-${item.id}`; }
    function _ItemSeparatorComponent(props: any) { return(<Divider {...props} />); }
    function _getItemLayout(_data: dataExercise[] | null | undefined, index: number) {
        return {
            length: 68,
            offset: 68 * index,
            index,
        };
    }
    function _renderItem({ item }: ListRenderItemInfo<dataExercise>) {
        return(<CustomItemList4
            key={`p3-admin-${item.id}`}
            title={decode(item.name)}
            actionViewDescription={()=>_viewDescription(decode(item.name), (decode(item.description) !== 'none')? decode(item.description): undefined)}
            actionDelete={()=>_onDelete(item.id)}
            actionEdit={()=>_editExcercise({
                idExercise: item.id,
                title: item.name,
                message: item.description
            })}
        />);
    }

    useEffect(()=>{
        loadData();
    }, []);

    return(<View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <Appbar style={{ backgroundColor: theme.colors.background }}>
            <Appbar.Action icon="menu" onPress={props.navigation.openDrawer} />
            <Appbar.Content title={'Lista de ejercicios'}  />
        </Appbar>
        <View style={{ flex: 2, overflow: 'hidden' }}>
            <FlatList
                data={list}
                keyExtractor={_keyExtractor}
                getItemLayout={_getItemLayout}
                contentContainerStyle={{ flex: (isLoading || isError)? 3: undefined, paddingBottom: 16 }}
                refreshControl={<RefreshControl
                    colors={[theme.colors.primary]}
                    progressBackgroundColor={theme.colors.elevation.level2}
                    refreshing={refreshing}
                    onRefresh={_refreshing}
                />}
                ItemSeparatorComponent={_ItemSeparatorComponent}
                ListEmptyComponent={(isLoading)? <ShowLoading />: (isError)? <CustomShowError message={messageError} />: undefined}
                renderItem={_renderItem}
            />
        </View>
        <FAB visible={!isLoading} style={styles.fab} icon={'plus'} onPress={_addNewExcercise} />
        <ViewDescription ref={refViewDescription} />
        <AddNewExercise ref={refAddNewExercise} />
        <EditExcercise ref={refEditExcercise} />
    </View>);
});

const ShowLoading = React.memo(function ShowLoading() {
    const { theme } = useContext(ThemeContext);
    return(<View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size={'large'} color={theme.colors.primary} />
    </View>);
});

type ViewDescriptionRef = {
    open: (title: string, description: string)=>void;
};
const ViewDescription = React.memo(forwardRef(function ViewDescription(_props: any, ref: React.Ref<ViewDescriptionRef>) {
    // Context's
    const { theme } = useContext(ThemeContext);
    // State's
    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    function _close() { setVisible(false); }
    function open(_title: string, _description: string) {
        setTitle(_title);
        setDescription(_description);
        setVisible(true);
    }
    useImperativeHandle(ref, ()=>({ open }));

    return(<CustomModal visible={visible} onRequestClose={_close}>
        <View style={[styles.content, { backgroundColor: theme.colors.background }]}>
            <Appbar.Header style={{ backgroundColor: theme.colors.background }}>
                <Appbar.BackAction onPress={_close} />
                <Appbar.Content title={title} />
            </Appbar.Header>
            <ScrollView style={{ paddingLeft: 10, paddingRight: 10 }}>
                <Paragraph style={{ marginTop: 10, marginBottom: 14 }}>{description}</Paragraph>
            </ScrollView>
        </View>
    </CustomModal>);
}));

const styles = StyleSheet.create({
    content: {
        flex: 1
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 8
    }
});
import React, { forwardRef, useContext, useImperativeHandle, useState } from "react";
import { View } from "react-native";
import { Appbar } from "react-native-paper";
import { NoList } from "../../../assets/icons";
import { Training } from "../../../scripts/ApiCorporal";
import { commentsData, DetailsTrainings, trainings } from "../../../scripts/ApiCorporal/types";
import { EmptyListComments } from "../../components/Components";
import CustomModal from "../../components/CustomModal";
import { decode } from "base-64";
import { MaterialTopTabNavigationOptions, createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ViewTrainingPage from "./viewTrainingPage";
import { ThemeContext } from "../../../providers/ThemeProvider";
import { GlobalRef } from "../../../GlobalRef";
import TabBar from "../../../components/TabBar";
import statusEffect from "../../../scripts/StatusEffect";

type dataTabTraining = {
    id: string;
    title: string;
    data: trainings[];
};

type IProps = {
    goMoreDetails: (training: DetailsTrainings, comment: commentsData | undefined)=>any;
};
export type ViewTrainingRef = {
    open: (trainings: trainings[], accountId: string)=>void;
    close: ()=>void;
};

const Tab = createMaterialTopTabNavigator();
const screenOptions: MaterialTopTabNavigationOptions = {
    lazy: true,
    lazyPreloadDistance: 1,
    swipeEnabled: true,
    tabBarScrollEnabled: true,
    tabBarStyle: { backgroundColor: '#1663AB' }
};

export default React.memo(forwardRef(function ViewTraining(props: IProps, ref: React.Ref<ViewTrainingRef>) {
    // Context
    const { theme } = useContext(ThemeContext);
    // State's
    const [visible, setVisible] = useState(false);
    const [tabData, setTabData] = useState<dataTabTraining[]>([]);
    const [accountId, setAccountId] = useState('-1');
    const [actualId, setActualId] = useState('0');
    
    function goMoreDetails(idTraining: string) {
        GlobalRef.current?.loadingController(true, 'Obteniendo información...');
        Training.admin_getEspecificTraining(idTraining, accountId)
            .then((data)=>{
                GlobalRef.current?.loadingController(false);
                props.goMoreDetails(data.t, data.c);
            })
            .catch((error)=>{
                GlobalRef.current?.loadingController(false);
                GlobalRef.current?.showSimpleAlert(error.cause, '');
            });
    }
    function refresh() {
        GlobalRef.current?.loadingController(true, 'Obteniendo información...');
        Training.admin_getAllAccount(accountId)
            .then((value)=>{
                GlobalRef.current?.loadingController(false);
                setTabData(processData(value.reverse()));
            })
            .catch((error)=>{
                GlobalRef.current?.loadingController(false);
                GlobalRef.current?.showSimpleAlert(error.cause, '');
            });
    }
    function processData(data: trainings[]) {
        const tabData: dataTabTraining[] = [];
        data.forEach((value)=>{
            const findIndex = tabData.findIndex((a)=>a.id == value.exercise.id);
            if (findIndex == -1) return tabData.push({
                id: value.exercise.id,
                title: decode(value.exercise.name),
                data: [value]
            });
            tabData[findIndex].data.push(value);
        });
        return tabData;
    }
    function deleteTraining() {
        GlobalRef.current?.loadingController(true, 'Borrando ejercicio...');
        Training.admin_delete(actualId)
            .then(()=>{
                GlobalRef.current?.loadingController(false);
                GlobalRef.current?.showSimpleAlert('Ejercicio borrado correctamente.', '');
                refresh();
            })
            .catch((error)=>{
                GlobalRef.current?.loadingController(false);
                GlobalRef.current?.showSimpleAlert(error.cause, '');
            });
    }
    function _deleteItem(_id: string) {
        setActualId(_id);
        GlobalRef.current?.showDoubleAlert('Advertencia de confirmación', '¿Estas seguro que quieres borrar este comentario?', deleteTraining);
    }
    function _renderTab(value: dataTabTraining) {
        return(<Tab.Screen
            key={`tab-training-${value.id}`}
            name={`${value.title} (${value.data.length})`}
            children={()=><ViewTrainingPage
                data={value.data}
                goMoreDetails={goMoreDetails}
                deleteItem={_deleteItem}
            />}
        />);
    }

    // Controller
    function open(_trainings: trainings[], _accountId: string) {
        const _tabData = processData(_trainings);
        setAccountId(_accountId);
        setTabData(_tabData);
        setVisible(true);
    }
    function close() { setVisible(false); }

    useImperativeHandle(ref, ()=>({ open, close }));
    statusEffect([
        { color: theme.colors.background, style: 'light' },
        { color: theme.colors.elevation.level2, style: 'light' }
    ], visible, undefined, undefined, true);

    return(<CustomModal visible={visible} onRequestClose={close}>
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <Appbar.Header style={{ backgroundColor: theme.colors.background }}>
                <Appbar.BackAction onPress={close} />
                <Appbar.Content title={'Rendimiento'} />
            </Appbar.Header>
            <View style={{ flex: 2 }}>
                {(tabData.length !== 0)? <Tab.Navigator screenOptions={screenOptions} tabBarPosition={'bottom'} tabBar={(props)=><TabBar {...props} />}>
                    {tabData.map(_renderTab)}
                </Tab.Navigator>: <ListEmptyComponent />}
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
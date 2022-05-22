import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { decode, encode } from "base-64";
import qs from "qs";
import { dataExercise, getAllExercises, storageData, tipical } from "./types";

export class ExerciseSystem {
    private urlBase: string = '';
    private header_access: { headers: { Authorization: string } } = { headers: { Authorization: '' } };
    constructor(setUrl: string, setHeaderAccess: string) {
        this.urlBase = setUrl;
        this.header_access.headers.Authorization = setHeaderAccess;
    }
    set(name: string, description: string): Promise<boolean> {
        return new Promise((resolve, reject)=>{
            AsyncStorage.getItem('account_session').then((value)=>{
                if (!value) return reject({ cause: 'No se ha encontrado datos de inicio de sesión.', error: false });
                var datas: storageData = JSON.parse(decode(String(value)));
                var dataPost = { setExercise: true, email: datas.email, password: datas.password, name: encode(name), description: encode(description) };
                axios.post(`${this.urlBase}/index.php`, qs.stringify(dataPost), this.header_access).then((html)=>{
                    try {
                        var result: tipical = html.data;
                        return (result.ok)? resolve(true): reject({ cause: (result.cause?.length !== undefined && result.cause?.length !== 0)? result.cause: 'Ocurrió un error inesperadamente.', error: false });
                    } catch (error) {
                        reject({ cause: 'Ocurrió un error inesperadamente.', error });
                    }
                }).catch((error)=>{
                    reject({ cause: 'Error de conexión.', error });
                });
            }).catch((error)=>reject({ cause: 'Ocurrió un error al intentar consultar a los datos de sesión.', error }));
        });
    }
    delete(idExercise: string): Promise<boolean> {
        return new Promise((resolve, reject)=>{
            AsyncStorage.getItem('account_session').then((value)=>{
                if (!value) return reject({ cause: 'No se ha encontrado datos de inicio de sesión.', error: false });
                var datas: storageData = JSON.parse(decode(String(value)));
                var dataPost = { deleteExercise: true, email: datas.email, password: datas.password, idExercise };
                axios.post(`${this.urlBase}/index.php`, qs.stringify(dataPost), this.header_access).then((html)=>{
                    try {
                        var result: tipical = html.data;
                        return (result.ok)? resolve(true): reject({ cause: (result.cause?.length !== undefined && result.cause?.length !== 0)? result.cause: 'Ocurrió un error inesperadamente.', error: false });
                    } catch (error) {
                        reject({ cause: 'Ocurrió un error inesperadamente.', error });
                    }
                }).catch((error)=>{
                    reject({ cause: 'Error de conexión.', error });
                });
            }).catch((error)=>reject({ cause: 'Ocurrió un error al intentar consultar a los datos de sesión.', error }));
        });
    }
    edit(idExercise: string, name: string, description: string): Promise<boolean> {
        return new Promise((resolve, reject)=>{
            AsyncStorage.getItem('account_session').then((value)=>{
                if (!value) return reject({ cause: 'No se ha encontrado datos de inicio de sesión.', error: false });
                var datas: storageData = JSON.parse(decode(String(value)));
                var dataPost = { editExercise: true, email: datas.email, password: datas.password, idExercise, name: encode(name), description: encode(description) };
                axios.post(`${this.urlBase}/index.php`, qs.stringify(dataPost), this.header_access).then((html)=>{
                    try {
                        var result: tipical = html.data;
                        return (result.ok)? resolve(true): reject({ cause: (result.cause?.length !== undefined && result.cause?.length !== 0)? result.cause: 'Ocurrió un error inesperadamente.', error: false });
                    } catch (error) {
                        reject({ cause: 'Ocurrió un error inesperadamente.', error });
                    }
                }).catch((error)=>{
                    reject({ cause: 'Error de conexión.', error });
                });
            }).catch((error)=>reject({ cause: 'Ocurrió un error al intentar consultar a los datos de sesión.', error }));
        });
    }
    getAll(): Promise<dataExercise[]> {
        return new Promise((resolve, reject)=>{
            AsyncStorage.getItem('account_session').then((value)=>{
                if (!value) return reject({ cause: 'No se ha encontrado datos de inicio de sesión.', error: false });
                var datas: storageData = JSON.parse(decode(String(value)));
                var dataPost = { getExercises: true, email: datas.email, password: datas.password };
                axios.post(`${this.urlBase}/index.php`, qs.stringify(dataPost), this.header_access).then((html)=>{
                    try {
                        var result: getAllExercises = html.data;
                        if (result.ok) {
                            var exercises: any = result.data;
                            resolve(exercises);
                        } else {
                            reject({ cause: (result.cause?.length !== undefined && result.cause?.length !== 0)? result.cause: 'Ocurrió un error inesperadamente.', error: false });
                        }
                    } catch (error) {
                        reject({ cause: 'Ocurrió un error inesperadamente.', error });
                    }
                }).catch((error)=>{
                    reject({ cause: 'Error de conexión.', error });
                });
            }).catch((error)=>reject({ cause: 'Ocurrió un error al intentar consultar a los datos de sesión.', error }));
        });
    }
}
import { encode, decode } from "base-64";
import { dataListUsers, getUserData, listUsers, openAccount, storageData, tipical, userData } from "./types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import qs from "qs";

export default class AccountSystem {
    private urlBase: string = '';
    private header_access: { headers: { Authorization: string } } = { headers: { Authorization: '' } };
    constructor(setUrl: string, setHeaderAccess: string) {
        this.urlBase = setUrl;
        this.header_access.headers.Authorization = setHeaderAccess;
    }
    create(name: string, email: string, password: string, birthday: string, dni: string, phone: string): Promise<boolean> {
        return new Promise((resolve, reject)=>{
            try {
                var data = { createAccount: true, name: encode(name), email: encode(email), password: encode(password), birthday: encode(birthday), dni: encode(dni), phone: encode(phone) };
                axios.post(`${this.urlBase}/index.php`, qs.stringify(data), this.header_access).then((result)=>{
                    var data: tipical = result.data;
                    if (data.ok) resolve(true); else reject({ cause: data.cause, error: data.ok });
                }).catch((error)=>reject({ cause: 'Error de conexión.', error }));
            } catch (error) {
                reject({ cause: 'Ocurrió un error inesperadamente.', error });
            }
        });
    }
    open(email: string, password: string): Promise<storageData> {
        return new Promise(async(resolve, reject)=>{
            try {
                var data = { openAccount: true, email: encode(email), password: encode(password) };
                axios.post(`${this.urlBase}/index.php`, qs.stringify(data), this.header_access).then((result)=>{
                    var data: openAccount = result.data;
                    if (data.ok) {
                        AsyncStorage.setItem('account_session', encode(JSON.stringify(data.datas)), (error)=>{
                            if (error) return reject({ cause: 'Hubo un error al almacenar los datos de sesión.', error });
                            var datas: any = data.datas;
                            resolve(datas);
                        });
                    } else {
                        reject({
                            cause: (data.cause?.length !== undefined && data.cause?.length !== 0)? data.cause: 'Ocurrió un error inesperadamente.',
                            error: false,
                            action: (data.cause?.length !== undefined && data.cause?.length !== 0)? (data.cause?.toLocaleLowerCase().indexOf('mantenimiento'))? 0: 1: 1
                        });
                    }
                }).catch((error)=>{
                    console.log(error);
                    reject({ cause: 'Error de conexión.', error, action: 0 });
                });
            } catch (error) {
                reject({ cause: 'Ocurrió un error inesperadamente.', error, action: 1 });
            }
        });
    }
    verify(): Promise<storageData> {
        return new Promise(async(resolve, reject)=>{
            try {
                AsyncStorage.getItem('account_session').then((value)=>{
                    if (!value) return reject({ cause: 'No se ha encontrado datos de inicio de sesión.', action: 1, error: false });
                    var datas: storageData = JSON.parse(decode(String(value)));
                    this.open(decode(datas.email), decode(datas.password)).then((value)=>resolve(value)).catch((error)=>reject(error));
                }).catch((error)=>reject({ cause: 'Ocurrió un error al intentar consultar a los datos de sesión.', error, action: 1 }));
            } catch (error) {
                reject({ cause: 'Ocurrió un error inesperadamente.', error, action: 1 });
            }
        });
    }
    admin_getListUser(): Promise<dataListUsers[]> {
        return new Promise((resolve, reject)=>{
            try {
                AsyncStorage.getItem('account_session').then((value)=>{
                    if (!value) return reject({ cause: 'No se ha encontrado datos de inicio de sesión.', error: false });
                    var datas: storageData = JSON.parse(decode(String(value)));
                    var postData = { getListUsers: true, email: datas.email, password: datas.password };
                    axios.post(`${this.urlBase}/index.php`, qs.stringify(postData), this.header_access).then((result)=>{
                        var datas: listUsers = result.data;
                        if (datas.ok) {
                            var users: any = datas.data;
                            return resolve(users);
                        } else {
                            return reject({ cause: datas.cause, error: datas.ok });
                        }
                    }).catch((error)=>{
                        reject({ cause: 'Error de conexión.', error });
                    });
                }).catch((error)=>reject({ cause: 'Ocurrió un error al intentar consultar a los datos de sesión.', error }));
            } catch (error) {
                reject({ cause: 'Ocurrió un error inesperadamente.', error });
            }
        });
    }
    admin_getUserData(idUser: string): Promise<userData> {
        return new Promise((resolve, reject)=>{
            try {
                AsyncStorage.getItem('account_session').then((value)=>{
                    if (!value) return reject({ cause: 'No se ha encontrado datos de inicio de sesión.', error: false });
                    var datas: storageData = JSON.parse(decode(String(value)));
                    var postData = { getDataUser: true, idUser, email: datas.email, password: datas.password };
                    axios.post(`${this.urlBase}/index.php`, qs.stringify(postData), this.header_access).then((result)=>{
                        var data: getUserData = result.data;
                        if (data.ok) {
                            var userData: any = data.data;
                            return resolve(userData);
                        } else {
                            return reject({ cause: (data.cause?.length !== undefined && data.cause?.length !== 0)? data.cause: 'Ocurrió un error inesperadamente.', error: false });
                        }
                    }).catch((error)=>reject({ cause: 'Error de conexíon', error }));
                }).catch((error)=>reject({ cause: 'Ocurrió un error al intentar consultar a los datos de sesión.', error }));
            } catch (error) {
                reject({ cause: 'Ocurrió un error inesperadamente.', error });
            }
        });
    }
    admin_create(name: string, dni: string, birthday: string): Promise<boolean> {
        return new Promise((resolve, reject)=>{
            AsyncStorage.getItem('account_session').then((value)=>{
                if (!value) return reject({ cause: 'No se ha encontrado datos de inicio de sesión.', error: false });
                var datas: storageData = JSON.parse(decode(String(value)));
                var postData = { createAccountForAdmin: true, emailAdmin: datas.email, passwordAdmin: datas.password, name, dni, birthday };
                axios.post(`${this.urlBase}/index.php`, qs.stringify(postData), this.header_access).then((html)=>{
                    try {
                        var result: tipical = html.data;
                        if (result.ok) return resolve(true); else return reject({ cause: (result.cause?.length !== undefined && result.cause?.length !== 0)? result.cause: 'Ocurrió un error inesperadamente.', error: false });
                    } catch (error) {
                        reject({ cause: 'Ocurrió un error inesperadamente.', error });
                    }
                }).catch((error)=>reject({ cause: 'Error de conexíon', error }));
            }).catch((error)=>reject({ cause: 'Ocurrió un error al intentar consultar a los datos de sesión.', error }));
        });
    }
    admin_delete(idAccount: string): Promise<boolean> {
        return new Promise((resolve, reject)=>{
            AsyncStorage.getItem('account_session').then((value)=>{
                if (!value) return reject({ cause: 'No se ha encontrado datos de inicio de sesión.', error: false });
                var datas: storageData = JSON.parse(decode(String(value)));
                var postData = { deleteUserAdmin: true, email: datas.email, password: datas.password, idAccount: idAccount };
                axios.post(`${this.urlBase}/index.php`, qs.stringify(postData), this.header_access).then((html)=>{
                    try {
                        console.log(html.data);
                        var result: tipical = html.data;
                        if (result.ok) return resolve(true); else return reject({ cause: (result.cause?.length !== undefined && result.cause?.length !== 0)? result.cause: 'Ocurrió un error inesperadamente.', error: false });
                    } catch (error) {
                        reject({ cause: 'Ocurrió un error inesperadamente.', error });
                    }
                }).catch((error)=>reject({ cause: 'Error de conexíon', error }));
            }).catch((error)=>reject({ cause: 'Ocurrió un error al intentar consultar a los datos de sesión.', error }));
        });
    }
}
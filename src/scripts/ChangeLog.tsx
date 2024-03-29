import AsyncStorage from "@react-native-async-storage/async-storage";
import DeviceInfo from "react-native-device-info";
import { decode, encode } from "base-64";
import json_data from './ChangeLogData.json';

type JSON = {
    version: string;
    date: string;
    changes: {
        type: number;
        text: string;
    }[];
};


export default class SystemChangeLog {
    constructor() {}
    getLocalVersion(): Promise<string> {
        return new Promise((resolve, reject)=>{
            AsyncStorage.getItem('registVersion')
                .then((value)=>(value)? resolve(decode(value)): resolve('0.0.0'))
                .catch((error)=>reject(error));
        });
    }
    async getActualVersion(): Promise<string> {
        return DeviceInfo.getVersion();
    }
    getVerify(): Promise<boolean> {
        return new Promise(async (resolve)=>{
            var local: string = await this.getLocalVersion();
            var actual: string = await this.getActualVersion();
            return (local == actual)? resolve(false): resolve(true);
        });
    }
    getFullData(): JSON[] {
        return json_data;
    }
    tranform_changes(changes: string[]) {
        var strchanges: string = '';
        changes.forEach((value)=>{
            strchanges += `\n   • ${value}`;
        });
        return `Nuevos cambios:${strchanges}\n\nCambios: ${changes.length}`;
    }
    async setNewVersion() {
        var actualVersion = await this.getActualVersion();
        AsyncStorage.setItem('registVersion', encode(actualVersion));
    }
}

export type {
    JSON
};
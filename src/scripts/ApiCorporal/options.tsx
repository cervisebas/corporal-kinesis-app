import AsyncStorage from "@react-native-async-storage/async-storage";
import { decode, encode } from "base-64";
import { TypeOptions } from "./types";

export default class SystemOptions {
    constructor() {  }
    getAll(): Promise<TypeOptions> {
        return new Promise((resolve, reject)=>{
            AsyncStorage.getItem('admin_options').then((value)=>{
                if (value) {
                    var options: TypeOptions = JSON.parse(decode(value));
                    return resolve(options);
                }
                resolve({
                    viewAdmins1: false,
                    viewAdmins2: false,
                    activeFilters: false
                });
            }).catch(()=>reject());
        });
    }
    set(news: TypeOptions) {
        return new Promise((resolve, reject)=>{
            AsyncStorage.setItem('admin_options', encode(JSON.stringify(news)))
                .then(()=>resolve(true))
                .catch(()=>reject());
        });
    }
}
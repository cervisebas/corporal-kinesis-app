import { Image, ImageResizeMode, ImageSourcePropType, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native-paper";
import RNFS from "react-native-fs";
// Images
import NoLoad from "../assets/NoLoad.webp";
import { ThemeContext } from "../providers/ThemeProvider";

type IProps = {
    source: {
        uri: string;
    } | number;
    style?: StyleProp<ViewStyle>;
    circle?: boolean;
    size?: number;
    resizeMode?: ImageResizeMode | undefined; 
    loadSize?: number | "small" | "large";
    noShadow?: boolean;
    onLoad?: ()=>any;
};

const CacheDir = RNFS.ExternalCachesDirectoryPath;

export default React.memo(function ImageLazyLoad(props: IProps) {
    const [loading, setLoading] = useState(true);
    const [source, setSource] = useState<ImageSourcePropType>(NoLoad);
    const [actual, setAcual] = useState<{ uri: string }|number>(-1);
    const { theme } = useContext(ThemeContext);

    async function loadNow() {
        if (props.source == actual) return;
        setAcual(props.source);
        
        if (typeof props.source == 'number') {
            setLoading(false);
            return setSource(props.source as any);
        }
        if (props.source.uri.indexOf('file://') !== -1) {
            setLoading(false);
            return setSource(props.source);
        }
        
        if (!loading) setLoading(true);
        try {
            const uri = await resolveCacheImgLocation(props.source.uri);
            setSource({ uri });
            setLoading(false);
        } catch {
            setSource(NoLoad);
            setLoading(false);
        }
    }
    function errorLoad() { setSource(NoLoad); }

    useEffect(()=>{ loadNow(); }, []);
    useEffect(()=>{ loadNow(); }, [props.source]);

    return(<View style={[
            styles.view,
            { width: props.size, height: props.size, backgroundColor: theme.colors.elevation.level3 },
            props.style,
            (props.circle)? styles.circle: undefined,
            (props.circle)? { shadowColor: '#000000' }: undefined,
            (props.noShadow)? { shadowColor: 'rgba(0, 0, 0, 0)', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0, shadowRadius: 0 }: undefined
        ]}>
        {(loading)? <View style={[styles.loading, { backgroundColor: theme.colors.elevation.level3 }]}>
            <ActivityIndicator
                animating={true}
                size={props.loadSize??'large'}
            />
        </View>:
        <Image
            source={source}
            style={styles.image}
            resizeMethod={'auto'}
            resizeMode={props.resizeMode??'cover'}
            onLoad={props.onLoad}
            onError={errorLoad}
        />}
    </View>);
});


export async function resolveCacheImgLocation(source: string): Promise<string> {
    try {
        let _name = source.split('/').pop();
        // Variables de ubicaciones.
        let cPath = `${CacheDir}/${_name}`;
        let cUri = `file://${cPath}`;
        // Check exist.
        const exist = await RNFS.exists(cPath);
        // Si existe se retorna la ruta del archivo.
        if (exist) return cUri;
        // Si no existe procede a descargar.
        try {
            const download = await RNFS.downloadFile({ fromUrl: source, toFile: cPath }).promise;
            if (download.statusCode !== 200) throw "No se pudo descargar el archivo.";
            return cUri;
        } catch {
            throw "No se pudo descargar el archivo.";
        }
    } catch {
        throw "No se pudo verificar la existencia del archivo.";
    }
}

const styles = StyleSheet.create({
    view: {
        position: 'relative',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        flex: 1,
        width: '100%',
        height: '100%'
    },
    circle: {
        shadowOffset:{
            width: 0,
            height: 1
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
        borderRadius: 1024,
        //overflow: 'hidden'
    },
    loading: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    }
});
import React, { useEffect, useState } from "react";
import { ImageSourcePropType, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import FastImage, { FastImageProps, ResizeMode } from "react-native-fast-image";
import RNFS from "react-native-fs";
// Images
import ProfilePicture from "../../assets/profile.webp";

type IProps = {
    source: {
        uri: string;
    };
    style?: StyleProp<ViewStyle>;
    circle?: boolean;
    size?: number;
    resizeMode?: ResizeMode | undefined; 
    onLoad?: ()=>any;
    nativeImageProps?: FastImageProps;
};

export default React.memo(function ImageLazyLoad(props: IProps) {
    const [loading, setLoading] = useState(true);
    const [source, setSource] = useState<ImageSourcePropType>(ProfilePicture);

    async function loadNow() {
        try {
            const fileName = props.source.uri.split('/').pop();
            const uriFile = `file://${RNFS.CachesDirectoryPath}/${fileName}`;
            const exist = await RNFS.exists(uriFile);
            if (exist) {
                setSource({ uri: uriFile });
                return setLoading(false);
            }
            await RNFS.downloadFile({ fromUrl: props.source.uri, toFile: uriFile }).promise;
            setSource({ uri: uriFile });
            setLoading(false);
        } catch {
            setSource(ProfilePicture);
            setLoading(false);
        }
    }

    useEffect(()=>{ loadNow(); }, [props.source]);

    return(<View style={[styles.view, { width: props.size, height: props.size }, props.style, (props.circle)? styles.circle: undefined, (props.circle)? { shadowColor: '#FFFFFF' }: undefined]}>
        {(loading)?<SkeletonPlaceholder>
            <SkeletonPlaceholder.Item width={'100%'} height={'100%'} />
        </SkeletonPlaceholder>:
        <FastImage
            source={source! as any}
            style={styles.image}
            resizeMode={props.resizeMode}
            onLoad={props.onLoad}
            onError={props.onLoad}
            {...props.nativeImageProps}
        />}
    </View>);
});

const styles = StyleSheet.create({
    view: {
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#000000'
    },
    circle: {
        //shadowColor: "#000000",
        shadowOffset:{
            width: 0,
            height: 1
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
        borderRadius: 1024,
        overflow: 'hidden'
    },
    image: {
        width: '100%',
        height: '100%'
    }
});
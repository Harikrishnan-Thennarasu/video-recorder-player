import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    SafeAreaView,
    Text,
    PermissionsAndroid,
    Linking,
    Alert
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createThumbnail } from "react-native-create-thumbnail";
import { toSaveRecordedVideo } from '../LocalStorage';
import { useStopwatch } from 'react-timer-hook';



const Camera = ({ navigation }) => {

    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isCameraTypeBack, onCameraTypeChange] = useState(true);
    const [onCameraRef, setCameraRef] = useState(null);

    const {
        seconds,
        minutes,
        hours,
        start,
        pause,
        reset,
    } = useStopwatch({ autoStart: false });

    const onStartRecording = async () => {
        onCheckCameraPermissionAndRequest(async () => {
            if (onCameraRef && !isRecording) {
                setIsRecording(true);
                reset();
                const options = {
                    quality: RNCamera.Constants.VideoQuality['1080p'],
                    orientation: "auto"
                };
                const data = await onCameraRef.recordAsync(options);
                onCreateVideoThumbnail(data);
                navigation.navigate('PLAYER', data);
            }
        })
    };

    const onCheckCameraPermissionAndRequest = async (onOpenCamera) => {
        try {
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.CAMERA,
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
            ]);

            if (Object.values(granted).every((permission) => permission === PermissionsAndroid.RESULTS.GRANTED)) {
                onOpenCamera();
            } else {
                Alert.alert('Need Permissions', 'Open Setting > Permissions and allow access to record video', [
                    {
                        text: 'Not now',
                        onPress: () => { },
                        style: 'cancel',
                    },
                    {
                        text: 'Open Settings', onPress: () => {
                            Linking.openSettings();
                        }
                    },
                ]);
            }
        } catch (err) {
            console.warn(err);
        }
    }

    const onCreateVideoThumbnail = (data) => {
        createThumbnail({
            url: data.uri,
            timeStamp: 10000,
        }).then((response) => {
            toSaveRecordedVideo({ ...data, thumbnail: response });
        }).catch((err) => console.error(err));
    }

    const onStopRecording = () => {
        if (onCameraRef && isRecording) {
            onCameraRef.stopRecording();
            setIsRecording(false);
            reset();
            pause();
        }
    };

    const onPauseRecording = () => {
        if (onCameraRef && isRecording) {
            pause();
            onCameraRef.pauseRecording();
            setIsPaused(true);
        }
    };

    const onResumeRecording = () => {
        if (onCameraRef && isRecording) {
            onCameraRef.resumeRecording();
            start();
            setIsPaused(false);
        }
    };

    const toRenderTimer = () => {
        let timer = '';
        if (hours) {
            timer = timer + hours + ':';
        }

        if (minutes) {
            if (minutes < 10) {
                timer = timer + '0' + minutes + ':';
            } else {
                timer = timer + minutes + ':';
            }
        } else if (timer) {
            timer = timer + ':' + '00' + ':';
        } else {
            timer = '00' + ':';
        }

        if (seconds) {
            if (seconds < 10) {
                timer = timer + '0' + seconds;
            } else {
                timer = timer + seconds;
            }
        } else {
            timer = timer + '00';
        }

        return timer;
    }

    return (
        <SafeAreaView style={styles.container}>
            {isRecording ?
                <View style={styles.timerContainer}>
                    <MaterialCommunityIcons name={'record'} style={styles.timerIcon} />
                    <Text style={styles.timerText}>{toRenderTimer()}</Text>
                </View>
                :
                <View />
            }
            <RNCamera
                ref={(ref) => setCameraRef(ref)}
                style={styles.container}
                type={isCameraTypeBack ? RNCamera.Constants.Type.back : RNCamera.Constants.Type.front}
                captureAudio={true}
            />
            <View style={styles.footerContainer}>
                {!isRecording ?
                    <TouchableOpacity
                        style={styles.transparentBotton}
                        onPress={() => navigation.navigate('GALLERY')}
                    >
                        <Ionicons name={'albums'} style={styles.icon} />
                    </TouchableOpacity>
                    :
                    !isPaused ?
                        <TouchableOpacity
                            style={styles.transparentBotton}
                            onPress={onPauseRecording}
                        >
                            <Ionicons name={'pause'} style={styles.icon} />
                        </TouchableOpacity> :
                        <TouchableOpacity
                            style={styles.transparentBotton}
                            onPress={onResumeRecording}
                        >
                            <Ionicons name={'play'} style={styles.icon} />
                        </TouchableOpacity>
                }
                {!isRecording ?
                    <TouchableOpacity
                        style={styles.startRecordButton}
                        onPress={onStartRecording}
                    />
                    :
                    <TouchableOpacity
                        style={styles.stopRecordButton}
                        onPress={onStopRecording}
                    >
                        <View style={styles.stopRecordRedBox} />
                    </TouchableOpacity>
                }
                <TouchableOpacity
                    style={styles.transparentBotton}
                    disabled={isRecording}
                    onPress={() => onCameraTypeChange(!isCameraTypeBack)}
                >
                    {!isRecording ?
                        <Entypo name={'cycle'} style={styles.icon} />
                        :
                        <MaterialIcons name={'sync-disabled'} style={styles.icon} />
                    }
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

export default Camera;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column"
    },
    footerContainer: {
        height: 100,
        position: "absolute",
        bottom: 0,
        width: "100%",
        justifyContent: "space-around",
        alignItems: "center",
        flexDirection: "row"
    },
    icon: {
        color: '#ffff',
        fontSize: 25
    },
    transparentBotton: {
        height: 55,
        width: 55,
        borderRadius: 55,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.13)"
    },
    startRecordButton: {
        backgroundColor: '#ff1100',
        borderRadius: 50,
        width: 75,
        height: 75,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: "#ffff",
        borderWidth: 5
    },
    stopRecordButton: {
        backgroundColor: '#ffff',
        borderRadius: 50,
        width: 75,
        height: 75,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stopRecordRedBox: {
        height: 20,
        width: 20,
        borderRadius: 5,
        backgroundColor: "#ff1100"
    },
    timerContainer: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0)",
        height: 50,
        position: "absolute",
        width: '100%',
        top: 0,
        zIndex: 1,
        flexDirection: "row"
    },
    timerText: {
        color: '#ffff',
        fontSize: 18
    },
    timerIcon: {
        color: '#ff1100',
        fontSize: 18
    }
});
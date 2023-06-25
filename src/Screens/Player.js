import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import Video from 'react-native-video';

const Player = ({ route }) => {
    return (
        <SafeAreaView style={styles.container}>
            <Video
                style={styles.container}
                source={{ uri: route.params.uri }}
                resizeMode={"stretch"}
                controls={true}
            />
        </SafeAreaView>
    );
}

export default Player;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000'
    }
});
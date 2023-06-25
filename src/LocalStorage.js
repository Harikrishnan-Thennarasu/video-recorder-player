import AsyncStorage from "@react-native-async-storage/async-storage";

export const toSaveRecordedVideo = async (data) => {
    try {
        const result = await toGetAllVideos();
        const temp = [...result, data];
        const updateList = JSON.stringify(temp)
        await AsyncStorage.setItem(
            'HKT_RECORDER_GALLARY_LIST',
            updateList,
        );
    } catch (error) {
        console.error(error);
    }
};

export const toGetAllVideos = async () => {
    try {
        const result = await AsyncStorage.getItem('HKT_RECORDER_GALLARY_LIST');
        if (result) {
            return JSON.parse(result);
        } else {
            return [];
        }
    } catch (e) {
        console.error(error);
        return [];
    }
}
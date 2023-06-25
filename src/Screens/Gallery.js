import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { toGetAllVideos } from '../LocalStorage';


const Gallery = ({ route, navigation }) => {
  const [allVideos, setVideoList] = useState([]);

  useEffect(() => {
    fetchVideosInfoFromLocalStorage();
  }, [])

  const fetchVideosInfoFromLocalStorage = async () => {
    const result = await toGetAllVideos();
    setVideoList(result);
  }

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity style={style.thumbnailContainer} onPress={() => onPlayVideo(item)}>
        <Image
          style={style.thumbnail}
          source={{ uri: item.thumbnail.path }}
        />
      </TouchableOpacity>
    )
  }

  const onPlayVideo = (item) => {
    navigation.navigate('PLAYER', item)
  }

  return (
    <SafeAreaView style={style.container}>
      <FlatList
        data={allVideos}
        numColumns={3}
        renderItem={renderItem}
      />
    </SafeAreaView>
  )
}

export default Gallery;

const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5
  },
  thumbnailContainer: {
    width: "30%",
    height: 100,
    marginRight: "5%",
    marginBottom: "5%"
  },
  thumbnail: {
    width: "100%",
    height: "100%"
  }
})

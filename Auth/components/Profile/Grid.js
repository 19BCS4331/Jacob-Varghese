import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';

const Grid = ({posts, onThumbnailPress}) => {
  // Implement the grid layout here, you can use FlatList or any other method to display the thumbnails
  return (
    <FlatList
      data={posts}
      numColumns={3} // Change the number of columns as needed
      keyExtractor={item => item.postId}
      renderItem={({item}) => (
        <TouchableOpacity onPress={() => onThumbnailPress(item)}>
          <Image source={{uri: item.mediaUrl}} style={styles.thumbnail} />
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  thumbnail: {
    width: 100,
    height: 100,
    margin: 10,
    borderRadius: 10,
  },
});

export default Grid;

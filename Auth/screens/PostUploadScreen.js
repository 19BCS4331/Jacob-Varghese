import {View, Text, Image, StyleSheet} from 'react-native';
import React from 'react';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import Video from 'react-native-video';
import * as ImagePicker from 'react-native-image-picker';
import {useState} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {UploadOutlined} from '@ant-design/icons';

const PostUploadScreen = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const openFilePicker = () => {
    const options = {
      mediaType: 'mixed', // Allows selecting both images and videos
      quality: 1,
    };

    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled file picker');
      } else if (response.error) {
        console.error('File picker error:', response.error);
      } else if (response.assets && response.assets.length > 0) {
        const file = response.assets[0];
        const {uri, fileName, type} = file;
        if (type.startsWith('image/')) {
          // Selected file is an image
          setSelectedImage(uri);
          setSelectedVideo(null);

          // Call the function to upload the image file and store the title
          //   uploadImage(uri, fileName);
        } else if (type.startsWith('video/')) {
          // Selected file is a video
          setSelectedVideo(uri);
          setSelectedImage(null);
          // Call the function to upload the video file and store the title
          //   uploadVideo(uri, fileName);
        }
      }
    });
  };

  const uploadFile = async (fileUri, fileName, fileType) => {
    const storageRef = storage().ref().child(fileName);
    const task = storageRef.putFile(fileUri, {contentType: fileType});

    try {
      await task;
      console.log('File uploaded successfully.');

      // Get the download URL of the uploaded file
      const downloadURL = await storageRef.getDownloadURL();

      // Save the file details and title to Firestore
      await firestore().collection('posts').add({
        title: title, // Replace 'title' with the actual title variable
        mediaUrl: downloadURL,
        fileName: fileName,
        fileType: fileType,
      });

      console.log('Post data saved to Firestore.');
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <View>
      <Text
        style={{fontSize: 30, marginLeft: 20, marginTop: 40, marginBottom: 40}}>
        Add a post!
      </Text>
      {!selectedImage && !selectedVideo && (
        <TouchableOpacity
          onPress={openFilePicker}
          style={styles.MediaSelectButton}>
          <Text>Choose Media</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={openFilePicker}>
        {selectedImage && (
          <View style={styles.ImgContainer}>
            <Image style={styles.Image} source={{uri: selectedImage}} />
          </View>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={openFilePicker}>
        {selectedVideo && (
          <View style={styles.VideoContainer}>
            <Video
              source={{uri: selectedVideo}}
              style={styles.videoPreview}
              resizeMode="cover"
              //   controls={true}
            />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  ImgContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  VideoContainer: {
    aspectRatio: 16 / 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Image: {
    height: 300,
    width: '90%',
    resizeMode: 'cover',
    borderWidth: 6,
    borderColor: 'lightblue',
  },
  videoPreview: {
    width: '100%',
    height: '100%',
    maxWidth: '90%',
    // flex: 1,
  },
  MediaSelectButton: {
    backgroundColor: 'lightblue',
    width: 100,
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
  },
});

export default PostUploadScreen;

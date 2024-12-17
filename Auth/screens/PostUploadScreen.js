import {
  View,
  Text,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from 'react-native';
import React from 'react';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import Video from 'react-native-video';
import * as ImagePicker from 'react-native-image-picker';
import {useState, useEffect} from 'react';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
import ImageCropPicker from 'react-native-image-crop-picker';
import {PermissionsAndroid} from 'react-native';

const PostUploadScreen = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [title, setTitle] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('');

  const requestFilePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'File Access Permission',
          message:
            'This app needs access to your files to perform file picking.',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('File access permission granted.');
        return true;
      } else {
        console.log('File access permission denied.');
        return false;
      }
    } catch (error) {
      console.error('Error while requesting file access permission:', error);
      return false;
    }
  };

  // useEffect(() => {
  //   // Fetch user profile data from the users collection in Firestore
  //   const fetchUserProfile = async () => {
  //     try {
  //       const user = auth().currentUser;
  //       if (user) {
  //         const userDoc = await firestore()
  //           .collection('users')
  //           .doc(user.uid)
  //           .get();

  //         if (userDoc.exists) {
  //           const userData = userDoc.data();
  //           // Save the user's display name and profile photo URL in state
  //           setDisplayName(userData.displayName);
  //           setProfilePhotoUrl(userData.profilePhotoUrl);
  //         }
  //       }
  //     } catch (error) {
  //       console.error('Error fetching user profile:', error);
  //       // Handle the error, e.g., show an alert to the user
  //     }
  //   };

  //   fetchUserProfile();
  // }, []);

  // const openFilePicker = () => {
  //   const options = {
  //     mediaType: 'mixed', // Allows selecting both images and videos
  //     quality: 1,
  //   };

  //   ImagePicker.launchImageLibrary(options, response => {
  //     if (response.didCancel) {
  //       console.log('User cancelled file picker');
  //     } else if (response.error) {
  //       console.error('File picker error:', response.error);
  //     } else if (response.assets && response.assets.length > 0) {
  //       const file = response.assets[0];
  //       const {uri, fileName, type} = file;
  //       if (type.startsWith('image/')) {
  //         // Selected file is an image
  //         setSelectedImage(uri);
  //         setSelectedVideo(null);

  //         // Call the function to upload the image file and store the title
  //         // uploadFile(uri, fileName, type);
  //       } else if (type.startsWith('video/')) {
  //         // Selected file is a video
  //         setSelectedVideo(uri);
  //         setSelectedImage(null);
  //         // Call the function to upload the video file and store the title
  //         // uploadFile(uri, fileName, type);
  //       }
  //     }
  //   });
  // };

  const openFilePicker = async () => {
    const permissionGranted = await requestFilePermission();
    if (permissionGranted) {
      ImageCropPicker.openPicker({
        mediaType: 'mixed', // Allows selecting both images and videos
        cropping: false, // Disable cropping by default
      })
        .then(async image => {
          if (image.mime.startsWith('image/')) {
            // The user selected an image
            if (image.width > 1000 || image.height > 1000) {
              // If the image is larger than 1000x1000, offer cropping
              const croppedImage = await ImageCropPicker.openCropper({
                path: image.path,
                width: 1000,
                height: 1000,
                cropperCircleOverlay: false, // Set to true if you want a circular crop
              });

              if (croppedImage) {
                setSelectedImage(croppedImage.path);
                setSelectedVideo(null);
              }
            } else {
              // If the image is smaller, no need to crop
              setSelectedImage(image.path);
              setSelectedVideo(null);
            }
          } else if (image.mime.startsWith('video/')) {
            // The user selected a video
            setSelectedVideo(image.path);
            setSelectedImage(null);
          }
        })
        .catch(error => {
          console.error('File picker error:', error);
        });
    } else {
      // Handle permission denial, e.g., show an alert to the user
      Alert.alert('Permission Denied', 'Please grant access to select media.');
    }
  };

  const uploadFile = async (fileUri, fileName, fileType) => {
    const storageRef = storage().ref().child(fileName);
    const task = storageRef.putFile(fileUri, {contentType: fileType});

    try {
      await task;
      console.log('File uploaded successfully.');
      Alert.alert('', 'File Successfully Uploaded!');

      const currentUser = firebase.auth().currentUser;
      const userDoc = await firestore()
        .collection('users')
        .doc(currentUser.uid)
        .get();
      const userData = userDoc.data();
      console.log(userData);
      // Get the download URL of the uploaded file
      const downloadURL = await storageRef.getDownloadURL();

      // Save the file details and title to Firestore
      await firestore().collection('posts').add({
        title: title, // Replace 'title' with the actual title variable
        mediaUrl: downloadURL,
        fileName: fileName,
        fileType: fileType,
        userId: firebase.auth().currentUser.uid,
        userName: userData.displayName,
        userEmail: userData.email,
        profilePhotoUrl: userData.profilePhotoUrl,
        likesCount: 0,
        comments: [],
        usersLiked: [],
      });

      console.log('Post data saved to Firestore.');
      setTitle('');
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleUploadButtonPress = () => {
    if ((title && selectedImage) || (title && selectedVideo)) {
      const fileUri = selectedImage || selectedVideo;
      const fileName = fileUri.split('/').pop(); // Replace with the actual file name
      const fileType = selectedImage ? 'image/jpeg' : 'video/mp4';
      const title = title;
      uploadFile(fileUri, fileName, fileType);
    } else {
      console.log('No file selected');
      Alert.alert('', 'Please Fill In All Details!');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <Text
        style={{
          fontSize: 25,
          marginLeft: 20,
          marginTop: 40,
          marginBottom: 40,
          color: 'black',
          fontFamily: 'Poppins-Regular',
        }}>
        Add a post!
      </Text>
      <KeyboardAvoidingView behavior="position">
        {!selectedImage && !selectedVideo && (
          <View style={{alignItems: 'center'}}>
            <TouchableOpacity
              onPress={openFilePicker}
              style={styles.MediaSelectButton}>
              <Image
                source={require('../Assets/upload.png')}
                style={{height: 40, width: 40, opacity: 0.8}}
              />
            </TouchableOpacity>
            <Text
              style={{
                color: 'lightblue',
                fontFamily: 'Poppins-Bold',
                marginTop: 10,
                fontSize: 18,
              }}>
              Choose Media
            </Text>
          </View>
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
              />
            </View>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
      <KeyboardAvoidingView style={styles.CaptionContainer} behavior="position">
        <Text
          style={{
            alignSelf: 'flex-start',
            left: 80,
            marginTop: 20,
            marginBottom: 5,
            fontSize: 18,
            fontFamily: 'Poppins-Regular',
            color: 'black',
          }}>
          write a caption:
        </Text>
        <TextInput
          placeholder="Write the perfect caption!"
          style={styles.Caption}
          value={title}
          onChangeText={setTitle}
          placeholderTextColor="gray"
        />
      </KeyboardAvoidingView>
      <View
        style={{
          height: 50,
          width: 50,
          alignSelf: 'flex-end',

          margin: 20,
          marginTop: '30%',
        }}>
        <TouchableOpacity onPress={handleUploadButtonPress}>
          <Image
            source={require('../Assets/send.png')}
            style={{
              width: 50,
              height: 50,
            }}
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
  },
  ImgContainer: {
    alignItems: 'center',
    justifyContent: 'center',
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
    borderRadius: 20,
  },
  videoPreview: {
    width: '100%',
    height: '100%',
    maxWidth: '90%',
    borderRadius: 20,
    elevation: 5,
    // flex: 1,
  },
  MediaSelectButton: {
    backgroundColor: 'lightblue',
    width: 300,
    height: 250,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Caption: {
    backgroundColor: 'lightgray',
    width: 300,
    paddingLeft: 20,
    borderRadius: 10,
    elevation: 2,
    fontFamily: 'Poppins-Regular',
    color: 'black',
    marginLeft: 80,
  },
  CaptionContainer: {
    alignItems: 'center',
    marginTop: 40,
    width: '80%',
  },
  UploadIcon: {},
});

export default PostUploadScreen;

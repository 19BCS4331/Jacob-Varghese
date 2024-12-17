import {
  View,
  Text,
  Button,
  Alert,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  PermissionsAndroid,
} from 'react-native';
import React, {useState, useEffect, useContext} from 'react';

import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import firestore from '@react-native-firebase/firestore';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';

const Settings = () => {
  const [displayName, setDisplayName] = useState('');
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('');
  const [about, setAbout] = useState('');
  // const {userProfile, setUserProfile} = useContext(UserContext);

  useEffect(() => {
    // Fetch user profile data from the users collection in Firestore
    const fetchUserProfile = async () => {
      try {
        const user = auth().currentUser;
        if (user) {
          const userDoc = await firestore()
            .collection('users')
            .doc(user.uid)
            .get();

          if (userDoc.exists) {
            const userData = userDoc.data();
            // Save the user's display name and profile photo URL in state
            setDisplayName(userData.displayName);
            setProfilePhotoUrl(userData.profilePhotoUrl);
            setAbout(userData.about);
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // Handle the error, e.g., show an alert to the user
      }
    };

    fetchUserProfile();
  }, []);

  const requestFilePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'File Access Permission',
          message:
            'This app needs access to your files to select a profile photo.',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      console.error('Error while requesting file access permission:', error);
      return false;
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const user = auth().currentUser;
      if (user) {
        // Update the user's profile data in the users collection
        await firestore().collection('users').doc(user.uid).update({
          displayName: displayName,
          profilePhotoUrl: profilePhotoUrl,
          //   about: about,
        });

        const userPostsSnapshot = await firestore()
          .collection('posts')
          .where('userId', '==', user.uid)
          .get();

        const batch = firestore().batch();

        userPostsSnapshot.forEach(doc => {
          const postRef = firestore().collection('posts').doc(doc.id);
          batch.update(postRef, {
            profilePhotoUrl: profilePhotoUrl,
            userName: displayName,
          });
        });

        await batch.commit();

        // Show a success message to the user
        Alert.alert('', 'Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      // Handle the error, e.g., show an alert to the user
    }
  };

  const SignOut = async () => {
    try {
      Alert.alert(
        'Sign Out',
        'Are you sure you want to sign out?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Sign Out',
            onPress: async () => {
              await auth().signOut();
              await GoogleSignin.signOut();
              console.log('User signed out!');
            },
          },
        ],
        {cancelable: false},
      );
    } catch (error) {
      console.error(error);
    }
  };

  // const handleChooseProfilePhoto = async () => {
  //   try {
  //     const image = await ImagePicker.openPicker({
  //       cropping: true,
  //       width: 300,
  //       height: 300,
  //       cropperCircleOverlay: true,
  //       cropperToolbarTitle: 'Crop Image',
  //     });

  //     if (image && image.path) {
  //       // Save the selected image URI to state
  //       setProfilePhotoUrl(image.path);
  //     }
  //   } catch (error) {
  //     console.error('Image picker error:', error);
  //     // Handle the error, e.g., show an alert to the user
  //   }
  // };

  const handleChooseProfilePhoto = async () => {
    const permissionGranted = await requestFilePermission();
    if (permissionGranted) {
      try {
        const image = await ImagePicker.openPicker({
          cropping: true,
          width: 300,
          height: 300,
          cropperCircleOverlay: true,
          cropperToolbarTitle: 'Crop Image',
        });

        if (image && image.path) {
          const reference = storage().ref(
            `profilePhotos/${auth().currentUser.uid}`,
          );
          const task = reference.putFile(image.path);

          task.on('state_changed', snapshot => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
          });

          try {
            await task;
            const downloadURL = await reference.getDownloadURL();
            setProfilePhotoUrl(downloadURL);
          } catch (error) {
            console.error('Error getting download URL:', error);
          }
        }
      } catch (error) {
        console.error('Image picker error:', error);
      }
    } else {
      Alert.alert(
        'Permission Denied',
        'Please grant access to select a profile photo.',
      );
    }
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.profilePhotoContainer}
        onPress={handleChooseProfilePhoto}>
        {profilePhotoUrl ? (
          <Image source={{uri: profilePhotoUrl}} style={styles.profileImage} />
        ) : (
          <Text style={styles.profilePhotoText}>Add Profile Photo</Text>
        )}
      </TouchableOpacity>
      <Text style={styles.displayNameText}>{displayName}</Text>
      <TextInput
        style={styles.displayNameInput}
        placeholder="Change Display Name"
        // value={displayName}
        onChangeText={setDisplayName}
        placeholderTextColor="gray"
      />
      <View style={{width: 80, alignSelf: 'center', marginTop: 50}}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleUpdateProfile}>
          <Text style={styles.saveText}>Save details</Text>
        </TouchableOpacity>
      </View>
      <View style={{width: 100, alignSelf: 'center', top: '35%', left: '30%'}}>
        <Button title="Sign Out" onPress={SignOut} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profilePhotoContainer: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  displayNameText: {
    fontSize: 16,
    marginBottom: 50,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    color: '#595959',
  },
  displayNameInput: {
    backgroundColor: 'white',
    width: '80%',
    alignSelf: 'center',
    paddingLeft: 20,
    borderRadius: 10,
    elevation: 5,
  },
  saveButton: {
    backgroundColor: 'lightblue',
    width: 110,
    height: 45,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveText: {
    fontFamily: 'Poppins-Regular',
    color: 'white',
  },
});
export default Settings;

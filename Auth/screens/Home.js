import {View, Text, Button, StyleSheet} from 'react-native';
import React, {useState} from 'react';

import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import PostUploadScreen from './PostUploadScreen';

const Home = () => {
  const SignOut = async () => {
    try {
      await auth().signOut();
      await GoogleSignin.signOut();
      console.log('User signed Out!');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <PostUploadScreen />
      {/* <View style={{top: '80%', width: 100, alignSelf: 'center'}}>
        <Button title="Sign Out" onPress={SignOut} />
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Home;

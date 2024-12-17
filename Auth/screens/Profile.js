import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Button,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {firebase} from '@react-native-firebase/auth';
import Post from '../components/Home/Post';
import Grid from '../components/Profile/Grid';
import {TouchableOpacity} from 'react-native-gesture-handler';

const Profile = ({navigation}) => {
  const [userProfile, setUserProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    // Fetch the user's profile information from Firestore or your backend
    const userId = firebase.auth().currentUser.uid; // Replace this with the user ID of the logged-in user
    firestore()
      .collection('users')
      .doc(userId)
      .get()
      .then(snapshot => {
        if (snapshot.exists) {
          setUserProfile(snapshot.data());
        } else {
          console.log('User profile not found');
        }
      })
      .catch(error => {
        console.error('Error fetching user profile:', error);
      });

    // Fetch the user's posts from Firestore or your backend
    const unsubscribe = firestore()
      .collection('posts')
      .where('userId', '==', userId)
      .onSnapshot(querySnapshot => {
        const postsData = [];
        querySnapshot.forEach(documentSnapshot => {
          const data = documentSnapshot.data();
          postsData.push({
            postId: documentSnapshot.id,
            title: data.title,
            mediaUrl: data.mediaUrl,
            fileType: data.fileType,
            likesCount: data.likesCount,
            comments: data.comments,
            profilePhotoUrl: data.profilePhotoUrl,
            userEmail: data.userEmail,
            userName: data.userName,
          });
        });
        setUserPosts(postsData);
      });

    return () => unsubscribe();
  }, []);

  const handleThumbnailPress = post => {
    // Redirect to the PostDetail screen and pass the focused post and other posts as navigation params
    navigation.navigate('PostDetail', {
      focusedPost: post,
      otherPosts: userPosts,
    });
  };

  return (
    <View style={styles.container}>
      {userProfile && (
        <>
          <Image
            source={{uri: userProfile.profilePhotoUrl}}
            style={styles.profileImage}
          />
          <Text style={styles.displayNameText}>{userProfile.displayName}</Text>
        </>
      )}
      <View
        style={{
          alignItems: 'center',
          position: 'absolute',
          right: '5%',
          top: '3%',
        }}>
        <TouchableOpacity
          style={styles.settingsIconButton}
          onPress={() => navigation.navigate('Settings')}>
          <Image
            style={styles.settingsIcon}
            source={require('../Assets/settings.png')}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.postTitle}>Posts</Text>
      <Grid posts={userPosts} onThumbnailPress={handleThumbnailPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    alignSelf: 'center',
  },
  settingsIcon: {
    width: 30,
    height: 30,
    opacity: 0.6,
  },
  postTitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 20,
    color: '#595959',
  },
  displayNameText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    color: '#595959',
  },
});

export default Profile;

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import Video from 'react-native-video';
import firestore from '@react-native-firebase/firestore';
import {firebase} from '@react-native-firebase/auth';
import auth from '@react-native-firebase/auth';

const Post = ({
  postId,
  title,
  mediaUrl,
  fileType,
  userName,
  userEmail,
  likesCount,
  comments,
  profilePhotoUrl,
}) => {
  const isImage = fileType.startsWith('image/');
  const isVideo = fileType.startsWith('video/');
  // const [currentLikesCount, setCurrentLikesCount] = useState(likesCount);
  const [isLiked, setIsLiked] = useState(false);
  const [likedByUsers, setLikedByUsers] = useState([]);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    // Fetch the list of user IDs who liked the post from Firestore
    const unsubscribe = firestore()
      .collection('posts')
      .doc(postId)
      .onSnapshot(snapshot => {
        const data = snapshot.data();
        if (data && data.userLikes) {
          setLikedByUsers(data.userLikes);
          setIsLiked(data.userLikes.includes(firebase.auth().currentUser.uid));
        } else {
          setLikedByUsers([]);
          setIsLiked(false);
        }
      });

    return () => unsubscribe();
  }, [postId]);

  const handleLike = async () => {
    setIsLiked(prevIsLiked => !prevIsLiked);

    try {
      // Get the post document reference in Firestore
      const postRef = firestore().collection('posts').doc(postId);

      // Update the likesCount and likes field based on the current like status
      await postRef.update({
        likesCount: firestore.FieldValue.increment(isLiked ? -1 : 1),
        userLikes: isLiked
          ? firestore.FieldValue.arrayRemove(firebase.auth().currentUser.uid)
          : firestore.FieldValue.arrayUnion(firebase.auth().currentUser.uid),
      });
    } catch (error) {
      console.error('Error updating post likes:', error);
      // Handle the error, e.g., show an alert to the user
    }
  };

  let likeText;
  if (
    likedByUsers.length === 1 &&
    likedByUsers.includes(firebase.auth().currentUser.uid)
  ) {
    likeText = 'You liked this post';
  } else if (likedByUsers.length === 1) {
    likeText = '1 person liked this post';
  } else if (
    likedByUsers.length > 1 &&
    likedByUsers.includes(firebase.auth().currentUser.uid)
  ) {
    const othersCount = likedByUsers.length - 1;
    likeText = `You and ${othersCount} others liked this post`;
  } else {
    likeText = `${likedByUsers.length} people liked this post`;
  }

  const toggleMute = () => {
    setIsMuted(prevIsMuted => !prevIsMuted);
  };

  return (
    <View style={styles.postContainer}>
      {/* Display post content here */}
      <View style={styles.UserInfo}>
        {profilePhotoUrl && (
          <Image source={{uri: profilePhotoUrl}} style={styles.postUserImage} />
        )}
        {userName ? (
          <Text style={styles.postUser}>{userName}</Text>
        ) : (
          <Text style={styles.postUser}>{userEmail}</Text>
        )}
      </View>
      {isImage && <Image source={{uri: mediaUrl}} style={styles.postImage} />}
      {isVideo && (
        <Pressable onPress={toggleMute}>
          <Video
            source={{uri: mediaUrl}}
            style={styles.postVideo}
            resizeMode="cover"
            muted={isMuted}
          />
        </Pressable>
      )}
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{marginLeft: 20, marginTop: 10}}>
          <View style={{width: 20}}>
            <TouchableOpacity onPress={handleLike}>
              {isLiked ? (
                <Image
                  style={styles.postLike}
                  source={require('../../Assets/like.png')}
                />
              ) : (
                <Image
                  style={styles.postLike}
                  source={require('../../Assets/notLiked.png')}
                />
              )}
            </TouchableOpacity>
          </View>

          <Text style={styles.postLikesText}>{likesCount} likes</Text>
        </View>
        <View>
          <Text style={styles.likeText}>{likeText}</Text>
        </View>
      </View>
      <View>
        {userName ? (
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.postTitleUser}>{userName}</Text>
            <Text
              style={styles.postTitleText}
              numberOfLines={5}
              lineBreakMode="tail">
              {title}
            </Text>
          </View>
        ) : (
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.postTitleUser}>{userEmail}</Text>
            <Text
              style={styles.postTitleText}
              numberOfLines={5}
              lineBreakMode="tail">
              {title}
            </Text>
          </View>
        )}
        <Text style={styles.postComments}>{comments}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    marginBottom: 20,
  },
  UserInfo: {
    marginLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  postVideo: {
    width: '90%',
    aspectRatio: 16 / 9,
    alignSelf: 'center',
  },
  postImage: {
    width: '90%',
    height: 300,
    resizeMode: 'cover',
    alignSelf: 'center',
    borderRadius: 20,
  },
  postTitleUser: {
    fontSize: 15,
    // fontWeight: 'bold',
    marginTop: 10,
    marginLeft: 20,
    fontFamily: 'Poppins-Bold',
    color: 'black',
  },
  postTitleText: {
    flex: 1,
    fontSize: 15,
    marginTop: 12,
    marginLeft: 10,
    fontFamily: 'Poppins-Light',
    color: 'black',
  },
  postUser: {
    color: 'black',
    marginLeft: 10,
    fontFamily: 'Poppins-Regular',
  },
  postUserImage: {
    width: 35,
    height: 35,
    borderRadius: 50,
  },
  postLike: {
    width: 30,
    height: 30,
  },
  postLikesText: {
    fontFamily: 'Poppins-Regular',
    color: 'black',
  },
  likeText: {
    fontFamily: 'Poppins-Regular',
    marginLeft: 20,
    color: 'black',
  },
  postComments: {},
});

export default React.memo(Post);

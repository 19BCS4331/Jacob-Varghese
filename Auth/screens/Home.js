import {View, Text, Button, StyleSheet, Alert, FlatList} from 'react-native';
import React, {useState, useEffect} from 'react';
import Header from '../components/Home/Header';
import Post from '../components/Home/Post';
import firestore from '@react-native-firebase/firestore';

const Home = ({navigation}) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch posts from Firestore
    const unsubscribe = firestore()
      .collection('posts')
      .onSnapshot(querySnapshot => {
        const postsData = [];
        querySnapshot.forEach(documentSnapshot => {
          const data = documentSnapshot.data();
          postsData.push({
            // id: documentSnapshot.id,
            postId: documentSnapshot.id,
            title: data.title,
            mediaUrl: data.mediaUrl,
            fileType: data.fileType,
            userName: data.userName,
            profilePhotoUrl: data.profilePhotoUrl,
            userEmail: data.userEmail,
            likesCount: data.likesCount,
            comments: data.comments,
          });
        });
        setPosts(postsData);
      });

    return () => unsubscribe();
  }, [[]]);

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={posts}
        keyExtractor={item => item.postId}
        initialNumToRender={5} // Adjust the number based on the average visible items
        removeClippedSubviews={true}
        renderItem={({item}) => (
          <Post
            key={item.postId}
            postId={item.postId}
            title={item.title}
            mediaUrl={item.mediaUrl}
            fileType={item.fileType}
            userName={item.userName}
            profilePhotoUrl={item.profilePhotoUrl}
            userEmail={item.userEmail}
            likesCount={item.likesCount}
            comments={item.comments}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Home;

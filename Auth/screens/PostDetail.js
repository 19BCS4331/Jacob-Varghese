import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import {ScrollView} from 'react-native-virtualized-view';
import Post from '../components/Home/Post';

const PostDetail = ({route}) => {
  const {focusedPost, otherPosts} = route.params;
  const filteredPosts = otherPosts.filter(
    post => post.postId !== focusedPost.postId,
  );
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Render the focused post here
      <Image
        source={{uri: focusedPost.mediaUrl}}
        style={styles.focusedPostImage}
      />
      <Text style={styles.focusedPostTitle}>{focusedPost.title}</Text>
      Add other details about the focused post
      Render other posts in a FlatList */}
      <Post
        postId={focusedPost.postId}
        title={focusedPost.title}
        mediaUrl={focusedPost.mediaUrl}
        fileType={focusedPost.fileType}
        likesCount={focusedPost.likesCount}
        comments={focusedPost.comments}
        userName={focusedPost.userName}
        profilePhotoUrl={focusedPost.profilePhotoUrl}
        userEmail={focusedPost.userEmail}
      />
      <FlatList
        data={filteredPosts}
        keyExtractor={item => item.postId}
        renderItem={({item}) => (
          <Post
            postId={item.postId}
            title={item.title}
            mediaUrl={item.mediaUrl}
            fileType={item.fileType}
            likesCount={item.likesCount}
            comments={item.comments}
            userName={item.userName}
            profilePhotoUrl={item.profilePhotoUrl}
            userEmail={item.userEmail}
          />
        )}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  focusedPostImage: {
    width: '90%',
    height: 300,
    resizeMode: 'cover',
    borderRadius: 10,
    alignSelf: 'center',
  },
  focusedPostTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginLeft: 20,
  },
  thumbnail: {
    width: '90%',
    height: 300,
    margin: 5,
    borderRadius: 10,
    resizeMode: 'cover',
    alignSelf: 'center',
  },
});

export default PostDetail;

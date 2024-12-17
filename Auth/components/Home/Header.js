import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';

const Header = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={{fontSize: 25, fontFamily: 'Poppins-Bold', color: 'black'}}>
        Sociofy
      </Text>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity onPress={() => navigation.navigate('PostUpload')}>
          <Image
            source={require('../../Assets/addPost.png')}
            style={{width: 40, height: 40, marginRight: 10}}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image
            source={require('../../Assets/Profile.png')}
            style={{
              width: 35,
              height: 35,
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    margin: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default Header;

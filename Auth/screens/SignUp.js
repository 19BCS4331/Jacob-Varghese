import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Image,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import auth from '@react-native-firebase/auth';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signUpWithEmail = async (email, password) => {
    try {
      await auth().createUserWithEmailAndPassword(email, password);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        // colors={['#02DCED', '#003CFF']}
        colors={['lightgray', 'lightgray']}
        style={styles.backgroundGradient}
      />
      <View style={styles.LoginContainer}>
        <Image
          style={styles.Logo}
          source={require('../Assets/CurrencyX.png')}
        />
        <Text
          style={{
            alignSelf: 'center',
            zIndex: 3,
            fontSize: 25,
            fontWeight: 'bold',
            color: '#7B7B7B',
            bottom: 30,
          }}>
          Sign Up
        </Text>
        <KeyboardAvoidingView style={styles.inputs}>
          <TextInput
            style={styles.Email}
            placeholder="Email"
            placeholderTextColor="gray"
            value={email}
            onChangeText={setEmail}></TextInput>
          <TextInput
            style={styles.Password}
            placeholder="Password"
            placeholderTextColor="gray"
            value={password}
            onChangeText={setPassword}></TextInput>
        </KeyboardAvoidingView>
        <TouchableOpacity
          style={styles.LoginButton}
          onPress={() => signUpWithEmail(email, password)}>
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            colors={['#02DCED', '#003CFF']}
            style={styles.buttonGradient}>
            <Text style={{color: 'white', fontWeight: 'bold', fontSize: 15}}>
              Sign Up
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFill,
    flex: 1,
  },
  Logo: {
    height: 180,
    width: 180,
    alignSelf: 'center',
  },
  LoginContainer: {
    zIndex: 3,
    backgroundColor: '#F6F6F6',
    height: 650,
    width: '80%',
    alignSelf: 'center',
    marginTop: '20%',
    borderRadius: 50,
    elevation: 20,
  },
  inputs: {
    alignSelf: 'center',
    zIndex: 3,
    marginTop: 50,
  },
  Email: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: 260,
    height: 50,
    paddingLeft: 20,
    elevation: 5,
    color: 'black',
  },
  Password: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: 260,
    height: 50,
    marginTop: 30,
    paddingLeft: 20,
    elevation: 5,
    color: 'black',
  },
  LoginButton: {
    alignSelf: 'center',
    marginTop: 60,
  },
  buttonGradient: {
    width: 125,
    height: 42,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  OtpButtonGradient: {
    width: 180,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  OtpLoginButton: {
    alignSelf: 'center',
    marginTop: 30,
    justifyContent: 'center',
  },
});

export default SignUp;

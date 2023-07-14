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
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(user => {
      if (user) {
        // User is authenticated, save profile information
        saveProfileInfoToFirestore(user.photoURL, user.displayName);
      } else {
        // User is not authenticated
        // console.error('User is not authenticated.');
      }
    });

    // Clean up the subscriber on unmount
    return () => subscriber();
  }, []);

  const onGoogleButtonPress = async () => {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    // Get the users ID token
    const {idToken, user} = await GoogleSignin.signIn();

    await saveProfileInfoToFirestore(user.photoURL, user.displayName);

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  };

  const signInWithEmail = async (email, password) => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
      const user = auth().currentUser;
      if (user) {
        await saveProfileInfoToFirestore(
          user.photoURL,
          user.displayName,
          user.email,
        );
      } else {
        console.error('User is not authenticated.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const saveProfileInfoToFirestore = async (photoUrl, displayName) => {
    const user = auth().currentUser;

    if (user) {
      const userId = user.uid;

      try {
        await firestore()
          .collection('users')
          .doc(userId)
          .set({
            profilePhotoUrl: photoUrl || '',
            displayName: displayName || '',
            email: email || '',
          });
        console.log('Profile information saved to Firestore.');
      } catch (error) {
        console.error('Error saving profile information:', error);
      }
    } else {
      // console.error('User is not authenticated.');
    }
  };

  const navigation = useNavigation();

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
          Login
        </Text>
        <KeyboardAvoidingView style={styles.inputs}>
          <TextInput
            style={styles.usernameInput}
            placeholder="Email"
            placeholderTextColor="gray"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            secureTextEntry
            placeholderTextColor="gray"
            value={password}
            onChangeText={setPassword}
          />
        </KeyboardAvoidingView>
        <TouchableOpacity
          style={styles.LoginButton}
          onPress={() => signInWithEmail(email, password)}>
          <LinearGradient
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            colors={['#02DCED', '#003CFF']}
            style={styles.buttonGradient}>
            <Text style={{color: 'white', fontWeight: 'bold', fontSize: 18}}>
              Login
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.OtpLoginButton}
          onPress={() => onGoogleButtonPress()}>
          <Image
            source={require('../Assets/Google__G__Logo.svg.png')}
            style={{width: 25, height: 25}}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text
            style={{
              color: 'black',
              alignSelf: 'center',
              fontFamily: 'Poppins-Regular',
              marginTop: 20,
              fontSize: 15,
            }}>
            Or Sign Up
          </Text>
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
  usernameInput: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: 260,
    height: 50,
    paddingLeft: 20,
    elevation: 5,
    color: 'black',
  },
  passwordInput: {
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
    flexDirection: 'row',
  },
});

export default Login;

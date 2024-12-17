// client id = "108707396543-ifskrje9dr0th5efqjvd2kr0gvcv0di6.apps.googleusercontent.com"

// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
//   KeyboardAvoidingView,
//   TextInput,
//   Button,
//   Alert,
//   StatusBar,
//   ScrollView,
// } from 'react-native';
// import React, {useState, useEffect} from 'react';
// import {SafeAreaView} from 'react-native-safe-area-context';
// import LinearGradient from 'react-native-linear-gradient';
// import {SafeAreaProvider} from 'react-native-safe-area-context';
// import auth from '@react-native-firebase/auth';
// import {
//   GoogleSignin,
//   GoogleSigninButton,
//   statusCodes,
// } from '@react-native-google-signin/google-signin';

// // GoogleSignin.configure({
// //   webClientId: '108707396543-ifskrje9dr0th5efqjvd2kr0gvcv0di6.apps.googleusercontent.com',
// // });

// const App = () => {
//   // If null, no SMS has been sent
//   const [confirm, setConfirm] = useState(null);
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [loggedIn, setloggedIn] = useState(false);
//   const [userInfo, setuserInfo] = useState([]);

//   _signIn = async () => {
//     try {
//       await GoogleSignin.hasPlayServices();
//       const {accessToken, idToken} = await GoogleSignin.signIn();
//       setloggedIn(true);
//       const credential = auth.GoogleAuthProvider.credential(
//         idToken,
//         accessToken,
//       );
//       await auth().signInWithCredential(credential);
//     } catch (error) {
//       if (error.code === statusCodes.SIGN_IN_CANCELLED) {
//         // user cancelled the login flow
//         Alert('Cancel');
//       } else if (error.code === statusCodes.IN_PROGRESS) {
//         Alert('Signin in progress');
//         // operation (f.e. sign in) is in progress already
//       } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
//         Alert('PLAY_SERVICES_NOT_AVAILABLE');
//         // play services not available or outdated
//       } else {
//         // some other error happened
//       }
//     }
//   };

//   useEffect(() => {
//     GoogleSignin.configure({
//       scopes: ['email'], // what API you want to access on behalf of the user, default is email and profile
//       webClientId:
//         '108707396543-ifskrje9dr0th5efqjvd2kr0gvcv0di6.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
//       offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
//     });
//   }, []);

//   signOut = async () => {
//     try {
//       await GoogleSignin.revokeAccess();
//       await GoogleSignin.signOut();
//       setloggedIn(false);
//       setuserInfo([]);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   // verification code (OTP - One-Time-Passcode)
//   //   const [code, setCode] = useState('');

//   //   // Handle login
//   //   function onAuthStateChanged(user) {
//   //     if (user) {
//   //       // Some Android devices can automatically process the verification code (OTP) message, and the user would NOT need to enter the code.
//   //       // Actually, if he/she tries to enter it, he/she will get an error message because the code was already used in the background.
//   //       // In this function, make sure you hide the component(s) for entering the code and/or navigate away from this screen.
//   //       // It is also recommended to display a message to the user informing him/her that he/she has successfully logged in.
//   //       // Alert.alert('Otp Confirmed', 'Welcome To CurrencyX');
//   //     }
//   //   }

//   //   useEffect(() => {
//   //     const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
//   //     return subscriber; // unsubscribe on unmount
//   //   }, []);

//   //   // Handle the button press
//   //   async function signInWithPhoneNumber() {
//   //     const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
//   //     setConfirm(confirmation);
//   //   }

//   //   async function confirmCode() {
//   //     try {
//   //       await confirm.confirm(code);
//   //       setConfirm(null);
//   //     } catch (error) {
//   //       console.log('Invalid code.');
//   //     }
//   //   }

//   //   if (!confirm) {
//   //     return (
//   //       <SafeAreaProvider>
//   //         <SafeAreaView style={styles.container}>
//   //           {/* <Button
//   //             title="Phone Number Sign In"
//   //             onPress={() => signInWithPhoneNumber}
//   //           /> */}
//   //           <LinearGradient
//   //             // colors={['#02DCED', '#003CFF']}
//   //             colors={['lightgray', 'lightgray']}
//   //             style={styles.backgroundGradient}
//   //           />
//   //           <View style={styles.LoginContainer}>
//   //             <Image
//   //               style={styles.Logo}
//   //               source={require('./Assets/CurrencyX.png')}
//   //             />
//   //             <Text
//   //               style={{
//   //                 alignSelf: 'center',
//   //                 zIndex: 3,
//   //                 fontSize: 25,
//   //                 fontWeight: 'bold',
//   //                 color: '#7B7B7B',
//   //                 bottom: 30,
//   //               }}>
//   //               Login
//   //             </Text>
//   //             <KeyboardAvoidingView style={styles.inputs}>
//   //               <TextInput
//   //                 style={styles.usernameInput}
//   //                 value={phoneNumber}
//   //                 onChangeText={text => setPhoneNumber(text)}
//   //                 placeholder="Enter phone number"
//   //                 placeholderTextColor="gray"
//   //               />
//   //               {/* <TextInput
//   //                 style={styles.passwordInput}
//   //                 placeholder="Password"
//   //                 secureTextEntry
//   //                 placeholderTextColor="gray"
//   //               /> */}
//   //             </KeyboardAvoidingView>
//   //             <TouchableOpacity
//   //               style={styles.LoginButton}
//   //               onPress={signInWithPhoneNumber}>
//   //               <LinearGradient
//   //                 start={{x: 0, y: 0}}
//   //                 end={{x: 1, y: 0}}
//   //                 colors={['#02DCED', '#003CFF']}
//   //                 style={styles.buttonGradient}>
//   //                 <Text
//   //                   style={{color: 'white', fontWeight: 'bold', fontSize: 18}}>
//   //                   Send OTP
//   //                 </Text>
//   //               </LinearGradient>
//   //             </TouchableOpacity>
//   //           </View>
//   //         </SafeAreaView>
//   //       </SafeAreaProvider>
//   //     );
//   //   }

//   //   return (
//   //     <SafeAreaProvider>
//   //       <SafeAreaView style={styles.container}>
//   //         <LinearGradient
//   //           // colors={['#02DCED', '#003CFF']}
//   //           colors={['lightgray', 'lightgray']}
//   //           style={styles.backgroundGradient}
//   //         />
//   //         <View style={styles.LoginContainer}>
//   //           <Image
//   //             style={styles.Logo}
//   //             source={require('./Assets/CurrencyX.png')}
//   //           />
//   //           <Text
//   //             style={{
//   //               alignSelf: 'center',
//   //               zIndex: 3,
//   //               fontSize: 25,
//   //               fontWeight: 'bold',
//   //               color: '#7B7B7B',
//   //               bottom: 30,
//   //             }}>
//   //             Confirm OTP
//   //           </Text>
//   //           <KeyboardAvoidingView style={styles.inputs}>
//   //             <TextInput
//   //               style={styles.usernameInput}
//   //               placeholder="OTP"
//   //               placeholderTextColor="gray"
//   //               value={code}
//   //               onChangeText={text => setCode(text)}
//   //             />
//   //             {/* <TextInput
//   //               style={styles.passwordInput}
//   //               placeholder="Password"
//   //               secureTextEntry
//   //               placeholderTextColor="gray"
//   //             /> */}
//   //           </KeyboardAvoidingView>
//   //           <TouchableOpacity
//   //             style={styles.LoginButton}
//   //             onPress={() => confirmCode()}>
//   //             <LinearGradient
//   //               start={{x: 0, y: 0}}
//   //               end={{x: 1, y: 0}}
//   //               colors={['#02DCED', '#003CFF']}
//   //               style={styles.buttonGradient}>
//   //               <Text style={{color: 'white', fontWeight: 'bold', fontSize: 18}}>
//   //                 Confirm
//   //               </Text>
//   //             </LinearGradient>
//   //           </TouchableOpacity>
//   //         </View>
//   //       </SafeAreaView>
//   //     </SafeAreaProvider>
//   //   );
//   // };
//   return (
//     <>
//       <StatusBar barStyle="dark-content" />
//       <SafeAreaView>
//         <ScrollView
//           contentInsetAdjustmentBehavior="automatic"
//           style={styles.scrollView}>
//           <View style={styles.body}>
//             <View style={styles.sectionContainer}>
//               <GoogleSigninButton
//                 style={{width: 192, height: 48}}
//                 size={GoogleSigninButton.Size.Wide}
//                 color={GoogleSigninButton.Color.Dark}
//                 onPress={this._signIn}
//               />
//             </View>
//             <View style={styles.buttonContainer}>
//               {!loggedIn && <Text>You are currently logged out</Text>}
//               {loggedIn && (
//                 <Button
//                   onPress={this.signOut}
//                   title="LogOut"
//                   color="red"></Button>
//               )}
//             </View>
//           </View>
//         </ScrollView>
//       </SafeAreaView>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   backgroundGradient: {
//     ...StyleSheet.absoluteFill,
//     flex: 1,
//   },
//   Logo: {
//     height: 180,
//     width: 180,
//     alignSelf: 'center',
//   },
//   LoginContainer: {
//     zIndex: 3,
//     backgroundColor: '#F6F6F6',
//     height: 650,
//     width: '80%',
//     alignSelf: 'center',
//     marginTop: '20%',
//     borderRadius: 50,
//     elevation: 20,
//   },
//   inputs: {
//     alignSelf: 'center',
//     zIndex: 3,
//     marginTop: 50,
//   },
//   usernameInput: {
//     backgroundColor: 'white',
//     borderRadius: 10,
//     width: 260,
//     height: 50,
//     paddingLeft: 20,
//     elevation: 5,
//     color: 'black',
//   },
//   passwordInput: {
//     backgroundColor: 'white',
//     borderRadius: 10,
//     width: 260,
//     height: 50,
//     marginTop: 30,
//     paddingLeft: 20,
//     elevation: 5,
//     color: 'black',
//   },
//   LoginButton: {
//     alignSelf: 'center',
//     marginTop: 60,
//   },
//   buttonGradient: {
//     width: 125,
//     height: 42,
//     borderRadius: 50,
//     alignItems: 'center',
//     justifyContent: 'center',
//     elevation: 5,
//   },
//   OtpButtonGradient: {
//     width: 180,
//     height: 42,
//     borderRadius: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//     elevation: 5,
//   },
//   OtpLoginButton: {
//     alignSelf: 'center',
//     marginTop: 30,
//     justifyContent: 'center',
//   },
// });

// export default App;

import {GoogleSignin} from '@react-native-google-signin/google-signin';
import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
import Login from './screens/Login';
import Home from './screens/Home';
import SignUp from './screens/SignUp';
import PostUploadScreen from './screens/PostUploadScreen';
import Profile from './screens/Profile';
import PostDetail from './screens/PostDetail';
import Settings from './screens/Settings';
// import 'react-native-gesture-handler';

const AuthStack = createStackNavigator();
const AppStack = createStackNavigator();

const AuthStackScreens = () => (
  <AuthStack.Navigator screenOptions={{headerShown: false}}>
    <AuthStack.Screen name="Login" component={Login} />
    <AuthStack.Screen name="SignUp" component={SignUp} />
  </AuthStack.Navigator>
);

const AppStackScreens = () => (
  <AppStack.Navigator screenOptions={{headerShown: false}}>
    <AppStack.Screen name="Home" component={Home} />
    <AppStack.Screen name="PostUpload" component={PostUploadScreen} />
    <AppStack.Screen name="Profile" component={Profile} />
    <AppStack.Screen name="PostDetail" component={PostDetail} />
    <AppStack.Screen name="Settings" component={Settings} />
    {/* Add more screens for the authenticated app flow */}
  </AppStack.Navigator>
);

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  GoogleSignin.configure({
    webClientId:
      '108707396543-p51kji5rel2fu22r2an3dsid1s64psi1.apps.googleusercontent.com',
  });

  return (
    <NavigationContainer>
      {user ? <AppStackScreens /> : <AuthStackScreens />}
    </NavigationContainer>
  );
};

export default App;

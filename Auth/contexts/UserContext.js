import React, {createContext, useState, useEffect} from 'react';
import {firebase} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Create the user context
export const UserContext = createContext();

// Create a user context provider component
export const UserProvider = ({children}) => {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const currentUser = firebase.auth().currentUser;
    if (currentUser) {
      // Fetch the user profile data from Firestore
      firestore()
        .collection('users')
        .doc(currentUser.uid)
        .get()
        .then(snapshot => {
          if (snapshot.exists) {
            const data = snapshot.data();
            setUserProfile(data);
          }
        })
        .catch(error => {
          console.error('Error fetching user profile:', error);
        });
    }
  }, []);
  return (
    <UserContext.Provider value={{userProfile, setUserProfile}}>
      {children}
    </UserContext.Provider>
  );
};

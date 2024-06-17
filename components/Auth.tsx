import React, { useEffect } from 'react';
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from '@react-native-google-signin/google-signin';
import { Image, StyleSheet, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import { useNavigation } from '@react-navigation/native';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {auth} from './Firebase'
// Configure Google Sign-in
GoogleSignin.configure({
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    webClientId: '1034501321129-jodmq0s1l64hap0n12jg3l2mf5kh46l3.apps.googleusercontent.com',
});

export default function SignInScreen() {
    type SignInScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Auth'>;
    const navigation = useNavigation<SignInScreenNavigationProp>();

    const handleGoogleSignIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            const idToken = await GoogleSignin.getTokens();

            const credential = GoogleAuthProvider.credential(idToken.idToken);
            await signInWithCredential(auth, credential);

            console.log(JSON.stringify(userInfo, null, 2));

            // Check if user has registered their information
            const currentUser = auth.currentUser;
            if (currentUser) {
                const userId = currentUser.uid;
                const userDoc = await firestore().collection('users').doc(userId).get();

                if (userDoc.exists) {
                    // User has already registered their information
                    const userData = userDoc.data();
                    navigation.navigate('Events');
                } else {
                    // User has not registered their information
                    navigation.navigate('Home');
                }
            } else {
                // No user signed in
                console.log('No user is signed in!');
            }
        } catch (error: any) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // User cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // Operation (e.g. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // Play services not available or outdated
            } else {
                // Some other error happened
                console.error(error);
            }
        }
    };

    return (
        <View style={styles.container}>
            <Image
                style={styles.logo}
                source={require('./images.jpeg')}
                resizeMode="contain"
            />
            <GoogleSigninButton
                style={styles.googleButton}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={handleGoogleSignIn}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    logo: {
        width: '70%',
        maxHeight: 200,
        marginBottom: 50,
    },
    googleButton: {
        width: '100%',
        height: 48,
        marginTop: 20,
    },
});





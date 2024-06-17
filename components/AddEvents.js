import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';
import CountrySelectDropdown from 'react-native-searchable-country-dropdown';
import firestore from '@react-native-firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

function AddEvents() {
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [userName, setUserName] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = getAuth().currentUser;

        if (currentUser) {
          const userId = currentUser.uid;

          // Fetch user document to get the name and country code
          const userDoc = await firestore().collection('users').doc(userId).get();

          if (userDoc.exists) {
            setUserName(userDoc.data().name);
          } else {
            console.log('No such document for user!');
          }
        } else {
          console.log('No user is signed in!');
        }
      } catch (error) {
        console.error('Error fetching user data: ', error);
      }
    };

    fetchUserData();
  }, []); // Fetch user data only once when component mounts

  const saveEvent = async () => {
    try {
      const currentUser = getAuth().currentUser;

      if (currentUser) {
        // Fetch user document again to ensure latest data
        const userId = currentUser.uid;
        const userDoc = await firestore().collection('users').doc(userId).get();

        if (userDoc.exists) {
          const { name, countryCode } = userDoc.data();

          // Save event associated with the selected country code and user's name
          await firestore().collection('countries').doc(countryCode).collection('events').add({
            eventName: eventName,
            eventDescription: eventDescription,
            createdBy: name, // Use user's name instead of userId
            createdAt: firestore.FieldValue.serverTimestamp(),
          });

          alert('Event saved successfully!');
          navigation.goBack(); // Navigate back after saving
        } else {
          console.log('No such document for user!');
        }
      } else {
        console.log('No user is signed in!');
      }
    } catch (error) {
      console.error('Error saving event: ', error);
      alert('Error saving event: ' + error.message);
    }
  };

  const cancelAddEvent = () => {
    navigation.goBack(); // Navigate back to previous screen (Events screen)
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Event</Text>
      <TextInput
        style={styles.input}
        placeholder="Event Name"
        value={eventName}
        onChangeText={setEventName}
      />
      <TextInput
        style={[styles.input, styles.multilineInput]}
        placeholder="Event Description"
        multiline
        numberOfLines={4}
        value={eventDescription}
        onChangeText={setEventDescription}
      />
      <CountrySelectDropdown
        fontFamily="Nunito-Regular"
        textColor="#000000"
        countrySelect={(country) => setCountryCode(country)}
        placeholder="Select Country"
        containerStyle={styles.dropdown}
      />
      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <Button title="Save Event" onPress={saveEvent} />
        </View>
        <View style={styles.buttonWrapper}>
          <Button title="Cancel" onPress={cancelAddEvent} color="#FF0000" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    fontSize: 16,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  dropdown: {
    width: '100%',
    marginBottom: 0,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 150,
  },
  buttonWrapper: {
    width: '40%', // Adjust width as needed
  },
});

export default AddEvents;

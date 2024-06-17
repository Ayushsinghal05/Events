import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useAuth } from './AuthContext';
import Icon from 'react-native-vector-icons/Ionicons'; // Import Icon from react-native-vector-icons

function Events() {
  const [userData, setUserData] = useState(null); // State to hold user data
  const [events, setEvents] = useState([]); // State to hold events
  const navigation = useNavigation();
  const isFocused = useIsFocused(); // Hook to check if screen is focused
  const { user, handleLogout } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = getAuth().currentUser;

        if (currentUser) {
          const userId = currentUser.uid;

          // Fetch user document from Firestore
          const userDoc = await firestore().collection('users').doc(userId).get();

          if (userDoc.exists) {
            // Set user data in state
            setUserData(userDoc.data());
            fetchEvents(userDoc.data().countryCode); // Fetch events based on user's country code
          } else {
            console.log('No such document!');
          }
        } else {
          console.log('No user is signed in!');
        }
      } catch (error) {
        console.error('Error fetching user data: ', error);
      }
    };

    fetchUserData();
  }, [isFocused]); // Fetch user data when screen is focused

  const fetchEvents = async (countryCode) => {
    try {
      const eventsRef = firestore().collection('countries').doc(countryCode).collection('events');
      const snapshot = await eventsRef.get();

      if (snapshot.empty) {
        console.log('No events found.');
        setEvents([]);
        return;
      }

      let eventsData = [];
      snapshot.forEach((doc) => {
        eventsData.push({ id: doc.id, ...doc.data() });
      });
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching events: ', error);
    }
  };

  const navigateToAddEvents = () => {
    navigation.navigate('AddEvents');
  };

  const navigateToSettings = () => {
    navigation.navigate('Home');
  };

  const handleLogoutPress = async () => {
    await handleLogout(); // Call handleLogout function from AuthContext
    // Optionally, navigate to login or home screen after logout
    navigation.navigate("Auth");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Events in {userData?.countryCode}</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.settingsButton} onPress={navigateToSettings}>
            <Icon name="settings-outline" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutPress}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* User Info */}
      {userData ? (
        <View style={styles.userInfo}>
          <Text style={styles.userInfoText}>Name: {userData.name}</Text>
          <Text style={styles.userInfoText}>Country: {userData.countryCode}</Text>
          <Text style={styles.userInfoText}>Age: {userData.age}</Text>
        </View>
      ) : (
        <Text>Loading user data...</Text>
      )}

      {/* Events List */}
      <FlatList
        style={styles.list}
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.eventItem}>
            <Text style={styles.eventName}>{item.eventName}</Text>
            <Text style={styles.eventDescription}>{item.eventDescription}</Text>
            <Text style={styles.eventCreatedBy}>Created By: {item.createdBy}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No events found.</Text>}
      />

      {/* Button to Add Events */}
      <TouchableOpacity style={styles.addButton} onPress={navigateToAddEvents}>
        <Text style={styles.buttonText}>Add Events</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsButton: {
    marginRight: 10,
  },
  logoutButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#dc3545',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
  },
  userInfo: {
    marginBottom: 20,
  },
  userInfoText: {
    fontSize: 18,
    marginBottom: 5,
  },
  list: {
    flex: 1,
    width: '100%',
  },
  eventItem: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    padding: 10,
    borderRadius: 5,
  },
  eventName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventDescription: {
    fontSize: 14,
    marginTop: 5,
  },
  eventCreatedBy: {
    fontSize: 12,
    color: 'gray',
    marginTop: 5,
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default Events;

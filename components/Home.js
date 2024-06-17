import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import CountrySelectDropdown from "react-native-searchable-country-dropdown";
import firestore from '@react-native-firebase/firestore';
import { getAuth } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';
import { useAuth } from './AuthContext';

function Home() {
  const [countryCode, setCountryCode] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [userId, setUserId] = useState(null);
  const navigation = useNavigation();
  const { user, handleLogout } = useAuth();

  useEffect(() => {
    const currentUser = getAuth().currentUser;
    if (currentUser) {
      setUserId(currentUser.uid);
      fetchUserData(currentUser.uid);
    } else {
      // Handle the case where the user is not authenticated
      alert('No user is signed in!');
    }
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const userDoc = await firestore().collection('users').doc(userId).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        setName(userData.name || "");
        setAge(userData.age || "");
        setCountryCode(userData.countryCode || "");
      } else {
        console.log('No such document for user!');
      }
    } catch (error) {
      console.error('Error fetching user data: ', error);
    }
  };

  const handleSetCountryCode = (country) => {
    setCountryCode(country);
  };

  const handleSaveToFirestore = async () => {
    if (!userId) {
      alert('No user is signed in!');
      return;
    }

    try {
      await firestore().collection('users').doc(userId).set({
        name: name,
        age: age,
        countryCode: countryCode
      });
      alert('User information saved successfully!');
      navigation.navigate('Events');
    } catch (error) {
      alert('Error saving user information: ' + error.message);
    }
  };

  const handleLogoutPress = async () => {
    await handleLogout(); // Call handleLogout function from AuthContext
    // Optionally, navigate to login or home screen after logout
    navigation.navigate("Auth");
  };

  return (
    <View style={styles.container}>
      {/* Sign Out Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutPress}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Welcome to the Home Screen!</Text>

        {/* Input for Name */}
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />

        {/* Input for Age */}
        <TextInput
          style={styles.input}
          placeholder="Enter your age"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />

        {/* Country Select Dropdown */}
        <CountrySelectDropdown
          fontFamily={"Nunito-Regular"}
          textColor={"#000000"}
          countrySelect={handleSetCountryCode}
          placeholder="Select Country"
          containerStyle={styles.dropdown}
          defaultValue={countryCode} // Set the default value to the selected country code
        />

        {/* Selected Country Code Display */}
        {countryCode !== "" && (
          <Text style={styles.selectedCountryText}>
            Selected Country Code: {countryCode}
          </Text>
        )}

        {/* Button to Save Information */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveToFirestore}>
          <Text style={styles.buttonText}>Save Information</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 70,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    position: "relative",
  },
  content: {
    flex: 1,
    marginTop: 20, // Add top margin to move content down
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
  },
  dropdown: {
    width: '100%',
    marginBottom: 20,
  },
  selectedCountryText: {
    fontSize: 18,
    color: "#000000",
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
  logoutButton: {
    position: "absolute",
    top: 40,
    right: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#dc3545",
    zIndex: 1, // Ensure it's above other content
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default Home;



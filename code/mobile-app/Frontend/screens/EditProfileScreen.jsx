import Constants from 'expo-constants'; 
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditProfile = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    contact: '',
    age: '',
  });
  const { LOCALHOST, DEPLOYED_URL } = Constants.expoConfig.extra;    // 2. Get environment variables from app.config.js
  const API_URL = DEPLOYED_URL||LOCALHOST ;
  const [errors, setErrors] = useState({});

  // Load user profile on component mount
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        navigation.navigate('Login');
        return;
      }

      console.log(`Fetching profile from: ${API_URL}/api/users/doctor/profile`);
      
      const response = await fetch(`${API_URL}/api/users/doctor/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Response status:', response.status);

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.log('Non-JSON response:', text);
        Alert.alert('Error', 'Unable to fetch profile. Please try again later.');
        return;
      }

      const data = await response.json();
      
      if (response.ok && data.success) {
        const doctorData = data.doctor;
        setUser(doctorData);
        setFormData({
          name: doctorData?.name || '',
          specialty: doctorData?.specialty || '',
          contact: doctorData?.contact || '',
          age: doctorData?.age ? doctorData.age.toString() : '',
        });
      } else {
        Alert.alert('Error', data.message || 'Failed to load profile');
        if (response.status === 401) {
          navigation.navigate('Login');
        }
      }
    } catch (error) {
      console.error('Load profile error:', error);
      Alert.alert('Error', 'Failed to load profile. Please try again.');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Basic validation
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.specialty.trim()) newErrors.specialty = 'Specialty is required';
    if (!formData.contact.trim()) newErrors.contact = 'Contact is required';

    // Contact validation (10 digits)
    if (formData.contact && !/^\d{10}$/.test(formData.contact)) {
      newErrors.contact = 'Contact number must be exactly 10 digits';
    }

    // Age validation
    if (formData.age) {
      const age = parseInt(formData.age);
      if (isNaN(age) || age < 18 || age > 100) {
        newErrors.age = 'Age must be between 18 and 100';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors and try again.');
      return;
    }

    setIsLoading(true);
    
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        navigation.navigate('Login');
        return;
      }

      // Prepare update data - only include fields that have values
      const updateData = {};
      if (formData.name.trim()) updateData.name = formData.name.trim();
      if (formData.specialty.trim()) updateData.specialty = formData.specialty.trim();
      if (formData.contact.trim()) updateData.contact = formData.contact.trim();
      if (formData.age && formData.age.trim()) updateData.age = parseInt(formData.age);

      console.log(`Updating profile at: ${API_URL}/api/users/doctor/profile`);
      console.log('Update data:', updateData);

      const response = await fetch(`${API_URL}/api/users/doctor/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      console.log('Update response status:', response.status);

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.log('Non-JSON response:', text);
        Alert.alert('Error', 'Update failed. Please try again later.');
        return;
      }

      const data = await response.json();
      
      if (response.ok && data.success) {
        Alert.alert('Success', 'Profile updated successfully!', [
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack();
            },
          },
        ]);
      } else {
        Alert.alert('Error', data.message || 'Failed to update profile');
        if (response.status === 401) {
          navigation.navigate('Login');
        }
      }
    } catch (error) {
      console.error('Update profile error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderInput = (field, placeholder, icon, options = {}) => {
    const {
      keyboardType = 'default',
      multiline = false,
      editable = true,
    } = options;

    return (
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{placeholder}</Text>
        
        <View style={styles.inputWrapper}>
          <Ionicons name={icon} size={20} color="#10e0f8" style={styles.inputIcon} />
          <TextInput
            style={[
              styles.input,
              multiline && styles.multilineInput,
              errors[field] && styles.inputError,
            ]}
            value={formData[field]}
            onChangeText={(value) => handleChange(field, value)}
            placeholder={placeholder}
            keyboardType={keyboardType}
            multiline={multiline}
            editable={editable}
            placeholderTextColor="#8fb1cc"
            autoCapitalize="sentences"
            autoCorrect={false}
          />
        </View>
        
        {errors[field] && (
          <Text style={styles.errorText}>{errors[field]}</Text>
        )}
      </View>
    );
  };

  if (isLoadingProfile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10e0f8" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#465a6e" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {user && (
            <View style={styles.userInfo}>
              <Text style={styles.userInfoTitle}>Doctor Information</Text>
              <Text style={styles.userInfoText}>Email: {user.email}</Text>
              <Text style={styles.userInfoText}>ID: {user.id}</Text>
            </View>
          )}

          {renderInput('name', 'Full Name', 'person')}
          
          {renderInput('specialty', 'Specialty', 'medical')}
          
          {renderInput('contact', 'Contact Number', 'call', {
            keyboardType: 'phone-pad',
          })}
          
          {renderInput('age', 'Age', 'calendar', {
            keyboardType: 'numeric',
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#465a6e',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#465a6e',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#10e0f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#465a6e',
    borderBottomWidth: 1,
    borderBottomColor: '#34495e',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  userInfo: {
    backgroundColor: '#2c3e50',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#34495e',
  },
  userInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10e0f8',
    marginBottom: 10,
  },
  userInfoText: {
    fontSize: 14,
    color: '#a0c9e8',
    marginBottom: 5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#34495e',
    borderRadius: 12,
    backgroundColor: '#2c3e50',
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#fff',
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#ff6b6b',
  },
  inputIcon: {
    marginRight: 10,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 12,
    marginTop: 5,
  },
  footer: {
    padding: 20,
    backgroundColor: '#465a6e',
    borderTopWidth: 1,
    borderTopColor: '#34495e',
  },
  saveButton: {
    backgroundColor: '#10e0f8',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#6c757d',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditProfile;
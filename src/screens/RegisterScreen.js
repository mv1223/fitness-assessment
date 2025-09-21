import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../utils/theme';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, VALIDATION_RULES } from '../utils/constants';

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return false;
    }
    if (!formData.email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return false;
    }
    if (!formData.email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    if (!formData.username.trim()) {
      Alert.alert('Error', 'Please enter a username');
      return false;
    }
    if (formData.username.length < VALIDATION_RULES.MIN_USERNAME_LENGTH) {
      Alert.alert('Error', `Username must be at least ${VALIDATION_RULES.MIN_USERNAME_LENGTH} characters long`);
      return false;
    }
    if (!formData.password.trim()) {
      Alert.alert('Error', 'Please enter a password');
      return false;
    }
    if (formData.password.length < VALIDATION_RULES.MIN_PASSWORD_LENGTH) {
      Alert.alert('Error', `Password must be at least ${VALIDATION_RULES.MIN_PASSWORD_LENGTH} characters long`);
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    if (!formData.age.trim()) {
      Alert.alert('Error', 'Please enter your age');
      return false;
    }
    const age = parseInt(formData.age);
    if (age < VALIDATION_RULES.MIN_AGE || age > VALIDATION_RULES.MAX_AGE) {
      Alert.alert('Error', `Age must be between ${VALIDATION_RULES.MIN_AGE} and ${VALIDATION_RULES.MAX_AGE} years`);
      return false;
    }
    if (!formData.gender.trim()) {
      Alert.alert('Error', 'Please select your gender');
      return false;
    }
    if (!formData.height.trim()) {
      Alert.alert('Error', 'Please enter your height');
      return false;
    }
    const height = parseInt(formData.height);
    if (height < VALIDATION_RULES.MIN_HEIGHT || height > VALIDATION_RULES.MAX_HEIGHT) {
      Alert.alert('Error', `Height must be between ${VALIDATION_RULES.MIN_HEIGHT} and ${VALIDATION_RULES.MAX_HEIGHT} cm`);
      return false;
    }
    if (!formData.weight.trim()) {
      Alert.alert('Error', 'Please enter your weight');
      return false;
    }
    const weight = parseInt(formData.weight);
    if (weight < VALIDATION_RULES.MIN_WEIGHT || weight > VALIDATION_RULES.MAX_WEIGHT) {
      Alert.alert('Error', `Weight must be between ${VALIDATION_RULES.MIN_WEIGHT} and ${VALIDATION_RULES.MAX_WEIGHT} kg`);
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert('Success', SUCCESS_MESSAGES.REGISTRATION_SUCCESS);
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Error', ERROR_MESSAGES.NETWORK_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const genderOptions = ['Male', 'Female', 'Other'];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
      
      <LinearGradient
        colors={theme.colors.gradients.primary}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join the SAI Fitness Assessment platform</Text>
            </View>

            {/* Registration Form */}
            <View style={styles.formContainer}>
              {/* Personal Information */}
              <Text style={styles.sectionTitle}>Personal Information</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Full Name *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(value) => handleInputChange('name', value)}
                  placeholder="Enter your full name"
                  placeholderTextColor={theme.colors.placeholder}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email Address *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  placeholder="Enter your email"
                  placeholderTextColor={theme.colors.placeholder}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Username *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.username}
                  onChangeText={(value) => handleInputChange('username', value)}
                  placeholder="Choose a username"
                  placeholderTextColor={theme.colors.placeholder}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {/* Account Security */}
              <Text style={styles.sectionTitle}>Account Security</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password *</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    value={formData.password}
                    onChangeText={(value) => handleInputChange('password', value)}
                    placeholder="Create a password"
                    placeholderTextColor={theme.colors.placeholder}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Text style={styles.eyeText}>
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirm Password *</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    value={formData.confirmPassword}
                    onChangeText={(value) => handleInputChange('confirmPassword', value)}
                    placeholder="Confirm your password"
                    placeholderTextColor={theme.colors.placeholder}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Text style={styles.eyeText}>
                      {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Physical Information */}
              <Text style={styles.sectionTitle}>Physical Information</Text>
              
              <View style={styles.row}>
                <View style={[styles.inputContainer, { flex: 1, marginRight: theme.spacing.sm }]}>
                  <Text style={styles.label}>Age *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.age}
                    onChangeText={(value) => handleInputChange('age', value)}
                    placeholder="Age"
                    placeholderTextColor={theme.colors.placeholder}
                    keyboardType="numeric"
                  />
                </View>
                
                <View style={[styles.inputContainer, { flex: 1, marginLeft: theme.spacing.sm }]}>
                  <Text style={styles.label}>Gender *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.gender}
                    onChangeText={(value) => handleInputChange('gender', value)}
                    placeholder="Gender"
                    placeholderTextColor={theme.colors.placeholder}
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.inputContainer, { flex: 1, marginRight: theme.spacing.sm }]}>
                  <Text style={styles.label}>Height (cm) *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.height}
                    onChangeText={(value) => handleInputChange('height', value)}
                    placeholder="Height"
                    placeholderTextColor={theme.colors.placeholder}
                    keyboardType="numeric"
                  />
                </View>
                
                <View style={[styles.inputContainer, { flex: 1, marginLeft: theme.spacing.sm }]}>
                  <Text style={styles.label}>Weight (kg) *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.weight}
                    onChangeText={(value) => handleInputChange('weight', value)}
                    placeholder="Weight"
                    placeholderTextColor={theme.colors.placeholder}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              {/* Terms and Conditions */}
              <View style={styles.termsContainer}>
                <Text style={styles.termsText}>
                  By creating an account, you agree to our Terms of Service and Privacy Policy.
                </Text>
              </View>

              {/* Register Button */}
              <TouchableOpacity
                style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
                onPress={handleRegister}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={theme.colors.gradients.secondary}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.registerButtonText}>
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Login Link */}
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity onPress={handleLogin}>
                  <Text style={styles.loginLink}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#E5E7EB',
    textAlign: 'center',
    lineHeight: 24,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.roundness,
    padding: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  inputContainer: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: theme.roundness,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: 16,
    color: theme.colors.text,
    ...theme.shadows.small,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: theme.roundness,
    paddingHorizontal: theme.spacing.md,
    ...theme.shadows.small,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    fontSize: 16,
    color: theme.colors.text,
  },
  eyeButton: {
    padding: theme.spacing.sm,
  },
  eyeText: {
    fontSize: 20,
  },
  row: {
    flexDirection: 'row',
  },
  termsContainer: {
    marginBottom: theme.spacing.lg,
  },
  termsText: {
    fontSize: 12,
    color: '#E5E7EB',
    lineHeight: 18,
    textAlign: 'center',
  },
  registerButton: {
    borderRadius: theme.roundness,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  buttonGradient: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.roundness,
    alignItems: 'center',
  },
  registerButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: '#E5E7EB',
  },
  loginLink: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;

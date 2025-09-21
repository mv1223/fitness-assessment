import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  StatusBar,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../utils/theme';
import { PERFORMANCE_LEVELS } from '../utils/constants';

const { width } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState({
    name: 'Athlete Name',
    email: 'athlete@example.com',
    age: 18,
    gender: 'Male',
    height: 170,
    weight: 70,
    level: 'Intermediate',
    totalTests: 5,
    averageScore: 78,
    bestScore: 92,
    worstScore: 65,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    setEditData(userData);
  }, [userData]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setUserData(editData);
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleCancel = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => navigation.navigate('Welcome') },
      ]
    );
  };

  const getPerformanceColor = (score) => {
    if (score >= 90) return theme.colors.success;
    if (score >= 80) return theme.colors.info;
    if (score >= 70) return theme.colors.warning;
    if (score >= 60) return theme.colors.error;
    return theme.colors.placeholder;
  };

  const getPerformanceIcon = (score) => {
    if (score >= 90) return '🏆';
    if (score >= 80) return '🥇';
    if (score >= 70) return '🥈';
    if (score >= 60) return '🥉';
    return '📊';
  };

  const renderProfileHeader = () => (
    <View style={styles.profileHeader}>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>
          {userData.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <Text style={styles.userName}>{userData.name}</Text>
      <Text style={styles.userEmail}>{userData.email}</Text>
      <Text style={styles.userLevel}>{userData.level}</Text>
    </View>
  );

  const renderStats = () => (
    <View style={styles.statsContainer}>
      <Text style={styles.sectionTitle}>Performance Stats</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{userData.totalTests}</Text>
          <Text style={styles.statLabel}>Tests Completed</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{userData.averageScore}%</Text>
          <Text style={styles.statLabel}>Average Score</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{userData.bestScore}%</Text>
          <Text style={styles.statLabel}>Best Score</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{userData.worstScore}%</Text>
          <Text style={styles.statLabel}>Worst Score</Text>
        </View>
      </View>
    </View>
  );

  const renderPersonalInfo = () => (
    <View style={styles.personalInfoContainer}>
      <Text style={styles.sectionTitle}>Personal Information</Text>
      
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Name</Text>
        {isEditing ? (
          <TextInput
            style={styles.infoInput}
            value={editData.name}
            onChangeText={(value) => handleInputChange('name', value)}
            placeholder="Enter your name"
          />
        ) : (
          <Text style={styles.infoValue}>{userData.name}</Text>
        )}
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Email</Text>
        {isEditing ? (
          <TextInput
            style={styles.infoInput}
            value={editData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            placeholder="Enter your email"
            keyboardType="email-address"
          />
        ) : (
          <Text style={styles.infoValue}>{userData.email}</Text>
        )}
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Age</Text>
        {isEditing ? (
          <TextInput
            style={styles.infoInput}
            value={editData.age.toString()}
            onChangeText={(value) => handleInputChange('age', parseInt(value) || 0)}
            placeholder="Enter your age"
            keyboardType="numeric"
          />
        ) : (
          <Text style={styles.infoValue}>{userData.age} years</Text>
        )}
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Gender</Text>
        {isEditing ? (
          <TextInput
            style={styles.infoInput}
            value={editData.gender}
            onChangeText={(value) => handleInputChange('gender', value)}
            placeholder="Enter your gender"
          />
        ) : (
          <Text style={styles.infoValue}>{userData.gender}</Text>
        )}
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Height</Text>
        {isEditing ? (
          <TextInput
            style={styles.infoInput}
            value={editData.height.toString()}
            onChangeText={(value) => handleInputChange('height', parseInt(value) || 0)}
            placeholder="Enter your height"
            keyboardType="numeric"
          />
        ) : (
          <Text style={styles.infoValue}>{userData.height} cm</Text>
        )}
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Weight</Text>
        {isEditing ? (
          <TextInput
            style={styles.infoInput}
            value={editData.weight.toString()}
            onChangeText={(value) => handleInputChange('weight', parseInt(value) || 0)}
            placeholder="Enter your weight"
            keyboardType="numeric"
          />
        ) : (
          <Text style={styles.infoValue}>{userData.weight} kg</Text>
        )}
      </View>
    </View>
  );

  const renderRecentActivity = () => (
    <View style={styles.activityContainer}>
      <Text style={styles.sectionTitle}>Recent Activity</Text>
      
      <View style={styles.activityItem}>
        <View style={styles.activityIcon}>
          <Text style={styles.activityIconText}>🎯</Text>
        </View>
        <View style={styles.activityInfo}>
          <Text style={styles.activityTitle}>Vertical Jump Test</Text>
          <Text style={styles.activityDate}>2 hours ago</Text>
        </View>
        <View style={styles.activityScore}>
          <Text style={styles.activityScoreText}>85%</Text>
        </View>
      </View>
      
      <View style={styles.activityItem}>
        <View style={styles.activityIcon}>
          <Text style={styles.activityIconText}>🏃</Text>
        </View>
        <View style={styles.activityInfo}>
          <Text style={styles.activityTitle}>Sprint 30m Test</Text>
          <Text style={styles.activityDate}>1 day ago</Text>
        </View>
        <View style={styles.activityScore}>
          <Text style={styles.activityScoreText}>78%</Text>
        </View>
      </View>
      
      <View style={styles.activityItem}>
        <View style={styles.activityIcon}>
          <Text style={styles.activityIconText}>💪</Text>
        </View>
        <View style={styles.activityInfo}>
          <Text style={styles.activityTitle}>Sit Ups Test</Text>
          <Text style={styles.activityDate}>2 days ago</Text>
        </View>
        <View style={styles.activityScore}>
          <Text style={styles.activityScoreText}>92%</Text>
        </View>
      </View>
    </View>
  );

  const renderActionButtons = () => (
    <View style={styles.actionButtons}>
      {isEditing ? (
        <View style={styles.editButtons}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
          >
            <LinearGradient
              colors={theme.colors.gradients.secondary}
              style={styles.saveButtonGradient}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.editButton}
          onPress={handleEdit}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      )}
      
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
      
      <LinearGradient
        colors={theme.colors.gradients.primary}
        style={styles.gradient}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {renderProfileHeader()}
          {renderStats()}
          {renderPersonalInfo()}
          {renderRecentActivity()}
          {renderActionButtons()}
        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: theme.spacing.xs,
  },
  userEmail: {
    fontSize: 16,
    color: '#E5E7EB',
    marginBottom: theme.spacing.xs,
  },
  userLevel: {
    fontSize: 14,
    color: theme.colors.secondary,
    fontWeight: '600',
  },
  statsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: theme.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.roundness,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
    ...theme.shadows.small,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: '#E5E7EB',
    textAlign: 'center',
  },
  personalInfoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.roundness,
    padding: theme.spacing.lg,
    margin: theme.spacing.lg,
    ...theme.shadows.small,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  infoLabel: {
    fontSize: 14,
    color: '#E5E7EB',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  infoInput: {
    fontSize: 14,
    color: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    flex: 1,
    textAlign: 'right',
  },
  activityContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.roundness,
    padding: theme.spacing.lg,
    margin: theme.spacing.lg,
    ...theme.shadows.small,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  activityIconText: {
    fontSize: 20,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  activityDate: {
    fontSize: 12,
    color: '#E5E7EB',
  },
  activityScore: {
    marginLeft: theme.spacing.sm,
  },
  activityScoreText: {
    fontSize: 16,
    color: theme.colors.secondary,
    fontWeight: 'bold',
  },
  actionButtons: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  editButtons: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.roundness,
    borderWidth: 2,
    borderColor: theme.colors.error,
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  cancelButtonText: {
    fontSize: 16,
    color: theme.colors.error,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    borderRadius: theme.roundness,
    marginLeft: theme.spacing.sm,
    ...theme.shadows.medium,
  },
  saveButtonGradient: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.roundness,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  editButton: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.roundness,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  editButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  logoutButton: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.roundness,
    borderWidth: 2,
    borderColor: theme.colors.error,
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 16,
    color: theme.colors.error,
    fontWeight: '600',
  },
});

export default ProfileScreen;

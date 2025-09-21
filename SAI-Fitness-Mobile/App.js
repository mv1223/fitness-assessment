import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [selectedTest, setSelectedTest] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const fitnessTests = [
    { id: 1, name: 'Height', quality: 'Measurement', icon: '📏' },
    { id: 2, name: 'Weight', quality: 'Measurement', icon: '⚖️' },
    { id: 3, name: 'Sit and Reach', quality: 'Flexibility', icon: '🤸' },
    { id: 4, name: 'Vertical Jump', quality: 'Explosive Strength', icon: '⬆️' },
    { id: 5, name: 'Broad Jump', quality: 'Explosive Strength', icon: '➡️' },
    { id: 6, name: 'Medicine Ball Throw', quality: 'Upper Body Strength', icon: '🏐' },
    { id: 7, name: 'Sprint 30m', quality: 'Speed', icon: '🏃' },
    { id: 8, name: 'Shuttle Run', quality: 'Agility', icon: '🔄' },
    { id: 9, name: 'Sit Ups', quality: 'Core Strength', icon: '💪' },
    { id: 10, name: 'Endurance Run', quality: 'Endurance', icon: '🏃‍♂️' }
  ];

  const renderDashboard = () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>SAI FITNESS</Text>
        <Text style={styles.subtitle}>AI-Powered Assessment</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>Tests Completed</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>78%</Text>
          <Text style={styles.statLabel}>Average Score</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>Intermediate</Text>
          <Text style={styles.statLabel}>Level</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>Tests Remaining</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.primaryButton} onPress={() => setCurrentScreen('tests')}>
        <Text style={styles.buttonText}>Start New Test</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.secondaryButton} onPress={() => setCurrentScreen('results')}>
        <Text style={styles.secondaryButtonText}>View Results</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.secondaryButton} onPress={() => setCurrentScreen('leaderboard')}>
        <Text style={styles.secondaryButtonText}>Leaderboard</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderTests = () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Fitness Tests</Text>
        <Text style={styles.subtitle}>Select a test to begin</Text>
      </View>
      
      {fitnessTests.map((test) => (
        <TouchableOpacity 
          key={test.id} 
          style={styles.testCard}
          onPress={() => {
            setSelectedTest(test);
            setCurrentScreen('record');
          }}
        >
          <Text style={styles.testIcon}>{test.icon}</Text>
          <View style={styles.testInfo}>
            <Text style={styles.testName}>Test {test.id}: {test.name}</Text>
            <Text style={styles.testQuality}>{test.quality}</Text>
          </View>
          <Text style={styles.testArrow}>→</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderRecording = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Record Test</Text>
        <Text style={styles.subtitle}>{selectedTest?.name}</Text>
      </View>
      
      <View style={styles.videoContainer}>
        <Text style={styles.videoIcon}>📹</Text>
        <Text style={styles.videoText}>Camera Ready</Text>
        <Text style={styles.videoSubtext}>Position yourself in frame and tap record</Text>
      </View>
      
      <TouchableOpacity 
        style={[styles.primaryButton, isRecording && styles.recordingButton]} 
        onPress={() => {
          setIsRecording(!isRecording);
          if (!isRecording) {
            Alert.alert('Recording Started', 'In a real app, this would access your camera and record video with AI analysis!');
          } else {
            Alert.alert('Recording Stopped', 'Video saved! AI analysis would now process your performance.');
            setCurrentScreen('results');
          }
        }}
      >
        <Text style={styles.buttonText}>
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.secondaryButton} onPress={() => setCurrentScreen('tests')}>
        <Text style={styles.secondaryButtonText}>Back to Tests</Text>
      </TouchableOpacity>
    </View>
  );

  const renderResults = () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Test Results</Text>
        <Text style={styles.subtitle}>{selectedTest?.name}</Text>
      </View>
      
      <View style={styles.resultCard}>
        <Text style={styles.resultIcon}>🏆</Text>
        <Text style={styles.resultScore}>85%</Text>
        <Text style={styles.resultLabel}>Performance Score</Text>
      </View>
      
      <View style={styles.resultCard}>
        <Text style={styles.resultValue}>65.5 cm</Text>
        <Text style={styles.resultLabel}>Jump Height</Text>
      </View>
      
      <View style={styles.resultCard}>
        <Text style={styles.resultLevel}>Good</Text>
        <Text style={styles.resultLabel}>Performance Level</Text>
      </View>
      
      <TouchableOpacity style={styles.primaryButton} onPress={() => setCurrentScreen('tests')}>
        <Text style={styles.buttonText}>Take Another Test</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.secondaryButton} onPress={() => setCurrentScreen('leaderboard')}>
        <Text style={styles.secondaryButtonText}>View Leaderboard</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderLeaderboard = () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Leaderboard</Text>
        <Text style={styles.subtitle}>Top Performers</Text>
      </View>
      
      {[
        { rank: 1, name: 'Rajesh Kumar', test: 'Vertical Jump', score: '95%' },
        { rank: 2, name: 'Priya Sharma', test: 'Sprint 30m', score: '92%' },
        { rank: 3, name: 'Amit Singh', test: 'Sit Ups', score: '89%' },
        { rank: 4, name: 'Sneha Patel', test: 'Broad Jump', score: '87%' },
        { rank: 5, name: 'Vikram Reddy', test: 'Shuttle Run', score: '85%' }
      ].map((item) => (
        <View key={item.rank} style={styles.leaderboardItem}>
          <Text style={styles.rank}>#{item.rank}</Text>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userTest}>{item.test}</Text>
          </View>
          <Text style={styles.score}>{item.score}</Text>
        </View>
      ))}
      
      <TouchableOpacity style={styles.primaryButton} onPress={() => setCurrentScreen('dashboard')}>
        <Text style={styles.buttonText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard': return renderDashboard();
      case 'tests': return renderTests();
      case 'record': return renderRecording();
      case 'results': return renderResults();
      case 'leaderboard': return renderLeaderboard();
      default: return renderDashboard();
    }
  };

  return (
    <LinearGradient colors={['#1E3A8A', '#3B82F6']} style={styles.gradient}>
      <StatusBar style="light" />
      {renderScreen()}
      
      <View style={styles.navBar}>
        <TouchableOpacity 
          style={[styles.navButton, currentScreen === 'dashboard' && styles.navButtonActive]}
          onPress={() => setCurrentScreen('dashboard')}
        >
          <Text style={styles.navIcon}>🏠</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.navButton, currentScreen === 'tests' && styles.navButtonActive]}
          onPress={() => setCurrentScreen('tests')}
        >
          <Text style={styles.navIcon}>🎯</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.navButton, currentScreen === 'record' && styles.navButtonActive]}
          onPress={() => setCurrentScreen('record')}
        >
          <Text style={styles.navIcon}>📹</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.navButton, currentScreen === 'results' && styles.navButtonActive]}
          onPress={() => setCurrentScreen('results')}
        >
          <Text style={styles.navIcon}>📊</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.navButton, currentScreen === 'leaderboard' && styles.navButtonActive]}
          onPress={() => setCurrentScreen('leaderboard')}
        >
          <Text style={styles.navIcon}>🏆</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#F59E0B',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  testCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  testIcon: {
    fontSize: 30,
    marginRight: 15,
  },
  testInfo: {
    flex: 1,
  },
  testName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  testQuality: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  testArrow: {
    fontSize: 20,
    color: 'white',
  },
  videoContainer: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    marginBottom: 30,
  },
  videoIcon: {
    fontSize: 60,
    marginBottom: 15,
  },
  videoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  videoSubtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  recordingButton: {
    backgroundColor: '#EF4444',
  },
  resultCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
  },
  resultIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  resultScore: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginBottom: 5,
  },
  resultValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  resultLevel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 5,
  },
  resultLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  leaderboardItem: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rank: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  userTest: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  score: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F59E0B',
  },
  navBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.1)',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    paddingBottom: 35,
  },
  navButton: {
    padding: 10,
    borderRadius: 10,
  },
  navButtonActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  navIcon: {
    fontSize: 20,
  },
});

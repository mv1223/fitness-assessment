import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  RefreshControl,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../utils/theme';
import { FITNESS_TESTS, PERFORMANCE_LEVELS } from '../utils/constants';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [userStats, setUserStats] = useState({
    completedTests: 3,
    totalTests: 10,
    averageScore: 75,
    level: 'Intermediate',
    nextTest: 'Sit and Reach',
  });

  const [recentResults, setRecentResults] = useState([
    {
      id: 1,
      testName: 'Vertical Jump',
      score: 85,
      level: PERFORMANCE_LEVELS.GOOD,
      date: '2024-01-15',
    },
    {
      id: 2,
      testName: 'Sprint 30m',
      score: 78,
      level: PERFORMANCE_LEVELS.AVERAGE,
      date: '2024-01-14',
    },
    {
      id: 3,
      testName: 'Sit Ups',
      score: 92,
      level: PERFORMANCE_LEVELS.EXCELLENT,
      date: '2024-01-13',
    },
  ]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  const handleTestPress = (test) => {
    navigation.navigate('TestSelection', { selectedTest: test });
  };

  const handleViewResults = () => {
    navigation.navigate('Results');
  };

  const handleViewLeaderboard = () => {
    navigation.navigate('Leaderboard');
  };

  const handleProfile = () => {
    navigation.navigate('Profile');
  };

  const getPerformanceColor = (level) => {
    switch (level) {
      case PERFORMANCE_LEVELS.EXCELLENT:
        return theme.colors.success;
      case PERFORMANCE_LEVELS.GOOD:
        return theme.colors.info;
      case PERFORMANCE_LEVELS.AVERAGE:
        return theme.colors.warning;
      case PERFORMANCE_LEVELS.BELOW_AVERAGE:
        return theme.colors.error;
      default:
        return theme.colors.placeholder;
    }
  };

  const getPerformanceIcon = (level) => {
    switch (level) {
      case PERFORMANCE_LEVELS.EXCELLENT:
        return '🏆';
      case PERFORMANCE_LEVELS.GOOD:
        return '🥇';
      case PERFORMANCE_LEVELS.AVERAGE:
        return '🥈';
      case PERFORMANCE_LEVELS.BELOW_AVERAGE:
        return '🥉';
      default:
        return '📊';
    }
  };

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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#FFFFFF"
            />
          }
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.greeting}>Welcome back!</Text>
                <Text style={styles.userName}>Athlete</Text>
              </View>
              <TouchableOpacity
                style={styles.profileButton}
                onPress={handleProfile}
              >
                <Text style={styles.profileIcon}>👤</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{userStats.completedTests}</Text>
                <Text style={styles.statLabel}>Tests Completed</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{userStats.averageScore}%</Text>
                <Text style={styles.statLabel}>Average Score</Text>
              </View>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{userStats.level}</Text>
                <Text style={styles.statLabel}>Performance Level</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{userStats.totalTests - userStats.completedTests}</Text>
                <Text style={styles.statLabel}>Tests Remaining</Text>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsContainer}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsRow}>
              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={() => navigation.navigate('TestSelection')}
              >
                <Text style={styles.quickActionIcon}>🎯</Text>
                <Text style={styles.quickActionText}>Start Test</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={handleViewResults}
              >
                <Text style={styles.quickActionIcon}>📊</Text>
                <Text style={styles.quickActionText}>View Results</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickActionButton}
                onPress={handleViewLeaderboard}
              >
                <Text style={styles.quickActionIcon}>🏆</Text>
                <Text style={styles.quickActionText}>Leaderboard</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Recent Results */}
          <View style={styles.recentResultsContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Results</Text>
              <TouchableOpacity onPress={handleViewResults}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            {recentResults.map((result) => (
              <View key={result.id} style={styles.resultCard}>
                <View style={styles.resultInfo}>
                  <Text style={styles.resultTestName}>{result.testName}</Text>
                  <Text style={styles.resultDate}>{result.date}</Text>
                </View>
                <View style={styles.resultScore}>
                  <Text style={styles.resultScoreText}>{result.score}%</Text>
                  <Text style={styles.resultLevel}>{result.level}</Text>
                </View>
                <View style={styles.resultIcon}>
                  <Text style={styles.resultIconText}>
                    {getPerformanceIcon(result.level)}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Available Tests */}
          <View style={styles.testsContainer}>
            <Text style={styles.sectionTitle}>Available Tests</Text>
            <View style={styles.testsGrid}>
              {Object.values(FITNESS_TESTS).map((test) => (
                <TouchableOpacity
                  key={test.id}
                  style={styles.testCard}
                  onPress={() => handleTestPress(test)}
                >
                  <View style={styles.testCardHeader}>
                    <Text style={styles.testNumber}>{test.testNumber}</Text>
                    <Text style={styles.testName}>{test.name}</Text>
                  </View>
                  {test.qualityTested && (
                    <Text style={styles.testQuality}>{test.qualityTested}</Text>
                  )}
                  <Text style={styles.testDescription}>{test.description}</Text>
                  <View style={styles.testFooter}>
                    <Text style={styles.testDuration}>{test.duration}s</Text>
                    <Text style={styles.testArrow}>→</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Next Test Recommendation */}
          <View style={styles.nextTestContainer}>
            <Text style={styles.sectionTitle}>Recommended Next Test</Text>
            <View style={styles.nextTestCard}>
              <View style={styles.nextTestInfo}>
                <Text style={styles.nextTestName}>{userStats.nextTest}</Text>
                <Text style={styles.nextTestDescription}>
                  Complete this test to improve your overall assessment score
                </Text>
              </View>
              <TouchableOpacity
                style={styles.nextTestButton}
                onPress={() => navigation.navigate('TestSelection')}
              >
                <Text style={styles.nextTestButtonText}>Start</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    color: '#E5E7EB',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    fontSize: 20,
  },
  statsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.roundness,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.xs,
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
  quickActionsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: theme.spacing.md,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.roundness,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.xs,
    alignItems: 'center',
    ...theme.shadows.small,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: theme.spacing.sm,
  },
  quickActionText: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  recentResultsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  viewAllText: {
    fontSize: 14,
    color: '#E5E7EB',
    textDecorationLine: 'underline',
  },
  resultCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.roundness,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    ...theme.shadows.small,
  },
  resultInfo: {
    flex: 1,
  },
  resultTestName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: theme.spacing.xs,
  },
  resultDate: {
    fontSize: 12,
    color: '#E5E7EB',
  },
  resultScore: {
    alignItems: 'center',
    marginHorizontal: theme.spacing.md,
  },
  resultScoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  resultLevel: {
    fontSize: 10,
    color: '#E5E7EB',
  },
  resultIcon: {
    marginLeft: theme.spacing.sm,
  },
  resultIconText: {
    fontSize: 20,
  },
  testsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  testsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  testCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.roundness,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.small,
  },
  testCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  testNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: theme.spacing.sm,
  },
  testName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  testQuality: {
    fontSize: 10,
    color: '#E5E7EB',
    marginBottom: theme.spacing.sm,
  },
  testDescription: {
    fontSize: 12,
    color: '#E5E7EB',
    marginBottom: theme.spacing.sm,
    lineHeight: 16,
  },
  testFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  testDuration: {
    fontSize: 10,
    color: '#E5E7EB',
  },
  testArrow: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  nextTestContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  nextTestCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.roundness,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...theme.shadows.small,
  },
  nextTestInfo: {
    flex: 1,
  },
  nextTestName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: theme.spacing.xs,
  },
  nextTestDescription: {
    fontSize: 12,
    color: '#E5E7EB',
    lineHeight: 16,
  },
  nextTestButton: {
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.roundness,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginLeft: theme.spacing.md,
  },
  nextTestButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default DashboardScreen;

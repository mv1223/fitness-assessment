import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Alert,
  Share,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../utils/theme';
import { PERFORMANCE_LEVELS } from '../utils/constants';

const { width } = Dimensions.get('window');

const ResultsScreen = ({ navigation, route }) => {
  const { test, result, videoUri } = route.params;
  const [isSharing, setIsSharing] = useState(false);

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

  const getPerformanceMessage = (level) => {
    switch (level) {
      case PERFORMANCE_LEVELS.EXCELLENT:
        return 'Outstanding performance! You\'re in the top tier!';
      case PERFORMANCE_LEVELS.GOOD:
        return 'Great job! You\'re performing above average.';
      case PERFORMANCE_LEVELS.AVERAGE:
        return 'Good performance! Keep practicing to improve.';
      case PERFORMANCE_LEVELS.BELOW_AVERAGE:
        return 'Room for improvement. Focus on training.';
      default:
        return 'Keep working hard to improve your performance.';
    }
  };

  const handleShare = async () => {
    try {
      setIsSharing(true);
      
      const shareContent = {
        message: `I just completed the ${test.name} test with a score of ${result.value}${test.unit}! 🏃‍♂️ #SAIFitnessAssessment`,
        title: 'SAI Fitness Assessment Results',
      };
      
      await Share.share(shareContent);
    } catch (error) {
      console.error('Share failed:', error);
      Alert.alert('Error', 'Failed to share results. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  const handleRetakeTest = () => {
    Alert.alert(
      'Retake Test',
      'Are you sure you want to retake this test? Your current results will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Retake', style: 'destructive', onPress: () => navigation.navigate('TestSelection') },
      ]
    );
  };

  const handleViewLeaderboard = () => {
    navigation.navigate('Leaderboard');
  };

  const handleNextTest = () => {
    navigation.navigate('TestSelection');
  };

  const formatValue = (value, unit) => {
    if (unit === 'seconds' || unit === 'minutes') {
      return `${value.toFixed(2)}s`;
    }
    if (unit === 'count') {
      return `${Math.round(value)} reps`;
    }
    return `${value.toFixed(1)}${unit}`;
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
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Test Results</Text>
            <Text style={styles.subtitle}>{test.name}</Text>
          </View>

          {/* Main Result Card */}
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultIcon}>
                {getPerformanceIcon(result.performanceLevel)}
              </Text>
              <Text style={styles.resultTitle}>Performance Result</Text>
            </View>
            
            <View style={styles.resultValueContainer}>
              <Text style={styles.resultValue}>
                {formatValue(result.value, test.unit)}
              </Text>
              <Text style={styles.resultUnit}>{test.unit}</Text>
            </View>
            
            <View style={styles.resultLevelContainer}>
              <Text style={[
                styles.resultLevel,
                { color: getPerformanceColor(result.performanceLevel) }
              ]}>
                {result.performanceLevel.replace('_', ' ').toUpperCase()}
              </Text>
            </View>
            
            <Text style={styles.resultMessage}>
              {getPerformanceMessage(result.performanceLevel)}
            </Text>
          </View>

          {/* Analysis Details */}
          <View style={styles.detailsCard}>
            <Text style={styles.detailsTitle}>Analysis Details</Text>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Confidence Score</Text>
              <Text style={styles.detailValue}>
                {Math.round(result.confidence * 100)}%
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Data Integrity</Text>
              <Text style={[
                styles.detailValue,
                { color: result.isValid ? theme.colors.success : theme.colors.error }
              ]}>
                {result.isValid ? 'Valid' : 'Invalid'}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Cheat Detection</Text>
              <Text style={[
                styles.detailValue,
                { color: result.cheatDetected ? theme.colors.error : theme.colors.success }
              ]}>
                {result.cheatDetected ? 'Suspicious' : 'Clean'}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Analysis Time</Text>
              <Text style={styles.detailValue}>
                {new Date(result.analysisTime).toLocaleTimeString()}
              </Text>
            </View>
          </View>

          {/* Test Information */}
          <View style={styles.testInfoCard}>
            <Text style={styles.testInfoTitle}>Test Information</Text>
            
            <View style={styles.testInfoRow}>
              <Text style={styles.testInfoLabel}>Test Name:</Text>
              <Text style={styles.testInfoValue}>{test.name}</Text>
            </View>
            
            <View style={styles.testInfoRow}>
              <Text style={styles.testInfoLabel}>Quality Tested:</Text>
              <Text style={styles.testInfoValue}>{test.qualityTested || 'N/A'}</Text>
            </View>
            
            <View style={styles.testInfoRow}>
              <Text style={styles.testInfoLabel}>Duration:</Text>
              <Text style={styles.testInfoValue}>{test.duration} seconds</Text>
            </View>
            
            <View style={styles.testInfoRow}>
              <Text style={styles.testInfoLabel}>Recording Time:</Text>
              <Text style={styles.testInfoValue}>{result.recordingTime}s</Text>
            </View>
          </View>

          {/* Performance Breakdown */}
          {result.score && (
            <View style={styles.breakdownCard}>
              <Text style={styles.breakdownTitle}>Performance Breakdown</Text>
              
              <View style={styles.scoreContainer}>
                <View style={styles.scoreCircle}>
                  <Text style={styles.scoreText}>{Math.round(result.score)}</Text>
                  <Text style={styles.scoreLabel}>Score</Text>
                </View>
                
                <View style={styles.scoreDetails}>
                  <View style={styles.scoreBar}>
                    <View style={styles.scoreBarBackground}>
                      <View 
                        style={[
                          styles.scoreBarFill,
                          { 
                            width: `${result.score}%`,
                            backgroundColor: getPerformanceColor(result.performanceLevel)
                          }
                        ]}
                      />
                    </View>
                    <Text style={styles.scorePercentage}>{Math.round(result.score)}%</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Additional Metrics */}
          {result.jumpHeight && (
            <View style={styles.metricsCard}>
              <Text style={styles.metricsTitle}>Additional Metrics</Text>
              
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Jump Height</Text>
                <Text style={styles.metricValue}>{result.jumpHeight.toFixed(1)} cm</Text>
              </View>
            </View>
          )}

          {result.speed && (
            <View style={styles.metricsCard}>
              <Text style={styles.metricsTitle}>Speed Analysis</Text>
              
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Average Speed</Text>
                <Text style={styles.metricValue}>{result.speed.toFixed(2)} m/s</Text>
              </View>
            </View>
          )}

          {result.agility && (
            <View style={styles.metricsCard}>
              <Text style={styles.metricsTitle}>Agility Analysis</Text>
              
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Agility Score</Text>
                <Text style={styles.metricValue}>{result.agility.toFixed(2)}</Text>
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.shareButton}
              onPress={handleShare}
              disabled={isSharing}
            >
              <Text style={styles.shareButtonText}>
                {isSharing ? 'Sharing...' : 'Share Results'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.leaderboardButton}
              onPress={handleViewLeaderboard}
            >
              <Text style={styles.leaderboardButtonText}>View Leaderboard</Text>
            </TouchableOpacity>
          </View>

          {/* Navigation Buttons */}
          <View style={styles.navigationButtons}>
            <TouchableOpacity
              style={styles.retakeButton}
              onPress={handleRetakeTest}
            >
              <Text style={styles.retakeButtonText}>Retake Test</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNextTest}
            >
              <LinearGradient
                colors={theme.colors.gradients.secondary}
                style={styles.nextButtonGradient}
              >
                <Text style={styles.nextButtonText}>Next Test</Text>
              </LinearGradient>
            </TouchableOpacity>
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
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: '#E5E7EB',
  },
  resultCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.roundness,
    padding: theme.spacing.lg,
    margin: theme.spacing.lg,
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  resultIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.sm,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  resultValueContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  resultValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  resultUnit: {
    fontSize: 16,
    color: '#E5E7EB',
    marginTop: theme.spacing.xs,
  },
  resultLevelContainer: {
    marginBottom: theme.spacing.lg,
  },
  resultLevel: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  resultMessage: {
    fontSize: 14,
    color: '#E5E7EB',
    textAlign: 'center',
    lineHeight: 20,
  },
  detailsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.roundness,
    padding: theme.spacing.lg,
    margin: theme.spacing.lg,
    ...theme.shadows.small,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: theme.spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  detailLabel: {
    fontSize: 14,
    color: '#E5E7EB',
  },
  detailValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  testInfoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.roundness,
    padding: theme.spacing.lg,
    margin: theme.spacing.lg,
    ...theme.shadows.small,
  },
  testInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: theme.spacing.md,
  },
  testInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  testInfoLabel: {
    fontSize: 14,
    color: '#E5E7EB',
  },
  testInfoValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  breakdownCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.roundness,
    padding: theme.spacing.lg,
    margin: theme.spacing.lg,
    ...theme.shadows.small,
  },
  breakdownTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: theme.spacing.md,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.lg,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  scoreLabel: {
    fontSize: 10,
    color: '#E5E7EB',
  },
  scoreDetails: {
    flex: 1,
  },
  scoreBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    marginRight: theme.spacing.sm,
  },
  scoreBarFill: {
    height: 8,
    borderRadius: 4,
  },
  scorePercentage: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  metricsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.roundness,
    padding: theme.spacing.lg,
    margin: theme.spacing.lg,
    ...theme.shadows.small,
  },
  metricsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: theme.spacing.md,
  },
  metricItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  metricLabel: {
    fontSize: 14,
    color: '#E5E7EB',
  },
  metricValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  shareButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.roundness,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  shareButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  leaderboardButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.roundness,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
  },
  leaderboardButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  navigationButtons: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  retakeButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.roundness,
    borderWidth: 2,
    borderColor: theme.colors.error,
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  retakeButtonText: {
    fontSize: 16,
    color: theme.colors.error,
    fontWeight: '600',
  },
  nextButton: {
    flex: 1,
    borderRadius: theme.roundness,
    marginLeft: theme.spacing.sm,
    ...theme.shadows.medium,
  },
  nextButtonGradient: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.roundness,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default ResultsScreen;

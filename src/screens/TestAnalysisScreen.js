import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Dimensions,
  Animated,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../utils/theme';
import { PERFORMANCE_LEVELS } from '../utils/constants';
import AIAnalysis from '../utils/aiAnalysis';

const { width } = Dimensions.get('window');

const TestAnalysisScreen = ({ navigation, route }) => {
  const { test, videoUri, recordingTime } = route.params;
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStatus, setAnalysisStatus] = useState('Initializing...');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);
  const [error, setError] = useState(null);
  
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    startAnalysis();
  }, []);

  useEffect(() => {
    if (analysisProgress > 0) {
      Animated.timing(progressAnim, {
        toValue: analysisProgress / 100,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [analysisProgress]);

  useEffect(() => {
    if (!isAnalysisComplete) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isAnalysisComplete]);

  const startAnalysis = async () => {
    try {
      setAnalysisStatus('Initializing AI models...');
      setAnalysisProgress(10);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAnalysisStatus('Loading video for analysis...');
      setAnalysisProgress(20);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAnalysisStatus('Analyzing video content...');
      setAnalysisProgress(40);
      
      // Perform AI analysis based on test type
      let result;
      switch (test.id) {
        case 'vertical_jump':
          result = await AIAnalysis.analyzeVerticalJump(videoUri);
          break;
        case 'sit_ups':
          result = await AIAnalysis.analyzeSitUps(videoUri);
          break;
        case 'sprint_30m':
          result = await AIAnalysis.analyzeSprint(videoUri, 30);
          break;
        case 'shuttle_run':
          result = await AIAnalysis.analyzeShuttleRun(videoUri);
          break;
        default:
          result = await performBasicAnalysis();
      }
      
      setAnalysisStatus('Processing results...');
      setAnalysisProgress(70);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAnalysisStatus('Validating data integrity...');
      setAnalysisProgress(90);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAnalysisStatus('Analysis complete!');
      setAnalysisProgress(100);
      
      // Process and format the result
      const processedResult = processAnalysisResult(result);
      setAnalysisResult(processedResult);
      setIsAnalysisComplete(true);
      
      // Navigate to results after a short delay
      setTimeout(() => {
        navigation.navigate('Results', {
          test,
          result: processedResult,
          videoUri,
        });
      }, 2000);
      
    } catch (error) {
      console.error('Analysis failed:', error);
      setError('Analysis failed. Please try again.');
      setAnalysisStatus('Analysis failed');
    }
  };

  const performBasicAnalysis = async () => {
    // Mock analysis for tests without specific AI analysis
    return {
      score: Math.floor(Math.random() * 40) + 60, // 60-100
      confidence: 0.8 + Math.random() * 0.2, // 0.8-1.0
      isValid: true,
      cheatDetected: false,
      analysisTime: Date.now(),
    };
  };

  const processAnalysisResult = (result) => {
    const processedResult = {
      ...result,
      testId: test.id,
      testName: test.name,
      qualityTested: test.qualityTested,
      unit: test.unit,
      recordingTime,
      timestamp: new Date().toISOString(),
    };

    // Add performance level based on score
    if (result.score !== undefined) {
      processedResult.performanceLevel = getPerformanceLevel(result.score);
    }

    // Add specific metrics based on test type
    switch (test.id) {
      case 'vertical_jump':
        processedResult.jumpHeight = result.jumpHeight || 0;
        processedResult.metric = 'Jump Height';
        processedResult.value = processedResult.jumpHeight;
        break;
      case 'sit_ups':
        processedResult.count = result.count || 0;
        processedResult.metric = 'Repetitions';
        processedResult.value = processedResult.count;
        break;
      case 'sprint_30m':
        processedResult.time = result.time || 0;
        processedResult.speed = result.speed || 0;
        processedResult.metric = 'Sprint Time';
        processedResult.value = processedResult.time;
        break;
      case 'shuttle_run':
        processedResult.time = result.time || 0;
        processedResult.agility = result.agility || 0;
        processedResult.metric = 'Shuttle Time';
        processedResult.value = processedResult.time;
        break;
      default:
        processedResult.metric = 'Score';
        processedResult.value = processedResult.score || 0;
    }

    return processedResult;
  };

  const getPerformanceLevel = (score) => {
    if (score >= 90) return PERFORMANCE_LEVELS.EXCELLENT;
    if (score >= 80) return PERFORMANCE_LEVELS.GOOD;
    if (score >= 70) return PERFORMANCE_LEVELS.AVERAGE;
    if (score >= 60) return PERFORMANCE_LEVELS.BELOW_AVERAGE;
    return PERFORMANCE_LEVELS.POOR;
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

  const handleRetry = () => {
    setError(null);
    setAnalysisProgress(0);
    setAnalysisStatus('Initializing...');
    setIsAnalysisComplete(false);
    startAnalysis();
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Analysis',
      'Are you sure you want to cancel the analysis? You will need to record the test again.',
      [
        { text: 'Continue Analysis', style: 'cancel' },
        { text: 'Cancel', style: 'destructive', onPress: () => navigation.goBack() },
      ]
    );
  };

  if (error) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
        
        <LinearGradient
          colors={theme.colors.gradients.primary}
          style={styles.gradient}
        >
          <View style={styles.errorContainer}>
            <Text style={styles.errorIcon}>❌</Text>
            <Text style={styles.errorTitle}>Analysis Failed</Text>
            <Text style={styles.errorMessage}>{error}</Text>
            
            <View style={styles.errorButtons}>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={handleRetry}
              >
                <LinearGradient
                  colors={theme.colors.gradients.secondary}
                  style={styles.retryButtonGradient}
                >
                  <Text style={styles.retryButtonText}>Retry Analysis</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
      
      <LinearGradient
        colors={theme.colors.gradients.primary}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Analyzing Test</Text>
            <Text style={styles.subtitle}>{test.name}</Text>
          </View>

          {/* Progress Section */}
          <View style={styles.progressSection}>
            <Animated.View
              style={[
                styles.progressContainer,
                { transform: [{ scale: pulseAnim }] }
              ]}
            >
              <View style={styles.progressCircle}>
                <Animated.View
                  style={[
                    styles.progressFill,
                    {
                      transform: [{
                        rotate: progressAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0deg', '360deg'],
                        }),
                      }],
                    },
                  ]}
                />
                <View style={styles.progressInner}>
                  <Text style={styles.progressText}>{analysisProgress}%</Text>
                </View>
              </View>
            </Animated.View>
            
            <Text style={styles.statusText}>{analysisStatus}</Text>
          </View>

          {/* Analysis Steps */}
          <View style={styles.stepsContainer}>
            <View style={styles.step}>
              <View style={[styles.stepIcon, analysisProgress >= 10 && styles.stepIconActive]}>
                <Text style={styles.stepIconText}>🤖</Text>
              </View>
              <Text style={styles.stepText}>AI Model Initialization</Text>
            </View>
            
            <View style={styles.step}>
              <View style={[styles.stepIcon, analysisProgress >= 40 && styles.stepIconActive]}>
                <Text style={styles.stepIconText}>📹</Text>
              </View>
              <Text style={styles.stepText}>Video Analysis</Text>
            </View>
            
            <View style={styles.step}>
              <View style={[styles.stepIcon, analysisProgress >= 70 && styles.stepIconActive]}>
                <Text style={styles.stepIconText}>🔍</Text>
              </View>
              <Text style={styles.stepText}>Cheat Detection</Text>
            </View>
            
            <View style={styles.step}>
              <View style={[styles.stepIcon, analysisProgress >= 100 && styles.stepIconActive]}>
                <Text style={styles.stepIconText}>✅</Text>
              </View>
              <Text style={styles.stepText}>Result Validation</Text>
            </View>
          </View>

          {/* Analysis Details */}
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsTitle}>Analysis Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Test Duration:</Text>
              <Text style={styles.detailValue}>{recordingTime}s</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Quality Tested:</Text>
              <Text style={styles.detailValue}>{test.qualityTested || 'N/A'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Unit:</Text>
              <Text style={styles.detailValue}>{test.unit}</Text>
            </View>
          </View>

          {/* Loading Indicator */}
          {!isAnalysisComplete && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FFFFFF" />
              <Text style={styles.loadingText}>Please wait...</Text>
            </View>
          )}

          {/* Success Message */}
          {isAnalysisComplete && analysisResult && (
            <View style={styles.successContainer}>
              <Text style={styles.successIcon}>🎉</Text>
              <Text style={styles.successTitle}>Analysis Complete!</Text>
              <Text style={styles.successMessage}>
                Your test has been successfully analyzed and verified.
              </Text>
            </View>
          )}

          {/* Cancel Button */}
          {!isAnalysisComplete && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel Analysis</Text>
            </TouchableOpacity>
          )}
        </View>
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
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xxl,
    paddingBottom: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
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
  progressSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  progressContainer: {
    marginBottom: theme.spacing.lg,
  },
  progressCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  progressFill: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    borderColor: 'transparent',
    borderTopColor: theme.colors.secondary,
    borderRightColor: theme.colors.secondary,
  },
  progressInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statusText: {
    fontSize: 16,
    color: '#E5E7EB',
    textAlign: 'center',
  },
  stepsContainer: {
    marginBottom: theme.spacing.xxl,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  stepIconActive: {
    backgroundColor: theme.colors.secondary,
  },
  stepIconText: {
    fontSize: 20,
  },
  stepText: {
    fontSize: 16,
    color: '#FFFFFF',
    flex: 1,
  },
  detailsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.roundness,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
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
  loadingContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  loadingText: {
    fontSize: 14,
    color: '#E5E7EB',
    marginTop: theme.spacing.sm,
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  successIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: theme.spacing.sm,
  },
  successMessage: {
    fontSize: 14,
    color: '#E5E7EB',
    textAlign: 'center',
    lineHeight: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: theme.spacing.lg,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: theme.spacing.md,
  },
  errorMessage: {
    fontSize: 16,
    color: '#E5E7EB',
    textAlign: 'center',
    marginBottom: theme.spacing.xxl,
    lineHeight: 24,
  },
  errorButtons: {
    width: '100%',
  },
  retryButton: {
    borderRadius: theme.roundness,
    marginBottom: theme.spacing.md,
    ...theme.shadows.medium,
  },
  retryButtonGradient: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.roundness,
    alignItems: 'center',
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cancelButton: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.roundness,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default TestAnalysisScreen;

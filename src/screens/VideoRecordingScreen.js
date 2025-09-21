import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StatusBar,
  Dimensions,
  Animated,
  Vibration,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../utils/theme';
import { FITNESS_TESTS } from '../utils/constants';

const { width, height } = Dimensions.get('window');

const VideoRecordingScreen = ({ navigation, route }) => {
  const { test } = route.params;
  const cameraRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [recordingUri, setRecordingUri] = useState(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [currentInstruction, setCurrentInstruction] = useState(0);
  
  const countdownAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isCountdownActive && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
        Vibration.vibrate(100);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isCountdownActive && countdown === 0) {
      startRecording();
    }
  }, [countdown, isCountdownActive]);

  useEffect(() => {
    if (isRecording) {
      const timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isRecording]);

  useEffect(() => {
    if (isCountdownActive) {
      Animated.sequence([
        Animated.timing(countdownAnim, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(countdownAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [countdown, isCountdownActive]);

  useEffect(() => {
    if (isRecording) {
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
  }, [isRecording]);

  const startCountdown = () => {
    setCountdown(3);
    setIsCountdownActive(true);
    setShowInstructions(false);
  };

  const startRecording = async () => {
    try {
      if (cameraRef.current) {
        const options = {
          quality: RNCamera.Constants.VideoQuality['720p'],
          maxDuration: test.duration,
          videoBitrate: 2000000,
        };
        
        const data = await cameraRef.current.recordAsync(options);
        setRecordingUri(data.uri);
        setIsRecording(true);
        setIsCountdownActive(false);
        Vibration.vibrate([200, 100, 200]);
      }
    } catch (error) {
      console.error('Recording failed:', error);
      Alert.alert('Error', 'Failed to start recording. Please try again.');
    }
  };

  const stopRecording = async () => {
    try {
      if (cameraRef.current) {
        await cameraRef.current.stopRecording();
        setIsRecording(false);
        Vibration.vibrate(200);
        
        // Navigate to analysis screen
        navigation.navigate('TestAnalysis', {
          test,
          videoUri: recordingUri,
          recordingTime,
        });
      }
    } catch (error) {
      console.error('Stop recording failed:', error);
      Alert.alert('Error', 'Failed to stop recording. Please try again.');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNextInstruction = () => {
    if (currentInstruction < test.instructions.length - 1) {
      setCurrentInstruction(currentInstruction + 1);
    } else {
      startCountdown();
    }
  };

  const handleSkipInstructions = () => {
    startCountdown();
  };

  const renderInstructions = () => (
    <View style={styles.instructionsOverlay}>
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>Test Instructions</Text>
        <Text style={styles.instructionText}>
          {test.instructions[currentInstruction]}
        </Text>
        <View style={styles.instructionProgress}>
          <Text style={styles.instructionCounter}>
            {currentInstruction + 1} of {test.instructions.length}
          </Text>
        </View>
        <View style={styles.instructionButtons}>
          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkipInstructions}
          >
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNextInstruction}
          >
            <LinearGradient
              colors={theme.colors.gradients.secondary}
              style={styles.nextButtonGradient}
            >
              <Text style={styles.nextButtonText}>
                {currentInstruction < test.instructions.length - 1 ? 'Next' : 'Start'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderCountdown = () => (
    <View style={styles.countdownOverlay}>
      <Animated.View
        style={[
          styles.countdownContainer,
          { transform: [{ scale: countdownAnim }] }
        ]}
      >
        <Text style={styles.countdownText}>{countdown}</Text>
        <Text style={styles.countdownSubtext}>Get Ready!</Text>
      </Animated.View>
    </View>
  );

  const renderRecordingControls = () => (
    <View style={styles.recordingControls}>
      <View style={styles.recordingInfo}>
        <Animated.View
          style={[
            styles.recordingIndicator,
            { transform: [{ scale: pulseAnim }] }
          ]}
        >
          <View style={styles.recordingDot} />
        </Animated.View>
        <Text style={styles.recordingText}>RECORDING</Text>
        <Text style={styles.recordingTime}>{formatTime(recordingTime)}</Text>
      </View>
      
      <TouchableOpacity
        style={styles.stopButton}
        onPress={stopRecording}
        activeOpacity={0.8}
      >
        <View style={styles.stopButtonInner} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
      
      <RNCamera
        ref={cameraRef}
        style={styles.camera}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.off}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        androidRecordAudioPermissionOptions={{
          title: 'Permission to use audio recording',
          message: 'We need your permission to use your audio',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
      />

      {/* Test Info Overlay */}
      <View style={styles.testInfoOverlay}>
        <Text style={styles.testName}>{test.name}</Text>
        <Text style={styles.testDescription}>{test.description}</Text>
        <Text style={styles.testDuration}>Duration: {test.duration}s</Text>
      </View>

      {/* Instructions Overlay */}
      {showInstructions && renderInstructions()}

      {/* Countdown Overlay */}
      {isCountdownActive && renderCountdown()}

      {/* Recording Controls */}
      {isRecording && renderRecordingControls()}

      {/* Start Button */}
      {!isRecording && !isCountdownActive && !showInstructions && (
        <View style={styles.startButtonContainer}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={startCountdown}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={theme.colors.gradients.secondary}
              style={styles.startButtonGradient}
            >
              <Text style={styles.startButtonText}>Start Recording</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  testInfoOverlay: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: theme.roundness,
    padding: theme.spacing.md,
  },
  testName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: theme.spacing.xs,
  },
  testDescription: {
    fontSize: 14,
    color: '#E5E7EB',
    marginBottom: theme.spacing.xs,
  },
  testDuration: {
    fontSize: 12,
    color: theme.colors.secondary,
    fontWeight: '600',
  },
  instructionsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.roundness,
    padding: theme.spacing.lg,
    margin: theme.spacing.lg,
    maxWidth: width * 0.9,
    ...theme.shadows.large,
  },
  instructionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  instructionText: {
    fontSize: 16,
    color: theme.colors.text,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  instructionProgress: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  instructionCounter: {
    fontSize: 14,
    color: theme.colors.placeholder,
  },
  instructionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  skipButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    marginRight: theme.spacing.sm,
    borderRadius: theme.roundness,
    borderWidth: 1,
    borderColor: theme.colors.placeholder,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 16,
    color: theme.colors.placeholder,
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
  countdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownContainer: {
    alignItems: 'center',
  },
  countdownText: {
    fontSize: 120,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  countdownSubtext: {
    fontSize: 24,
    color: '#E5E7EB',
    marginTop: theme.spacing.md,
  },
  recordingControls: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recordingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: theme.roundness,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  recordingIndicator: {
    marginRight: theme.spacing.sm,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.error,
  },
  recordingText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginRight: theme.spacing.sm,
  },
  recordingTime: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  stopButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  stopButtonInner: {
    width: 20,
    height: 20,
    backgroundColor: theme.colors.error,
    borderRadius: 4,
  },
  startButtonContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  startButton: {
    borderRadius: theme.roundness,
    ...theme.shadows.large,
  },
  startButtonGradient: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.roundness,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default VideoRecordingScreen;

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  TextInput,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../utils/theme';
import { FITNESS_TESTS, TEST_STATUS } from '../utils/constants';

const { width } = Dimensions.get('window');

const TestSelectionScreen = ({ navigation, route }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredTests, setFilteredTests] = useState(Object.values(FITNESS_TESTS));
  const [showInstructions, setShowInstructions] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);

  const categories = [
    { id: 'all', name: 'All Tests', icon: '🎯' },
    { id: 'strength', name: 'Strength', icon: '💪' },
    { id: 'endurance', name: 'Endurance', icon: '🏃' },
    { id: 'speed', name: 'Speed', icon: '⚡' },
    { id: 'agility', name: 'Agility', icon: '🔄' },
    { id: 'flexibility', name: 'Flexibility', icon: '🤸' },
  ];

  useEffect(() => {
    filterTests();
  }, [searchQuery, selectedCategory]);

  const filterTests = () => {
    let filtered = Object.values(FITNESS_TESTS);

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(test =>
        test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (test.qualityTested && test.qualityTested.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(test => {
        if (!test.qualityTested) return false;
        return test.qualityTested.toLowerCase().includes(selectedCategory.toLowerCase());
      });
    }

    setFilteredTests(filtered);
  };

  const handleTestPress = (test) => {
    setSelectedTest(test);
    setShowInstructions(true);
  };

  const handleStartTest = () => {
    setShowInstructions(false);
    navigation.navigate('VideoRecording', { test: selectedTest });
  };

  const handleCloseInstructions = () => {
    setShowInstructions(false);
    setSelectedTest(null);
  };

  const getTestStatus = (testId) => {
    // Mock status - in real app, this would come from user data
    const statuses = {
      'height': TEST_STATUS.COMPLETED,
      'weight': TEST_STATUS.COMPLETED,
      'sit_and_reach': TEST_STATUS.COMPLETED,
      'vertical_jump': TEST_STATUS.COMPLETED,
      'broad_jump': TEST_STATUS.COMPLETED,
      'medicine_ball_throw': TEST_STATUS.NOT_STARTED,
      'sprint_30m': TEST_STATUS.NOT_STARTED,
      'shuttle_run': TEST_STATUS.NOT_STARTED,
      'sit_ups': TEST_STATUS.NOT_STARTED,
      'endurance_run': TEST_STATUS.NOT_STARTED,
    };
    return statuses[testId] || TEST_STATUS.NOT_STARTED;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case TEST_STATUS.COMPLETED:
        return theme.colors.success;
      case TEST_STATUS.IN_PROGRESS:
        return theme.colors.warning;
      case TEST_STATUS.FAILED:
        return theme.colors.error;
      default:
        return theme.colors.placeholder;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case TEST_STATUS.COMPLETED:
        return '✅';
      case TEST_STATUS.IN_PROGRESS:
        return '⏳';
      case TEST_STATUS.FAILED:
        return '❌';
      default:
        return '⭕';
    }
  };

  const getTestIcon = (test) => {
    const icons = {
      'height': '📏',
      'weight': '⚖️',
      'sit_and_reach': '🤸',
      'vertical_jump': '⬆️',
      'broad_jump': '➡️',
      'medicine_ball_throw': '🏐',
      'sprint_30m': '🏃',
      'shuttle_run': '🔄',
      'sit_ups': '💪',
      'endurance_run': '🏃‍♂️',
    };
    return icons[test.id] || '🎯';
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
            <Text style={styles.title}>Select Test</Text>
            <Text style={styles.subtitle}>Choose a fitness test to begin</Text>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search tests..."
              placeholderTextColor={theme.colors.placeholder}
            />
          </View>

          {/* Category Filter */}
          <View style={styles.categoryContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryScroll}
            >
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category.id && styles.categoryButtonActive
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text style={[
                    styles.categoryText,
                    selectedCategory === category.id && styles.categoryTextActive
                  ]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Tests Grid */}
          <View style={styles.testsContainer}>
            {filteredTests.map((test) => {
              const status = getTestStatus(test.id);
              return (
                <TouchableOpacity
                  key={test.id}
                  style={styles.testCard}
                  onPress={() => handleTestPress(test)}
                  activeOpacity={0.8}
                >
                  <View style={styles.testCardHeader}>
                    <View style={styles.testIconContainer}>
                      <Text style={styles.testIcon}>{getTestIcon(test)}</Text>
                    </View>
                    <View style={styles.testInfo}>
                      <Text style={styles.testName}>{test.name}</Text>
                      <Text style={styles.testNumber}>Test {test.testNumber}</Text>
                    </View>
                    <View style={styles.testStatus}>
                      <Text style={styles.statusIcon}>{getStatusIcon(status)}</Text>
                    </View>
                  </View>

                  {test.qualityTested && (
                    <View style={styles.testQualityContainer}>
                      <Text style={styles.testQuality}>{test.qualityTested}</Text>
                    </View>
                  )}

                  <Text style={styles.testDescription}>{test.description}</Text>

                  <View style={styles.testFooter}>
                    <View style={styles.testDetails}>
                      <Text style={styles.testDuration}>{test.duration}s</Text>
                      <Text style={styles.testUnit}>{test.unit}</Text>
                    </View>
                    <Text style={styles.testArrow}>→</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Empty State */}
          {filteredTests.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>🔍</Text>
              <Text style={styles.emptyStateTitle}>No tests found</Text>
              <Text style={styles.emptyStateText}>
                Try adjusting your search or filter criteria
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Instructions Modal */}
        <Modal
          visible={showInstructions}
          transparent
          animationType="slide"
          onRequestClose={handleCloseInstructions}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedTest?.name}</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={handleCloseInstructions}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                <View style={styles.testInfoSection}>
                  <Text style={styles.testInfoTitle}>Test Information</Text>
                  <View style={styles.testInfoRow}>
                    <Text style={styles.testInfoLabel}>Duration:</Text>
                    <Text style={styles.testInfoValue}>{selectedTest?.duration} seconds</Text>
                  </View>
                  <View style={styles.testInfoRow}>
                    <Text style={styles.testInfoLabel}>Quality Tested:</Text>
                    <Text style={styles.testInfoValue}>{selectedTest?.qualityTested || 'N/A'}</Text>
                  </View>
                  <View style={styles.testInfoRow}>
                    <Text style={styles.testInfoLabel}>Unit:</Text>
                    <Text style={styles.testInfoValue}>{selectedTest?.unit}</Text>
                  </View>
                </View>

                <View style={styles.instructionsSection}>
                  <Text style={styles.instructionsTitle}>Instructions</Text>
                  {selectedTest?.instructions?.map((instruction, index) => (
                    <View key={index} style={styles.instructionItem}>
                      <Text style={styles.instructionNumber}>{index + 1}.</Text>
                      <Text style={styles.instructionText}>{instruction}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.requirementsSection}>
                  <Text style={styles.requirementsTitle}>Requirements</Text>
                  <View style={styles.requirementItem}>
                    <Text style={styles.requirementIcon}>📹</Text>
                    <Text style={styles.requirementText}>Video recording required</Text>
                  </View>
                  <View style={styles.requirementItem}>
                    <Text style={styles.requirementIcon}>📏</Text>
                    <Text style={styles.requirementText}>Accurate measurements needed</Text>
                  </View>
                  <View style={styles.requirementItem}>
                    <Text style={styles.requirementIcon}>⏱️</Text>
                    <Text style={styles.requirementText}>Follow timing instructions</Text>
                  </View>
                </View>
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCloseInstructions}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.startButton}
                  onPress={handleStartTest}
                >
                  <LinearGradient
                    colors={theme.colors.gradients.secondary}
                    style={styles.startButtonGradient}
                  >
                    <Text style={styles.startButtonText}>Start Test</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
  searchContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  searchInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: theme.roundness,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: 16,
    color: theme.colors.text,
    ...theme.shadows.small,
  },
  categoryContainer: {
    marginBottom: theme.spacing.lg,
  },
  categoryScroll: {
    paddingHorizontal: theme.spacing.lg,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.roundness,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginRight: theme.spacing.sm,
  },
  categoryButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: theme.spacing.sm,
  },
  categoryText: {
    fontSize: 14,
    color: '#E5E7EB',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  testsContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  testCard: {
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
  testIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  testIcon: {
    fontSize: 20,
  },
  testInfo: {
    flex: 1,
  },
  testName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: theme.spacing.xs,
  },
  testNumber: {
    fontSize: 12,
    color: '#E5E7EB',
  },
  testStatus: {
    marginLeft: theme.spacing.sm,
  },
  statusIcon: {
    fontSize: 20,
  },
  testQualityContainer: {
    marginBottom: theme.spacing.sm,
  },
  testQuality: {
    fontSize: 12,
    color: theme.colors.secondary,
    fontWeight: '600',
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  testDescription: {
    fontSize: 14,
    color: '#E5E7EB',
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  testFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  testDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  testDuration: {
    fontSize: 12,
    color: '#E5E7EB',
    marginRight: theme.spacing.sm,
  },
  testUnit: {
    fontSize: 12,
    color: '#E5E7EB',
  },
  testArrow: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: theme.spacing.sm,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#E5E7EB',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.roundness,
    width: width * 0.9,
    maxHeight: '80%',
    ...theme.shadows.large,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  modalBody: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  testInfoSection: {
    marginBottom: theme.spacing.lg,
  },
  testInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  testInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  testInfoLabel: {
    fontSize: 14,
    color: theme.colors.placeholder,
  },
  testInfoValue: {
    fontSize: 14,
    color: theme.colors.text,
    fontWeight: '500',
  },
  instructionsSection: {
    marginBottom: theme.spacing.lg,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
  },
  instructionNumber: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: 'bold',
    marginRight: theme.spacing.sm,
  },
  instructionText: {
    fontSize: 14,
    color: theme.colors.text,
    flex: 1,
    lineHeight: 20,
  },
  requirementsSection: {
    marginBottom: theme.spacing.lg,
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  requirementIcon: {
    fontSize: 16,
    marginRight: theme.spacing.sm,
  },
  requirementText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    marginRight: theme.spacing.sm,
    borderRadius: theme.roundness,
    borderWidth: 1,
    borderColor: theme.colors.placeholder,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: theme.colors.placeholder,
    fontWeight: '600',
  },
  startButton: {
    flex: 1,
    borderRadius: theme.roundness,
    marginLeft: theme.spacing.sm,
    ...theme.shadows.medium,
  },
  startButtonGradient: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.roundness,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default TestSelectionScreen;

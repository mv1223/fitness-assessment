import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  TextInput,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../utils/theme';
import { FITNESS_TESTS } from '../utils/constants';

const { width } = Dimensions.get('window');

const LeaderboardScreen = ({ navigation }) => {
  const [selectedTest, setSelectedTest] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    loadLeaderboardData();
  }, [selectedTest, selectedCategory]);

  const loadLeaderboardData = () => {
    // Mock leaderboard data
    const mockData = [
      {
        id: 1,
        name: 'Rajesh Kumar',
        score: 95,
        test: 'Vertical Jump',
        value: 65.5,
        unit: 'cm',
        rank: 1,
        avatar: '👑',
        level: 'Expert',
      },
      {
        id: 2,
        name: 'Priya Sharma',
        score: 92,
        test: 'Sprint 30m',
        value: 4.2,
        unit: 's',
        rank: 2,
        avatar: '🥇',
        level: 'Expert',
      },
      {
        id: 3,
        name: 'Amit Singh',
        score: 89,
        test: 'Sit Ups',
        value: 45,
        unit: 'reps',
        rank: 3,
        avatar: '🥈',
        level: 'Advanced',
      },
      {
        id: 4,
        name: 'Sneha Patel',
        score: 87,
        test: 'Broad Jump',
        value: 2.8,
        unit: 'm',
        rank: 4,
        avatar: '🥉',
        level: 'Advanced',
      },
      {
        id: 5,
        name: 'Vikram Reddy',
        score: 85,
        test: 'Shuttle Run',
        value: 12.5,
        unit: 's',
        rank: 5,
        avatar: '🏆',
        level: 'Advanced',
      },
      {
        id: 6,
        name: 'Anjali Gupta',
        score: 83,
        test: 'Medicine Ball Throw',
        value: 8.5,
        unit: 'm',
        rank: 6,
        avatar: '💪',
        level: 'Intermediate',
      },
      {
        id: 7,
        name: 'Rohit Verma',
        score: 81,
        test: 'Endurance Run',
        value: 6.5,
        unit: 'min',
        rank: 7,
        avatar: '🏃',
        level: 'Intermediate',
      },
      {
        id: 8,
        name: 'Kavya Nair',
        score: 79,
        test: 'Sit and Reach',
        value: 25.5,
        unit: 'cm',
        rank: 8,
        avatar: '🤸',
        level: 'Intermediate',
      },
      {
        id: 9,
        name: 'Arjun Mehta',
        score: 77,
        test: 'Vertical Jump',
        value: 58.2,
        unit: 'cm',
        rank: 9,
        avatar: '⚡',
        level: 'Intermediate',
      },
      {
        id: 10,
        name: 'Divya Joshi',
        score: 75,
        test: 'Sprint 30m',
        value: 5.1,
        unit: 's',
        rank: 10,
        avatar: '🌟',
        level: 'Beginner',
      },
    ];

    let filteredData = mockData;

    // Filter by test
    if (selectedTest !== 'all') {
      filteredData = filteredData.filter(item => item.test === selectedTest);
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      const testCategories = {
        'strength': ['Sit Ups', 'Medicine Ball Throw'],
        'endurance': ['Endurance Run'],
        'speed': ['Sprint 30m'],
        'agility': ['Shuttle Run'],
        'flexibility': ['Sit and Reach'],
        'power': ['Vertical Jump', 'Broad Jump'],
      };
      
      if (testCategories[selectedCategory]) {
        filteredData = filteredData.filter(item => 
          testCategories[selectedCategory].includes(item.test)
        );
      }
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filteredData = filteredData.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.test.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setLeaderboardData(filteredData);
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `#${rank}`;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return '#FFD700';
      case 2:
        return '#C0C0C0';
      case 3:
        return '#CD7F32';
      default:
        return '#FFFFFF';
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Expert':
        return theme.colors.success;
      case 'Advanced':
        return theme.colors.info;
      case 'Intermediate':
        return theme.colors.warning;
      case 'Beginner':
        return theme.colors.placeholder;
      default:
        return '#FFFFFF';
    }
  };

  const getTestIcon = (test) => {
    const icons = {
      'Vertical Jump': '⬆️',
      'Sprint 30m': '🏃',
      'Sit Ups': '💪',
      'Broad Jump': '➡️',
      'Shuttle Run': '🔄',
      'Medicine Ball Throw': '🏐',
      'Endurance Run': '🏃‍♂️',
      'Sit and Reach': '🤸',
    };
    return icons[test] || '🎯';
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Leaderboard</Text>
      <Text style={styles.subtitle}>Top performers across all tests</Text>
    </View>
  );

  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search athletes..."
          placeholderTextColor={theme.colors.placeholder}
        />
      </View>

      {/* Test Filter */}
      <View style={styles.filterRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedTest === 'all' && styles.filterButtonActive
            ]}
            onPress={() => setSelectedTest('all')}
          >
            <Text style={[
              styles.filterButtonText,
              selectedTest === 'all' && styles.filterButtonTextActive
            ]}>
              All Tests
            </Text>
          </TouchableOpacity>
          
          {Object.values(FITNESS_TESTS).map((test) => (
            <TouchableOpacity
              key={test.id}
              style={[
                styles.filterButton,
                selectedTest === test.name && styles.filterButtonActive
              ]}
              onPress={() => setSelectedTest(test.name)}
            >
              <Text style={[
                styles.filterButtonText,
                selectedTest === test.name && styles.filterButtonTextActive
              ]}>
                {test.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Category Filter */}
      <View style={styles.filterRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {[
            { id: 'all', name: 'All Categories', icon: '🎯' },
            { id: 'strength', name: 'Strength', icon: '💪' },
            { id: 'endurance', name: 'Endurance', icon: '🏃' },
            { id: 'speed', name: 'Speed', icon: '⚡' },
            { id: 'agility', name: 'Agility', icon: '🔄' },
            { id: 'flexibility', name: 'Flexibility', icon: '🤸' },
            { id: 'power', name: 'Power', icon: '💥' },
          ].map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.filterButton,
                selectedCategory === category.id && styles.filterButtonActive
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={styles.filterIcon}>{category.icon}</Text>
              <Text style={[
                styles.filterButtonText,
                selectedCategory === category.id && styles.filterButtonTextActive
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );

  const renderLeaderboardItem = (item, index) => (
    <View key={item.id} style={styles.leaderboardItem}>
      <View style={styles.rankContainer}>
        <Text style={[
          styles.rankText,
          { color: getRankColor(item.rank) }
        ]}>
          {getRankIcon(item.rank)}
        </Text>
      </View>
      
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>{item.avatar}</Text>
      </View>
      
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userTest}>{item.test}</Text>
        <Text style={[
          styles.userLevel,
          { color: getLevelColor(item.level) }
        ]}>
          {item.level}
        </Text>
      </View>
      
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreValue}>
          {item.value}{item.unit}
        </Text>
        <Text style={styles.scoreLabel}>Score: {item.score}%</Text>
      </View>
      
      <View style={styles.testIconContainer}>
        <Text style={styles.testIcon}>
          {getTestIcon(item.test)}
        </Text>
      </View>
    </View>
  );

  const renderLeaderboard = () => (
    <View style={styles.leaderboardContainer}>
      {leaderboardData.length > 0 ? (
        leaderboardData.map((item, index) => renderLeaderboardItem(item, index))
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>🔍</Text>
          <Text style={styles.emptyStateTitle}>No results found</Text>
          <Text style={styles.emptyStateText}>
            Try adjusting your filters or search criteria
          </Text>
        </View>
      )}
    </View>
  );

  const renderStats = () => (
    <View style={styles.statsContainer}>
      <Text style={styles.statsTitle}>Leaderboard Stats</Text>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{leaderboardData.length}</Text>
          <Text style={styles.statLabel}>Total Athletes</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {leaderboardData.length > 0 ? Math.round(leaderboardData.reduce((sum, item) => sum + item.score, 0) / leaderboardData.length) : 0}
          </Text>
          <Text style={styles.statLabel}>Average Score</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {leaderboardData.length > 0 ? Math.max(...leaderboardData.map(item => item.score)) : 0}
          </Text>
          <Text style={styles.statLabel}>Highest Score</Text>
        </View>
      </View>
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
          {renderHeader()}
          {renderFilters()}
          {renderStats()}
          {renderLeaderboard()}
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
  filtersContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  searchContainer: {
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
  filterRow: {
    marginBottom: theme.spacing.sm,
  },
  filterScroll: {
    paddingHorizontal: theme.spacing.lg,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.roundness,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginRight: theme.spacing.sm,
  },
  filterButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  filterIcon: {
    fontSize: 16,
    marginRight: theme.spacing.sm,
  },
  filterButtonText: {
    fontSize: 14,
    color: '#E5E7EB',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  statsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.roundness,
    padding: theme.spacing.lg,
    margin: theme.spacing.lg,
    ...theme.shadows.small,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: theme.spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
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
  leaderboardContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.roundness,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.small,
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  rankText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  avatarText: {
    fontSize: 20,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: theme.spacing.xs,
  },
  userTest: {
    fontSize: 12,
    color: '#E5E7EB',
    marginBottom: theme.spacing.xs,
  },
  userLevel: {
    fontSize: 10,
    fontWeight: '600',
  },
  scoreContainer: {
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: theme.spacing.xs,
  },
  scoreLabel: {
    fontSize: 10,
    color: '#E5E7EB',
  },
  testIconContainer: {
    marginLeft: theme.spacing.sm,
  },
  testIcon: {
    fontSize: 20,
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
});

export default LeaderboardScreen;

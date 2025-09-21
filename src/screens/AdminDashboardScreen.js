import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../utils/theme';
import { FITNESS_TESTS } from '../utils/constants';

const { width } = Dimensions.get('window');

const AdminDashboardScreen = ({ navigation }) => {
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 1250,
    totalTests: 8750,
    averageScore: 78.5,
    activeUsers: 450,
    pendingReviews: 25,
    flaggedTests: 8,
    systemHealth: 98.5,
    lastUpdate: '2 minutes ago',
  });

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      user: 'Rajesh Kumar',
      action: 'Completed Vertical Jump Test',
      score: 95,
      time: '5 minutes ago',
      status: 'verified',
    },
    {
      id: 2,
      user: 'Priya Sharma',
      action: 'Flagged for review',
      score: 45,
      time: '15 minutes ago',
      status: 'flagged',
    },
    {
      id: 3,
      user: 'Amit Singh',
      action: 'Completed Sit Ups Test',
      score: 89,
      time: '1 hour ago',
      status: 'verified',
    },
    {
      id: 4,
      user: 'Sneha Patel',
      action: 'System alert triggered',
      score: null,
      time: '2 hours ago',
      status: 'alert',
    },
    {
      id: 5,
      user: 'Vikram Reddy',
      action: 'Completed Sprint Test',
      score: 85,
      time: '3 hours ago',
      status: 'verified',
    },
  ]);

  const [testStats, setTestStats] = useState([
    { test: 'Vertical Jump', completions: 1250, averageScore: 82.3, flagged: 2 },
    { test: 'Sprint 30m', completions: 1180, averageScore: 79.1, flagged: 3 },
    { test: 'Sit Ups', completions: 1100, averageScore: 85.7, flagged: 1 },
    { test: 'Broad Jump', completions: 1050, averageScore: 77.8, flagged: 2 },
    { test: 'Shuttle Run', completions: 980, averageScore: 81.2, flagged: 0 },
    { test: 'Medicine Ball Throw', completions: 920, averageScore: 76.5, flagged: 1 },
    { test: 'Endurance Run', completions: 850, averageScore: 83.4, flagged: 1 },
    { test: 'Sit and Reach', completions: 800, averageScore: 79.8, flagged: 0 },
  ]);

  const handleViewUsers = () => {
    Alert.alert('View Users', 'Navigate to user management screen');
  };

  const handleViewReports = () => {
    Alert.alert('View Reports', 'Navigate to reports screen');
  };

  const handleViewFlagged = () => {
    Alert.alert('View Flagged Tests', 'Navigate to flagged tests screen');
  };

  const handleSystemSettings = () => {
    Alert.alert('System Settings', 'Navigate to system settings screen');
  };

  const handleExportData = () => {
    Alert.alert('Export Data', 'Data export initiated');
  };

  const handleRefresh = () => {
    Alert.alert('Refresh', 'Dashboard data refreshed');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return theme.colors.success;
      case 'flagged':
        return theme.colors.error;
      case 'alert':
        return theme.colors.warning;
      default:
        return theme.colors.placeholder;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return '✅';
      case 'flagged':
        return '🚩';
      case 'alert':
        return '⚠️';
      default:
        return '📊';
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <Text style={styles.subtitle}>System Overview & Management</Text>
      <TouchableOpacity
        style={styles.refreshButton}
        onPress={handleRefresh}
      >
        <Text style={styles.refreshButtonText}>🔄 Refresh</Text>
      </TouchableOpacity>
    </View>
  );

  const renderOverviewCards = () => (
    <View style={styles.overviewContainer}>
      <View style={styles.overviewRow}>
        <View style={styles.overviewCard}>
          <Text style={styles.overviewIcon}>👥</Text>
          <Text style={styles.overviewNumber}>{dashboardData.totalUsers.toLocaleString()}</Text>
          <Text style={styles.overviewLabel}>Total Users</Text>
        </View>
        <View style={styles.overviewCard}>
          <Text style={styles.overviewIcon}>🎯</Text>
          <Text style={styles.overviewNumber}>{dashboardData.totalTests.toLocaleString()}</Text>
          <Text style={styles.overviewLabel}>Tests Completed</Text>
        </View>
      </View>
      
      <View style={styles.overviewRow}>
        <View style={styles.overviewCard}>
          <Text style={styles.overviewIcon}>📊</Text>
          <Text style={styles.overviewNumber}>{dashboardData.averageScore}%</Text>
          <Text style={styles.overviewLabel}>Average Score</Text>
        </View>
        <View style={styles.overviewCard}>
          <Text style={styles.overviewIcon}>🟢</Text>
          <Text style={styles.overviewNumber}>{dashboardData.activeUsers}</Text>
          <Text style={styles.overviewLabel}>Active Users</Text>
        </View>
      </View>
    </View>
  );

  const renderSystemStatus = () => (
    <View style={styles.systemStatusContainer}>
      <Text style={styles.sectionTitle}>System Status</Text>
      
      <View style={styles.statusRow}>
        <Text style={styles.statusLabel}>System Health</Text>
        <View style={styles.statusBar}>
          <View 
            style={[
              styles.statusBarFill,
              { width: `${dashboardData.systemHealth}%` }
            ]}
          />
        </View>
        <Text style={styles.statusValue}>{dashboardData.systemHealth}%</Text>
      </View>
      
      <View style={styles.statusRow}>
        <Text style={styles.statusLabel}>Pending Reviews</Text>
        <Text style={[styles.statusValue, { color: theme.colors.warning }]}>
          {dashboardData.pendingReviews}
        </Text>
      </View>
      
      <View style={styles.statusRow}>
        <Text style={styles.statusLabel}>Flagged Tests</Text>
        <Text style={[styles.statusValue, { color: theme.colors.error }]}>
          {dashboardData.flaggedTests}
        </Text>
      </View>
      
      <View style={styles.statusRow}>
        <Text style={styles.statusLabel}>Last Update</Text>
        <Text style={styles.statusValue}>{dashboardData.lastUpdate}</Text>
      </View>
    </View>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      
      <View style={styles.actionsGrid}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleViewUsers}
        >
          <Text style={styles.actionIcon}>👥</Text>
          <Text style={styles.actionText}>View Users</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleViewReports}
        >
          <Text style={styles.actionIcon}>📊</Text>
          <Text style={styles.actionText}>View Reports</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleViewFlagged}
        >
          <Text style={styles.actionIcon}>🚩</Text>
          <Text style={styles.actionText}>Flagged Tests</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleSystemSettings}
        >
          <Text style={styles.actionIcon}>⚙️</Text>
          <Text style={styles.actionText}>Settings</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleExportData}
        >
          <Text style={styles.actionIcon}>📤</Text>
          <Text style={styles.actionText}>Export Data</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Text style={styles.actionIcon}>🏠</Text>
          <Text style={styles.actionText}>User View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderTestStats = () => (
    <View style={styles.testStatsContainer}>
      <Text style={styles.sectionTitle}>Test Statistics</Text>
      
      {testStats.map((stat, index) => (
        <View key={index} style={styles.testStatItem}>
          <View style={styles.testStatInfo}>
            <Text style={styles.testStatName}>{stat.test}</Text>
            <Text style={styles.testStatCompletions}>
              {stat.completions.toLocaleString()} completions
            </Text>
          </View>
          
          <View style={styles.testStatScores}>
            <Text style={styles.testStatScore}>
              Avg: {stat.averageScore}%
            </Text>
            <Text style={[
              styles.testStatFlagged,
              { color: stat.flagged > 0 ? theme.colors.error : theme.colors.success }
            ]}>
              {stat.flagged} flagged
            </Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderRecentActivity = () => (
    <View style={styles.recentActivityContainer}>
      <Text style={styles.sectionTitle}>Recent Activity</Text>
      
      {recentActivity.map((activity) => (
        <View key={activity.id} style={styles.activityItem}>
          <View style={styles.activityIcon}>
            <Text style={styles.activityIconText}>
              {getStatusIcon(activity.status)}
            </Text>
          </View>
          
          <View style={styles.activityInfo}>
            <Text style={styles.activityUser}>{activity.user}</Text>
            <Text style={styles.activityAction}>{activity.action}</Text>
            <Text style={styles.activityTime}>{activity.time}</Text>
          </View>
          
          {activity.score && (
            <View style={styles.activityScore}>
              <Text style={[
                styles.activityScoreText,
                { color: getStatusColor(activity.status) }
              ]}>
                {activity.score}%
              </Text>
            </View>
          )}
        </View>
      ))}
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
          {renderOverviewCards()}
          {renderSystemStatus()}
          {renderQuickActions()}
          {renderTestStats()}
          {renderRecentActivity()}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 16,
    color: '#E5E7EB',
  },
  refreshButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: theme.roundness,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  refreshButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  overviewContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  overviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  overviewCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.roundness,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.xs,
    alignItems: 'center',
    ...theme.shadows.small,
  },
  overviewIcon: {
    fontSize: 24,
    marginBottom: theme.spacing.sm,
  },
  overviewNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: theme.spacing.xs,
  },
  overviewLabel: {
    fontSize: 12,
    color: '#E5E7EB',
    textAlign: 'center',
  },
  systemStatusContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.roundness,
    padding: theme.spacing.lg,
    margin: theme.spacing.lg,
    ...theme.shadows.small,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: theme.spacing.md,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  statusLabel: {
    fontSize: 14,
    color: '#E5E7EB',
    flex: 1,
  },
  statusBar: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    marginHorizontal: theme.spacing.sm,
  },
  statusBarFill: {
    height: 8,
    backgroundColor: theme.colors.success,
    borderRadius: 4,
  },
  statusValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'right',
  },
  quickActionsContainer: {
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '30%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.roundness,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
    ...theme.shadows.small,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: theme.spacing.sm,
  },
  actionText: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
  },
  testStatsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.roundness,
    padding: theme.spacing.lg,
    margin: theme.spacing.lg,
    ...theme.shadows.small,
  },
  testStatItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  testStatInfo: {
    flex: 1,
  },
  testStatName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: theme.spacing.xs,
  },
  testStatCompletions: {
    fontSize: 12,
    color: '#E5E7EB',
  },
  testStatScores: {
    alignItems: 'flex-end',
  },
  testStatScore: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
  },
  testStatFlagged: {
    fontSize: 10,
    fontWeight: '600',
  },
  recentActivityContainer: {
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
  activityUser: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: theme.spacing.xs,
  },
  activityAction: {
    fontSize: 12,
    color: '#E5E7EB',
    marginBottom: theme.spacing.xs,
  },
  activityTime: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  activityScore: {
    marginLeft: theme.spacing.sm,
  },
  activityScoreText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default AdminDashboardScreen;

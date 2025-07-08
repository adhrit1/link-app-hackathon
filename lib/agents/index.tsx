import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types
export interface StudentProfile {
  id: string;
  name: string;
  major: string;
  year: string;
  interests: string[];
  gpa: number;
  studyStyle: 'group' | 'individual' | 'mixed';
  activityLevel: 'high' | 'medium' | 'low';
  goals: {
    academic: string[];
    career: string[];
    personal: string[];
  };
}

export interface AgentRecommendation {
  type: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  reasoning: string;
}

export interface AgentInteraction {
  agentId: string;
  timestamp: Date;
  type: 'recommendation' | 'question' | 'assistance' | 'learning';
  content: string;
  response: string;
}

// Base Agent
abstract class BaseAgent {
  protected id: string;
  protected name: string;
  protected role: string;
  protected memory: any[] = [];

  constructor(id: string, name: string, role: string) {
    this.id = id;
    this.name = name;
    this.role = role;
  }

  abstract process(input: any): Promise<any>;
  
  protected addToMemory(data: any) {
    this.memory.push({
      timestamp: new Date(),
      data
    });
    if (this.memory.length > 50) {
      this.memory = this.memory.slice(-50);
    }
  }

  getInfo() {
    return {
      id: this.id,
      name: this.name,
      role: this.role,
      memoryCount: this.memory.length
    };
  }
}

// Student Profiling Agent
class StudentProfilingAgent extends BaseAgent {
  private profiles: Map<string, StudentProfile> = new Map();

  constructor() {
    super('profiler', 'Student Profiler', 'Profile Analysis & Learning');
  }

  async process(input: any): Promise<any> {
    const { studentId, action, data } = input;

    switch (action) {
      case 'update_profile':
        return this.updateProfile(studentId, data);
      case 'get_profile':
        return this.getProfile(studentId);
      case 'analyze_behavior':
        return this.analyzeBehavior(studentId, data);
      case 'get_recommendations':
        return this.getRecommendations(studentId);
      default:
        return { error: 'Unknown action' };
    }
  }

  private updateProfile(studentId: string, data: Partial<StudentProfile>) {
    const existing = this.profiles.get(studentId) || this.createDefaultProfile(studentId);
    const updated = { ...existing, ...data };
    this.profiles.set(studentId, updated);
    
    this.addToMemory({
      type: 'profile_update',
      studentId,
      changes: data
    });

    return { success: true, profile: updated };
  }

  private getProfile(studentId: string) {
    const profile = this.profiles.get(studentId);
    return profile || this.createDefaultProfile(studentId);
  }

  private createDefaultProfile(studentId: string): StudentProfile {
    return {
      id: studentId,
      name: 'Student',
      major: 'Undeclared',
      year: 'Freshman',
      interests: [],
      gpa: 0,
      studyStyle: 'mixed',
      activityLevel: 'medium',
      goals: {
        academic: [],
        career: [],
        personal: []
      }
    };
  }

  private analyzeBehavior(studentId: string, data: any) {
    const profile = this.profiles.get(studentId);
    if (!profile) return { error: 'Profile not found' };

    const analysis = {
      academicTrends: this.analyzeAcademicTrends(profile, data),
      socialPatterns: this.analyzeSocialPatterns(profile, data),
      learningStyle: this.analyzeLearningStyle(profile, data),
      recommendations: this.generateRecommendations(profile, data)
    };

    this.addToMemory({
      type: 'behavior_analysis',
      studentId,
      analysis
    });

    return analysis;
  }

  private analyzeAcademicTrends(profile: StudentProfile, data: any) {
    return {
      gpaTrend: profile.gpa > 3.0 ? 'good' : 'needs_improvement',
      studyEffectiveness: this.calculateStudyEffectiveness(data),
      improvementAreas: this.identifyImprovementAreas(profile, data)
    };
  }

  private analyzeSocialPatterns(profile: StudentProfile, data: any) {
    return {
      socialEngagement: profile.activityLevel,
      groupPreferences: this.identifyGroupPreferences(data),
      communicationStyle: 'collaborative'
    };
  }

  private analyzeLearningStyle(profile: StudentProfile, data: any) {
    return {
      preferredMethod: profile.studyStyle,
      studyTimes: this.extractStudyTimes(data),
      subjectEngagement: this.calculateSubjectEngagement(data)
    };
  }

  private generateRecommendations(profile: StudentProfile, data: any): AgentRecommendation[] {
    const recommendations: AgentRecommendation[] = [];

    // Academic recommendations
    if (profile.gpa < 3.0) {
      recommendations.push({
        type: 'academic',
        title: 'Academic Support Needed',
        description: 'Consider tutoring services and study groups',
        priority: 'high',
        reasoning: 'GPA below 3.0 indicates need for additional support'
      });
    }

    // Social recommendations
    if (profile.activityLevel === 'low') {
      recommendations.push({
        type: 'social',
        title: 'Increase Social Engagement',
        description: 'Join clubs and attend campus events',
        priority: 'medium',
        reasoning: 'Low activity level suggests need for social connection'
      });
    }

    return recommendations;
  }

  private getRecommendations(studentId: string) {
    const profile = this.profiles.get(studentId);
    if (!profile) return { error: 'Profile not found' };

    return {
      academic: this.getAcademicRecommendations(profile),
      social: this.getSocialRecommendations(profile),
      career: this.getCareerRecommendations(profile),
      personal: this.getPersonalRecommendations(profile)
    };
  }

  private getAcademicRecommendations(profile: StudentProfile) {
    const recommendations = [];
    
    if (profile.gpa < 3.0) {
      recommendations.push({
        title: 'Academic Support',
        description: 'Consider tutoring and study groups',
        priority: 'high'
      });
    }

    if (profile.major === 'Undeclared') {
      recommendations.push({
        title: 'Major Exploration',
        description: 'Take exploratory courses and meet with advisors',
        priority: 'medium'
      });
    }

    return recommendations;
  }

  private getSocialRecommendations(profile: StudentProfile) {
    const recommendations = [];
    
    if (profile.activityLevel === 'low') {
      recommendations.push({
        title: 'Join Student Organizations',
        description: 'Find clubs that match your interests',
        priority: 'medium'
      });
    }

    if (profile.studyStyle === 'group') {
      recommendations.push({
        title: 'Study Groups',
        description: 'Connect with classmates for collaborative learning',
        priority: 'medium'
      });
    }

    return recommendations;
  }

  private getCareerRecommendations(profile: StudentProfile) {
    const recommendations = [];
    
    recommendations.push({
      title: 'Career Services',
      description: 'Visit the career center for guidance',
      priority: 'medium'
    });

    if (profile.major !== 'Undeclared') {
      recommendations.push({
        title: 'Internship Search',
        description: 'Look for internships in your field',
        priority: 'medium'
      });
    }

    return recommendations;
  }

  private getPersonalRecommendations(profile: StudentProfile) {
    const recommendations = [];
    
    recommendations.push({
      title: 'Wellness Resources',
      description: 'Utilize campus wellness and mental health services',
      priority: 'medium'
    });

    return recommendations;
  }

  private calculateStudyEffectiveness(data: any): number {
    return 0.75; // Placeholder
  }

  private identifyImprovementAreas(profile: StudentProfile, data: any): string[] {
    return ['Time management', 'Note-taking', 'Test preparation'];
  }

  private identifyGroupPreferences(data: any): string[] {
    return ['Study groups', 'Club activities', 'Team projects'];
  }

  private extractStudyTimes(data: any): string[] {
    return ['Morning', 'Afternoon', 'Evening'];
  }

  private calculateSubjectEngagement(data: any): { [key: string]: number } {
    return {
      'Computer Science': 0.8,
      'Mathematics': 0.6,
      'English': 0.4
    };
  }

  private getCourseSuggestions(major: string): string {
    const suggestions: { [key: string]: string } = {
      'Computer Science': 'CS 61A, CS 61B, CS 70',
      'Mathematics': 'Math 1A, Math 1B, Math 53',
      'Physics': 'Physics 7A, Physics 7B, Physics 7C'
    };
    return suggestions[major] || 'General education courses';
  }

  private getDormSuggestion(studyStyle: string): string {
    if (studyStyle === 'group') return 'Units 1-3 (more social)';
    if (studyStyle === 'individual') return 'Blackwell Hall (quieter)';
    return 'Any dorm (mixed environment)';
  }

  private getActivitySuggestions(interests: string[], activityLevel: string): string {
    const suggestions = [];
    if (interests.includes('technology')) suggestions.push('CS clubs, hackathons');
    if (interests.includes('sports')) suggestions.push('Intramural sports, RSF');
    if (activityLevel === 'low') suggestions.push('Start with one club, gradually increase');
    return suggestions.join(', ') || 'Explore campus events and clubs';
  }

  private getInternshipSuggestions(major: string): string {
    return 'Check Handshake, attend career fairs, network with alumni';
  }

  private getSkillSuggestions(major: string): string {
    const skills: { [key: string]: string } = {
      'Computer Science': 'Programming, algorithms, data structures',
      'Business': 'Leadership, communication, analytics',
      'Engineering': 'Problem-solving, technical skills, teamwork'
    };
    return skills[major] || 'Communication, leadership, technical skills';
  }

  private getWellnessSuggestions(activityLevel: string): string {
    if (activityLevel === 'low') return 'Start with walking, join fitness classes';
    if (activityLevel === 'high') return 'Balance activity with rest and recovery';
    return 'Maintain current activity level, add variety';
  }
}

// Recommendation Agent
class RecommendationAgent extends BaseAgent {
  private profilerAgent: StudentProfilingAgent;

  constructor(profilerAgent: StudentProfilingAgent) {
    super('recommender', 'Recommendation Engine', 'Personalized Recommendations');
    this.profilerAgent = profilerAgent;
  }

  async process(input: any): Promise<any> {
    const { studentId, action, data } = input;

    switch (action) {
      case 'recommend_courses':
        return this.recommendCourses(studentId, data);
      case 'recommend_activities':
        return this.recommendActivities(studentId, data);
      case 'recommend_resources':
        return this.recommendResources(studentId, data);
      case 'recommend_opportunities':
        return this.recommendOpportunities(studentId, data);
      default:
        return { error: 'Unknown action' };
    }
  }

  private async recommendCourses(studentId: string, preferences: any) {
    const profile = await this.profilerAgent.process({
      studentId,
      action: 'get_profile'
    });

    const recommendations = {
      required: ['Math 1A', 'English R1A'],
      recommended: ['CS 61A', 'Data 8'],
      exploratory: ['Psychology 1', 'Economics 1'],
      reasoning: 'Based on your major and interests'
    };

    this.addToMemory({
      type: 'course_recommendation',
      studentId,
      recommendations
    });

    return recommendations;
  }

  private async recommendActivities(studentId: string, preferences: any) {
    const recommendations = {
      clubs: ['CS Club', 'Data Science Club', 'Entrepreneurship Club'],
      events: ['Career Fair', 'Hackathon', 'Study Abroad Info Session'],
      resources: ['Tutoring Center', 'Writing Center', 'Career Services'],
      reasoning: 'Based on your interests and activity level'
    };

    this.addToMemory({
      type: 'activity_recommendation',
      studentId,
      recommendations
    });

    return recommendations;
  }

  private async recommendResources(studentId: string, preferences: any) {
    const recommendations = {
      academic: ['Library resources', 'Online databases', 'Study spaces'],
      career: ['Resume workshops', 'Interview prep', 'Networking events'],
      wellness: ['Counseling services', 'Health center', 'Fitness classes'],
      reasoning: 'Comprehensive support for student success'
    };

    this.addToMemory({
      type: 'resource_recommendation',
      studentId,
      recommendations
    });

    return recommendations;
  }

  private async recommendOpportunities(studentId: string, preferences: any) {
    const recommendations = {
      internships: ['Google STEP', 'Microsoft Explore', 'Local startups'],
      research: ['URAP program', 'Faculty research', 'Independent study'],
      leadership: ['Student government', 'Club leadership', 'Peer mentoring'],
      reasoning: 'Opportunities aligned with your goals'
    };

    this.addToMemory({
      type: 'opportunity_recommendation',
      studentId,
      recommendations
    });

    return recommendations;
  }
}

// Learning Agent
class LearningAgent extends BaseAgent {
  private profilerAgent: StudentProfilingAgent;

  constructor(profilerAgent: StudentProfilingAgent) {
    super('learner', 'Learning Optimizer', 'Learning Strategy & Optimization');
    this.profilerAgent = profilerAgent;
  }

  async process(input: any): Promise<any> {
    const { studentId, action, data } = input;

    switch (action) {
      case 'optimize_learning':
        return this.optimizeLearning(studentId, data);
      case 'create_study_plan':
        return this.createStudyPlan(studentId, data);
      case 'analyze_performance':
        return this.analyzePerformance(studentId, data);
      default:
        return { error: 'Unknown action' };
    }
  }

  private async optimizeLearning(studentId: string, data: any) {
    const profile = await this.profilerAgent.process({
      studentId,
      action: 'get_profile'
    });

    const optimization = {
      studyTechniques: profile.studyStyle === 'group' ? 
        ['Group study sessions', 'Peer teaching', 'Discussion groups'] :
        ['Pomodoro technique', 'Active recall', 'Spaced repetition'],
      timeManagement: {
        studyBlocks: '2-3 hour focused sessions',
        breaks: '15-minute breaks every hour',
        review: 'Daily review of new material'
      },
      environment: profile.studyStyle === 'individual' ?
        'Quiet library or study room' : 'Group study spaces',
      reasoning: 'Optimized for your learning style and preferences'
    };

    this.addToMemory({
      type: 'learning_optimization',
      studentId,
      optimization
    });

    return optimization;
  }

  private async createStudyPlan(studentId: string, data: any) {
    const plan = {
      daily: {
        morning: ['Review previous material', 'Read new content'],
        afternoon: ['Active study sessions', 'Practice problems'],
        evening: ['Reflect on learning', 'Prepare for tomorrow']
      },
      weekly: {
        monday: 'New concepts and theory',
        tuesday: 'Practice and application',
        wednesday: 'Review and reinforcement',
        thursday: 'Advanced topics',
        friday: 'Assessment and reflection'
      },
      examPrep: {
        '2_weeks_before': 'Review all material',
        '1_week_before': 'Practice exams',
        '3_days_before': 'Focus on weak areas',
        '1_day_before': 'Light review and rest'
      }
    };

    this.addToMemory({
      type: 'study_plan_creation',
      studentId,
      plan
    });

    return plan;
  }

  private async analyzePerformance(studentId: string, data: any) {
    const analysis = {
      strengths: ['Analytical thinking', 'Problem solving', 'Time management'],
      weaknesses: ['Test anxiety', 'Procrastination', 'Note-taking'],
      trends: {
        improvement: 'Steady progress in most areas',
        challenges: 'Consistent difficulty with certain topics',
        patterns: 'Better performance in morning sessions'
      },
      recommendations: [
        'Implement more active learning strategies',
        'Increase practice with difficult topics',
        'Develop better note-taking techniques'
      ]
    };

    this.addToMemory({
      type: 'performance_analysis',
      studentId,
      analysis
    });

    return analysis;
  }
}

// Agent System Manager
export class AgentSystemManager {
  private agents: Map<string, BaseAgent> = new Map();
  private interactions: AgentInteraction[] = [];
  private isInitialized: boolean = false;

  constructor() {
    this.initializeAgents();
  }

  private initializeAgents() {
    const profilerAgent = new StudentProfilingAgent();
    const recommendationAgent = new RecommendationAgent(profilerAgent);
    const learningAgent = new LearningAgent(profilerAgent);

    this.agents.set('profiler', profilerAgent);
    this.agents.set('recommender', recommendationAgent);
    this.agents.set('learner', learningAgent);

    this.isInitialized = true;
  }

  async processRequest(studentId: string, request: any): Promise<any> {
    if (!this.isInitialized) {
      throw new Error('Agent system not initialized');
    }

    const { agentId, action, data } = request;
    const agent = this.agents.get(agentId);

    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }

    try {
      const result = await agent.process({ studentId, action, data });
      
      this.recordInteraction(agentId, studentId, action, data, result);
      
      return result;
    } catch (error) {
      console.error(`Error processing request for agent ${agentId}:`, error);
      throw error;
    }
  }

  private recordInteraction(agentId: string, studentId: string, action: string, data: any, result: any) {
    const interaction: AgentInteraction = {
      agentId,
      timestamp: new Date(),
      type: this.determineInteractionType(action),
      content: JSON.stringify(data),
      response: JSON.stringify(result)
    };

    this.interactions.push(interaction);
  }

  private determineInteractionType(action: string): 'recommendation' | 'question' | 'assistance' | 'learning' {
    if (action.includes('recommend')) return 'recommendation';
    if (action.includes('question')) return 'question';
    if (action.includes('learn') || action.includes('optimize')) return 'learning';
    return 'assistance';
  }

  getAgentInfo(agentId: string) {
    const agent = this.agents.get(agentId);
    return agent ? agent.getInfo() : null;
  }

  getAllAgents() {
    return Array.from(this.agents.values()).map(agent => agent.getInfo());
  }

  getInteractions(studentId?: string): AgentInteraction[] {
    if (studentId) {
      return this.interactions.filter(interaction => 
        interaction.content.includes(studentId)
      );
    }
    return this.interactions;
  }

  getSystemStatus() {
    return {
      isInitialized: this.isInitialized,
      agentCount: this.agents.size,
      totalInteractions: this.interactions.length,
      activeAgents: Array.from(this.agents.values()).length
    };
  }
}

// React Context
interface AgentSystemContextType {
  agentSystem: AgentSystemManager;
  currentStudentId: string | null;
  setCurrentStudentId: (id: string) => void;
  processRequest: (request: any) => Promise<any>;
  getAgentInfo: (agentId: string) => any;
  getAllAgents: () => any[];
  getInteractions: (studentId?: string) => AgentInteraction[];
  getSystemStatus: () => any;
}

const AgentSystemContext = createContext<AgentSystemContextType | null>(null);

export const useAgentSystem = () => {
  const context = useContext(AgentSystemContext);
  if (!context) {
    throw new Error('useAgentSystem must be used within an AgentSystemProvider');
  }
  return context;
};

interface AgentSystemProviderProps {
  children: ReactNode;
}

export const AgentSystemProvider = ({ children }: AgentSystemProviderProps) => {
  const [agentSystem] = useState(() => new AgentSystemManager());
  const [currentStudentId, setCurrentStudentId] = useState<string | null>(null);

  const processRequest = async (request: any) => {
    if (!currentStudentId) {
      throw new Error('No student ID set');
    }
    return await agentSystem.processRequest(currentStudentId, request);
  };

  const value: AgentSystemContextType = {
    agentSystem,
    currentStudentId,
    setCurrentStudentId,
    processRequest,
    getAgentInfo: (agentId: string) => agentSystem.getAgentInfo(agentId),
    getAllAgents: () => agentSystem.getAllAgents(),
    getInteractions: (studentId?: string) => agentSystem.getInteractions(studentId),
    getSystemStatus: () => agentSystem.getSystemStatus()
  };

  return (
    <AgentSystemContext.Provider value={value}>
      {children}
    </AgentSystemContext.Provider>
  );
}; 
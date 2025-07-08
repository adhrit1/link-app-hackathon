"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

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

// Student Profiling Agent
class StudentProfilingAgent {
  private profiles: Map<string, StudentProfile> = new Map();

  async process(input: any): Promise<any> {
    const { studentId, action, data } = input;
    console.log('StudentProfilingAgent processing:', { studentId, action, data });

    switch (action) {
      case 'get_profile':
        const profile = this.getProfile(studentId);
        console.log('Returning profile:', profile);
        return profile;
      case 'update_profile':
        return this.updateProfile(studentId, data);
      case 'get_recommendations':
        const recommendations = this.getRecommendations(studentId);
        console.log('Returning recommendations:', recommendations);
        return recommendations;
      default:
        return { error: 'Unknown action' };
    }
  }

  private updateProfile(studentId: string, data: Partial<StudentProfile>) {
    const existing = this.profiles.get(studentId) || this.createDefaultProfile(studentId);
    const updated = { ...existing, ...data };
    this.profiles.set(studentId, updated);
    return { success: true, profile: updated };
  }

  private getProfile(studentId: string) {
    let profile = this.profiles.get(studentId);
    if (!profile) {
      profile = this.createDefaultProfile(studentId);
      this.profiles.set(studentId, profile);
    }
    return profile;
  }

  private createDefaultProfile(studentId: string): StudentProfile {
    return {
      id: studentId,
      name: '',
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

  private getRecommendations(studentId: string) {
    const profile = this.getProfile(studentId);
    if (!profile) return { error: 'Profile not found' };

    const recommendations: AgentRecommendation[] = [];

    // Academic recommendations for freshmen
    if (profile.major === 'Undeclared') {
      recommendations.push({
        type: 'academic',
        title: 'Explore Your Interests',
        description: 'Take general education courses to discover your passions and potential majors',
        priority: 'high',
        reasoning: 'As a freshman, exploring different subjects helps you make informed major decisions'
      });
    }

    // GPA recommendations
    if (profile.gpa < 2.0) {
      recommendations.push({
        type: 'academic',
        title: 'Academic Support Needed',
        description: 'Consider tutoring services, study groups, and academic advising',
        priority: 'high',
        reasoning: 'Low GPA indicates need for additional academic support'
      });
    } else if (profile.gpa >= 3.5) {
      recommendations.push({
        type: 'academic',
        title: 'Honors Program Opportunity',
        description: 'Consider applying for honors programs and advanced courses',
        priority: 'medium',
        reasoning: 'High GPA qualifies you for advanced academic opportunities'
      });
    }

    // Social recommendations for freshmen
    if (profile.activityLevel === 'low') {
      recommendations.push({
        type: 'social',
        title: 'Get Involved on Campus',
        description: 'Join freshman orientation groups, campus clubs, and attend welcome events',
        priority: 'medium',
        reasoning: 'Freshman year is the perfect time to build social connections'
      });
    }

    // Freshman-specific recommendations
    recommendations.push({
      type: 'academic',
      title: 'First-Year Success',
      description: 'Attend office hours, join study groups, and use campus resources like the library and writing center',
      priority: 'high',
      reasoning: 'Establishing good academic habits early sets you up for success'
    });

    // Housing recommendations for freshmen
    recommendations.push({
      type: 'social',
      title: 'Dorm Life Tips',
      description: 'Get to know your roommate, participate in dorm activities, and explore campus together',
      priority: 'medium',
      reasoning: 'Dorm life is a key part of the freshman experience'
    });

    return {
      academic: this.getAcademicRecommendations(profile),
      social: this.getSocialRecommendations(profile),
      career: this.getCareerRecommendations(profile),
      personal: this.getPersonalRecommendations(profile),
      all: recommendations
    };
  }

  private getAcademicRecommendations(profile: StudentProfile) {
    const recommendations = [];

    if (profile.major === 'Undeclared') {
      recommendations.push({
        type: 'course_selection',
        courses: 'General Education requirements, Introduction courses in various subjects',
        reasoning: 'Explore different fields to find your passion'
      });
    } else {
      recommendations.push({
        type: 'course_selection',
        courses: this.getCourseSuggestions(profile.major),
        reasoning: 'Based on your major'
      });
    }

    if (profile.gpa < 2.0) {
      recommendations.push({
        type: 'study_improvement',
        suggestion: 'Increase study hours, seek tutoring, and attend office hours',
        reasoning: 'GPA indicates need for academic support'
      });
    }

    // Freshman-specific recommendations
    recommendations.push({
      type: 'academic_habits',
      suggestion: 'Establish good study habits, use campus resources, and attend all classes',
      reasoning: 'First year sets the foundation for academic success'
    });

    return recommendations;
  }

  private getSocialRecommendations(profile: StudentProfile) {
    return [
      {
        type: 'housing',
        suggestion: 'Get involved in dorm activities and build relationships with your floor mates',
        reasoning: 'Dorm life is central to the freshman experience'
      },
      {
        type: 'activities',
        suggestions: 'Join freshman orientation groups, campus clubs, and attend welcome week events',
        reasoning: 'Freshman year is the perfect time to explore campus life'
      },
      {
        type: 'campus_exploration',
        suggestions: 'Explore campus facilities, attend sporting events, and visit the student union',
        reasoning: 'Familiarize yourself with campus resources and activities'
      }
    ];
  }

  private getCareerRecommendations(profile: StudentProfile) {
    return [
      {
        type: 'exploration',
        suggestions: 'Attend career fairs, explore different majors, and talk to upperclassmen about their experiences',
        reasoning: 'Freshman year is about exploration and discovery'
      },
      {
        type: 'skill_building',
        suggestions: 'Develop study skills, time management, and communication abilities',
        reasoning: 'These foundational skills will serve you throughout your academic career'
      },
      {
        type: 'networking',
        suggestions: 'Build relationships with professors, advisors, and fellow students',
        reasoning: 'Early networking helps with future opportunities'
      }
    ];
  }

  private getPersonalRecommendations(profile: StudentProfile) {
    return [
      {
        type: 'wellness',
        suggestions: 'Maintain a healthy sleep schedule, eat well, and find time for exercise and relaxation',
        reasoning: 'Physical and mental health are crucial for academic success'
      },
      {
        type: 'adjustment',
        suggestions: 'Give yourself time to adjust to college life, seek support when needed, and stay connected with family',
        reasoning: 'The transition to college can be challenging - be patient with yourself'
      },
      {
        type: 'balance',
        suggestions: 'Find the right balance between academics, social life, and personal time',
        reasoning: 'Learning to manage multiple priorities is a key college skill'
      }
    ];
  }

  // Helper methods
  private getCourseSuggestions(major: string): string {
    const courseSuggestions: { [key: string]: string } = {
      'Computer Science': 'CS 61A (Structure), CS 61B (Data Structures), CS 61C (Machine Structures), CS 70 (Discrete Math), CS 170 (Algorithms)',
      'Business': 'Business Administration core courses, Economics, Statistics, Marketing',
      'Engineering': 'Engineering fundamentals, Physics, Calculus, Design courses',
      'Psychology': 'Introduction to Psychology, Research Methods, Statistics, Cognitive Psychology',
      'Biology': 'General Biology, Chemistry, Physics, Advanced Biology courses',
      'Mathematics': 'Calculus sequence, Linear Algebra, Abstract Algebra, Analysis',
      'English': 'Literature courses, Writing workshops, Creative writing, Literary theory'
    };
    return courseSuggestions[major] || 'General Education requirements and major prerequisites';
  }

  private getDormSuggestion(studyStyle: string): string {
    const suggestions: { [key: string]: string } = {
      'quiet': 'Unit 1 or Unit 2 - quieter environment',
      'social': 'Unit 3 or Clark Kerr - more social atmosphere',
      'mixed': 'Any unit - balanced environment'
    };
    return suggestions[studyStyle] || 'Any unit';
  }

  private getActivitySuggestions(interests: string[], activityLevel: string): string {
    const activities = [
      'Join clubs related to your interests',
      'Participate in intramural sports',
      'Attend campus events',
      'Volunteer opportunities'
    ];

    if (activityLevel === 'high') {
      activities.push('Leadership positions', 'Multiple clubs');
    }

    return activities.join(', ');
  }

  private getInternshipSuggestions(major: string): string {
    return 'Tech companies, startups, research positions, industry-specific internships';
  }

  private getSkillSuggestions(major: string): string {
    const skills: { [key: string]: string } = {
      'Computer Science': 'Programming, Data Structures, Algorithms, Machine Learning',
      'Business': 'Leadership, Communication, Analytics, Project Management',
      'Engineering': 'Technical Skills, Problem Solving, Design, Teamwork',
      'Psychology': 'Research Methods, Statistics, Communication, Critical Thinking'
    };
    return skills[major] || 'Communication, Leadership, Problem Solving';
  }

  private getWellnessSuggestions(activityLevel: string): string {
    const activities = ['Regular exercise', 'Healthy eating', 'Adequate sleep', 'Stress management'];

    if (activityLevel === 'high') {
      activities.push('Intensive workouts', 'Sports teams');
    } else if (activityLevel === 'low') {
      activities.push('Gentle yoga', 'Walking', 'Meditation');
    }

    return activities.join(', ');
  }
}

// Recommendation Agent
class RecommendationAgent {
  private profilerAgent: StudentProfilingAgent;

  constructor(profilerAgent: StudentProfilingAgent) {
    this.profilerAgent = profilerAgent;
  }

  async process(input: any): Promise<any> {
    const { studentId, category, preferences } = input;

    switch (category) {
      case 'courses':
        return this.recommendCourses(studentId, preferences);
      case 'activities':
        return this.recommendActivities(studentId, preferences);
      case 'resources':
        return this.recommendResources(studentId, preferences);
      case 'opportunities':
        return this.recommendOpportunities(studentId, preferences);
      default:
        return { error: 'Unknown category' };
    }
  }

  private async recommendCourses(studentId: string, preferences: any) {
    const recommendations = {
      required: ['General Education requirements', 'Major prerequisites'],
      elective: ['Advanced courses in your major', 'Interdisciplinary courses'],
      enrichment: ['Language courses', 'Creative arts', 'Professional development'],
      reasoning: 'Based on your academic profile and goals'
    };

    return recommendations;
  }

  private async recommendActivities(studentId: string, preferences: any) {
    const recommendations = {
      clubs: ['Academic clubs', 'Cultural organizations', 'Professional societies'],
      events: ['Career fairs', 'Cultural events', 'Academic workshops'],
      sports: ['Intramural sports', 'Fitness classes', 'Recreational activities'],
      volunteering: ['Community service', 'Campus volunteering', 'Non-profit organizations'],
      reasoning: 'Based on your interests and social preferences'
    };

    return recommendations;
  }

  private async recommendResources(studentId: string, preferences: any) {
    const recommendations = {
      academic: ['Tutoring services', 'Study groups', 'Academic advising'],
      career: ['Career counseling', 'Resume workshops', 'Interview preparation'],
      wellness: ['Mental health services', 'Fitness facilities', 'Wellness programs'],
      financial: ['Financial aid', 'Scholarships', 'Budgeting tools'],
      reasoning: 'Based on your current needs and goals'
    };

    return recommendations;
  }

  private async recommendOpportunities(studentId: string, preferences: any) {
    const recommendations = {
      internships: ['Summer internships', 'Part-time positions', 'Industry projects'],
      research: ['Faculty research', 'Lab positions', 'Research programs'],
      leadership: ['Student government', 'Club leadership', 'Project management'],
      networking: ['Alumni events', 'Professional conferences', 'Industry meetups'],
      reasoning: 'Based on your career goals and interests'
    };

    return recommendations;
  }
}

// Learning Agent
class LearningAgent {
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
    const optimization = {
      studySchedule: {
        morning: 'Review and planning',
        afternoon: 'Active learning and practice',
        evening: 'Reflection and preparation'
      },
      learningMethods: ['Active recall', 'Spaced repetition', 'Interleaving', 'Elaboration'],
      timeManagement: {
        pomodoroTechnique: '25-minute focused sessions',
        breakScheduling: '5-minute breaks between sessions',
        prioritySetting: 'Most important tasks first'
      },
      focusAreas: ['Core concepts', 'Problem-solving skills', 'Application of knowledge']
    };

    return optimization;
  }

  private async createStudyPlan(studentId: string, data: any) {
    const plan = {
      daily: {
        morning: ['Review previous material', 'Plan day'],
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

    return analysis;
  }
}

// Agent System Manager
export class AgentSystemManager {
  private agents: Map<string, any> = new Map();
  private isInitialized: boolean = false;
  private totalInteractions: number = 0;

  constructor() {
    this.initializeAgents();
  }

  private initializeAgents() {
    const profilerAgent = new StudentProfilingAgent();
    const recommendationAgent = new RecommendationAgent(profilerAgent);
    const learningAgent = new LearningAgent();

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
    console.log('AgentSystemManager processing request:', { studentId, agentId, action, data });
    
    const agent = this.agents.get(agentId);

    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }

    try {
      this.totalInteractions++;
      const result = await agent.process({ studentId, action, data });
      console.log('Agent result:', result);
      return result;
    } catch (error) {
      console.error(`Error processing request for agent ${agentId}:`, error);
      throw error;
    }
  }

  getAgentInfo(agentId: string) {
    const agent = this.agents.get(agentId);
    if (!agent) return null;
    
    const agentNames: { [key: string]: string } = {
      'profiler': 'Student Profiler',
      'recommender': 'Smart Recommender', 
      'learner': 'Adaptive Learner'
    };
    
    const agentRoles: { [key: string]: string } = {
      'profiler': 'Profile Analysis & Learning',
      'recommender': 'Personalized Recommendations',
      'learner': 'Learning Optimization'
    };
    
    return {
      id: agentId,
      name: agentNames[agentId] || agentId,
      role: agentRoles[agentId] || 'Agent'
    };
  }

  getAllAgents() {
    return Array.from(this.agents.keys()).map(id => this.getAgentInfo(id)).filter(Boolean);
  }

  getSystemStatus() {
    return {
      isInitialized: this.isInitialized,
      agentCount: this.agents.size,
      activeAgents: Array.from(this.agents.values()).length,
      totalInteractions: this.totalInteractions
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
    const studentId = currentStudentId || 'demo-student-001';
    return await agentSystem.processRequest(studentId, request);
  };

  const value: AgentSystemContextType = {
    agentSystem,
    currentStudentId,
    setCurrentStudentId,
    processRequest,
    getAgentInfo: (agentId: string) => agentSystem.getAgentInfo(agentId),
    getAllAgents: () => agentSystem.getAllAgents(),
    getSystemStatus: () => agentSystem.getSystemStatus()
  };

  return (
    <AgentSystemContext.Provider value={value}>
      {children}
    </AgentSystemContext.Provider>
  );
}; 
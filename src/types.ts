/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Discipline {
  id: string;
  name: string;
  iconName: string; // Material symbol name
  description: string;
  category: 'physical' | 'esports';
}

export type MatchStatus = 'live' | 'upcoming' | 'finished';

export interface Match {
  id: string;
  disciplineId: string;
  disciplineName: string;
  teamA: {
    name: string;
    logoUrl?: string;
    score?: number;
  };
  teamB: {
    name: string;
    logoUrl?: string;
    score?: number;
  };
  status: MatchStatus;
  timeString: string;
  venueOrPlatform: string;
  liveViewers?: number;
  twitchEmbedUrl?: string;
  description?: string;
}

export interface UserProfile {
  email: string;
  nickname: string;
  selectedDisciplines: string[];
  xp: number;
  level: number;
  isVerified: boolean;
  joinedAt: string;
  phone?: string;
  fullName?: string;
  studentId?: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  isCompleted: boolean;
  isClaimed: boolean;
  disciplineId?: string;
}

export interface UniversityEvent {
  id: string;
  title: string;
  date: string;
  category: string;
  description: string;
}

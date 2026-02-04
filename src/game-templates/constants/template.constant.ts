export interface GameTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  bestFor: string[];
  minPlayers: number;
  maxPlayers: number;
  estimatedDuration: string;
  settings: {
    isSequential: boolean;
    allowSkipping: boolean;
    requirePhotoProof: boolean;
    requireGpsProof: boolean;
    scoringMethod: string;
    maxTeamSize: number;
    [key: string]: any;
  };
  checkpointTypes: string[];
  recommendedCheckpoints: string;
}

export const GAME_TEMPLATES: Record<string, GameTemplate> = {
  treasure_hunt: {
    id: 'treasure_hunt',
    name: 'Treasure Hunt',
    description: 'Follow sequential clues to find the treasure',
    icon: '🗺️',
    difficulty: 'medium',
    bestFor: ['families', 'teams', 'beginners'],
    minPlayers: 2,
    maxPlayers: 50,
    estimatedDuration: '60-90 min',
    settings: {
      isSequential: true,
      allowSkipping: false,
      requirePhotoProof: true,
      requireGpsProof: true,
      scoringMethod: 'time_based',
      maxTeamSize: 5,
      timeLimit: 90,
      hintsAllowed: 3,
    },
    checkpointTypes: ['clue', 'riddle', 'puzzle'],
    recommendedCheckpoints: '3-7',
  },

  scavenger_hunt: {
    id: 'scavenger_hunt',
    name: 'Scavenger Hunt',
    description: 'Find items and complete tasks in any order',
    icon: '🔍',
    difficulty: 'easy',
    bestFor: ['families', 'large groups', 'casual'],
    minPlayers: 2,
    maxPlayers: 100,
    estimatedDuration: '45-60 min',
    settings: {
      isSequential: false,
      allowSkipping: false,
      requirePhotoProof: true,
      requireGpsProof: false,
      scoringMethod: 'points',
      maxTeamSize: 4,
      timeLimit: 60,
      bonusPoints: true,
    },
    checkpointTypes: ['photo', 'task', 'find'],
    recommendedCheckpoints: '5-10',
  },

  fitness_circuit: {
    id: 'fitness_circuit',
    name: 'Fitness Bootcamp',
    description:
      'A high-intensity circuit challenge. Complete exercises at each station to progress.',
    icon: '💪',
    difficulty: 'hard',
    bestFor: ['fitness enthusiasts', 'athletes', 'active groups'],
    minPlayers: 1,
    maxPlayers: 20,
    estimatedDuration: '30-45 min',
    settings: {
      isSequential: true,
      allowSkipping: false,
      requirePhotoProof: true,
      requireGpsProof: true, // Ensuring they are at the gym/park station
      scoringMethod: 'reps_completed',
      maxTeamSize: 1,
      restInterval: 30, // Custom setting
      heartRateTracking: false,
    },
    checkpointTypes: ['exercise', 'video', 'timer'],
    recommendedCheckpoints: '5-12',
  },

  indoor_soiree: {
    id: 'indoor_soiree',
    name: 'Mixology & Mystery',
    description:
      'An indoor social game for adults. Solve riddles to find cocktail ingredients hidden around the house.',
    icon: '🍸',
    difficulty: 'medium',
    bestFor: ['adults', 'couples', 'parties'],
    minPlayers: 2,
    maxPlayers: 12,
    estimatedDuration: '90-120 min',
    settings: {
      isSequential: false,
      allowSkipping: true,
      requirePhotoProof: true,
      requireGpsProof: false, // Indoor, so GPS isn't needed
      scoringMethod: 'creativity',
      maxTeamSize: 2,
      alcoholIncluded: true, // Custom setting
      hintPenalty: 5,
    },
    checkpointTypes: ['riddle', 'quiz', 'photo'],
    recommendedCheckpoints: '4-8',
  },

  office_icebreaker: {
    id: 'office_icebreaker',
    name: 'Office Spy',
    description:
      'A stealthy indoor game for corporate teams to get to know the office and each other.',
    icon: '🕵️‍♂️',
    difficulty: 'easy',
    bestFor: ['corporate', 'new hires', 'teams'],
    minPlayers: 4,
    maxPlayers: 100,
    estimatedDuration: '30 min',
    settings: {
      isSequential: false,
      allowSkipping: true,
      requirePhotoProof: true,
      requireGpsProof: false,
      scoringMethod: 'speed',
      maxTeamSize: 5,
      departmentFocus: 'mixed',
    },
    checkpointTypes: ['task', 'photo', 'find'],
    recommendedCheckpoints: '5-7',
  },

  // ... other templates
};

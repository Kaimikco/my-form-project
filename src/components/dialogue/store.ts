import { create } from 'zustand';
import { NPC, DialogueTopic, DialogueNode, PlayerOption } from '@/types/Town';

interface DialogueHistoryEntry {
  npcText: string;      // The NPC text the player just responded to
  playerResponse: string; // What the player chose to say
}

type DialoguePhase = 'greeting' | 'awaiting-topic' | 'showing-npc-response' | 'awaiting-player-choice';

interface DialogueState {
  // Current state
  currentNpc: NPC | null;
  currentTopic: DialogueTopic | null;
  currentNode: DialogueNode | null;
  activeNpcText: string;
  dialoguePhase: DialoguePhase;
  hasGreeted: boolean;
  shouldEndAfterResponse: boolean; // New flag
  
  // History (clears when switching topics)
  topicHistory: DialogueHistoryEntry[];
  
  // Actions
  startDialogue: (npc: NPC) => void;
  selectTopic: (topic: DialogueTopic) => void;
  selectPlayerOption: (option: PlayerOption) => void;
  onTypewriterComplete: () => void;
  resetDialogue: () => void;
}

export const useDialogueStore = create<DialogueState>((set, get) => ({
  // Initial state
  currentNpc: null,
  currentTopic: null,
  currentNode: null,
  activeNpcText: '',
  dialoguePhase: 'greeting',
  hasGreeted: false,
  shouldEndAfterResponse: false,
  topicHistory: [],

  // Actions
  startDialogue: (npc: NPC) => {
    const greeting = Array.isArray(npc.dialogue?.greeting) 
      ? npc.dialogue.greeting[0] 
      : npc.dialogue?.greeting || '';

    set({
      currentNpc: npc,
      currentTopic: null,
      currentNode: null,
      activeNpcText: greeting,
      dialoguePhase: 'greeting',
      hasGreeted: false,
      shouldEndAfterResponse: false,
      topicHistory: []
    });
  },

  selectTopic: (topic: DialogueTopic) => {
    set({
      currentTopic: topic,
      currentNode: topic.conversation, // Set the conversation node!
      activeNpcText: topic.initialResponse,
      dialoguePhase: 'showing-npc-response',
      shouldEndAfterResponse: false,
      topicHistory: [] // Clear history when switching topics
    });
  },

  selectPlayerOption: (option: PlayerOption) => {
    const state = get();
    
    // Add to history: previous NPC text + player's choice
    const newHistoryEntry: DialogueHistoryEntry = {
      npcText: state.activeNpcText,
      playerResponse: option.text
    };

    // Execute any side effects
    if (option.action) {
      option.action();
    }

    // Always show the NPC response first
    set({
      topicHistory: [...state.topicHistory, newHistoryEntry],
      activeNpcText: option.npcResponse,
      currentNode: option.nextNode || null,
      shouldEndAfterResponse: !!option.endsConversation,
      dialoguePhase: 'showing-npc-response'
    });
  },

  onTypewriterComplete: () => {
    const state = get();
    
    switch (state.dialoguePhase) {
      case 'greeting':
        set({ 
          dialoguePhase: 'awaiting-topic',
          hasGreeted: true 
        });
        break;
      case 'showing-npc-response':
        if (state.shouldEndAfterResponse) {
          // Conversation should end after showing this response
          set({ 
            dialoguePhase: 'awaiting-topic',
            shouldEndAfterResponse: false 
          });
        } else if (state.currentNode) {
          // Continue conversation - show player options
          set({ dialoguePhase: 'awaiting-player-choice' });
        } else {
          // No more conversation nodes, back to topic selection
          set({ dialoguePhase: 'awaiting-topic' });
        }
        break;
    }
  },

  resetDialogue: () => {
    set({
      currentNpc: null,
      currentTopic: null,
      currentNode: null,
      activeNpcText: '',
      dialoguePhase: 'greeting',
      hasGreeted: false,
      shouldEndAfterResponse: false,
      topicHistory: []
    });
  }
}));
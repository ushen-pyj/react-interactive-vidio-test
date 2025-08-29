import { InteractiveVideoConfig } from '../types/interactive-video';
import { StyleUtils, createTitleStyle, createButtonStyle } from '../utils/stylePresets';

const tempVidio = "/assest/BigBuckBunny.mp4"

// 示例互动视频配置 - 冒险故事
export const adventureStoryConfig: InteractiveVideoConfig = {
  id: 'adventure-story-demo',
  title: '神秘森林冒险',
  description: '一个充满选择的互动冒险故事，你的每个决定都会影响故事的走向。',
  startSegmentId: 'intro',
  settings: {
    autoPlay: true,
    showControls: true,
    width: 1280,
    height: 720
  },
  segments: [
    {
      id: 'intro',
      videoUrl: '/assest/BigBuckBunny.mp4',
      duration: 30,
      seekTime: 0,
      branchTriggerTime: 8,
      branchTitle: {
        text: '选择你的冒险路径',
        position: { x: 'center', y: 'top', offsetY: 10 },
        style: createTitleStyle('default')
      },
      branches: [
        {
          id: 'path-forest',
          label: '森林',
          description: '选择这条路径将带你深入未知的森林深处',
          nextSegmentId: 'forest-path',
          position: { x: 'left', y: 'bottom', offsetX: 10, offsetY: 20 },
          style: createButtonStyle('circle-large')
        },
        {
          id: 'path-village',
          label: '村庄',
          description: '选择这条安全的路径前往村庄寻求帮助',
          nextSegmentId: 'village-path',
          position: { x: 'right', y: 'bottom', offsetX: -10, offsetY: 20 },
          style: createButtonStyle('transparent', { textPosition: 'left' })
        }
      ]
    },
    {
      id: 'forest-path',
      videoUrl: '/assest/BigBuckBunny.mp4',
      duration: 20,
      seekTime: 20,
      branchTriggerTime: 12,
      branchTitle: {
        text: '森林深处的神秘声音',
        position: { x: 'left', y: 'top', offsetX: 5, offsetY: 10 },
        style: createTitleStyle('forest')
      },
      branches: [
        {
          id: 'investigate-sound',
          label: '调查声音',
          description: '你听到了森林深处传来的神秘声音',
          nextSegmentId: 'mystery-encounter',
          position: { x: 'center', y: 'top', offsetY: 15 },
          style: createButtonStyle('rectangle')
        },
        {
          id: 'ignore-sound',
          label: '继续前进',
          description: '保持谨慎，继续沿着小径前进',
          nextSegmentId: 'safe-path',
          position: { x: 'left', y: 'center', offsetX: 5 },
          style: createButtonStyle('circle-medium')
        },
        {
          id: 'return-back',
          label: '返回',
          description: '感到害怕，决定返回安全的地方',
          nextSegmentId: 'village-path',
          position: { x: 'right', y: 'center', offsetX: -5 },
          style: createButtonStyle('circle-small')
        }
      ]
    },
    {
      id: 'village-path',
      videoUrl: '/assest/ForBiggerBlazes.mp4',
      duration: 12,
      seekTime: 0,
      branchTriggerTime: 10,
      branchTitle: {
        text: '村庄中的选择',
        position: { x: 'right', y: 'center', offsetX: -5 },
        style: createTitleStyle('village')
      },
      branches: [
        {
          id: 'talk-elder',
          label: '与村长交谈',
          description: '寻求村中长者的智慧和建议',
          nextSegmentId: 'elder-wisdom'
        },
        {
          id: 'explore-village',
          label: '探索村庄',
          description: '四处走走，了解这个村庄的秘密',
          nextSegmentId: 'village-secrets'
        }
      ]
    },
    {
      id: 'mystery-encounter',
      videoUrl: '/assest/BigBuckBunny.mp4',
      duration: 20,
      seekTime: 20,
      branchTriggerTime: 17,
      branches: [
        {
          id: 'accept-challenge',
          label: '接受挑战',
          description: '勇敢地面对未知的挑战',
          nextSegmentId: 'heroic-ending'
        },
        {
          id: 'seek-help',
          label: '寻求帮助',
          description: '意识到需要更多帮助来解决这个问题',
          nextSegmentId: 'collaborative-ending'
        }
      ]
    },
    {
      id: 'safe-path',
      videoUrl: '/assest/ForBiggerBlazes.mp4',
      duration: 8,
      seekTime: 0,
      isEnd: true
    },
    {
      id: 'elder-wisdom',
      videoUrl: '/assest/ForBiggerBlazes.mp4',
      duration: 15,
      seekTime: 0,
      branchTriggerTime: 12,
      branches: [
        {
          id: 'follow-advice',
          label: '遵循长者的建议',
          description: '按照村长的智慧行事',
          nextSegmentId: 'wise-ending'
        },
        {
          id: 'own-path',
          label: '走自己的路',
          description: '感谢建议但选择自己的道路',
          nextSegmentId: 'independent-ending'
        }
      ]
    },
    {
      id: 'village-secrets',
      videoUrl: '/assest/ForBiggerBlazes.mp4',
      duration: 10,
      seekTime: 0,
      isEnd: true
    },
    {
      id: 'heroic-ending',
      videoUrl: '/assest/ForBiggerBlazes.mp4',
      duration: 12,
      seekTime: 0,
      isEnd: true
    },
    {
      id: 'collaborative-ending',
      videoUrl: '/assest/ElephantsDream.mp4',
      duration: 10,
      seekTime: 0,
      isEnd: true
    },
    {
      id: 'wise-ending',
      videoUrl: '/assest/ForBiggerBlazes.mp4',
      duration: 8,
      seekTime: 0,
      isEnd: true
    },
    {
      id: 'independent-ending',
      videoUrl: '/assest/ForBiggerBlazes.mp4',
      duration: 6,
      seekTime: 0,
      isEnd: true
    }
  ]
};

// 简单的教学示例配置
export const tutorialConfig: InteractiveVideoConfig = {
  id: 'tutorial-demo',
  title: '互动视频教程',
  description: '学习如何使用互动视频框架的简单教程。',
  startSegmentId: 'tutorial-start',
  settings: {
    autoPlay: false,
    showControls: true,
    width: 854,
    height: 480
  },
  segments: [
    {
      id: 'tutorial-start',
      videoUrl: '/assest/BigBuckBunny.mp4',
      duration: 5,
      seekTime: 0,
      branchTriggerTime: 4,
      branches: [
        {
          id: 'learn-basics',
          label: '学习基础功能',
          description: '了解互动视频的基本操作',
          nextSegmentId: 'basics-lesson'
        },
        {
          id: 'advanced-features',
          label: '高级功能演示',
          description: '探索更复杂的互动功能',
          nextSegmentId: 'advanced-lesson'
        }
      ]
    },
    {
      id: 'basics-lesson',
      videoUrl: '/assest/ForBiggerBlazes.mp4',
      duration: 8,
      seekTime: 0,
      isEnd: true
    },
    {
      id: 'advanced-lesson',
      videoUrl: '/assest/ForBiggerBlazes.mp4',
      duration: 10,
      seekTime: 0,
      branchTriggerTime: 8,
      branches: [
        {
          id: 'practice-mode',
          label: '练习模式',
          description: '通过实践来巩固学习',
          nextSegmentId: 'practice-session'
        },
        {
          id: 'finish-tutorial',
          label: '完成教程',
          description: '结束学习，开始使用',
          nextSegmentId: 'tutorial-end'
        }
      ]
    },
    {
      id: 'practice-session',
      videoUrl: '/assest/ForBiggerBlazes.mp4',
      duration: 6,
      seekTime: 0,
      isEnd: true
    },
    {
      id: 'tutorial-end',
      videoUrl: '/assest/ForBiggerBlazes.mp4',
      duration: 4,
      seekTime: 0,
      isEnd: true
    }
  ]
};

// 所有可用的配置
export const availableConfigs = {
  adventure: adventureStoryConfig,
  tutorial: tutorialConfig
};

export default availableConfigs;
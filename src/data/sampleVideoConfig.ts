import { InteractiveVideoConfig } from '../types/interactive-video';

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
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      duration: 10,
      startTime: 0,
      endTime: 10,
      branchTriggerTime: 8,
      branches: [
        {
          id: 'path-forest',
          label: '进入神秘森林',
          description: '选择这条路径将带你深入未知的森林深处',
          nextSegmentId: 'forest-path',
          position: { x: 'left', y: 'bottom', offsetX: 10, offsetY: 20 }
        },
        {
          id: 'path-village',
          label: '前往附近村庄',
          description: '选择这条安全的路径前往村庄寻求帮助',
          nextSegmentId: 'village-path',
          position: { x: 'right', y: 'bottom', offsetX: -10, offsetY: 20 }
        }
      ]
    },
    {
      id: 'forest-path',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      duration: 15,
      startTime: 0,
      endTime: 15,
      branchTriggerTime: 12,
      branches: [
        {
          id: 'investigate-sound',
          label: '调查奇怪的声音',
          description: '你听到了森林深处传来的神秘声音',
          nextSegmentId: 'mystery-encounter',
          position: { x: 'center', y: 'top', offsetY: 15 }
        },
        {
          id: 'ignore-sound',
          label: '忽略声音继续前进',
          description: '保持谨慎，继续沿着小径前进',
          nextSegmentId: 'safe-path',
          position: { x: 'left', y: 'center', offsetX: 5 }
        },
        {
          id: 'return-back',
          label: '返回起点',
          description: '感到害怕，决定返回安全的地方',
          nextSegmentId: 'village-path',
          position: { x: 'right', y: 'center', offsetX: -5 }
        }
      ]
    },
    {
      id: 'village-path',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      duration: 12,
      startTime: 0,
      endTime: 12,
      branchTriggerTime: 10,
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
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      duration: 20,
      startTime: 0,
      endTime: 20,
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
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      duration: 8,
      startTime: 0,
      endTime: 8,
      isEnd: true
    },
    {
      id: 'elder-wisdom',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      duration: 15,
      startTime: 0,
      endTime: 15,
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
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      duration: 10,
      startTime: 0,
      endTime: 10,
      isEnd: true
    },
    {
      id: 'heroic-ending',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      duration: 12,
      startTime: 0,
      endTime: 12,
      isEnd: true
    },
    {
      id: 'collaborative-ending',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
      duration: 10,
      startTime: 0,
      endTime: 10,
      isEnd: true
    },
    {
      id: 'wise-ending',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      duration: 8,
      startTime: 0,
      endTime: 8,
      isEnd: true
    },
    {
      id: 'independent-ending',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
      duration: 6,
      startTime: 0,
      endTime: 6,
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
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      duration: 5,
      startTime: 0,
      endTime: 5,
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
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      duration: 8,
      startTime: 0,
      endTime: 8,
      isEnd: true
    },
    {
      id: 'advanced-lesson',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      duration: 10,
      startTime: 0,
      endTime: 10,
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
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      duration: 6,
      startTime: 0,
      endTime: 6,
      isEnd: true
    },
    {
      id: 'tutorial-end',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      duration: 4,
      startTime: 0,
      endTime: 4,
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
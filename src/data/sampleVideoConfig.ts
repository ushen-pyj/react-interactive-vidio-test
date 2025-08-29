import { InteractiveVideoConfig } from '../types/interactive-video';
import { createTitleStyle, createButtonStyle } from '../utils/stylePresets';

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
      duration: 15,
      seekTime: 0,
      branchTriggerTime: 12,
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
        },
        {
          id: 'path-mountain',
          label: '山脉',
          description: '选择这条危险的路径前往神秘的山脉',
          nextSegmentId: 'mountain-path',
          position: { x: 'center', y: 'bottom', offsetY: 20 },
          style: createButtonStyle('rectangle')
        }
      ]
    },
    {
      id: 'forest-path',
      videoUrl: '/assest/BigBuckBunny.mp4',
      duration: 18,
      seekTime: 15,
      branchTriggerTime: 15,
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
          nextSegmentId: 'deep-forest',
          position: { x: 'left', y: 'center', offsetX: 10 },
          style: createButtonStyle('circle-medium')
        },
        {
          id: 'return-back',
          label: '返回',
          description: '感到害怕，决定返回安全的地方',
          nextSegmentId: 'village-path',
          position: { x: 'right', y: 'center', offsetX: -10 },
          style: createButtonStyle('circle-small')
        },
        {
          id: 'climb-tree',
          label: '爬树观察',
          description: '爬到高处观察周围的情况',
          nextSegmentId: 'tree-view',
          position: { x: 'center', y: 'bottom', offsetY: -10 },
          style: createButtonStyle('circle-medium')
        }
      ]
    },
    {
      id: 'village-path',
      videoUrl: '/assest/BigBuckBunny.mp4',
      duration: 20,
      seekTime: 33,
      branchTriggerTime: 17,
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
          nextSegmentId: 'elder-wisdom',
          position: { x: 'left', y: 'bottom', offsetX: 10, offsetY: 20 },
          style: createButtonStyle('rectangle')
        },
        {
          id: 'explore-village',
          label: '探索村庄',
          description: '四处走走，了解这个村庄的秘密',
          nextSegmentId: 'village-secrets',
          position: { x: 'right', y: 'bottom', offsetX: -10, offsetY: 20 },
          style: createButtonStyle('circle-large')
        },
        {
          id: 'visit-market',
          label: '前往市场',
          description: '去村庄的市场看看有什么有用的物品',
          nextSegmentId: 'market-encounter',
          position: { x: 'center', y: 'bottom', offsetY: 20 },
          style: createButtonStyle('transparent')
        }
      ]
    },
    {
      id: 'mountain-path',
      videoUrl: '/assest/BigBuckBunny.mp4',
      duration: 22,
      seekTime: 53,
      branchTriggerTime: 19,
      branchTitle: {
        text: '山脉的挑战',
        position: { x: 'center', y: 'top', offsetY: 10 },
        style: createTitleStyle('default')
      },
      branches: [
        {
          id: 'climb-peak',
          label: '攀登山峰',
          description: '挑战自己，攀登到山峰顶部',
          nextSegmentId: 'peak-challenge',
          position: { x: 'left', y: 'center', offsetX: 5 },
          style: createButtonStyle('circle-large')
        },
        {
          id: 'find-cave',
          label: '寻找洞穴',
          description: '在山中寻找可以休息的洞穴',
          nextSegmentId: 'cave-discovery',
          position: { x: 'right', y: 'center', offsetX: -5 },
          style: createButtonStyle('rectangle')
        },
        {
          id: 'follow-stream',
          label: '沿溪流而下',
          description: '跟随山间的溪流寻找出路',
          nextSegmentId: 'stream-path',
          position: { x: 'center', y: 'bottom', offsetY: 20 },
          style: createButtonStyle('circle-medium')
        }
      ]
    },
    {
      id: 'mystery-encounter',
      videoUrl: '/assest/BigBuckBunny.mp4',
      duration: 25,
      seekTime: 75,
      branchTriggerTime: 22,
      branchTitle: {
        text: '神秘的遭遇',
        position: { x: 'center', y: 'top', offsetY: 10 },
        style: createTitleStyle('forest')
      },
      branches: [
        {
          id: 'accept-challenge',
          label: '接受挑战',
          description: '勇敢地面对未知的挑战',
          nextSegmentId: 'heroic-ending',
          position: { x: 'left', y: 'bottom', offsetX: 10, offsetY: 20 },
          style: createButtonStyle('circle-large')
        },
        {
          id: 'seek-help',
          label: '寻求帮助',
          description: '意识到需要更多帮助来解决这个问题',
          nextSegmentId: 'collaborative-ending',
          position: { x: 'right', y: 'bottom', offsetX: -10, offsetY: 20 },
          style: createButtonStyle('rectangle')
        },
        {
          id: 'negotiate',
          label: '尝试谈判',
          description: '用智慧和言语来解决冲突',
          nextSegmentId: 'diplomatic-ending',
          position: { x: 'center', y: 'bottom', offsetY: 20 },
          style: createButtonStyle('transparent')
        }
      ]
    },
    {
      id: 'deep-forest',
      videoUrl: '/assest/BigBuckBunny.mp4',
      duration: 20,
      seekTime: 100,
      branchTriggerTime: 17,
      branchTitle: {
        text: '森林深处的发现',
        position: { x: 'left', y: 'top', offsetX: 5, offsetY: 10 },
        style: createTitleStyle('forest')
      },
      branches: [
        {
          id: 'ancient-ruins',
          label: '探索古迹',
          description: '发现了古老的遗迹，决定进入探索',
          nextSegmentId: 'ruins-ending',
          position: { x: 'center', y: 'center' },
          style: createButtonStyle('rectangle')
        },
        {
          id: 'magical-spring',
          label: '神奇泉水',
          description: '找到了传说中的神奇泉水',
          nextSegmentId: 'spring-ending',
          position: { x: 'left', y: 'bottom', offsetX: 10, offsetY: 20 },
          style: createButtonStyle('circle-medium')
        }
      ]
    },
    {
      id: 'tree-view',
      videoUrl: '/assest/BigBuckBunny.mp4',
      duration: 15,
      seekTime: 120,
      branchTriggerTime: 12,
      branchTitle: {
        text: '树顶的视野',
        position: { x: 'center', y: 'top', offsetY: 10 },
        style: createTitleStyle('default')
      },
      branches: [
        {
          id: 'spot-treasure',
          label: '发现宝藏',
          description: '从高处看到了闪闪发光的宝藏',
          nextSegmentId: 'treasure-ending',
          position: { x: 'left', y: 'center', offsetX: 5 },
          style: createButtonStyle('circle-large')
        },
        {
          id: 'see-danger',
          label: '发现危险',
          description: '看到了潜在的危险，需要小心应对',
          nextSegmentId: 'danger-ending',
          position: { x: 'right', y: 'center', offsetX: -5 },
          style: createButtonStyle('rectangle')
        }
      ]
    },
    {
      id: 'elder-wisdom',
      videoUrl: '/assest/BigBuckBunny.mp4',
      duration: 18,
      seekTime: 135,
      branchTriggerTime: 15,
      branchTitle: {
        text: '长者的智慧',
        position: { x: 'center', y: 'top', offsetY: 10 },
        style: createTitleStyle('village')
      },
      branches: [
        {
          id: 'follow-advice',
          label: '遵循建议',
          description: '按照村长的智慧行事',
          nextSegmentId: 'wise-ending',
          position: { x: 'left', y: 'bottom', offsetX: 10, offsetY: 20 },
          style: createButtonStyle('rectangle')
        },
        {
          id: 'own-path',
          label: '走自己的路',
          description: '感谢建议但选择自己的道路',
          nextSegmentId: 'independent-ending',
          position: { x: 'right', y: 'bottom', offsetX: -10, offsetY: 20 },
          style: createButtonStyle('circle-medium')
        }
      ]
    },
    {
      id: 'market-encounter',
      videoUrl: '/assest/BigBuckBunny.mp4',
      duration: 16,
      seekTime: 153,
      branchTriggerTime: 13,
      branchTitle: {
        text: '市场的奇遇',
        position: { x: 'right', y: 'center', offsetX: -5 },
        style: createTitleStyle('village')
      },
      branches: [
        {
          id: 'buy-map',
          label: '购买地图',
          description: '买一张详细的地图来指引方向',
          nextSegmentId: 'map-ending',
          position: { x: 'center', y: 'bottom', offsetY: 20 },
          style: createButtonStyle('transparent')
        },
        {
          id: 'trade-goods',
          label: '交易物品',
          description: '用身上的物品换取有用的工具',
          nextSegmentId: 'trade-ending',
          position: { x: 'left', y: 'center', offsetX: 5 },
          style: createButtonStyle('circle-large')
        }
      ]
    },
    {
      id: 'peak-challenge',
      videoUrl: '/assest/BigBuckBunny.mp4',
      duration: 24,
      seekTime: 169,
      branchTriggerTime: 21,
      branchTitle: {
        text: '山峰的试炼',
        position: { x: 'center', y: 'top', offsetY: 10 },
        style: createTitleStyle('default')
      },
      branches: [
        {
          id: 'overcome-fear',
          label: '克服恐惧',
          description: '战胜内心的恐惧，继续攀登',
          nextSegmentId: 'courage-ending',
          position: { x: 'center', y: 'center' },
          style: createButtonStyle('circle-large')
        },
        {
          id: 'find-shelter',
          label: '寻找庇护',
          description: '天气恶劣，需要找个地方避风',
          nextSegmentId: 'shelter-ending',
          position: { x: 'left', y: 'bottom', offsetX: 10, offsetY: 20 },
          style: createButtonStyle('rectangle')
        }
      ]
    },
    {
      id: 'cave-discovery',
      videoUrl: '/assest/BigBuckBunny.mp4',
      duration: 19,
      seekTime: 193,
      branchTriggerTime: 16,
      branchTitle: {
        text: '洞穴的秘密',
        position: { x: 'left', y: 'top', offsetX: 5, offsetY: 10 },
        style: createTitleStyle('default')
      },
      branches: [
        {
          id: 'explore-deeper',
          label: '深入探索',
          description: '继续深入洞穴寻找宝藏',
          nextSegmentId: 'cave-treasure-ending',
          position: { x: 'center', y: 'bottom', offsetY: 20 },
          style: createButtonStyle('circle-medium')
        },
        {
          id: 'rest-here',
          label: '在此休息',
          description: '在洞穴中休息恢复体力',
          nextSegmentId: 'rest-ending',
          position: { x: 'right', y: 'center', offsetX: -5 },
          style: createButtonStyle('transparent')
        }
      ]
    },
    {
      id: 'stream-path',
      videoUrl: '/assest/BigBuckBunny.mp4',
      duration: 17,
      seekTime: 212,
      branchTriggerTime: 14,
      branchTitle: {
        text: '溪流的指引',
        position: { x: 'center', y: 'top', offsetY: 10 },
        style: createTitleStyle('default')
      },
      branches: [
        {
          id: 'follow-downstream',
          label: '顺流而下',
          description: '跟随溪流找到出山的路',
          nextSegmentId: 'downstream-ending',
          position: { x: 'left', y: 'center', offsetX: 5 },
          style: createButtonStyle('rectangle')
        },
        {
          id: 'cross-stream',
          label: '渡过溪流',
          description: '渡过溪流探索对岸',
          nextSegmentId: 'crossing-ending',
          position: { x: 'right', y: 'center', offsetX: -5 },
          style: createButtonStyle('circle-large')
        }
      ]
    },
    // 结束分支 - 使用不同的视频
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
      seekTime: 10,
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
      id: 'diplomatic-ending',
      videoUrl: '/assest/ForBiggerBlazes.mp4',
      duration: 8,
      seekTime: 22,
      isEnd: true
    },
    {
      id: 'wise-ending',
      videoUrl: '/assest/ForBiggerBlazes.mp4',
      duration: 8,
      seekTime: 30,
      isEnd: true
    },
    {
      id: 'independent-ending',
      videoUrl: '/assest/ElephantsDream.mp4',
      duration: 6,
      seekTime: 10,
      isEnd: true
    },
    {
      id: 'ruins-ending',
      videoUrl: '/assest/ForBiggerBlazes.mp4',
      duration: 14,
      seekTime: 38,
      isEnd: true
    },
    {
      id: 'spring-ending',
      videoUrl: '/assest/ElephantsDream.mp4',
      duration: 9,
      seekTime: 16,
      isEnd: true
    },
    {
      id: 'treasure-ending',
      videoUrl: '/assest/ForBiggerBlazes.mp4',
      duration: 11,
      seekTime: 52,
      isEnd: true
    },
    {
      id: 'danger-ending',
      videoUrl: '/assest/ElephantsDream.mp4',
      duration: 7,
      seekTime: 25,
      isEnd: true
    },
    {
      id: 'map-ending',
      videoUrl: '/assest/ForBiggerBlazes.mp4',
      duration: 9,
      seekTime: 63,
      isEnd: true
    },
    {
      id: 'trade-ending',
      videoUrl: '/assest/ElephantsDream.mp4',
      duration: 8,
      seekTime: 32,
      isEnd: true
    },
    {
      id: 'courage-ending',
      videoUrl: '/assest/ForBiggerBlazes.mp4',
      duration: 13,
      seekTime: 72,
      isEnd: true
    },
    {
      id: 'shelter-ending',
      videoUrl: '/assest/ElephantsDream.mp4',
      duration: 6,
      seekTime: 40,
      isEnd: true
    },
    {
      id: 'cave-treasure-ending',
      videoUrl: '/assest/ForBiggerBlazes.mp4',
      duration: 10,
      seekTime: 85,
      isEnd: true
    },
    {
      id: 'rest-ending',
      videoUrl: '/assest/ElephantsDream.mp4',
      duration: 5,
      seekTime: 46,
      isEnd: true
    },
    {
      id: 'downstream-ending',
      videoUrl: '/assest/ForBiggerBlazes.mp4',
      duration: 12,
      seekTime: 95,
      isEnd: true
    },
    {
      id: 'crossing-ending',
      videoUrl: '/assest/ElephantsDream.mp4',
      duration: 8,
      seekTime: 51,
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
      duration: 12,
      seekTime: 0,
      branchTriggerTime: 9,
      branchTitle: {
        text: '选择学习路径',
        position: { x: 'center', y: 'top', offsetY: 10 },
        style: createTitleStyle('default')
      },
      branches: [
        {
          id: 'learn-basics',
          label: '学习基础功能',
          description: '了解互动视频的基本操作',
          nextSegmentId: 'basics-lesson',
          position: { x: 'left', y: 'bottom', offsetX: 10, offsetY: 20 },
          style: createButtonStyle('rectangle')
        },
        {
          id: 'advanced-features',
          label: '高级功能演示',
          description: '探索更复杂的互动功能',
          nextSegmentId: 'advanced-lesson',
          position: { x: 'right', y: 'bottom', offsetX: -10, offsetY: 20 },
          style: createButtonStyle('circle-large')
        },
        {
          id: 'quick-demo',
          label: '快速演示',
          description: '快速了解所有功能',
          nextSegmentId: 'demo-lesson',
          position: { x: 'center', y: 'bottom', offsetY: 20 },
          style: createButtonStyle('transparent')
        }
      ]
    },
    {
      id: 'basics-lesson',
      videoUrl: '/assest/BigBuckBunny.mp4',
      duration: 15,
      seekTime: 12,
      branchTriggerTime: 12,
      branchTitle: {
        text: '基础功能学习',
        position: { x: 'left', y: 'top', offsetX: 5, offsetY: 10 },
        style: createTitleStyle('default')
      },
      branches: [
        {
          id: 'practice-basic',
          label: '练习基础操作',
          description: '通过练习掌握基础功能',
          nextSegmentId: 'basic-practice-ending',
          position: { x: 'left', y: 'bottom', offsetX: 10, offsetY: 20 },
          style: createButtonStyle('circle-medium')
        },
        {
          id: 'learn-advanced',
          label: '继续学习高级功能',
          description: '进入高级功能学习',
          nextSegmentId: 'advanced-lesson',
          position: { x: 'right', y: 'bottom', offsetX: -10, offsetY: 20 },
          style: createButtonStyle('rectangle')
        }
      ]
    },
    {
      id: 'advanced-lesson',
      videoUrl: '/assest/BigBuckBunny.mp4',
      duration: 18,
      seekTime: 27,
      branchTriggerTime: 15,
      branchTitle: {
        text: '高级功能演示',
        position: { x: 'right', y: 'top', offsetX: -5, offsetY: 10 },
        style: createTitleStyle('default')
      },
      branches: [
        {
          id: 'practice-advanced',
          label: '练习高级功能',
          description: '通过实践来巩固高级功能学习',
          nextSegmentId: 'advanced-practice-ending',
          position: { x: 'left', y: 'bottom', offsetX: 10, offsetY: 20 },
          style: createButtonStyle('circle-large')
        },
        {
          id: 'finish-tutorial',
          label: '完成教程',
          description: '结束学习，开始使用',
          nextSegmentId: 'tutorial-complete-ending',
          position: { x: 'right', y: 'bottom', offsetX: -10, offsetY: 20 },
          style: createButtonStyle('rectangle')
        },
        {
          id: 'review-basics',
          label: '回顾基础',
          description: '重新学习基础功能',
          nextSegmentId: 'basics-lesson',
          position: { x: 'center', y: 'bottom', offsetY: 20 },
          style: createButtonStyle('transparent')
        }
      ]
    },
    {
      id: 'demo-lesson',
      videoUrl: '/assest/BigBuckBunny.mp4',
      duration: 20,
      seekTime: 45,
      branchTriggerTime: 17,
      branchTitle: {
        text: '快速演示模式',
        position: { x: 'center', y: 'top', offsetY: 10 },
        style: createTitleStyle('default')
      },
      branches: [
        {
          id: 'detailed-learning',
          label: '详细学习',
          description: '转到详细的学习模式',
          nextSegmentId: 'basics-lesson',
          position: { x: 'left', y: 'bottom', offsetX: 15, offsetY: 25 },
          style: createButtonStyle('circle-medium')
        },
        {
          id: 'finish-demo',
          label: '完成演示',
          description: '结束快速演示',
          nextSegmentId: 'demo-complete-ending',
          position: { x: 'right', y: 'bottom', offsetX: -15, offsetY: 25 },
          style: createButtonStyle('rectangle')
        }
      ]
    },
    // 教程结束分支
    {
      id: 'basic-practice-ending',
      videoUrl: '/assest/ForBiggerBlazes.mp4',
      duration: 8,
      seekTime: 0,
      isEnd: true
    },
    {
      id: 'advanced-practice-ending',
      videoUrl: '/assest/ElephantsDream.mp4',
      duration: 10,
      seekTime: 0,
      isEnd: true
    },
    {
      id: 'tutorial-complete-ending',
      videoUrl: '/assest/ForBiggerBlazes.mp4',
      duration: 6,
      seekTime: 8,
      isEnd: true
    },
    {
      id: 'demo-complete-ending',
      videoUrl: '/assest/ElephantsDream.mp4',
      duration: 7,
      seekTime: 10,
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
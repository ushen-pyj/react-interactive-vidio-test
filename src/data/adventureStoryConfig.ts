import { InteractiveVideoConfig } from '../types/interactive-video';
import { createTitleStyle, createButtonStyle } from '../utils/stylePresets';

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
      branchTriggerTime: 12,
      backgroundAnimation: {
        type: 'horizontal',
        duration: 4,
        amplitude: 30,
        enabled: true
      },
      branchTitle: {
        text: '选择你的冒险路径',
        position: { x: 'center', y: 'top', offsetY: 10 },
        style: createTitleStyle('default')
      },
      branches: [
        {
          id: 'path-forest',
          label: '森林',
          text: '森林',
          description: '选择这条路径将带你深入未知的森林深处',
          nextSegmentId: 'forest-path',
          position: { x: 'left', y: 'bottom', offsetX: 10, offsetY: 20 },
          style: createButtonStyle('circle-large')
        },
        {
          id: 'path-village',
          label: '村庄',
          text: '村庄',
          description: '选择这条安全的路径前往村庄寻求帮助',
          nextSegmentId: 'village-path',
          position: { x: 'right', y: 'bottom', offsetX: -10, offsetY: 20 },
          style: createButtonStyle('transparent', { textPosition: 'left' })
        },
        {
          id: 'path-mountain',
          label: '山脉',
          text: '山脉',
          description: '选择这条危险的路径前往神秘的山脉',
          nextSegmentId: 'mountain-path',
          position: { x: 'center', y: 'bottom', offsetY: 20 },
          style: createButtonStyle('rectangle')
        }
      ]
    },
    {
      id: 'forest-path',
      videoUrl: '/assest/ElephantsDream.mp4',
      duration: 18,
      branchTriggerTime: 15,
      backgroundAnimation: {
        type: 'vertical',
        duration: 3.5,
        amplitude: 25,
        enabled: true
      },
      branchTitle: {
        text: '森林深处的神秘声音',
        position: { x: 'left', y: 'top', offsetX: 5, offsetY: 10 },
        style: createTitleStyle('forest')
      },
      branches: [
        {
          id: 'investigate-sound',
          label: '调查声音',
          text: '调查声音',
          description: '你听到了森林深处传来的神秘声音',
          nextSegmentId: 'mystery-encounter',
          position: { x: 'center', y: 'top', offsetY: 15 },
          style: createButtonStyle('rectangle')
        },
        {
          id: 'ignore-sound',
          label: '继续前进',
          text: '继续前进',
          description: '保持谨慎，继续沿着小径前进',
          nextSegmentId: 'deep-forest',
          position: { x: 'left', y: 'center', offsetX: 10 },
          style: createButtonStyle('circle-medium')
        },
        {
          id: 'return-back',
          label: '返回',
          text: '返回',
          description: '感到害怕，决定返回安全的地方',
          nextSegmentId: 'village-path',
          position: { x: 'right', y: 'center', offsetX: -10 },
          style: createButtonStyle('circle-small')
        },
        {
          id: 'climb-tree',
          label: '爬树观察',
          text: '爬树观察',
          description: '爬到高处观察周围的情况',
          nextSegmentId: 'tree-view',
          position: { x: 'center', y: 'bottom', offsetY: -10 },
          style: createButtonStyle('circle-medium')
        }
      ]
    },
    {
      id: 'village-path',
      videoUrl: '/assest/ElephantsDream.mp4',
      duration: 33,
      branchTriggerTime: 17,
      backgroundAnimation: {
        type: 'scale',
        duration: 5,
        amplitude: 3,
        enabled: true
      },
      branchTitle: {
        text: '村庄中的选择',
        position: { x: 'right', y: 'center', offsetX: -5 },
        style: createTitleStyle('village')
      },
      branches: [
        {
          id: 'talk-elder',
          label: '与村长交谈',
          text: '与村长交谈',
          description: '寻求村中长者的智慧和建议',
          nextSegmentId: 'elder-wisdom',
          position: { x: 'left', y: 'bottom', offsetX: 10, offsetY: 20 },
          style: createButtonStyle('rectangle')
        },
        {
          id: 'explore-village',
          label: '探索村庄',
          text: '探索村庄',
          description: '四处走走，了解这个村庄的秘密',
          nextSegmentId: 'village-secrets',
          position: { x: 'right', y: 'bottom', offsetX: -10, offsetY: 20 },
          style: createButtonStyle('circle-large')
        },
        {
          id: 'visit-market',
          label: '前往市场',
          text: '前往市场',
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
      duration: 15,
      branchTriggerTime: 12,
      backgroundAnimation: {
        type: 'horizontal',
        duration: 6,
        amplitude: 40,
        enabled: true
      },
      branchTitle: {
        text: '山脉的挑战',
        position: { x: 'center', y: 'top', offsetY: 10 },
        style: createTitleStyle('default')
      },
      branches: [
        {
          id: 'climb-peak',
          label: '攀登山峰',
          text: '攀登山峰',
          description: '挑战自己，攀登到山峰顶部',
          nextSegmentId: 'peak-challenge',
          position: { x: 'left', y: 'center', offsetX: 5 },
          style: createButtonStyle('circle-large')
        },
        {
          id: 'find-cave',
          label: '寻找洞穴',
          text: '寻找洞穴',
          description: '在山中寻找可以休息的洞穴',
          nextSegmentId: 'cave-discovery',
          position: { x: 'right', y: 'center', offsetX: -5 },
          style: createButtonStyle('rectangle')
        },
        {
          id: 'follow-stream',
          label: '沿溪流而下',
          text: '沿溪流而下',
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
      branchTriggerTime: 22,
      backgroundAnimation: {
        type: 'scale',
        duration: 4.5,
        amplitude: 2.5,
        enabled: true
      },
      branchTitle: {
        text: '神秘的遭遇',
        position: { x: 'center', y: 'top', offsetY: 10 },
        style: createTitleStyle('forest')
      },
      branches: [
        {
          id: 'accept-challenge',
          label: '接受挑战',
          text: '接受挑战',
          description: '勇敢地面对未知的挑战',
          nextSegmentId: 'heroic-ending',
          position: { x: 'left', y: 'bottom', offsetX: 10, offsetY: 20 },
          style: createButtonStyle('circle-large')
        },
        {
          id: 'seek-help',
          label: '寻求帮助',
          text: '寻求帮助',
          description: '意识到需要更多帮助来解决这个问题',
          nextSegmentId: 'collaborative-ending',
          position: { x: 'right', y: 'bottom', offsetX: -10, offsetY: 20 },
          style: createButtonStyle('rectangle')
        },
        {
          id: 'negotiate',
          label: '尝试谈判',
          text: '尝试谈判',
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
      branchTriggerTime: 17,
      backgroundAnimation: {
        type: 'vertical',
        duration: 3,
        amplitude: 35,
        enabled: true
      },
      branchTitle: {
        text: '森林深处的发现',
        position: { x: 'left', y: 'top', offsetX: 5, offsetY: 10 },
        style: createTitleStyle('forest')
      },
      branches: [
        {
          id: 'ancient-ruins',
          label: '探索古迹',
          text: '探索古迹',
          description: '发现了古老的遗迹，决定进入探索',
          nextSegmentId: 'ruins-ending',
          position: { x: 'center', y: 'center' },
          style: createButtonStyle('rectangle')
        },
        {
          id: 'magical-spring',
          label: '神奇泉水',
          text: '神奇泉水',
          description: '发现了一处神奇的泉水',
          nextSegmentId: 'spring-ending',
          position: { x: 'left', y: 'bottom', offsetX: 10, offsetY: 20 },
          style: createButtonStyle('circle-large')
        },
        {
          id: 'hidden-treasure',
          label: '寻找宝藏',
          text: '寻找宝藏',
          description: '寻找传说中的隐藏宝藏',
          nextSegmentId: 'treasure-ending',
          position: { x: 'right', y: 'bottom', offsetX: -10, offsetY: 20 },
          style: createButtonStyle('transparent')
        }
      ]
    },
    {
      id: 'tree-view',
      videoUrl: '/assest/ForBiggerBlazes.mp4',
      duration: 12,
      branchTriggerTime: 9,
      backgroundAnimation: {
        type: 'horizontal',
        duration: 2,
        amplitude: 15,
        enabled: true
      },
      branchTitle: {
        text: '树顶的视野',
        position: { x: 'center', y: 'top', offsetY: 10 },
        style: createTitleStyle('default')
      },
      branches: [
        {
          id: 'spot-village',
          label: '发现村庄',
          text: '发现村庄',
          description: '从高处看到了远处的村庄',
          nextSegmentId: 'village-path',
          position: { x: 'left', y: 'bottom', offsetX: 10, offsetY: 20 },
          style: createButtonStyle('circle-medium')
        },
        {
          id: 'see-danger',
          label: '发现危险',
          text: '发现危险',
          description: '看到了潜在的危险，需要小心应对',
          nextSegmentId: 'danger-ending',
          position: { x: 'right', y: 'bottom', offsetX: -10, offsetY: 20 },
          style: createButtonStyle('rectangle')
        }
      ]
    },
    {
      id: 'elder-wisdom',
      videoUrl: '/assest/ForBiggerBlazes.mp4',
      duration: 22,
      branchTriggerTime: 19,
      backgroundAnimation: {
        type: 'scale',
        duration: 3,
        amplitude: 1.5,
        enabled: true
      },
      branchTitle: {
        text: '长者的智慧',
        position: { x: 'center', y: 'top', offsetY: 10 },
        style: createTitleStyle('village')
      },
      branches: [
        {
          id: 'follow-advice',
          label: '听从建议',
          text: '听从建议',
          description: '接受长者的智慧建议',
          nextSegmentId: 'wisdom-ending',
          position: { x: 'left', y: 'bottom', offsetX: 10, offsetY: 20 },
          style: createButtonStyle('circle-large')
        },
        {
          id: 'ignore-advice',
          label: '忽略建议',
          text: '忽略建议',
          description: '决定按照自己的想法行动',
          nextSegmentId: 'independent-ending',
          position: { x: 'right', y: 'bottom', offsetX: -10, offsetY: 20 },
          style: createButtonStyle('rectangle')
        }
      ]
    },
    {
      id: 'village-secrets',
      videoUrl: '/assest/ElephantsDream.mp4',
      duration: 16,
      branchTriggerTime: 13,
      backgroundAnimation: {
        type: 'vertical',
        duration: 4,
        amplitude: 20,
        enabled: true
      },
      branchTitle: {
        text: '村庄的秘密',
        position: { x: 'left', y: 'top', offsetX: 5, offsetY: 10 },
        style: createTitleStyle('village')
      },
      branches: [
        {
          id: 'reveal-secret',
          label: '揭露秘密',
          text: '揭露秘密',
          description: '决定揭露你发现的村庄秘密',
          nextSegmentId: 'revelation-ending',
          position: { x: 'center', y: 'bottom', offsetY: 20 },
          style: createButtonStyle('transparent')
        },
        {
          id: 'keep-secret',
          label: '保守秘密',
          text: '保守秘密',
          description: '决定保守这个秘密',
          nextSegmentId: 'secret-ending',
          position: { x: 'left', y: 'bottom', offsetX: 10, offsetY: 20 },
          style: createButtonStyle('circle-medium')
        },
        {
          id: 'investigate-more',
          label: '深入调查',
          text: '深入调查',
          description: '继续深入调查这个秘密',
          nextSegmentId: 'investigation-ending',
          position: { x: 'right', y: 'bottom', offsetX: -10, offsetY: 20 },
          style: createButtonStyle('rectangle')
        }
      ]
    },
    {
      id: 'market-encounter',
      videoUrl: '/assest/BigBuckBunny.mp4',
      duration: 14,
      branchTriggerTime: 11,
      backgroundAnimation: {
        type: 'horizontal',
        duration: 2.5,
        amplitude: 18,
        enabled: true
      },
      branchTitle: {
        text: '市场遭遇',
        position: { x: 'right', y: 'top', offsetX: -5, offsetY: 10 },
        style: createTitleStyle('default')
      },
      branches: [
        {
          id: 'buy-item',
          label: '购买物品',
          text: '购买物品',
          description: '购买一件有用的物品',
          nextSegmentId: 'item-ending',
          position: { x: 'left', y: 'bottom', offsetX: 10, offsetY: 20 },
          style: createButtonStyle('circle-large')
        },
        {
          id: 'trade-service',
          label: '交换服务',
          text: '交换服务',
          description: '用服务换取你需要的东西',
          nextSegmentId: 'trade-ending',
          position: { x: 'right', y: 'bottom', offsetX: -10, offsetY: 20 },
          style: createButtonStyle('rectangle')
        }
      ]
    },
    {
      id: 'peak-challenge',
      videoUrl: '/assest/ForBiggerBlazes.mp4',
      duration: 18,
      branchTriggerTime: 15,
      backgroundAnimation: {
        type: 'scale',
        duration: 3.5,
        amplitude: 2,
        enabled: true
      },
      branchTitle: {
        text: '山峰挑战',
        position: { x: 'center', y: 'top', offsetY: 10 },
        style: createTitleStyle('default')
      },
      branches: [
        {
          id: 'overcome-challenge',
          label: '克服挑战',
          text: '克服挑战',
          description: '凭借勇气和毅力克服挑战',
          nextSegmentId: 'courage-ending',
          position: { x: 'center', y: 'bottom', offsetY: 20 },
          style: createButtonStyle('circle-large')
        },
        {
          id: 'find-shelter',
          label: '寻找庇护',
          text: '寻找庇护',
          description: '寻找安全的地方躲避恶劣天气',
          nextSegmentId: 'shelter-ending',
          position: { x: 'left', y: 'bottom', offsetX: 10, offsetY: 20 },
          style: createButtonStyle('rectangle')
        }
      ]
    },
    {
      id: 'cave-discovery',
      videoUrl: '/assest/ElephantsDream.mp4',
      duration: 16,
      branchTriggerTime: 13,
      backgroundAnimation: {
        type: 'vertical',
        duration: 4,
        amplitude: 25,
        enabled: true
      },
      branchTitle: {
        text: '洞穴发现',
        position: { x: 'left', y: 'top', offsetX: 5, offsetY: 10 },
        style: createTitleStyle('default')
      },
      branches: [
        {
          id: 'explore-cave',
          label: '探索洞穴',
          text: '探索洞穴',
          description: '深入洞穴探索其中的秘密',
          nextSegmentId: 'cave-treasure-ending',
          position: { x: 'center', y: 'bottom', offsetY: 20 },
          style: createButtonStyle('circle-medium')
        },
        {
          id: 'rest-in-cave',
          label: '在洞穴休息',
          text: '在洞穴休息',
          description: '在洞穴中休息恢复体力',
          nextSegmentId: 'rest-ending',
          position: { x: 'left', y: 'bottom', offsetX: 10, offsetY: 20 },
          style: createButtonStyle('rectangle')
        }
      ]
    },
    {
      id: 'stream-path',
      videoUrl: '/assest/BigBuckBunny.mp4',
      duration: 13,
      branchTriggerTime: 10,
      backgroundAnimation: {
        type: 'horizontal',
        duration: 3,
        amplitude: 22,
        enabled: true
      },
      branchTitle: {
        text: '溪流之路',
        position: { x: 'right', y: 'center', offsetX: -5 },
        style: createTitleStyle('default')
      },
      branches: [
        {
          id: 'follow-downstream',
          label: '顺流而下',
          text: '顺流而下',
          description: '跟随溪流向下游前进',
          nextSegmentId: 'downstream-ending',
          position: { x: 'left', y: 'bottom', offsetX: 10, offsetY: 20 },
          style: createButtonStyle('circle-large')
        },
        {
          id: 'cross-stream',
          label: '穿越溪流',
          text: '穿越溪流',
          description: '尝试穿越溪流到对岸',
          nextSegmentId: 'crossing-ending',
          position: { x: 'right', y: 'bottom', offsetX: -10, offsetY: 20 },
          style: createButtonStyle('rectangle')
        }
      ]
    },
    // 结局片段
    {
      id: 'heroic-ending',
      videoUrl: '/assest/ForBiggerBlazes.mp4',
      duration: 10,
      isEnd: true
    },
    {
      id: 'collaborative-ending',
      videoUrl: '/assest/ElephantsDream.mp4',
      duration: 12,
      isEnd: true
    },
    {
      id: 'diplomatic-ending',
      videoUrl: '/assest/BigBuckBunny.mp4',
      duration: 8,
      isEnd: true
    },
    {
      id: 'ruins-ending',
      videoUrl: '/assest/ForBiggerBlazes.mp4',
      duration: 15,
      isEnd: true
    },
    {
      id: 'spring-ending',
      videoUrl: '/assest/ElephantsDream.mp4',
      duration: 9,
      isEnd: true
    },
    {
      id: 'treasure-ending',
      videoUrl: '/assest/BigBuckBunny.mp4',
      duration: 11,
      isEnd: true
    },
    {
      id: 'danger-ending',
      videoUrl: '/assest/ForBiggerBlazes.mp4',
      duration: 7,
      isEnd: true
    },
    {
      id: 'wisdom-ending',
      videoUrl: '/assest/ElephantsDream.mp4',
      duration: 14,
      isEnd: true
    },
    {
      id: 'independent-ending',
      videoUrl: '/assest/BigBuckBunny.mp4',
      duration: 10,
      isEnd: true
    },
    {
      id: 'revelation-ending',
      videoUrl: '/assest/ForBiggerBlazes.mp4',
      duration: 13,
      isEnd: true
    },
    {
      id: 'secret-ending',
      videoUrl: '/assest/ElephantsDream.mp4',
      duration: 9,
      isEnd: true
    },
    {
      id: 'investigation-ending',
      videoUrl: '/assest/BigBuckBunny.mp4',
      duration: 16,
      isEnd: true
    },
    {
      id: 'item-ending',
      videoUrl: '/assest/ForBiggerBlazes.mp4',
      duration: 8,
      isEnd: true
    },
    {
      id: 'trade-ending',
      videoUrl: '/assest/ElephantsDream.mp4',
      duration: 8,
      isEnd: true
    },
    {
      id: 'courage-ending',
      videoUrl: '/assest/ForBiggerBlazes.mp4',
      duration: 13,
      isEnd: true
    },
    {
      id: 'shelter-ending',
      videoUrl: '/assest/ElephantsDream.mp4',
      duration: 6,
      isEnd: true
    },
    {
      id: 'cave-treasure-ending',
      videoUrl: '/assest/ForBiggerBlazes.mp4',
      duration: 10,
      isEnd: true
    },
    {
      id: 'rest-ending',
      videoUrl: '/assest/ElephantsDream.mp4',
      duration: 5,
      isEnd: true
    },
    {
      id: 'downstream-ending',
      videoUrl: '/assest/ForBiggerBlazes.mp4',
      duration: 12,
      isEnd: true
    },
    {
      id: 'crossing-ending',
      videoUrl: '/assest/ElephantsDream.mp4',
      duration: 8,
      isEnd: true
    }
  ]
};
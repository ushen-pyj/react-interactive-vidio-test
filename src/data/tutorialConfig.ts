import { InteractiveVideoConfig } from '../types/interactive-video';
import { createTitleStyle, createButtonStyle } from '../utils/stylePresets';

export const tutorialConfig: InteractiveVideoConfig = {
  id: 'interactive-tutorial',
  title: '互动视频教程',
  description: '学习如何使用互动视频系统的完整教程',
  startSegmentId: 'tutorial-start',
  settings: {
    autoPlay: true,
    showControls: true,
    width: 1280,
    height: 720
  },
  segments: [
    {
      id: 'tutorial-start',
      videoUrl: '/assest/BigBuckBunny.mp4',
      duration: 20,
      branchTriggerTime: 15,
      backgroundAnimation: {
        type: 'scale',
        duration: 4,
        amplitude: 3,
        enabled: true
      },
      branchTitle: {
        text: '选择学习路径',
        position: { x: 'center', y: 'top', offsetY: 10 },
        style: createTitleStyle('default')
      },
      branches: [
        {
          id: 'basic-tutorial',
          label: '基础教程',
          text: '基础教程',
          description: '从基础开始学习互动视频',
          nextSegmentId: 'basics-lesson',
          position: { x: 'left', y: 'bottom', offsetX: 15, offsetY: 25 },
          style: createButtonStyle('rectangle')
        },
        {
          id: 'advanced-tutorial',
          label: '高级教程',
          text: '高级教程',
          description: '学习高级功能和技巧',
          nextSegmentId: 'advanced-lesson',
          position: { x: 'right', y: 'bottom', offsetX: -15, offsetY: 25 },
          style: createButtonStyle('circle-large')
        },
        {
          id: 'quick-demo',
          label: '快速演示',
          text: '快速演示',
          description: '快速了解主要功能',
          nextSegmentId: 'demo-lesson',
          position: { x: 'center', y: 'bottom', offsetY: 25 },
          style: createButtonStyle('transparent')
        }
      ]
    },
    {
      id: 'basics-lesson',
      videoUrl: '/assest/ElephantsDream.mp4',
      duration: 30,
      branchTriggerTime: 25,
      backgroundAnimation: {
        type: 'horizontal',
        duration: 5,
        amplitude: 20,
        enabled: true
      },
      branchTitle: {
        text: '基础操作练习',
        position: { x: 'left', y: 'top', offsetX: 10, offsetY: 10 },
        style: createTitleStyle('default')
      },
      branches: [
        {
          id: 'practice-basic',
          label: '练习基础操作',
          text: '练习基础操作',
          description: '通过实际操作来练习基础功能',
          nextSegmentId: 'basic-practice-ending',
          position: { x: 'center', y: 'center' },
          style: createButtonStyle('circle-medium')
        },
        {
          id: 'continue-advanced',
          label: '继续高级教程',
          text: '继续高级教程',
          description: '转到高级教程继续学习',
          nextSegmentId: 'advanced-lesson',
          position: { x: 'right', y: 'bottom', offsetX: -10, offsetY: 20 },
          style: createButtonStyle('rectangle')
        }
      ]
    },
    {
      id: 'advanced-lesson',
      videoUrl: '/assest/ForBiggerBlazes.mp4',
      duration: 35,
      branchTriggerTime: 30,
      backgroundAnimation: {
        type: 'vertical',
        duration: 3.5,
        amplitude: 25,
        enabled: true
      },
      branchTitle: {
        text: '高级功能学习',
        position: { x: 'right', y: 'top', offsetX: -10, offsetY: 10 },
        style: createTitleStyle('default')
      },
      branches: [
        {
          id: 'practice-advanced',
          label: '练习高级功能',
          text: '练习高级功能',
          description: '通过实际操作来掌握高级功能',
          nextSegmentId: 'advanced-practice-ending',
          position: { x: 'left', y: 'center', offsetX: 10 },
          style: createButtonStyle('circle-large')
        },
        {
          id: 'complete-tutorial',
          label: '完成教程',
          text: '完成教程',
          description: '结束学习，查看总结',
          nextSegmentId: 'tutorial-complete-ending',
          position: { x: 'right', y: 'center', offsetX: -10 },
          style: createButtonStyle('rectangle')
        }
      ]
    },
    {
      id: 'demo-lesson',
      videoUrl: '/assest/BigBuckBunny.mp4',
      duration: 15,
      branchTriggerTime: 12,
      backgroundAnimation: {
        type: 'scale',
        duration: 2.5,
        amplitude: 4,
        enabled: true
      },
      branchTitle: {
        text: '快速演示选项',
        position: { x: 'center', y: 'top', offsetY: 10 },
        style: createTitleStyle('default')
      },
      branches: [
        {
          id: 'detailed-learning',
          label: '详细学习',
          text: '详细学习',
          description: '转到详细的学习模式',
          nextSegmentId: 'basics-lesson',
          position: { x: 'left', y: 'bottom', offsetX: 15, offsetY: 25 },
          style: createButtonStyle('circle-medium')
        },
        {
          id: 'finish-demo',
          label: '完成演示',
          text: '完成演示',
          description: '结束快速演示',
          nextSegmentId: 'demo-complete-ending',
          position: { x: 'right', y: 'bottom', offsetX: -15, offsetY: 25 },
          style: createButtonStyle('rectangle')
        }
      ]
    },
    {
      id: 'basic-practice-ending',
      videoUrl: '/assest/ForBiggerBlazes.mp4',
      duration: 8,
      isEnd: true
    },
    {
      id: 'advanced-practice-ending',
      videoUrl: '/assest/ElephantsDream.mp4',
      duration: 10,
      isEnd: true
    },
    {
      id: 'tutorial-complete-ending',
      videoUrl: '/assest/ForBiggerBlazes.mp4',
      duration: 6,
      isEnd: true
    },
    {
      id: 'demo-complete-ending',
      videoUrl: '/assest/ElephantsDream.mp4',
      duration: 7,
      isEnd: true
    }
  ]
};

export default tutorialConfig;
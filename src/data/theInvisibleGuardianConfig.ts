import { InteractiveVideoConfig } from '../types/interactive-video';
import { createTitleStyle, createButtonStyle } from '../utils/stylePresets';

export const theInvisibleGuardianConfig: InteractiveVideoConfig = {
    id: 'the-invisible-guardian',
    title: '隐形守护者',
    description: '一个充满选择的互动冒险故事，你的每个决定都会影响故事的走向。',
    startSegmentId: 'intro',
    settings: {
      autoPlay: true,
      showControls: false,
      width: 1280,
      height: 780
    },
    segments: [
      {
        id: 'intro',
        videoUrl: 'https://decisive-acoustics-d6d7084427.media.strapiapp.com/1_so_Convert_955dfe72c3.mp4',
        duration: 10,
        autoNext: true,
        branches: [
          {
            id: 'intro1',
            label: '序章1',
            text: '序章1',
            description: '序章1',
            nextSegmentId: 'intro1',
            position: { x: 'center', y: 'center' },
            style: createButtonStyle('circle-large')
          }
        ]
      },
      {
        id: 'intro1',
        videoUrl: 'https://decisive-acoustics-d6d7084427.media.strapiapp.com/2_so_Convert_e67d23c309.mp4',
        duration: 7,
        autoNext: true,
        branches: [
          {
            id: 'intro2',
            label: '序章2',
            text: '序章2',
            description: '序章2',
            nextSegmentId: 'intro2',
            position: { x: 'center', y: 'center' },
            style: createButtonStyle('circle-large')
          }
        ]
      },
      {
        id: 'intro2',
        videoUrl: 'https://decisive-acoustics-d6d7084427.media.strapiapp.com/3_so_Convert_aec515026e.mp4',
        duration: 9,
        autoNext: true,
        branches: [
          {
            id: 'intro3',
            label: '序章3',
            text: '序章3',
            description: '序章3',
            nextSegmentId: 'intro3',
            position: { x: 'center', y: 'center' },
            style: createButtonStyle('circle-large')
          }
        ]
      },
      {
        id: 'intro3',
        videoUrl: 'https://decisive-acoustics-d6d7084427.media.strapiapp.com/4_so_Convert_081499c711.mp4',
        duration: 9,
        autoNext: true,
        branches: [
          {
            id: 'intro4',
            label: '序章4',
            text: '序章4',
            description: '序章4',
            nextSegmentId: 'intro4',
            position: { x: 'center', y: 'center' },
            style: createButtonStyle('circle-large')
          }
        ]
      },
      {
        id: 'intro4',
        videoUrl: 'https://decisive-acoustics-d6d7084427.media.strapiapp.com/5_so_Convert_e8e8177d9c.mp4',
        duration: 9,
        autoNext: true,
        branches: [
          {
            id: 'intro5',
            label: '序章5',
            text: '序章5',
            description: '序章5',
            nextSegmentId: 'intro5',
            position: { x: 'center', y: 'center' },
            style: createButtonStyle('circle-large')
          }
        ]
      },
      {
        id: 'intro5',
        videoUrl: 'https://decisive-acoustics-d6d7084427.media.strapiapp.com/6_so_Convert_fb1cad1de5.mp4',
        duration: 9,
        autoNext: true,
        branches: [
          {
            id: 'intro6',
            label: '序章6',
            text: '序章6',
            description: '序章6',
            nextSegmentId: 'intro6',
            position: { x: 'center', y: 'center' },
            style: createButtonStyle('circle-large')
          }
        ]
      },
      {
        id: 'intro6',
        videoUrl: 'https://decisive-acoustics-d6d7084427.media.strapiapp.com/7_so_Convert_b9d11b1fa0.mp4',
        duration: 9,
        autoNext: true,
        branches: [
          {
            id: 'intro7',
            label: '序章7',
            text: '序章7',
            description: '序章7',
            nextSegmentId: 'intro7',
            position: { x: 'center', y: 'center' },
            style: createButtonStyle('circle-large')
          }
        ]
      },
      {
        id: 'intro7',
        videoUrl: 'https://decisive-acoustics-d6d7084427.media.strapiapp.com/8_so_Convert_29978112eb.mp4',
        duration: 10,
        autoNext: true,
        branches: [
          {
            id: 'intro8',
            label: '序章8',
            text: '序章8',
            description: '序章8',
            nextSegmentId: 'intro8',
            position: { x: 'center', y: 'center' },
            style: createButtonStyle('circle-large')
          }
        ]
      },
      {
        id: 'intro8',
        videoUrl: 'https://decisive-acoustics-d6d7084427.media.strapiapp.com/9_so_Convert_5629252e6a.mp4',
        duration: 10,
        branchTriggerTime: 10,
        backgroundAnimation: {
          type: 'scale',
          duration: 4,
          amplitude: 5,
          enabled: true
        },
        branches: [
          {
            id: 'jushou1',
            label: '举手',
            text: '举手',
            description: '举手',
            nextSegmentId: 'jushou1',
            position: { x: 'left', y: 'bottom', offsetX: 100, offsetY: 200 },
            style: createButtonStyle('circle-large')
          },
          {
            id: 'bujushou1',
            label: '不举手',
            text: '不举手',
            description: '不举手',
            nextSegmentId: 'bujushou1',
            position: { x: 'right', y: 'bottom', offsetX: -400, offsetY: 200 },
            style: createButtonStyle('circle-large')
          }
        ]
      },
      {
        id: 'jushou1',
        videoUrl: 'https://decisive-acoustics-d6d7084427.media.strapiapp.com/1_so_Convert_769637c3ec.mp4',
        duration: 9,
        autoNext: true,
        branches: [
          {
            id: 'jushou2',
            label: '举手2',
            text: '举手2',
            description: '举手2',
            nextSegmentId: 'jushou2',
            position: { x: 'center', y: 'center' },
            style: createButtonStyle('circle-large')
          }
        ]
      },
      {
        id: 'jushou2',
        videoUrl: 'https://decisive-acoustics-d6d7084427.media.strapiapp.com/2_so_Convert_2cb2706718.mp4',
        duration: 10,
        autoNext: true,
        branches: [
          {
            id: 'jushou3',
            label: '举手3',
            text: '举手3',
            description: '举手3',
            nextSegmentId: 'jushou3',
            position: { x: 'center', y: 'center' },
            style: createButtonStyle('circle-large')
          }
        ]
      },
      {
        id: 'jushou3',
        videoUrl: 'https://decisive-acoustics-d6d7084427.media.strapiapp.com/3_so_Convert_ca4cdfc564.mp4',
        duration: 11,
        autoNext: true,
        branches: [
          {
            id: 'jushou4',
            label: '举手4',
            text: '举手4',
            description: '举手4',
            nextSegmentId: 'jushou4',
            position: { x: 'center', y: 'center' },
            style: createButtonStyle('circle-large')
          }
        ]
      },
      {
        id: 'jushou4',
        videoUrl: 'https://decisive-acoustics-d6d7084427.media.strapiapp.com/4_so_Convert_93944f1b08.mp4',
        duration: 10,
        branchTriggerTime: 10,
        backgroundAnimation: {
          type: 'horizontal',
          duration: 4,
          amplitude: 5,
          enabled: true
        },
        branches: [
          {
            id: 'jixuzhanzheng1',
            label: '继续战争,彻底消灭反日示例',
            text: '继续战争,彻底消灭反日示例',
            description: '继续战争,彻底消灭反日示例',
            nextSegmentId: 'jixuzhanzheng1',
            position: { x: 'left', y: 'bottom', offsetX: 200, offsetY: 200 },
            style: createButtonStyle('transparent')
          },
          {
            id: 'hepingtanpan1',
            label: '和平谈判，通过外交解决争端',
            text: '和平谈判，通过外交解决争端',
            description: '和平谈判，通过外交解决争端',
            nextSegmentId: 'hepingtanpan1',
            position: { x: 'right', y: 'bottom', offsetX: -400, offsetY: 200 },
            style: createButtonStyle('transparent')
          }
        ]
      },
      {
        id: 'bujushou1',
        videoUrl: 'https://decisive-acoustics-d6d7084427.media.strapiapp.com/1_so_Convert_50b0e72b83.mp4',
        duration: 7,
        autoNext: true,
        branches: [
          {
            id: 'bujushou2',
            label: '不举手2',
            text: '不举手2',
            description: '不举手2',
            nextSegmentId: 'bujushou2',
            position: { x: 'center', y: 'center' },
            style: createButtonStyle('circle-large')
          }
        ]
      },
      {
        id: 'bujushou2',
        videoUrl: 'https://decisive-acoustics-d6d7084427.media.strapiapp.com/2_so_Convert_bbe4dff2a9.mp4',
        duration: 12,
        autoNext: true,
        branches: [
          {
            id: 'bujushou3',
            label: '不举手3',
            text: '不举手3',
            description: '不举手3',
            nextSegmentId: 'bujushou3',
            position: { x: 'center', y: 'center' },
            style: createButtonStyle('circle-large')
          }
        ]
      },
      {
        id: 'bujushou3',
        videoUrl: 'https://decisive-acoustics-d6d7084427.media.strapiapp.com/3_so_Convert_5e1685ff2d.mp4',
        duration: 10,
        autoNext: true,
        branches: [
          {
            id: 'bujushou4',
            label: '不举手4',
            text: '不举手4',
            description: '不举手4',
            nextSegmentId: 'bujushou4',
            position: { x: 'center', y: 'center' },
            style: createButtonStyle('circle-large')
          }
        ]
      },
      {
        id: 'bujushou4',
        videoUrl: 'https://decisive-acoustics-d6d7084427.media.strapiapp.com/4_so_Convert_6648b25c03.mp4',
        duration: 7,
        autoNext: true,
        branches: [
          {
            id: 'bujushou5',
            label: '不举手5',
            text: '不举手5',
            description: '不举手5',
            nextSegmentId: 'bujushou5',
            position: { x: 'center', y: 'center' },
            style: createButtonStyle('circle-large')
          }
        ]
      },
      {
        id: 'bujushou5',
        videoUrl: 'https://decisive-acoustics-d6d7084427.media.strapiapp.com/5_so_Convert_8449375787.mp4',
        duration: 9,
        isEnd: true,
      },
      {
        id: 'hepingtanpan1',
        videoUrl: 'https://decisive-acoustics-d6d7084427.media.strapiapp.com/5_so_Convert_8449375787.mp4',
        duration: 9,
        isEnd: true,
      },
      {
        id: 'jixuzhanzheng1',
        videoUrl: 'https://decisive-acoustics-d6d7084427.media.strapiapp.com/1_so_Convert_848eb08d5a.mp4',
        duration: 8,
        autoNext: true,
        branches: [
          {
            id: 'jixuzhanzheng2',
            label: '继续战争,彻底消灭反日示例2',
            text: '继续战争,彻底消灭反日示例2',
            description: '继续战争,彻底消灭反日示例2',
            nextSegmentId: 'jixuzhanzheng2',
            position: { x: 'center', y: 'center' },
            style: createButtonStyle('circle-large')
          }
        ]
      },
      {
        id: 'jixuzhanzheng2',
        videoUrl: 'https://decisive-acoustics-d6d7084427.media.strapiapp.com/2_so_Convert_597bff704e.mp4',
        duration: 10,
        autoNext: true,
        branches: [
          {
            id: 'jixuzhanzheng3',
            label: '继续战争,彻底消灭反日示例3',
            text: '继续战争,彻底消灭反日示例3',
            description: '继续战争,彻底消灭反日示例3',
            nextSegmentId: 'jixuzhanzheng3',
            position: { x: 'center', y: 'center' },
            style: createButtonStyle('circle-large')
          }
        ]
      },
      {
        id: 'jixuzhanzheng3',
        videoUrl: 'https://decisive-acoustics-d6d7084427.media.strapiapp.com/3_so_Convert_75a1a21dd8.mp4',
        duration: 11,
        autoNext: true,
        branches: [
          {
            id: 'jixuzhanzheng4',
            label: '继续战争,彻底消灭反日示例4',
            text: '继续战争,彻底消灭反日示例4',
            description: '继续战争,彻底消灭反日示例4',
            nextSegmentId: 'jixuzhanzheng4',
            position: { x: 'center', y: 'center' },
            style: createButtonStyle('circle-large')
          }
        ]
      },
      {
        id: 'jixuzhanzheng4',
        videoUrl: 'https://decisive-acoustics-d6d7084427.media.strapiapp.com/4_so_Convert_88d20b2831.mp4',
        duration: 12,
        autoNext: true,
        branches: [
          {
            id: 'jixuzhanzheng5',
            label: '继续战争,彻底消灭反日示例5',
            text: '继续战争,彻底消灭反日示例5',
            description: '继续战争,彻底消灭反日示例5',
            nextSegmentId: 'jixuzhanzheng5',
            position: { x: 'center', y: 'center' },
            style: createButtonStyle('circle-large')
          }
        ]
      },
      {
        id: 'jixuzhanzheng5',
        videoUrl: 'https://decisive-acoustics-d6d7084427.media.strapiapp.com/5_so_Convert_4d55a1d11b.mp4',
        duration: 6,
        autoNext: true,
        branches: [
          {
            id: 'jixuzhanzheng6',
            label: '继续战争,彻底消灭反日示例6',
            text: '继续战争,彻底消灭反日示例6',
            description: '继续战争,彻底消灭反日示例6',
            nextSegmentId: 'jixuzhanzheng6',
            position: { x: 'center', y: 'center' },
            style: createButtonStyle('circle-large')
          }
        ]
      },
      {
        id: 'jixuzhanzheng6',
        videoUrl: 'https://decisive-acoustics-d6d7084427.media.strapiapp.com/6_so_Convert_7c905775a8.mp4',
        duration: 6,
        branchTriggerTime: 6,
        backgroundAnimation: {
          type: 'vertical',
          duration: 4,
          amplitude: 5,
          enabled: true
        },
        branches: [
          {
            id: 'jixuzhanzheng7',
            label: '点击敬酒',
            text: '点击敬酒',
            description: '点击敬酒',
            nextSegmentId: 'jixuzhanzheng7',
            position: { x: 'center', y: 'center' },
            style: createButtonStyle('circle-large')
          }
        ]
      },
      {
        id: 'jixuzhanzheng7',
        videoUrl: 'https://decisive-acoustics-d6d7084427.media.strapiapp.com/7_so_Convert_f2c4e57ef0.mp4',
        duration: 9,
        autoNext: true,
        branches: [
          {
            id: 'jixuzhanzheng8',
            label: '',
            text: '',
            description: '',
            nextSegmentId: 'jixuzhanzheng8',
            position: { x: 'center', y: 'center' },
            style: createButtonStyle('circle-large')
          }
        ]
      },
      {
        id: 'jixuzhanzheng8',
        videoUrl: 'https://decisive-acoustics-d6d7084427.media.strapiapp.com/8_so_Convert_f463a8e5c7.mp4',
        duration: 8,
        autoNext: true,
        branches: [
          {
            id: 'jixuzhanzheng9',
            label: '',
            text: '',
            description: '',
            nextSegmentId: 'jixuzhanzheng9',
            position: { x: 'center', y: 'center' },
            style: createButtonStyle('circle-large')
          }
        ]
      },
      {
        id: 'jixuzhanzheng9',
        videoUrl: 'https://decisive-acoustics-d6d7084427.media.strapiapp.com/9_so_Convert_42cc529fb3.mp4',
        duration: 8,
        autoNext: true,
        branches: [
          {
            id: 'jixuzhanzheng10',
            label: '',
            text: '',
            description: '',
            nextSegmentId: 'jixuzhanzheng10',
            position: { x: 'center', y: 'center' },
            style: createButtonStyle('circle-large')
          }
        ]
      },
      {
        id: 'jixuzhanzheng10',
        videoUrl: 'https://decisive-acoustics-d6d7084427.media.strapiapp.com/10_so_Convert_3e98082c20.mp4',
        duration: 9,
        autoNext: true,
        branches: [
          {
            id: 'jixuzhanzheng11',
            label: '',
            text: '',
            description: '',
            nextSegmentId: 'jixuzhanzheng11',
            position: { x: 'center', y: 'center' },
            style: createButtonStyle('circle-large')
          }
        ]
      },
      {
        id: 'jixuzhanzheng11',
        videoUrl: 'https://decisive-acoustics-d6d7084427.media.strapiapp.com/11_so_Convert_e94c623c6e.mp4',
        duration: 11,
        autoNext: true,
        branches: [
          {
            id: 'jixuzhanzheng12',
            label: '',
            text: '',
            description: '',
            nextSegmentId: 'jixuzhanzheng12',
            position: { x: 'center', y: 'center' },
            style: createButtonStyle('circle-large')
          }
        ]
      },
      {
        id: 'jixuzhanzheng12',
        videoUrl: 'https://decisive-acoustics-d6d7084427.media.strapiapp.com/12_so_Convert_58dad2a6a8.mp4',
        duration: 10,
        autoNext: true,
        branches: [
          {
            id: 'jixuzhanzheng13',
            label: '',
            text: '',
            description: '',
            nextSegmentId: 'jixuzhanzheng13',
            position: { x: 'center', y: 'center' },
            style: createButtonStyle('circle-large')
          }
        ]
      },
      {
        id: 'jixuzhanzheng13',
        videoUrl: 'https://decisive-acoustics-d6d7084427.media.strapiapp.com/13_so_Convert_848ae93c72.mp4',
        duration: 8,
        isEnd: true
      }
    ]
};

export default theInvisibleGuardianConfig;
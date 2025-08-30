declare module 'videocontext' {
  interface VideoContextOptions {
    canvas?: HTMLCanvasElement;
    width?: number;
    height?: number;
    preserveDrawingBuffer?: boolean;
  }

  interface VideoNode {
    connect(destination: any): void;
    start(time?: number): void;
    stop(time?: number): void;
    destroy(): void;
  }

  interface AudioNode {
    connect(destination: any): void;
    start(time?: number): void;
    stop(time?: number): void;
    destroy(): void;
  }

  interface EffectNode {
    connect(destination: any): void;
    start(time?: number): void;
    stop(time?: number): void;
    destroy(): void;
  }

  class VideoContext {
    constructor(canvas: HTMLCanvasElement, options?: VideoContextOptions);
    
    // Properties
    canvas: HTMLCanvasElement;
    destination: any;
    currentTime: number;
    duration: number;
    state: string;
    
    // Video methods
    video(src: string): VideoNode;
    
    // Audio methods
    audio(src: string): AudioNode;
    
    // Effect methods
    effect(type: string): EffectNode;
    
    // Playback control
    play(): void;
    pause(): void;
    seek(time: number): void;
    
    // Lifecycle
    destroy(): void;
    
    // Events
    addEventListener(event: string, callback: Function): void;
    removeEventListener(event: string, callback: Function): void;
    registerCallback(event: string, callback: Function): void;
    unregisterCallback(event: string, callback: Function): void;
  }

  export default VideoContext;
  export { VideoContext, VideoNode, AudioNode, EffectNode };
}
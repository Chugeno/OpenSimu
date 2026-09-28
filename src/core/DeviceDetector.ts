export type DeviceType = 'desktop' | 'tablet' | 'mobile';

export interface DeviceInfo {
  type: DeviceType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  hasTouch: boolean;
  screenOrientation: 'portrait' | 'landscape';
  screenWidth: number;
  screenHeight: number;
}

export class DeviceDetector {
  private static listeners: Array<(info: DeviceInfo) => void> = [];
  private static currentInfo: DeviceInfo = DeviceDetector.detect();

  public static detect(): DeviceInfo {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    const hasTouch = typeof window !== 'undefined' && (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      (navigator as any).msMaxTouchPoints > 0
    );

    const w = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const h = typeof window !== 'undefined' ? window.innerHeight : 768;

    const isMobileUA = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const isTabletUA = /iPad|Android(?!.*Mobile)|Tablet/i.test(ua);

    let type: DeviceType = 'desktop';

    if (isMobileUA || (w <= 600 && hasTouch)) {
      type = 'mobile';
    } else if (isTabletUA || (w <= 1024 && hasTouch)) {
      type = 'tablet';
    } else if (w < 768) {
      type = 'mobile';
    }

    const info: DeviceInfo = {
      type,
      isMobile: type === 'mobile',
      isTablet: type === 'tablet',
      isDesktop: type === 'desktop',
      hasTouch,
      screenOrientation: w >= h ? 'landscape' : 'portrait',
      screenWidth: w,
      screenHeight: h,
    };

    return info;
  }

  public static init() {
    if (typeof window === 'undefined') return;

    this.currentInfo = this.detect();
    this.applyBodyClasses(this.currentInfo);

    window.addEventListener('resize', () => {
      const newInfo = this.detect();
      if (
        newInfo.type !== this.currentInfo.type ||
        newInfo.screenOrientation !== this.currentInfo.screenOrientation ||
        Math.abs(newInfo.screenWidth - this.currentInfo.screenWidth) > 50
      ) {
        this.currentInfo = newInfo;
        this.applyBodyClasses(newInfo);
        this.notify(newInfo);
      }
    });

    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        const newInfo = this.detect();
        this.currentInfo = newInfo;
        this.applyBodyClasses(newInfo);
        this.notify(newInfo);
      }, 100);
    });
  }

  public static getInfo(): DeviceInfo {
    return this.currentInfo;
  }

  public static onDeviceChange(listener: (info: DeviceInfo) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private static notify(info: DeviceInfo) {
    for (const listener of this.listeners) {
      listener(info);
    }
  }

  private static applyBodyClasses(info: DeviceInfo) {
    if (typeof document === 'undefined') return;
    const body = document.body;
    body.classList.remove('device-mobile', 'device-tablet', 'device-desktop', 'has-touch', 'orientation-portrait', 'orientation-landscape');

    body.classList.add(`device-${info.type}`);
    body.classList.add(`orientation-${info.screenOrientation}`);
    if (info.hasTouch) {
      body.classList.add('has-touch');
    }
  }
}

/**
 * Performance monitoring utilities for canvas operations
 */

interface PerformanceEntry {
  name: string;
  startTime: number;
  duration?: number;
}

class PerformanceMonitor {
  private entries: Map<string, PerformanceEntry> = new Map();
  private fpsHistory: number[] = [];
  private lastFrameTime = 0;
  private frameCount = 0;
  private isMonitoring = false;

  /**
   * Start timing a performance entry
   */
  start(name: string): void {
    this.entries.set(name, {
      name,
      startTime: performance.now(),
    });
  }

  /**
   * End timing a performance entry and return duration
   */
  end(name: string): number {
    const entry = this.entries.get(name);
    if (!entry) {
      console.warn(`Performance entry "${name}" not found`);
      return 0;
    }

    const duration = performance.now() - entry.startTime;
    entry.duration = duration;

    return duration;
  }

  /**
   * Get the duration of a completed performance entry
   */
  getDuration(name: string): number {
    const entry = this.entries.get(name);
    return entry?.duration ?? 0;
  }

  /**
   * Start FPS monitoring
   */
  startFPSMonitoring(): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.lastFrameTime = performance.now();
    this.frameCount = 0;
    this.fpsHistory = [];

    this.measureFPS();
  }

  /**
   * Stop FPS monitoring
   */
  stopFPSMonitoring(): void {
    this.isMonitoring = false;
  }

  /**
   * Get current FPS
   */
  getCurrentFPS(): number {
    if (this.fpsHistory.length === 0) return 0;
    return this.fpsHistory[this.fpsHistory.length - 1];
  }

  /**
   * Get average FPS over the monitoring period
   */
  getAverageFPS(): number {
    if (this.fpsHistory.length === 0) return 0;
    const sum = this.fpsHistory.reduce((a, b) => a + b, 0);
    return sum / this.fpsHistory.length;
  }

  /**
   * Get FPS history
   */
  getFPSHistory(): number[] {
    return [...this.fpsHistory];
  }

  /**
   * Measure memory usage (if available)
   */
  getMemoryUsage(): number | undefined {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return memory.usedJSHeapSize;
    }
    return undefined;
  }

  /**
   * Clear all performance data
   */
  clear(): void {
    this.entries.clear();
    this.fpsHistory = [];
    this.frameCount = 0;
  }

  /**
   * Get performance summary
   */
  getSummary(): {
    entries: { name: string; duration: number }[];
    currentFPS: number;
    averageFPS: number;
    memoryUsage?: number;
  } {
    const entries = Array.from(this.entries.values())
      .filter(entry => entry.duration !== undefined)
      .map(entry => ({
        name: entry.name,
        duration: entry.duration!,
      }));

    return {
      entries,
      currentFPS: this.getCurrentFPS(),
      averageFPS: this.getAverageFPS(),
      memoryUsage: this.getMemoryUsage(),
    };
  }

  private measureFPS(): void {
    if (!this.isMonitoring) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastFrameTime;

    this.frameCount++;

    // Calculate FPS every 100ms
    if (deltaTime >= 100) {
      const fps = Math.round((this.frameCount * 1000) / deltaTime);
      this.fpsHistory.push(fps);

      // Keep only last 100 FPS measurements
      if (this.fpsHistory.length > 100) {
        this.fpsHistory.shift();
      }

      this.frameCount = 0;
      this.lastFrameTime = currentTime;
    }

    requestAnimationFrame(() => this.measureFPS());
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

/**
 * Decorator for measuring function performance
 */
export function measurePerformance(name: string) {
  return function <T extends (...args: any[]) => any>(
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<T>
  ) {
    const originalMethod = descriptor.value;

    if (!originalMethod) return;

    descriptor.value = function (this: any, ...args: any[]) {
      performanceMonitor.start(name);
      const result = originalMethod.apply(this, args);
      performanceMonitor.end(name);
      return result;
    } as T;

    return descriptor;
  };
}

/**
 * Higher-order function for measuring async function performance
 */
export function withPerformanceTracking<T extends (...args: any[]) => any>(
  name: string,
  func: T
): T {
  return ((...args: any[]) => {
    performanceMonitor.start(name);
    const result = func(...args);

    if (result instanceof Promise) {
      return result.finally(() => {
        performanceMonitor.end(name);
      });
    } else {
      performanceMonitor.end(name);
      return result;
    }
  }) as T;
}

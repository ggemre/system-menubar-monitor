export type NetworkData = { received: number; sent: number; time: number };
export type CPUData = { userUsage: number; sysUsage: number; time: number };
export type TemperatureData = { temperature: number; time: number };
export type SystemData<T> = { prev: T | null; curr: T };

export interface SystemDataProvider<T> {
  getSystemData(): Promise<T>;
  getTitle(systemData: SystemData<T> | null): string;
  getTooltip(systemData: SystemData<T> | null): string;
}

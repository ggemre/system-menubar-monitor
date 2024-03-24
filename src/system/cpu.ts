import { promisify } from "util";
import { exec } from "child_process";
import { CPUData, SystemData, SystemDataProvider } from "../utils/types";

export class CPU implements SystemDataProvider<CPUData> {
  private userUsage: number | undefined;
  private sysUsage: number | undefined;

  public async getSystemData(): Promise<CPUData> {
    const output = await promisify(exec)("echo $(top -l 1 | awk '/CPU usage/' | awk '{print $3,$5,$7}')");
    const dataCells = output.stdout.split(" ").filter((cell) => cell !== "");

    return {
      userUsage: Number(dataCells[0].slice(0, -1)),
      sysUsage: Number(dataCells[1].slice(0, -1)),
      time: Date.now(),
    };
  }

  private calculateData(cpuData: SystemData<CPUData>) {
    this.userUsage = cpuData.curr.userUsage;
    this.sysUsage = cpuData.curr.sysUsage;
  }

  public getTitle(cpuData: SystemData<CPUData> | null): string {
    if (!cpuData || cpuData?.prev === null) {
      return "--";
    }

    if (!this.userUsage || !this.sysUsage) {
      this.calculateData(cpuData);
    }

    return `${this.userUsage}%`;
  }

  public getTooltip(cpuData: SystemData<CPUData> | null): string {
    if (!cpuData || cpuData?.prev === null) {
      return "--";
    }

    if (!this.userUsage || !this.sysUsage) {
      this.calculateData(cpuData);
    }

    return `User: ${this.userUsage}%\nSystem: ${this.sysUsage}%`;
  }
}

import { promisify } from "util";
import { exec } from "child_process";
import { NetworkData, SystemData, SystemDataProvider } from "../utils/types";
import { formatBytes } from "../utils/utils";

export class Network implements SystemDataProvider<NetworkData> {
  private received: number | undefined;
  private sent: number | undefined;

  public async getSystemData(): Promise<NetworkData> {
    const output = await promisify(exec)("/usr/sbin/netstat -I en0 -b");
    const dataRow = output.stdout.split("\n")[1];
    const dataCells = dataRow.split(" ").filter((cell) => cell !== "");

    return {
      received: Number(dataCells[6]),
      sent: Number(dataCells[9]),
      time: Date.now(),
    };
  }

  private calculateData(networkData: SystemData<NetworkData>) {
    const interval = (networkData.curr.time - networkData.prev!.time) / 1000;
    this.received = Math.round((networkData.curr.received - networkData.prev!.received) / interval);
    this.sent = Math.round((networkData.curr.sent - networkData.prev!.sent) / interval);
  }

  public getTitle(networkData: SystemData<NetworkData> | null): string {
    if (!networkData || networkData?.prev === null) {
      return "--";
    }

    if (!this.received || !this.sent) {
      this.calculateData(networkData);
    }

    const speed = Math.max(this.received!, this.sent!);

    return `${formatBytes(speed)}/s`;
  }

  public getTooltip(networkData: SystemData<NetworkData> | null): string {
    if (!networkData || networkData?.prev === null) {
      return "--";
    }

    if (!this.received || !this.sent) {
      this.calculateData(networkData);
    }

    return `Received: ${formatBytes(this.received!)}/s\nSent: ${formatBytes(this.sent!)}/s`;
  }
}

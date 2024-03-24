import { Icon, MenuBarExtra } from "@raycast/api";
import { useCachedPromise, useCachedState } from "@raycast/utils";
import { SystemData, CPUData } from "./utils/types";
import { CPU } from "./system/cpu";

export default function Command() {
  const cpu = new CPU();

  const [cpuData, setCpuData] = useCachedState<SystemData<CPUData> | null>("CpuData", null);

  const { isLoading: cpuLoading } = useCachedPromise(cpu.getSystemData, [], {
    onData: (data) => {
      setCpuData((prevCpuData) => ({
        prev: prevCpuData?.curr || null,
        curr: data,
      }));
    },
  });

  return (
    <MenuBarExtra
      icon={Icon.ComputerChip}
      isLoading={cpuLoading}
      title={cpu.getTitle(cpuData)}
      tooltip={cpu.getTooltip(cpuData)}
    />
  );
}

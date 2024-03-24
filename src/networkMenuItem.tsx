import { Icon, MenuBarExtra } from "@raycast/api";
import { useCachedPromise, useCachedState } from "@raycast/utils";
import { Network } from "./system/network";
import { SystemData, NetworkData } from "./utils/types";

export default function Command() {
  const network = new Network();

  const [netData, setNetData] = useCachedState<SystemData<NetworkData> | null>("NetworkData", null);

  const { isLoading: netLoading } = useCachedPromise(network.getSystemData, [], {
    onData: (data) => {
      setNetData((prevNetData) => ({
        prev: prevNetData?.curr || null,
        curr: data,
      }));
    },
  });

  return (
    <MenuBarExtra
      icon={Icon.ChevronUpDown}
      isLoading={netLoading}
      title={network.getTitle(netData)}
      tooltip={network.getTooltip(netData)}
    />
  );
}

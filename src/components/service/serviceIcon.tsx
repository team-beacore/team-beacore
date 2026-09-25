import type { ServiceIcon } from "../../content/services";
import {
  BagIcon,
  BotIcon,
  CodeIcon,
  CubesIcon,
  GlobeIcon,
  MonitorIcon,
  SlidersIcon,
  TargetIcon,
} from "../../lib/icons";

const map = {
  globe: GlobeIcon,
  target: TargetIcon,
  code: CodeIcon,
  monitor: MonitorIcon,
  bot: BotIcon,
  cubes: CubesIcon,
  bag: BagIcon,
  sliders: SlidersIcon,
} as const;

export function serviceIcon(icon: ServiceIcon) {
  return map[icon];
}

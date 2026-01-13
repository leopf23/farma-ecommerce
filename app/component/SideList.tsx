import { IconType } from "react-icons";
import { FiDroplet, FiSettings, FiActivity } from "react-icons/fi";

type Item = {
  label: string;
  value: number | string;
  icon: IconType;
};

type SideStatsProps = {
  items: Item[];
};

export default function SideList({ items }: SideStatsProps) {
  return (
    <ul className="flex md:flex-col gap-3">
      {items.map((item, index) => {
        const Icon = item.icon;

        return (
          <li
            key={index}
            className="flex items-center gap-3 py-2"
          >
            <Icon className="text-neutral-500 text-lg" />

            <div className="leading-tight">
              <p className="text-neutral-500 text-xs">
                {item.label}
              </p>
              <span className="font-semibold text-neutral-900 text-sm">
                {item.value}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

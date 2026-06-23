import { ModulePlaceholder } from "@/components/content/module-placeholder";

export const metadata = { title: "Maps" };

export default function MapsPage() {
  return (
    <ModulePlaceholder
      eyebrow="Facility Navigation"
      title="Site Maps"
      description="Interactive facility maps and zone overviews for Site-80."
      features={["Interactive Facility Map", "Containment Status Monitor", "Power Grid", "Zone Access", "Evacuation Routes"]}
    />
  );
}

import { PitWallScreen } from "@/components/pit-wall-screen";

export default async function PitWallPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <PitWallScreen clusterId={id} />;
}

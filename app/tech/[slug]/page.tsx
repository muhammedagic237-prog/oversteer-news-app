import { TransmissionDetailScreen } from "@/components/transmission-detail-screen";

export default async function TransmissionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <TransmissionDetailScreen slug={slug} />;
}

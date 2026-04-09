import { StoryDetailScreen } from "@/components/story-detail-screen";

export default async function StoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <StoryDetailScreen storyId={id} />;
}

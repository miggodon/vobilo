import StorePage from "./StorePage";

// Mock group lookup — ersätts med DB-query när auth är på plats
function getGroupName(slug: string): string {
  const names: Record<string, string> = {
    "hammarby-p09": "Hammarby P09",
    "klass-6b": "Klass 6B Svartedalsskolan",
  };
  return names[slug] ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function GroupStorePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const groupName = getGroupName(slug);

  return <StorePage slug={slug} groupName={groupName} />;
}

import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ ecosystem_slug: string; id: string }>;
};

export default async function Page({ params }: Props) {
  const { ecosystem_slug, id } = await params;

  redirect(`/dashboard/${ecosystem_slug}/${id}/overview`);
}

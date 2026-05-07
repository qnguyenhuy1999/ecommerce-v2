import { UserDetailPage } from '@/features/users/components/user-detail-page';

export default async function BuyerDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <UserDetailPage id={id} />;
}

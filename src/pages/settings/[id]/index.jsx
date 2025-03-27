// pages/settings/[id]/index.jsx
import Settings from '@/components/settings/Settings';

export default function Page({ params }) {
  // Safely handle undefined params or id
  const currentType = params?.id?.replace('-staff', '') || '';
  return <Settings currentType={currentType} />;
}

import { Outlet } from '@remix-run/react';

import { HomePage } from '~/components/home/HomePage';
import { useGetCurrentPathname } from '~/services/Navigation/useGetCurrentPathname';
import { createHandleMetaData } from '~/services/routeHandles';

export default function LandingLayoutRoute() {
  const currentPath = useGetCurrentPathname();
  return (
    <HomePage currentPath={currentPath}>
      <Outlet />
    </HomePage>
  );
}

export const handle = createHandleMetaData({
  globalNav: false,
  globalFooter: false,
});

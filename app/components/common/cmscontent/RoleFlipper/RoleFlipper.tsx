import { useCallback, useState } from 'react';
import { useIntervalEffect } from '@react-hookz/web';

import { RoleCard } from './RoleCard';

export function RoleFlipper(
  props: { roles: string[] } | { getRole: () => string }
) {
  const getRole = useCallback(() => {
    if ('getRole' in props && typeof props.getRole === 'function') {
      return props.getRole();
    }

    if (
      'roles' in props &&
      Array.isArray(props.roles) &&
      props.roles.length > 0
    ) {
      const index = Math.floor(Math.random() * props.roles.length);
      return props.roles[index];
    }

    return null;
  }, [props]);

  const [role, setRole] = useState(getRole);

  useIntervalEffect(function PickNextUniqueRole() {
    setRole((currentRole) => {
      let nextRole = getRole();

      if (nextRole === null) {
        return currentRole;
      }

      while (nextRole === currentRole) {
        nextRole = getRole();
      }
      return nextRole;
    });
  }, 2000);

  return <RoleCard role={role} />;
}

import { createContext, useContext } from 'react';
import { createContextualCan } from '@casl/react';
import { Roles, getLoggedInUser, getPermission } from '../utils';

// export const AbilityContext = createContext();
export const Can = createContextualCan(AbilityContext.Consumer);

function CanIDo({
  action,
  resource,
  showUnauthenticated = true,
  role = Roles.ADMIN,
  alternateChildren = null,
  children,
}) {
  const loggedInUser = getLoggedInUser();
  const ability = useContext(AbilityContext);
  if (
    loggedInUser?.role === Roles.SYSADMIN ||
    loggedInUser?.role === Roles.ADMIN
  ) {
    return <>{children}</>;
  }

  console.debug('Permissions request:', { action, resource });

  const arrActions = Array.isArray(action) ? action : [action];

  const isAllowed = arrActions.some((action) => {
    if (action === 'edit') {
      return ability.can('update', resource);
    }
    return ability.can(action, resource);
  });

  return (
    <div>
      {isAllowed ? (
        <div>{children}</div>
      ) : showUnauthenticated && !alternateChildren ? (
        <div className="">Not Found Page</div>
      ) : (
        alternateChildren
      )}
    </div>
  );
}

export default CanIDo;

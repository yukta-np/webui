import { createContext, useContext } from 'react';
import { createContextualCan } from '@casl/react';
import { Roles, getLoggedInUser } from '../utils';

export const AbilityContext = createContext();
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

  if (
    loggedInUser?.role === Roles.ADMIN ||
    loggedInUser?.role === Roles.SYSADMIN
  ) {
    return <>{children}</>;
  }

  const ability = useContext(AbilityContext);

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

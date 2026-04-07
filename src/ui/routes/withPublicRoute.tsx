import React, {ElementType, ReactElement} from 'react';

// Using HOC component
const withPublicRoute = (WrappedComponent: ElementType) => (props: unknown): ReactElement | null => {
  return <WrappedComponent {...props} />;
};

export default withPublicRoute;

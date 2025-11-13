import React, { ReactNode } from 'react';

interface ConditionalComponentProps {
  isValid: boolean;
  children: ReactNode;
}

const ConditionalComponent: React.FC<ConditionalComponentProps> = ({
  isValid,
  children,
}) => {
  if (!isValid) {
    return null;
  }

  return <>{children}</>;
};

export default ConditionalComponent;

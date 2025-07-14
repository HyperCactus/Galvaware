// Placeholder content for QuoteStatusBadge component
import React from 'react';

interface QuoteStatusBadgeProps {
  status: string;
}

const QuoteStatusBadge: React.FC<QuoteStatusBadgeProps> = ({ status }) => {
  return (
    <span>
      {/* Render badge based on status */}
      {status}
    </span>
  );
};

export default QuoteStatusBadge;
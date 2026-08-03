import React from 'react';
import { classNames } from '../utils/helpers';

const LoadingSkeleton = ({ className }) => (
  <div className={classNames('animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg', className)} />
);

export default LoadingSkeleton;


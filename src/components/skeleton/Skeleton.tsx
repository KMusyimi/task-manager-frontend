import { CSSProperties, memo } from 'react';
import './style/Skeleton.css';


interface SkeletonParams {
  type: 'box' | 'line';
  className?: string;
  width?: string | number;
  height?: string | number;
}

interface DynamicStyles extends CSSProperties {
  '--skeleton-w'?: string | number;
  '--skeleton-h'?: string | number;
}

function Skeleton({ type, className, width, height }: SkeletonParams) {
  const classes = `skeleton ${type === 'line' ? 'skeleton-line' : ''} ${className ?? ''}`;
  const style: DynamicStyles = { '--skeleton-w': width, '--skeleton-h': height }
  return (
    <div
      className={classes}
      style={style}
      aria-hidden="true"
    />)
}

export default memo(Skeleton);
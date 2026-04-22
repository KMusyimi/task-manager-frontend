import React, { lazy, memo, Suspense } from 'react';
import type { IconType } from 'react-icons';
import Skeleton from '../skeleton/Skeleton';



const createLazyIcon = (importFn: () => Promise<Record<string, unknown>>, member: string) => {
  return lazy(async () => {
    const module = await importFn();
    return { default: module[member] as IconType };
  });
};

const iconsObj = {
  FaEllipsis: createLazyIcon(() => import('react-icons/fa6'), 'FaEllipsis'),
  FaBarsStaggered: createLazyIcon(() => import('react-icons/fa6'), 'FaBarsStaggered'),
  FaPenToSquare: createLazyIcon(() => import('react-icons/fa6'), 'FaPenToSquare'),
  FaXmark: createLazyIcon(() => import('react-icons/fa6'), 'FaXmark'),
  FaPlus: createLazyIcon(() => import('react-icons/fa6'), 'FaPlus'),
  FaTriangleExclamation: createLazyIcon(() => import('react-icons/fa6'), 'FaTriangleExclamation'),
  FaArrowRightFromBracket: createLazyIcon(() => import('react-icons/fa6'), 'FaArrowRightFromBracket'),
  FaUserPen: createLazyIcon(() => import('react-icons/fa6'), 'FaUserPen'),
  FaGear: createLazyIcon(() => import('react-icons/fa6'), 'FaGear'),
  FaAngleRight: createLazyIcon(() => import('react-icons/fa6'), 'FaAngleRight'),
  FaLock: createLazyIcon(() => import('react-icons/fa6'), 'FaLock'),
  FaRegCircleXmark: createLazyIcon(() => import('react-icons/fa6'), 'FaRegCircleXmark'),
  FaCloudArrowUp: createLazyIcon(() => import('react-icons/fa6'), 'FaCloudArrowUp'),
  FaTrash: createLazyIcon(() => import('react-icons/fa6'), 'FaTrash'),
}

export type iconKeyTypes = keyof typeof iconsObj;

interface IconWrapperParams {
  name: keyof typeof iconsObj
  className?: string
  style?: React.CSSProperties
}

function IconWrapper({ name, ...rest }: IconWrapperParams) {
  const MyIcon = iconsObj[name];
  return (
    <i className='icon'>
      <Suspense fallback={<Skeleton type={'box'} height={16} width={16} />}>
        <MyIcon {...rest} />
      </Suspense>
    </i>
  )
}

export default memo(IconWrapper)
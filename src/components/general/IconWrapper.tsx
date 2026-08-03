import React, { lazy, memo, Suspense } from 'react';
import type { IconType } from 'react-icons';
import Skeleton from '../skeleton/Skeleton';


export type IconName = keyof typeof iconsObj ;

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
  LuUserPen: createLazyIcon(() => import('react-icons/lu'), 'LuUserPen'),
  PiGearSix: createLazyIcon(() => import('react-icons/pi'), 'PiGearSix'),
  FaAngleRight: createLazyIcon(() => import('react-icons/fa6'), 'FaAngleRight'),
  LuLock: createLazyIcon(() => import('react-icons/lu'), 'LuLock'),
  FaRegCircleXmark: createLazyIcon(() => import('react-icons/fa6'), 'FaRegCircleXmark'),
  FaCloudArrowUp: createLazyIcon(() => import('react-icons/fa6'), 'FaCloudArrowUp'),
  FaTrash: createLazyIcon(() => import('react-icons/fa6'), 'FaTrash'),
  FaExpand: createLazyIcon(() => import('react-icons/fa6'), 'FaExpand'),
  FiCalendar: createLazyIcon(() => import('react-icons/fi'), 'FiCalendar'),
  VscListFilter: createLazyIcon(() => import('react-icons/vsc'), 'VscListFilter'),
  TbLayoutDashboardFilled: createLazyIcon(() => import('react-icons/tb'), 'TbLayoutDashboardFilled'),
  RiSearch2Line: createLazyIcon(() => import('react-icons/ri'), 'RiSearch2Line'),
  LuTag: createLazyIcon(() => import('react-icons/lu'), 'LuTag'),
  PiLightning: createLazyIcon(() => import('react-icons/pi'), 'PiLightning'),
  FaChevronRight: createLazyIcon(() => import('react-icons/fa6'), 'FaChevronRight'),
  CheckedIcon: createLazyIcon(() => import('react-icons/io'), 'IoIosCheckmarkCircleOutline'),
  UncheckedIcon: createLazyIcon(() => import('react-icons/io'), 'IoMdRadioButtonOff'),
  BiComment: createLazyIcon(() => import('react-icons/bi'), 'BiComment'),
  LuUser: createLazyIcon(() => import('react-icons/lu'), 'LuUser'),
  RiAttachment2: createLazyIcon(() => import('react-icons/ri'), 'RiAttachment2'),
  FiChevronUp: createLazyIcon(() => import('react-icons/fi'), 'FiChevronUp'),
  FiChevronDown: createLazyIcon(() => import('react-icons/fi'), 'FiChevronDown'),
  FiMinus: createLazyIcon(() => import('react-icons/fi'), 'FiMinus'),
  FiBriefcase: createLazyIcon(() => import('react-icons/fi'), 'FiBriefcase'),
  FiPhone: createLazyIcon(() => import('react-icons/fi'), 'FiPhone'),
  LuMail: createLazyIcon(() => import('react-icons/lu'), 'LuMail'),
  LuBuilding2: createLazyIcon(() => import('react-icons/lu'), 'LuBuilding2'),
  LuCamera: createLazyIcon(() => import('react-icons/lu'), 'LuCamera'),
  LuMoon: createLazyIcon(() => import('react-icons/lu'), 'LuMoon'),
  LuChartColumn: createLazyIcon(() => import('react-icons/lu'), 'LuChartColumn'),
  IoSunnyOutline: createLazyIcon(() => import('react-icons/io5'), 'IoSunnyOutline'),
  FiShield: createLazyIcon(() => import('react-icons/fi'), 'FiShield'),
  HiOutlineStar: createLazyIcon(() => import('react-icons/hi'), 'HiOutlineStar'),
  
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


export default memo(IconWrapper);
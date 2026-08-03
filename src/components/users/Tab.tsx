import { lazy, Suspense, type JSX } from "react";
import type { UserResponse } from "../../models/UserModel";
import Spinner from '../general/Spinner';
import { MenuTabs } from './UsersProfile';

const SecurityTab = lazy(() => import("./SecurityTab"));
const ProfileTab = lazy(() => import("./ProfileTab"));
const EditTab = lazy(() => import("./EditTab"));
const SettingsTab = lazy(() => import("./SettingsTab"));

interface TabParams
{
  user: UserResponse;
  activeTab: MenuTabs;
  navigateTo: (newIdx: number) => void;
}

interface ComponentsTypes
{
  edit: (user: UserResponse) => JSX.Element;
  profile: (user: UserResponse, navigateTo: (newIdx: number) => void) => JSX.Element;
  settings: () => JSX.Element;
  security: (user: UserResponse) => JSX.Element;
}

const TABS_COMPONENTS: ComponentsTypes = {
  edit: (user: UserResponse) => (<EditTab user={user} />),
  profile: (user: UserResponse, navigateTo: (newIdx: number) => void) => (<ProfileTab user={user} navigateTo={navigateTo} />),
  settings: () => <SettingsTab />,
  security: (user: UserResponse) => <SecurityTab user={user} />,
};


export default function TabContent({ activeTab, user, navigateTo }: TabParams)
{
  const renderContent = TABS_COMPONENTS[activeTab];

  return (
    <Suspense fallback={<Spinner />}>
      {renderContent(user, navigateTo)}
    </Suspense>
  )
}

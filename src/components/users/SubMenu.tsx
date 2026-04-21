import { motion } from 'framer-motion';
import { lazy, memo, Suspense, type JSX } from "react";
import type { UserResponse } from "../../models/UserModel";
import type { MenuTypes } from "../../Views/UsersView";
import Spinner from '../general/Spinner';

const ChangePasswordMenu = lazy(() => import("./ChangePasswordMenu"));
const EditProfileForm = lazy(() => import("./EditProfileForm"));
const UserSettingsMenu = lazy(() => import("./UserSettingsMenu"));

interface SubmenuParams {
  user: UserResponse;
  activeMenu: MenuTypes;
}

interface ComponentsTypes {
  myProfile: (user: UserResponse) => JSX.Element;
  settings: () => JSX.Element;
  changePw: (user: UserResponse) => JSX.Element;
  mainMenu: null
}

const MENU_COMPONENTS: ComponentsTypes = {
  myProfile: (user: UserResponse) => (<EditProfileForm user={user} />),
  settings: () => <UserSettingsMenu />,
  changePw: (user: UserResponse) => <ChangePasswordMenu user={user} />,
  mainMenu: null
};


function Submenu({ activeMenu, user }: SubmenuParams) {
  const renderContent = MENU_COMPONENTS[activeMenu as keyof typeof MENU_COMPONENTS];
  const isVisible = activeMenu !== 'mainMenu';

  return (
    <>
      {isVisible &&
        <motion.div
          className="submenu"
          key={activeMenu}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.2 }}
        >
          <Suspense fallback={<Spinner />}>
            {renderContent ? renderContent(user) : null}
          </Suspense>
        </motion.div>
      }
    </>
  )
}


export default memo(Submenu);
import { AnimatePresence, motion } from "framer-motion";
import { memo, ReactNode } from "react";


const tabContentVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -100 : 100,
    opacity: 0,
  }),
};

interface SubMenuParams
{
  activeIdx?: number;
  direction: number;
  children: ReactNode;
}

function UsersProfileTabs({ activeIdx = 0, direction, children }: SubMenuParams)
{

  return (
    <AnimatePresence initial={false} custom={direction} mode='wait'>
      <motion.div
        key={activeIdx}
        custom={direction}
        variants={tabContentVariants}
        initial="enter"
        layout
        animate="center"
        exit="exit"
        transition={{
          x: { type: "spring", stiffness: 300, damping: 30 },
          opacity: { duration: 0.3 },
        }}
        className="tab w-full h-full text-zinc-300"
      >
        {children}
      </motion.div>
    </AnimatePresence>

  )
}


export default memo(UsersProfileTabs);

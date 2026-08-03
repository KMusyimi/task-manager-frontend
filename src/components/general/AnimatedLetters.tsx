import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";


interface AnimatedTextProps
{
  text: string;
  className?: string;
  break: boolean;
  children?:ReactNode;
}

const letterVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 200,
    },
  },
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
    },
  },
};

export const AnimatedText = ({ text, className = "" }: AnimatedTextProps) =>
{
  const letters = Array.from(text);

  return (
    <motion.h1
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ display: "flex", flexWrap: "wrap", overflow: "hidden" }}
    >
      {letters.map((char, index) => (
        <motion.span
          key={`${char}-${(String(index))}`}
          variants={letterVariants}
          style={{ display: "inline-block", whiteSpace: "pre" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.h1>
  );
};

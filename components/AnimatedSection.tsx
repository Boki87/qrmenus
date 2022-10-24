import React from "react";
import { motion } from "framer-motion";

const variants = {
  hidden: { opacity: 0, x: 0, y: 20 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: 20 },
};

type Props = {
  duration?: number;
  delay?: number;
  children?: React.ReactNode;
};

const AnimatedSection: React.FC<Props> = ({
  children,
  duration = 0.4,
  delay = 0,
}) => {
  return (
    <motion.div
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={variants}
      transition={{ duration: duration, delay: delay, type: "easeInOut" }}
      style={{ position: "relative" }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;

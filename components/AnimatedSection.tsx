import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

const variants = {
  hidden: { opacity: 0, x: 0, y: 20 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: 20 },
  visible: { opacity: 1, x: 0, y: 0 },
};

type Props = {
  duration?: number;
  delay?: number;
  animateOnScroll?: boolean;
  children?: React.ReactNode;
};

const AnimatedSection: React.FC<Props> = ({
  children,
  duration = 0.4,
  animateOnScroll = false,
  delay = 0,
}) => {
  const controls = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const whatToAnimate = animateOnScroll ? controls : "enter";

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={whatToAnimate}
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

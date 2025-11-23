"use client";

import { useTheme } from "@/lib/theme-context";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  // Animation variants for the container
  const containerVariants = {
    light: {
      scale: 1,
      rotate: 0,
      background: "rgba(251, 191, 36, 0.1)", // amber-500 with opacity
    },
    dark: {
      scale: 1,
      rotate: 180,
      background: "rgba(96, 165, 250, 0.1)", // blue-400 with opacity
    },
  };

  // Animation variants for the sun icon with proper TypeScript types
  const sunVariants: Variants = {
    initial: { 
      scale: 0, 
      rotate: -90,
      opacity: 0 
    },
    animate: { 
      scale: 1, 
      rotate: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10
      }
    },
    exit: { 
      scale: 0, 
      rotate: 90,
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  // Animation variants for the moon icon with proper TypeScript types
  const moonVariants: Variants = {
    initial: { 
      scale: 0, 
      rotate: 90,
      opacity: 0 
    },
    animate: { 
      scale: 1, 
      rotate: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10
      }
    },
    exit: { 
      scale: 0, 
      rotate: -90,
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <motion.div
      className="relative"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="relative h-10 w-10 rounded-full border border-transparent"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {/* Animated background */}
        <motion.div
          className="absolute inset-0 rounded-full"
          variants={containerVariants}
          initial={false}
          animate={theme}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 15,
            duration: 0.5 
          }}
        />
        
        {/* Icons container */}
        <div className="relative z-10 flex items-center justify-center w-6 h-6">
          <AnimatePresence mode="wait">
            {theme === 'light' ? (
              <motion.div
                key="sun"
                variants={sunVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex items-center justify-center"
              >
                <Sun className="h-5 w-5 text-amber-500 drop-shadow-sm" />
                
                {/* Sun rays animation */}
                <motion.div
                  className="absolute inset-0"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-0.5 h-0.5 bg-amber-400 rounded-full" />
                  <div className="absolute top-0.5 -right-0.5 w-0.5 h-0.5 bg-amber-400 rounded-full" />
                  <div className="absolute -bottom-0.5 -right-0.5 w-0.5 h-0.5 bg-amber-400 rounded-full" />
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0.5 h-0.5 bg-amber-400 rounded-full" />
                  <div className="absolute -bottom-0.5 -left-0.5 w-0.5 h-0.5 bg-amber-400 rounded-full" />
                  <div className="absolute top-0.5 -left-0.5 w-0.5 h-0.5 bg-amber-400 rounded-full" />
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                variants={moonVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex items-center justify-center"
              >
                <Moon className="h-5 w-5 text-blue-400 drop-shadow-sm" />
                
                {/* Stars animation */}
                <motion.div
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div
                    className="absolute -top-0.5 -right-0.5 w-0.5 h-0.5 bg-blue-200 rounded-full"
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  />
                  <motion.div
                    className="absolute -bottom-0.5 -left-0.5 w-0.5 h-0.5 bg-blue-200 rounded-full"
                    animate={{ 
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "reverse",
                      delay: 0.5
                    }}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Pulsing glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: theme === 'light' 
              ? "0 0 0 0 rgba(251, 191, 36, 0.7)"
              : "0 0 0 0 rgba(96, 165, 250, 0.7)"
          }}
          whileHover={{
            boxShadow: theme === 'light'
              ? "0 0 0 4px rgba(251, 191, 36, 0.3)"
              : "0 0 0 4px rgba(96, 165, 250, 0.3)"
          }}
          transition={{ duration: 0.3 }}
        />
      </Button>
    </motion.div>
  );
}
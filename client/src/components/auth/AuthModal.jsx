import { AnimatePresence, motion } from "framer-motion";

function AuthModal({ isOpen, onClose, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="
              fixed
              inset-0
              z-[100]
              bg-black/60
              backdrop-blur-sm
            "
          />

          {/* Modal */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.97,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.97,
              y: 20,
            }}
            transition={{
              duration: 0.25,
              ease: "easeOut",
            }}
            className="
              fixed
              left-1/2
              top-1/2
              z-[101]
              h-[94vh]
              w-[94vw]
              -translate-x-1/2
              -translate-y-1/2
              sm:w-[92vw]
              lg:h-[88vh]
              lg:w-[90vw]
              lg:max-w-6xl
            "
          >
            <div
              className="
                relative
                h-full
                overflow-hidden
                rounded-2xl
                bg-white
                shadow-[0_25px_80px_rgba(0,0,0,0.22)]
                sm:rounded-3xl
              "
            >
              {/* Close */}

              <button
                type="button"
                onClick={onClose}
                aria-label="Close authentication"
                className="
                  absolute
                  right-4
                  top-4
                  z-[110]
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  bg-white
                  text-xl
                  font-medium
                  text-slate-500
                  shadow-md
                  transition-all
                  duration-200
                  hover:text-slate-900
                  hover:shadow-lg
                  sm:right-5
                  sm:top-5
                "
              >
                ×
              </button>

              {/* Content */}

              <div className="h-full min-h-0">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default AuthModal;
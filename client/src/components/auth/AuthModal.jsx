import { AnimatePresence, motion } from "framer-motion";

function AuthModal({ isOpen, onClose, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="
              fixed inset-0 z-[100]
              bg-black/60 backdrop-blur-md
            "
          />

          {/* Modal */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9,
              y: 40,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
              y: 40,
            }}
            transition={{ duration: 0.3 }}
            className="
              fixed left-1/2 top-1/2 z-[101]
              w-[95%] max-w-5xl
              -translate-x-1/2 -translate-y-1/2
            "
          >
            <div
              className="
                relative overflow-hidden
                rounded-3xl bg-white shadow-2xl
              "
            >
              {/* Close button */}

              <button
                onClick={onClose}
                className="
                  absolute right-5 top-5
                  text-3xl text-gray-500
                  transition hover:text-black
                "
              >
                ×
              </button>

              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default AuthModal;
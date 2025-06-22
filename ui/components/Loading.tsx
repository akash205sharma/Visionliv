import { motion } from 'framer-motion';
import React from 'react'

const Loading = () => {
    return (
        <motion.div
            className="h-screen flex flex-col items-center justify-center text-center text-lg text-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            <motion.div
                className="text-4xl mb-4"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
            >
                🚀
            </motion.div>

            <motion.div
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
            >
                Hang tight! The Render server is warming up for you...
                <br />
                Just a few more seconds ⏳
            </motion.div>
        </motion.div>
    );
}

export default Loading

"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

interface CardData {
    id: string
    image: string
    title: string
    description?: string
    details: string
}

const cards: CardData[] = [
    {
        id: "1",
        image: "/l1.png",
        title: "The Oddysey",
        description: "Explore unknown galaxies.",
        details:
            "Throughout their journey, players will encounter diverse alien races, each with their own unique cultures and technologies.",
    },
    {
        id: "2",
        image: "/l2.png",
        title: "Angry Rabbits",
        description: "They are coming for you.",
        details: "A fast-paced action game where you must defend your garden from endless waves of furious rabbits!",
    },
    {
        id: "3",
        image: "/l3.webp",
        title: "Ghost town",
        description: "Scarry ghosts.",
        details:
            "Wander through haunted streets, uncover hidden secrets, and survive terrifying encounters with restless spirits.",
    },
    {
        id: "4",
        image: "/l4.png",
        title: "Pirates in the jungle",
        description: "Find the treasure.",
        details: "Solve puzzles, fight enemies, and explore mysterious ruins in your quest for the lost treasure.",
    },
    {
        id: "5",
        image: "/l5.webp",
        title: "Lost in the mountains",
        description: "Be careful.",
        details:
            "Survive harsh weather, dangerous wildlife, and hidden mysteries as you find your way out of the wilderness.",
    },
]

export default function LayoutCardDemo() {
    const [selected, setSelected] = useState<CardData | null>(null)

    return (
        <div className=" text-white flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                {cards.map((card, index) => (
                    <motion.div
                        key={card.id}
                        layoutId={`card-${card.id}`}
                        className="relative cursor-pointer mb-1"
                        onClick={() => setSelected(card)}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        <motion.div
                            layoutId={`border-${card.id}`}
                            className="relative bg-neutral-900/50 rounded-lg overflow-hidden"
                            style={{
                                border: "1px solid transparent",
                                borderBottomColor: "rgb(38 38 38)", // neutral-800
                            }}
                        >
                            <div className="relative p-4 w-full flex items-center gap-4">
                                <motion.img
                                    layoutId={`image-${card.id}`}
                                    src={card.image}
                                    alt={card.title}
                                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                                />

                                <div className="flex justify-between items-center w-full">
                                    <div className="flex-1 pr-3">
                                        <motion.h3 layoutId={`title-${card.id}`} className="font-semibold text-white">
                                            {card.title}
                                        </motion.h3>
                                        <motion.p layoutId={`desc-${card.id}`} className="text-sm text-gray-400">
                                            {card.description}
                                        </motion.p>
                                    </div>

                                    <motion.button
                                        layoutId={`button-${card.id}`}
                                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm relative z-10 transition-colors"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Get
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {selected && (
                    <>
                        <motion.div
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelected(null)}
                        />

                        <motion.div
                            layoutId={`card-${selected.id}`}
                            className="fixed inset-0 flex items-center justify-center z-50 p-6"
                            onClick={() => setSelected(null)}
                        >
                            <motion.div
                                layoutId={`border-${selected.id}`}
                                className="relative max-w-xl w-full bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl"
                                style={{
                                    border: "1px solid rgb(38 38 38)", // Full border in expanded state
                                }}
                                onClick={(e) => e.stopPropagation()}
                                initial={false}
                                animate={{
                                    borderColor: "rgb(38 38 38)",
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 30,
                                    duration: 0.3,
                                }}
                            >
                                <div className="p-6 flex items-start gap-4">
                                    <motion.img
                                        layoutId={`image-${selected.id}`}
                                        src={selected.image}
                                        alt={selected.title}
                                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                                    />

                                    <div className="flex-1 min-w-0">
                                        <motion.h3 layoutId={`title-${selected.id}`} className="text-xl font-bold text-white mb-2">
                                            {selected.title}
                                        </motion.h3>
                                        <motion.p layoutId={`desc-${selected.id}`} className="text-gray-400 mb-3">
                                            {selected.description}
                                        </motion.p>
                                        <motion.p
                                            className="text-gray-300 text-sm leading-relaxed"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2, duration: 0.3 }}
                                        >
                                            {selected.details}
                                        </motion.p>
                                    </div>

                                    <motion.button
                                        layoutId={`button-${selected.id}`}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm relative z-10 transition-colors flex-shrink-0"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Get
                                    </motion.button>
                                </div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

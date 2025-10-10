"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  useState,
  ReactNode,
  Children,
  isValidElement,
  cloneElement,
} from "react";

interface LayoutCardItemProps {
  id: string;
  children: ReactNode;
  expandedContent?: ReactNode;
}

interface LayoutCardData {
  id: string;
  content: ReactNode;
  expandedContent?: ReactNode;
}

interface LayoutCardProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  cardClassName?: string;
  expandedClassName?: string;
}

// LayoutCardItem component
export function LayoutCardItem({
  id,
  children,
  expandedContent,
}: LayoutCardItemProps) {
  // This is a placeholder component that will be processed by LayoutCard
  return null;
}

// Main LayoutCard component
export default function LayoutCard({
  children,
  className = "",
  containerClassName = "w-full max-w-md",
  cardClassName = "relative bg-neutral-900/50 rounded-lg overflow-hidden",
  expandedClassName = "relative max-w-xl w-full bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl",
}: LayoutCardProps) {
  const [selected, setSelected] = useState<LayoutCardData | null>(null);

  // Process children to extract LayoutCardItem props
  const cards: LayoutCardData[] = Children.toArray(children)
    .filter(
      (child): child is React.ReactElement<LayoutCardItemProps> =>
        isValidElement(child) && child.type === LayoutCardItem,
    )
    .map((child) => ({
      id: child.props.id,
      content: child.props.children,
      expandedContent: child.props.expandedContent,
    }));

  return (
    <div
      className={`text-white flex items-center justify-center p-6 ${className}`}
    >
      <div className={containerClassName}>
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
              className={cardClassName}
              style={{
                border: "1px solid transparent",
                borderBottomColor: "rgb(38 38 38)", // neutral-800
              }}
            >
              <div className="relative p-4 w-full">{card.content}</div>
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
                className={expandedClassName}
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
                <div className="p-6">
                  {selected.expandedContent || selected.content}
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

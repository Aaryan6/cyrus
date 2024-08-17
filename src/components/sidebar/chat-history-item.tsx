"use client";

import * as React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { motion } from "framer-motion";

import { Chats } from "@/lib/types";

interface ChatHistoryProps {
  index: number;
  chat: Chats;
}

export function ChatHistoryItem({ index, chat }: ChatHistoryProps) {
  const pathname = usePathname();

  const isActive = pathname.split("/")[3] === chat.path.split("/")[2];
  const shouldAnimate = index === 0 && isActive;

  if (!chat?.id) return null;
  return (
    <motion.div
      className="relative group flex items-center space-x-2 transition-all duration-300 px-3 p-2 rounded-sm overflow-hidden bg-foreground/5"
      variants={{
        initial: {
          height: 0,
          opacity: 0,
        },
        animate: {
          height: "auto",
          opacity: 1,
        },
      }}
      initial={shouldAnimate ? "initial" : undefined}
      animate={shouldAnimate ? "animate" : undefined}
      transition={{
        duration: 0.25,
        ease: "easeIn",
      }}
    >
      <Link href={chat.path} className={""}>
        <div
          className="relative max-h-5 flex-1 select-none overflow-hidden text-sm text-ellipsis break-all"
          title={chat.title}
        >
          <span className="">
            {shouldAnimate ? (
              chat.title.split("").map((character, index) => (
                <motion.span
                  key={index}
                  variants={{
                    initial: {
                      opacity: 0,
                      x: -100,
                    },
                    animate: {
                      opacity: 1,
                      x: 0,
                    },
                  }}
                  initial={shouldAnimate ? "initial" : undefined}
                  animate={shouldAnimate ? "animate" : undefined}
                  transition={{
                    duration: 0.25,
                    ease: "easeIn",
                    delay: index * 0.05,
                    staggerChildren: 0.05,
                  }}
                >
                  {character}
                </motion.span>
              ))
            ) : (
              <span>{chat.title}</span>
            )}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

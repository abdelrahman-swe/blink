"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface BlobButtonProps {
  children: React.ReactNode;
  href?: string;
  className?: string;
  target?: string;
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
}

const BLOBS = [0, 1, 2, 3];
const BLOB_COLOR = "black";

const MotionLink = motion.create(Link);

export default function AnimatedButton({
  children,
  href,
  target = "_blank",
  className = "",
  onClick,
  disabled = false,
}: BlobButtonProps) {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        style={{ position: "absolute", width: 0, height: 0 }}
        aria-hidden="true"
      >
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -7"
              result="goo"
            />
            <feBlend in2="goo" in="SourceGraphic" result="mix" />
          </filter>
        </defs>
      </svg>

      {href && href !== "#" ? (
        <MotionLink
          href={href}
          target={target}
          initial="idle"
          whileHover="hover"
          onClick={onClick}
          className={`relative z-1 inline-block border-none bg-transparent px-11.5 py-5 text-base font-bold uppercase no-underline outline-none text-[#312460] rounded-[30px] ${className}`}
        >
          <span className="pointer-events-none absolute inset-0 z-1 border-2 border-black rounded-[30px]" />

          <motion.span
            className="pointer-events-none absolute -z-2 rounded-[30px]"
            variants={{
              idle: { left: 3, top: 3, width: "100%", height: "100%" },
              hover: {
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
                transition: { duration: 0.3 },
              },
            }}
          />

          <motion.span
            className="relative z-10"
            variants={{
              idle: { color: BLOB_COLOR },
              hover: { color: "#ffffff", transition: { duration: 0.5 } },
            }}
          >
            {children}
          </motion.span>

          <span className="pointer-events-none absolute inset-0 -z-1 overflow-hidden bg-white rounded-[30px]">
            <span className="relative block h-full" style={{ filter: "url(#goo)" }}>
              {BLOBS.map((i) => (
                <motion.span
                  key={i}
                  className="absolute top-0.5 h-full rounded-full"
                  style={{
                    width: "25%",
                    left: `${i * 30}%`,
                    background: BLOB_COLOR,
                  }}
                  variants={{
                    idle: {
                      y: "150%",
                      scale: 1.4,
                      transition: { delay: i * 0.08, duration: 0.45 },
                    },
                    hover: {
                      y: 0,
                      scale: 1.4,
                      transition: { delay: i * 0.08, duration: 0.45 },
                    },
                  }}
                />
              ))}
            </span>
          </span>
        </MotionLink>
      ) : (
        <motion.button
          type="button"
          disabled={disabled}
          onClick={onClick}
          initial="idle"
          whileHover={disabled ? "idle" : "hover"}
          className={`relative z-1 inline-block border-none bg-transparent px-4 py-2 text-base font-bold uppercase no-underline outline-none text-black rounded-full ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <span className="pointer-events-none absolute inset-0 z-1 border-2 border-black rounded-full" />

          <motion.span
            className="pointer-events-none absolute -z-2 rounded-full"
            variants={{
              idle: { left: 3, top: 3, width: "100%", height: "100%" },
              hover: {
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
                transition: { duration: 0.3 },
              },
            }}
          />

          <motion.span
            className="relative z-10"
            variants={{
              idle: { color: BLOB_COLOR },
              hover: { color: "#ffffff", transition: { duration: 0.5 } },
            }}
          >
            {children}
          </motion.span>

          <span className="pointer-events-none absolute inset-0 -z-1 overflow-hidden bg-white rounded-full">
            <span className="relative block h-full" style={{ filter: "url(#goo)" }}>
              {BLOBS.map((i) => (
                <motion.span
                  key={i}
                  className="absolute top-0.5 h-full rounded-full"
                  style={{
                    width: "25%",
                    left: `${i * 30}%`,
                    background: BLOB_COLOR,
                  }}
                  variants={{
                    idle: {
                      y: "150%",
                      scale: 1.4,
                      transition: { delay: i * 0.08, duration: 0.45 },
                    },
                    hover: {
                      y: 0,
                      scale: 1.4,
                      transition: { delay: i * 0.08, duration: 0.45 },
                    },
                  }}
                />
              ))}
            </span>
          </span>
        </motion.button>
      )}
    </>
  );
}

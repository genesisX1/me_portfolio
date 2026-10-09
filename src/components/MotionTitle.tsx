'use client';
import { Fragment, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
const ease = [0.22, 1, 0.36, 1] as const;
export function MotionTitle({
  lines,
  as = 'h2',
  className = '',
  id,
}: {
  lines: ReactNode[];
  as?: 'h2' | 'h3';
  className?: string;
  id?: string;
}) {
  const reduce = useReducedMotion();
  const Tag = as;
  // Observe the stationary mask; translated words cannot observe themselves.
  return (
    <Tag className={`motion-title ${className}`} id={id}>
      {lines.map((line, i) => (
        <motion.span
          className="title-mask"
          key={i}
          initial={reduce ? false : 'hidden'}
          animate={reduce ? 'visible' : 'hidden'}
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
        >
          {typeof line === 'string' ? (
            <motion.span
              className="title-word-group"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: reduce ? 0 : 0.065,
                    delayChildren: reduce ? 0 : i * 0.08,
                  },
                },
              }}
            >
              {line.split(' ').map((word, j) => (
                <Fragment key={j}>
                  <span className="title-word-mask">
                    <motion.span
                      variants={{
                        hidden: { y: '105%', opacity: 0 },
                        visible: { y: 0, opacity: 1 },
                      }}
                      transition={{ duration: reduce ? 0 : 0.78, ease }}
                    >
                      {word}
                    </motion.span>
                  </span>
                  {j < line.split(' ').length - 1 ? ' ' : null}
                </Fragment>
              ))}
            </motion.span>
          ) : (
            <motion.span
              variants={{ hidden: { y: '110%', opacity: 0 }, visible: { y: 0, opacity: 1 } }}
              transition={{ duration: reduce ? 0 : 0.85, delay: reduce ? 0 : i * 0.09, ease }}
            >
              {line}
            </motion.span>
          )}
        </motion.span>
      ))}
    </Tag>
  );
}
export function MotionCopy({
  text,
  className = '',
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <p className={`motion-copy ${className}`}>{text}</p>;
  const words = text.split(' ');
  return (
    <motion.p
      className={`motion-copy ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: Math.min(0.024, 0.6 / words.length),
            delayChildren: delay,
          },
        },
      }}
    >
      {words.map((word, i) => (
        <Fragment key={i}>
          <motion.span
            className="copy-word"
            variants={{ hidden: { opacity: 0, y: 9 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.42, ease }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </motion.p>
  );
}

'use client';
import { motion, useReducedMotion } from 'framer-motion';
import { usePreferences } from '../Preferences';
import { MotionTitle, MotionCopy } from '../MotionTitle';
import { experience } from '@/data/portfolio';
import { Arrow, Reveal } from './UI';
export default function ExperienceSection() {
  const { localize } = usePreferences();
  const reduce = useReducedMotion();
  return localize(
    <section id="experience" className="experience panel section-pad">
      <Reveal>
        <div className="section-heading">
          <span aria-hidden="true">PARCOURS</span>
          <MotionTitle lines={['/MON PARCOURS']} />
        </div>
        <div className="experience-intro">
          <MotionTitle as="h3" lines={['La technique.', 'Le sens du détail.']} />
          <MotionCopy
            delay={0.12}
            text="J’aime donner forme aux idées. J’aborde un projet avec le regard du développeur et celui du graphiste : penser son fonctionnement, puis soigner ce que l’on voit et ce que l’on ressent."
          />
        </div>
        <div className="career-list">
          {experience.map((e, i) => (
            <motion.article
              className="career-row"
              key={e.company}
              initial={reduce ? false : { opacity: 0, x: 18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : i * 0.06 }}
            >
              <span className="career-index mono">0{i + 1}</span>
              <div>
                <h4>{e.company}</h4>
                <p>{e.role}</p>
                <small>{e.detail}</small>
              </div>
              <span className="career-period">{e.period}</span>
            </motion.article>
          ))}
        </div>
        <div className="experience-footer">
          <span>LOMÉ, TOGO · OUVERT AUX COLLABORATIONS À DISTANCE</span>
          <a href="#contact">
            Faisons connaissance <Arrow />
          </a>
        </div>
      </Reveal>
    </section>,
  );
}

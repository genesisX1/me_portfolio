'use client';
import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { usePreferences } from '../Preferences';
import OptimizedImage from '../OptimizedImage';
import { MotionTitle } from '../MotionTitle';
import { projects, type Project } from '@/data/portfolio';
import { Arrow, Reveal } from './UI';
import { safeExternalUrl } from '@/lib/interaction.mjs';
function ProjectArt({ project }: { project: Project }) {
  const { localize } = usePreferences();
  if (project.image)
    return (
      <OptimizedImage
        sizes="(max-width: 760px) 90vw, 42vw"
        src={project.image}
        alt={project.imageAlt || `Aperçu du projet ${project.title}`}
        loading="lazy"
        decoding="async"
        width={project.imageWidth}
        height={project.imageHeight}
      />
    );
  return localize(
    <div className={`project-art art-${project.id}`}>
      <span className="art-caption">VISUEL À AJOUTER</span>
      {project.category === 'Web' ? (
        <div className="browser-art">
          <div className="browser-bar">
            <i />
            <i />
            <i />
            <span>votre-projet</span>
          </div>
          <div className="browser-content">
            <div className="tiny-line" />
            <strong>
              {project.id === 'web-01' ? 'Une idée.\nUn site.' : 'Simple.\nIntuitif.'}
            </strong>
            <div className="wireframe">
              <span />
              <span />
              <span />
            </div>
            <div className="fake-button">Votre prochaine réalisation ↗</div>
          </div>
          <div className="browser-orbit" />
        </div>
      ) : (
        <div className="poster-art">
          <span>ATELIER / {project.id === 'design-01' ? 'IDENTITÉ' : 'ÉDITION'}</span>
          <strong>{project.id === 'design-01' ? 'Aa' : '&'}</strong>
          <div className="poster-rule" />
          <span>COULEUR · FORME · ÉMOTION</span>
        </div>
      )}
      <span className="art-index">
        {project.id.endsWith('01') ? '01' : '02'} / {project.category.toUpperCase()}
      </span>
    </div>,
  );
}

export default function ProjectsSection() {
  const { localize, t } = usePreferences();
  const [filter, setFilter] = useState('Tous');
  const reduce = useReducedMotion();
  const visible = projects.filter((p) => filter === 'Tous' || p.category === filter);
  return localize(
    <section id="work" className="work panel section-pad">
      <Reveal>
        <div className="section-heading">
          <span aria-hidden="true">PORTFOLIO</span>
          <MotionTitle lines={['/PROJETS CHOISIS']} />
        </div>
        <div className="section-toolbar">
          <div className="filters" role="group" aria-label="Filtrer les projets">
            {['Tous', 'Web', 'Design'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                aria-pressed={f === filter}
                className={f === filter ? 'active' : ''}
              >
                {f}
              </button>
            ))}
          </div>
          <span className="draft-note">
            <i />
            {projects.length} {t('projets en ligne')}
          </span>
        </div>
      </Reveal>
      <motion.div layout className="project-grid" aria-live="polite">
        <AnimatePresence mode="popLayout">
          {visible.map((p, i) => (
            <motion.div
              layout
              key={p.id}
              className="project-slot"
              initial={reduce ? false : { opacity: 0, y: 38, x: i % 2 ? 18 : -18 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              onViewportEnter={(entry) => entry?.target.classList.add('is-revealed')}
              exit={{ opacity: 0, scale: reduce ? 1 : 0.985 }}
              transition={{
                duration: reduce ? 0 : 0.68,
                ease: [0.22, 1, 0.36, 1],
                delay: reduce ? 0 : (i % 2) * 0.11,
                layout: { duration: reduce ? 0 : 0.32 },
              }}
            >
              <a
                className="project-card"
                href={safeExternalUrl(p.url)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Voir le projet ${p.title} — nouvel onglet`}
              >
                <div className="project-image">
                  <ProjectArt project={p} />
                  <span className="project-view-badge" aria-hidden="true">
                    Voir <Arrow />
                  </span>
                </div>
                <div className="project-meta">
                  <span className="eyebrow">{p.type}</span>
                  <h3>
                    {p.title}
                    <Arrow />
                  </h3>
                  <p>{p.description}</p>
                  <div className="tags">
                    {[...p.tags, ...(p.technologies || [])].map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </div>
                <div className="project-links">
                  <span>
                    Voir le projet <Arrow />
                  </span>
                  {p.year && <span>{p.year}</span>}
                </div>
              </a>
            </motion.div>
          ))}
          {visible.length === 0 && (
            <motion.p
              key="empty-projects"
              className="projects-empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Les créations graphiques seront ajoutées prochainement.
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
      <p className="work-note">
        Une sélection de sites et d’applications sur lesquels j’ai travaillé.
      </p>
    </section>,
  );
}

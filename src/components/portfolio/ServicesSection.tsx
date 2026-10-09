'use client';
import { useState } from 'react';
import { usePreferences } from '../Preferences';
import { MotionTitle } from '../MotionTitle';
import OptimizedImage from '../OptimizedImage';
import { projects, services } from '@/data/portfolio';
import { Reveal } from './UI';
export default function ServicesSection() {
  const { localize } = usePreferences();
  const [service, setService] = useState<number | null>(0);
  return localize(
    <section id="services" className="services section-pad">
      <Reveal>
        <div className="simple-heading">
          <MotionTitle lines={['/SERVICES']} />
          <p>
            De l’idée à l’écran.
            <br />
            Du code à l’image.
          </p>
        </div>
      </Reveal>
      <div className="service-list">
        {services.map((s, i) => (
          <Reveal key={s.title} from="left" delay={i * 0.035}>
            <article className={`service service-${i} ${service === i ? 'open' : ''}`}>
              <button
                aria-expanded={service === i}
                aria-controls={`service-${i}`}
                onClick={() => setService(service === i ? null : i)}
              >
                <span className="service-number">{s.number}</span>
                <h3>{s.title}</h3>
                <span className="service-sign">{service === i ? '×' : '↗'}</span>
              </button>
              <div
                id={`service-${i}`}
                aria-hidden={service !== i}
                className={`service-fold ${service === i ? 'expanded' : ''}`}
              >
                <div className="service-fold-inner">
                  <div className="service-content">
                    <p>{s.description}</p>
                    <div className={`service-art service-art-${i}`} aria-hidden="true">
                      <span>{s.label}</span>
                      {i === 0 || i === 2 ? (
                        <OptimizedImage
                          sizes="(max-width: 760px) 180px, 240px"
                          className="service-preview"
                          src={projects[i === 0 ? 0 : 3].image}
                          alt=""
                          loading="lazy"
                        />
                      ) : (
                        <b>{s.icon}</b>
                      )}
                      <div>
                        JOACKIM DATE <span>STUDIO / {s.number}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>,
  );
}

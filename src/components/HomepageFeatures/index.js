import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'SISSA',
    url: 'http://localhost:5173/',
    imgSrc: require('@site/static/img/sissa.png').default,
    description: (
      <>
        Sistema Integral de Servicio Social Albatros.
      </>
    ),
  },
  {
    title: 'ITE',
    url: 'https://www.ensenada.tecnm.mx/',
    imgSrc: require('@site/static/img/tecnm.png').default,
    description: (
      <>
        Instituto Tecnologico de Ensenada.
      </>
    ),
  },
  {
    title: 'SIE',
    url: 'http://escolares.ensenada.tecnm.mx/',
    imgSrc: require('@site/static/img/sie.png').default,
    description: (
      <>
        Sistema Integral Escolar.
      </>
    ),
  },
];

function Feature({ imgSrc, title, url, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <img src={imgSrc} alt={title} className={styles.featureImg} />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">
          <a href={url} target="_blank" rel="noopener noreferrer">{title}</a>
        </Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

import { number, services } from '../../content';
import { VariableTypography } from '../VariableTypography/VariableTypography';

export function ServiceList() {
  return (
    <section className="services-home wrap" aria-labelledby="services-home">
      <div className="section-head mono"><h2 id="services-home">What I do</h2></div>
      <div className="service-tiles">
        {services.map((service, index) => <div className="service-tile" key={service.slug}>
          <div className="tile-meta mono">{number(index + 1)}</div>
          <h3><VariableTypography lines={[service.name]} radius={125} /></h3>
          <p>{service.copy}</p>
        </div>)}
      </div>
    </section>
  );
}

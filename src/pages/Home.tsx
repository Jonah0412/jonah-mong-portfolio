import { DragGallery } from '../components/DragGallery/DragGallery';
import { ScrollStatement } from '../components/ScrollStatement/ScrollStatement';
import { ServiceList } from '../components/ServiceList/ServiceList';
import { RomansHero } from '../components/RomansHero/RomansHero';
import { WorkShowcase } from '../components/WorkShowcase/WorkShowcase';

const disciplines = ['Design', 'Web', 'Motion', 'WordPress', 'Figma', 'UI / UX', 'Imaging'];

export function Home({ ready }: { ready: boolean }) {
  return <>
    <RomansHero ready={ready} />
    <div className="ticker" aria-label={disciplines.join(', ')}>
      <div className="ticker-track" aria-hidden="true">
        {[0, 1, 2, 3].map(n => <div key={n} className="ticker-group">{disciplines.map(d => <span key={d}>{d}<i /></span>)}</div>)}
      </div>
    </div>
    <WorkShowcase />
    <DragGallery />
    <ScrollStatement />
    <ServiceList />
  </>;
}

'use client';

import { useEffect, useState } from 'react';
import { surveyConfig } from '@/config';

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}

export default function TopBar() {
  const [progress, setProgress] = useState(0);
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    setDateStr(formatDate(new Date()));
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight || 1;
      setProgress(Math.min(100, Math.max(0, (window.scrollY / max) * 100)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const { editionLabel } = surveyConfig;
  const [editionPrefix, editionRest] = (() => {
    if (!editionLabel) return ['', ''];
    const parts = editionLabel.split(/\s(.+)/);
    return [parts[0] || '', parts[1] || ''];
  })();

  return (
    <div className="topbar">
      <div className="topbar-inner">
        <div className="topbar-brand">
          <span>Howon&amp;Company</span>
        </div>
        <div className="topbar-edition">
          <em>{editionPrefix}</em> {editionRest}
          {dateStr && <strong>{dateStr}</strong>}
        </div>
      </div>
      <div className="progress-rail">
        <div className="progress-fill" style={{ width: progress + '%' }} />
      </div>
    </div>
  );
}

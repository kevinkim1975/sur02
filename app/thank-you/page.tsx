'use client';

import { useEffect, useState } from 'react';
import { surveyConfig } from '@/config';

const TOTAL = 10;
const RING_RADIUS = 12;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export default function ThankYouPage() {
  const { thankYouMessage, brandName } = surveyConfig;
  const [n, setN] = useState(TOTAL);

  useEffect(() => {
    const id = setInterval(() => {
      setN((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          clearInterval(id);
          window.close();
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const dashOffset = RING_CIRCUMFERENCE * (1 - n / TOTAL);

  return (
    <div className="thanks-wrap">
      <main className="thanks">
        <div className="brandline">
          <span className="brandmark">H</span>
          <span>{brandName}</span>
        </div>

        <div className="checkmark" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12.5L10 17.5L19 7.5"
              stroke="var(--accent)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1>
          설문이 성공적으로
          <br />
          제출되었습니다.
        </h1>
        <p className="msg">{thankYouMessage}</p>

        <div className="countdown">
          <div className="countdown-ring">
            <svg width="28" height="28" viewBox="0 0 28 28">
              <circle className="track" cx="14" cy="14" r={RING_RADIUS} />
              <circle
                className="arc"
                cx="14"
                cy="14"
                r={RING_RADIUS}
                style={{ strokeDashoffset: dashOffset }}
              />
            </svg>
          </div>
          <span>
            잠시 후 자동으로 닫힙니다 · <span className="num">{Math.max(0, n)}</span>초
          </span>
        </div>

        <div className="signature">Howon &amp; Company · Medical Consulting</div>
      </main>
    </div>
  );
}

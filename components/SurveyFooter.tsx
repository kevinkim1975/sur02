import { surveyConfig } from '@/config';

export default function SurveyFooter() {
  const { footerNotice, brandName } = surveyConfig;
  const lines = (footerNotice ?? '').split('\n');

  return (
    <footer className="foot">
      <div className="foot-inner">
        <div className="foot-left">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M8 1.5L2.5 4v4c0 3 2.4 5.7 5.5 6.5 3.1-.8 5.5-3.5 5.5-6.5V4L8 1.5z"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinejoin="round"
            />
            <path
              d="M6 8l1.5 1.5L10.5 6.5"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="foot-note">
            {lines.map((line, i) => (
              <span className="foot-line" key={i}>
                {line}
              </span>
            ))}
          </span>
        </div>
        <div className="foot-right">
          <div className="foot-mark">Howon &amp; Company</div>
          <div className="foot-copy">© 2026 {brandName}. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}

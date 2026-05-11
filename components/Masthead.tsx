import { surveyConfig } from '@/config';

export default function Masthead() {
  const {
    surveyTitle,
    headerDescription,
    mastheadSubtitle,
    estimatedMinutes,
    questions,
  } = surveyConfig;

  const sectionCount = new Set(questions.map((q) => q.section)).size;
  const questionCount = questions.length;

  const lines = surveyTitle.split('\n');
  const lineTop = lines[0] ?? '';
  const lineBottom = lines[1] ?? '';
  // Last whitespace-separated chunk of the second line is the accent.
  const m = lineBottom.match(/^(.*?)(\S+\s+\S+)\s*$/);
  const beforeAccent = m ? m[1] : '';
  const accentText = m ? m[2] : lineBottom;

  return (
    <header className="masthead">
      <div className="masthead-rule">
        <span>{mastheadSubtitle}</span>
        <span className="line"></span>
        <span className="serif">Confidential</span>
      </div>

      <h1>
        {lineTop}
        <br />
        {beforeAccent}
        <span className="accent">{accentText}</span>
      </h1>

      <p className="lede">{headerDescription}</p>

      <div className="meta-grid">
        <div>
          <div className="k">Sections</div>
          <div className="v">
            <span className="serif">{String(sectionCount).padStart(2, '0')}</span> 섹션
          </div>
        </div>
        <div>
          <div className="k">Questions</div>
          <div className="v">
            <span className="serif">{String(questionCount).padStart(2, '0')}</span> 문항
          </div>
        </div>
        <div>
          <div className="k">Estimated</div>
          <div className="v">
            <span className="serif">{estimatedMinutes ?? 8}</span> 분 내외
          </div>
        </div>
      </div>
    </header>
  );
}

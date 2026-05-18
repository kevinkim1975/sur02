'use client';

import { Fragment, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { surveyConfig } from '@/config';
import type { QuestionConfig, SectionId } from '@/lib/types';

type FormData = Record<string, string>;

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];
const SECTION_ORDER: SectionId[] = ['A', 'B', 'C', 'D', 'E', 'F'];

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

function getQuestionLabel(q: QuestionConfig): string {
  const firstLine = q.label.split('\n')[0];
  return firstLine.length > 40 ? firstLine.slice(0, 40) : firstLine;
}

function isRequiredAnswered(q: QuestionConfig, formData: FormData): boolean {
  if (!q.required) return true;
  if (q.type === 'identity') {
    return Boolean(
      formData[`${q.id}_hospital`]?.trim() &&
        formData[`${q.id}_role`] &&
        formData[`${q.id}_name`]?.trim(),
    );
  }
  if (q.type === 'priceTable') {
    return true;
  }
  return Boolean(formData[q.id]?.trim());
}

export default function SurveyForm() {
  const router = useRouter();
  const { clinicName, formspreeId, questions, subjectPrefix } = surveyConfig;

  const [formData, setFormData] = useState<FormData>({ q01_role: '원장' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const questionsBySection = useMemo(() => {
    const map: Record<string, QuestionConfig[]> = {};
    for (const q of questions) {
      if (!map[q.section]) map[q.section] = [];
      map[q.section].push(q);
    }
    return map;
  }, [questions]);

  const sectionsInOrder = useMemo(
    () => SECTION_ORDER.filter((s) => questionsBySection[s]?.length),
    [questionsBySection],
  );

  const requiredQs = useMemo(() => questions.filter((q) => q.required), [questions]);
  const requiredDone = requiredQs.filter((q) => isRequiredAnswered(q, formData)).length;
  const allRequired = requiredDone === requiredQs.length;

  const questionIndex = (qid: string) =>
    questions.findIndex((q) => q.id === qid);

  const buildPayload = (): Record<string, string> => {
    const payload: Record<string, string> = {
      _subject: subjectPrefix
        ? `${subjectPrefix} 응답`
        : `${clinicName || '설문'} 응답`,
    };

    for (const q of questions) {
      const upperId = q.id.toUpperCase();

      if (q.type === 'identity') {
        const hospital = (formData[`${q.id}_hospital`] || '').trim();
        const role = formData[`${q.id}_role`] || '';
        const name = (formData[`${q.id}_name`] || '').trim();
        if (hospital)
          payload[`[${upperId}] 병원명`] = `[질문] 병원명\n[답변] ${hospital}`;
        if (role)
          payload[`[${upperId}] 직급`] = `[질문] 직급\n[답변] ${role}`;
        if (name)
          payload[`[${upperId}] 성명`] = `[질문] 성명\n[답변] ${name}`;
        continue;
      }

      if (q.type === 'priceTable') {
        const procedures = q.procedures ?? [];
        procedures.forEach((proc, i) => {
          const level = formData[`${q.id}_level_${i}`] || '';
          const note = (formData[`${q.id}_note_${i}`] || '').trim();
          if (level || note) {
            const levelLabel =
              q.priceLevels?.find((l) => l.id === level)?.label || level;
            payload[`[${upperId}] ${proc}`] =
              `[질문] ${proc} 가격 수준\n[답변] ${levelLabel} / 비고: ${note || '없음'}`;
          }
        });
        continue;
      }

      const v = (formData[q.id] || '').trim();
      if (v) payload[`[${upperId}]`] = `[질문] ${q.label}\n[답변] ${v}`;
    }

    return payload;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allRequired || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(buildPayload()),
      });
      if (res.ok) {
        router.push('/thank-you');
      } else {
        alert('제출 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      }
    } catch {
      alert('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {sectionsInOrder.map((sectionId, sIdx) => {
        const sectionQs = questionsBySection[sectionId] ?? [];
        const sectionTitle = sectionQs[0]?.sectionTitle ?? '';
        return (
          <section className="section" key={sectionId} id={`section-${sectionId}`}>
            <div className="section-head">
              <div className="section-numeral">{ROMAN[sIdx]}</div>
              <div className="section-head-r">
                <div className="section-eyebrow">
                  <span>Section {pad2(sIdx + 1)}</span>
                </div>
                <h2 className="section-title">{sectionTitle}</h2>
                <div className="section-count">
                  {sectionQs.length} {sectionQs.length > 1 ? 'questions' : 'question'}
                </div>
              </div>
            </div>

            {sectionQs.map((q) => (
              <QuestionBlock
                key={q.id}
                q={q}
                num={pad2(questionIndex(q.id) + 1)}
                formData={formData}
                onChange={handleChange}
              />
            ))}
          </section>
        );
      })}

      <div className="submit-area">
        <div className="submit-ornament">— ❦ —</div>
        <div className="submit-eyebrow">Final Step</div>
        <h2 className="submit-headline">
          모든 응답을 검토하신 후
          <br />
          제출해 주시기 바랍니다.
        </h2>
        <div className={'submit-summary' + (allRequired ? ' complete' : '')}>
          <span className="dot"></span>
          필수 항목 <strong>{requiredDone}</strong> / {requiredQs.length} 완료
        </div>
        <div>
          <button
            type="submit"
            className="btn-submit"
            disabled={!allRequired || isSubmitting}
          >
            {isSubmitting ? '제출 중...' : '설문 제출하기'}
            <span className="btn-arrow">→</span>
          </button>
        </div>
      </div>
    </form>
  );
}

// ===== Question block =====
interface QuestionBlockProps {
  q: QuestionConfig;
  num: string;
  formData: FormData;
  onChange: (key: string, value: string) => void;
}

function QuestionBlock({ q, num, formData, onChange }: QuestionBlockProps) {
  return (
    <div className="q" data-qid={q.id} data-field={q.id}>
      <div className="q-head">
        <div className="q-num">
          <small>Question</small>№ {num}
        </div>
        <h3 className="q-label">
          {q.label}
          {q.required && (
            <span className="q-required" aria-label="필수">
              *
            </span>
          )}
        </h3>
      </div>
      {q.hint && <p className="q-hint">{q.hint}</p>}

      <div className="q-body">
        {q.type === 'identity' && (
          <IdentityField q={q} formData={formData} onChange={onChange} />
        )}
        {q.type === 'text' && (
          <TextField
            id={q.id}
            value={formData[q.id] || ''}
            placeholder={q.placeholder}
            onChange={(v) => onChange(q.id, v)}
          />
        )}
        {q.type === 'textarea' && (
          <TextAreaField
            id={q.id}
            value={formData[q.id] || ''}
            rows={q.rows ?? 4}
            placeholder={q.placeholder}
            onChange={(v) => onChange(q.id, v)}
          />
        )}
        {q.type === 'priceTable' && (
          <PriceTable q={q} formData={formData} onChange={onChange} />
        )}
      </div>
    </div>
  );
}

// ===== Identity (Q01) =====
function IdentityField({
  q,
  formData,
  onChange,
}: {
  q: QuestionConfig;
  formData: FormData;
  onChange: (key: string, value: string) => void;
}) {
  const hospital = formData[`${q.id}_hospital`] || '';
  const role = formData[`${q.id}_role`] || '원장';
  const name = formData[`${q.id}_name`] || '';

  return (
    <div className="identity-card">
      <div className="identity-grid">
        <div>
          <span className="sub-label">
            병원명 <span className="serif">Clinic</span>
          </span>
          <TextField
            id={`${q.id}_hospital`}
            value={hospital}
            placeholder="병원명을 입력해 주세요"
            onChange={(v) => onChange(`${q.id}_hospital`, v)}
          />
        </div>
        <div>
          <span className="sub-label">
            응답자 성명 <span className="serif">Respondent</span>
          </span>
          <TextField
            id={`${q.id}_name`}
            value={name}
            placeholder="성명을 입력해 주세요"
            onChange={(v) => onChange(`${q.id}_name`, v)}
          />
        </div>
        <div className="role-row">
          <span className="sub-label">
            직급 <span className="serif">Title</span>
          </span>
          <RoleSegmented
            name={`${q.id}_role`}
            value={role}
            onChange={(v) => onChange(`${q.id}_role`, v)}
          />
        </div>
      </div>
    </div>
  );
}

function RoleSegmented({
  name,
  value,
  onChange,
}: {
  name: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const options = ['원장', '실장'];
  return (
    <div className="segmented" data-value={value}>
      <span className="thumb" aria-hidden="true"></span>
      {options.map((opt) => {
        const id = `${name}-${opt}`;
        return (
          <Fragment key={opt}>
            <input
              id={id}
              type="radio"
              name={name}
              value={opt}
              checked={value === opt}
              onChange={() => onChange(opt)}
            />
            <label htmlFor={id}>{opt}</label>
          </Fragment>
        );
      })}
    </div>
  );
}

// ===== Text input =====
function TextField({
  id,
  value,
  placeholder,
  onChange,
}: {
  id: string;
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className={'field' + (focused ? ' is-focused' : '')}>
      <input
        id={id}
        className="input"
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
}

// ===== Textarea =====
function TextAreaField({
  id,
  value,
  rows,
  placeholder,
  onChange,
}: {
  id: string;
  value: string;
  rows: number;
  placeholder?: string;
  onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  const maxLength = 1000;
  const len = value.length;
  return (
    <div className={'field' + (focused ? ' is-focused' : '')}>
      <textarea
        id={id}
        className="textarea"
        rows={rows}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {focused && (
        <span className="char-count">
          {len} / {maxLength}
        </span>
      )}
    </div>
  );
}

// ===== Price table (Q14) =====
function PriceTable({
  q,
  formData,
  onChange,
}: {
  q: QuestionConfig;
  formData: FormData;
  onChange: (key: string, value: string) => void;
}) {
  const procedures = q.procedures ?? [];
  const levels = q.priceLevels ?? [];

  return (
    <>
      <div className="price-table-wrap">
        <table className="price-table">
          <thead>
            <tr>
              <th>Procedures</th>
              {levels.map((l) => (
                <th key={l.id}>{l.label}</th>
              ))}
              <th>비고 · 특이사항</th>
            </tr>
          </thead>
          <tbody>
            {procedures.map((proc, i) => {
              const levelKey = `${q.id}_level_${i}`;
              const noteKey = `${q.id}_note_${i}`;
              const currentLevel = formData[levelKey] || '';
              return (
                <tr key={proc}>
                  <td data-num={pad2(i + 1)}>{proc}</td>
                  {levels.map((l) => (
                    <td key={l.id}>
                      <label className="cell-radio">
                        <input
                          type="radio"
                          name={`price-${q.id}-${i}`}
                          value={l.id}
                          checked={currentLevel === l.id}
                          onChange={() => onChange(levelKey, l.id)}
                        />
                        <span className="cell-radio-dot" aria-hidden="true"></span>
                      </label>
                    </td>
                  ))}
                  <td>
                    <input
                      className="cell-note"
                      type="text"
                      placeholder="입력"
                      value={formData[noteKey] || ''}
                      onChange={(e) => onChange(noteKey, e.target.value)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="price-cards">
        {procedures.map((proc, i) => {
          const levelKey = `${q.id}_level_${i}`;
          const noteKey = `${q.id}_note_${i}`;
          const currentLevel = formData[levelKey] || '';
          return (
            <div className="price-card" key={proc}>
              <div className="price-card-num">{pad2(i + 1)}</div>
              <div className="price-card-name">{proc}</div>
              <div className="price-card-body">
                <div className="price-card-options">
                  {levels.map((l) => (
                    <label className="price-card-option" key={l.id}>
                      <input
                        type="radio"
                        name={`price-m-${q.id}-${i}`}
                        value={l.id}
                        checked={currentLevel === l.id}
                        onChange={() => onChange(levelKey, l.id)}
                      />
                      <span className="price-card-chip">{l.label}</span>
                    </label>
                  ))}
                </div>
                <label className="price-card-note-label">비고 · Notes</label>
                <TextField
                  id={noteKey}
                  value={formData[noteKey] || ''}
                  placeholder="특이사항이 있다면 입력해 주세요"
                  onChange={(v) => onChange(noteKey, v)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

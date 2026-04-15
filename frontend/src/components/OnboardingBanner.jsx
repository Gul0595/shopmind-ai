import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

export default function OnboardingBanner() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.onboarding.get().then(setData).catch(() => {});
  }, []);

  if (!data || data.complete) return null;

  const current = data.steps.find((s) => !s.done);
  const done = data.steps.filter((s) => s.done).length;
  const total = data.steps.length;
  const pct = Math.round((done / total) * 100);

  const stepLinks = { 2: "/dashboard/catalog", 3: "/dashboard/preview", 4: "/dashboard/widget" };

  return (
    <div className="onboarding-banner">
      <div className="onboarding-top">
        <div>
          <span className="onboarding-title">Getting started</span>
          <span className="onboarding-progress">{done} of {total} steps done</span>
        </div>
        <span className="onboarding-pct">{pct}%</span>
      </div>

      <div className="onboarding-bar">
        <div className="onboarding-fill" style={{ width: `${pct}%` }} />
      </div>

      <div className="onboarding-steps">
        {data.steps.map((s) => (
          <div key={s.step} className={`onboarding-step ${s.done ? "done" : s.step === current?.step ? "active" : "upcoming"}`}>
            <span className="step-check">{s.done ? "✓" : s.step}</span>
            <div>
              <div className="step-title">{s.title}</div>
              {!s.done && <div className="step-desc">{s.desc}</div>}
            </div>
            {!s.done && stepLinks[s.step] && (
              <Link to={stepLinks[s.step]} className="step-go">Go →</Link>
            )}
          </div>
        ))}
      </div>

      {data.usage && (
        <div className="onboarding-usage">
          <span>Monthly chats: <strong>{data.usage.count}</strong> / {data.usage.limit}</span>
          <div className="usage-bar">
            <div className="usage-fill" style={{ width: `${Math.min((data.usage.count / data.usage.limit) * 100, 100)}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}

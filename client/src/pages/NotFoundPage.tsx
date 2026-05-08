import { Link } from "react-router-dom";
import { useT } from "../i18n/LanguageContext.js";

export function NotFoundPage() {
  const t = useT();
  return (
    <div className="card max-w-lg space-y-4 text-center">
      <h1 className="font-display text-2xl font-bold text-white">
        {t.notFound.title}
      </h1>
      <p className="text-sm text-slate-400">{t.notFound.subtitle}</p>
      <Link to="/" className="btn-primary inline-flex">
        {t.notFound.cta}
      </Link>
    </div>
  );
}

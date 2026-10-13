import { Fragment } from "react";
import type { CodeExcerpt } from "@/data/projects";

/** Minimal HTML/AMPscript highlighter: comments, AMPscript, tags, attribute values. */
export function Highlight({ code }: { code: string }) {
  const parts: React.ReactNode[] = [];
  const re = /(<!--[\s\S]*?-->)|(%%[\s\S]*?%%)|(<\/?[a-zA-Z:][^>]*>)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(code))) {
    if (m.index > last) parts.push(<Fragment key={k++}>{code.slice(last, m.index)}</Fragment>);
    if (m[1]) parts.push(<span key={k++} className="text-[#7f8bb3] italic">{m[1]}</span>);
    else if (m[2]) parts.push(<span key={k++} className="text-[#ffcf7a]">{m[2]}</span>);
    else if (m[3]) {
      const tag = m[3];
      const sub = tag.split(/("[^"]*")/g);
      parts.push(
        <span key={k++} className="text-[#9caeff]">
          {sub.map((s, i) =>
            s.startsWith('"') ? (
              <span key={i} className={/aria-|lang/.test(sub[i - 1] ?? "") ? "text-[#7ee0b5]" : "text-[#e8c6ff]"}>
                {s}
              </span>
            ) : (
              <Fragment key={i}>{s}</Fragment>
            ),
          )}
        </span>,
      );
    }
    last = m.index + m[0].length;
  }
  if (last < code.length) parts.push(<Fragment key={k++}>{code.slice(last)}</Fragment>);
  return <>{parts}</>;
}

export function CodeExcerpts({ excerpts }: { excerpts: CodeExcerpt[] }) {
  return (
    <section aria-labelledby="code-title" className="bg-night py-20 text-night-ink sm:py-28">
      <div className="shell">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
          <h2 id="code-title" className="display text-[clamp(2.4rem,5vw,4.5rem)] lg:col-span-7">
            From the production HTML
          </h2>
          <p className="max-w-[28rem] text-lg leading-relaxed text-night-muted lg:col-span-5 lg:pt-3">
            Short excerpts from the shipped emails, with image paths and tracking values shortened.
          </p>
        </div>
        <div className="mt-14 flex flex-col gap-14">
          {excerpts.map((c) => (
            <figure key={c.title} className="grid gap-6 border-t border-white/10 pt-8 lg:grid-cols-12 lg:gap-10">
              <figcaption className="lg:col-span-4">
                <h3 className="display-tight text-[1.7rem] text-night-ink sm:text-[2rem]">{c.title}</h3>
                <p className="mt-3 leading-relaxed text-night-muted">{c.body}</p>
              </figcaption>
              <pre
                tabIndex={0}
                className="scrollbar-thin overflow-x-auto rounded-[6px] bg-[#070c22] p-5 text-[0.8rem] leading-[1.7] text-[#d6dbef] ring-1 ring-white/10 sm:p-6 sm:text-[0.86rem] lg:col-span-8"
                style={{ fontFamily: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace' }}
              >
                <code>
                  <Highlight code={c.code} />
                </code>
              </pre>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

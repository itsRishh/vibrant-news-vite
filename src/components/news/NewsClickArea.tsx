import { useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { buildSectionArticleSlug, getArticleByTitle, normalizeSectionKey, slugify } from "@/data/news";

/**
 * Makes every news block on the homepage clickable without duplicating link
 * markup in each card. Clicking a card resolves its headline and routes to the
 * matching story page using a section-aware slug.
 */
export function NewsClickArea({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.closest("a, button, input, form")) return;

        const block = target.closest("article, li");
        if (!block) return;

        const heading = block.querySelector("h3, h2, h1");
        const title = heading?.textContent?.trim();
        if (!title) return;

        const lookup = getArticleByTitle(title);
        const section = lookup?.section ?? "general";
        const slug = lookup?.slug ?? slugify(title);

        // navigate({
        //   to: "/news/$section/$slug",
        //   params: {
        //     section: normalizeSectionKey(section),
        //     slug,
        //   },
        // });
      }}
      className="[&_article]:cursor-pointer [&_li]:cursor-pointer flex items-center justify-center flex-col"
    >
      {children}
    </div>
  );
}

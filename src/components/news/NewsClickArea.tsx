import { useState, type ReactNode } from "react";
import { useQuery } from "convex/react";
import { Badge } from "@/components/news/Sections";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "../../../convex/_generated/api";

type DatabaseArticle = {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  body?: string;
  imageUrl: string | null;
  publishedAt: number;
};

/**
 * Makes every news block on the homepage clickable without duplicating link
 * markup in each card. Clicking a card opens its story in an on-page dialog.
 */
export function NewsClickArea({ children }: { children: ReactNode }) {
  const breakingArticles = useQuery(api.breakingNews.list);
  const latestArticles = useQuery(api.latestNews.list);
  const [selectedArticle, setSelectedArticle] = useState<DatabaseArticle | null>(null);

  return (
    <>
      <div
        onClick={(event) => {
          const target = event.target as HTMLElement;
          if (target.closest("a, button, input, form")) return;

          const block = target.closest("article, li");
          if (!block) return;

          const slug = block.getAttribute("data-article-slug");
          const title = block.querySelector("h3, h2, h1")?.textContent?.trim();
          if (!slug && !title) return;

          const article = [...(breakingArticles ?? []), ...(latestArticles ?? [])].find(
            (item) => item.slug === slug || item.title === title,
          );
          if (!article) return;

          setSelectedArticle({
            title: article.title,
            slug: article.slug,
            category: article.category,
            excerpt: article.excerpt,
            body: "body" in article ? article.body : undefined,
            imageUrl: article.imageUrl,
            publishedAt: article.publishedAt,
          });
        }}
        className="flex flex-col items-center justify-center [&_article]:cursor-pointer [&_li]:cursor-pointer"
      >
        {children}
      </div>

      <Dialog open={selectedArticle !== null} onOpenChange={(open) => !open && setSelectedArticle(null)}>
        <DialogContent data-lenis-prevent className="max-h-[90vh] max-w-3xl overflow-y-auto p-0">
          {selectedArticle && (
            <article>
              {selectedArticle.imageUrl && (
                <img
                  src={selectedArticle.imageUrl}
                  alt={selectedArticle.title}
                  className="h-48 w-full object-cover sm:h-72"
                />
              )}
              <div className="p-5 sm:p-8">
                <DialogHeader className="text-left">
                  <Badge>{selectedArticle.category}</Badge>
                  <DialogTitle className="mt-3 text-2xl font-black leading-tight sm:text-3xl">
                    {selectedArticle.title}
                  </DialogTitle>
                  <DialogDescription className="mt-3 text-sm leading-6">
                    {selectedArticle.excerpt}
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1 border-y border-border py-3 text-[11px] text-muted-foreground">
                  <span className="font-bold text-foreground">{selectedArticle.slug}</span>
                  <span>{new Date(selectedArticle.publishedAt).toLocaleString()}</span>
                </div>

                <div className="mt-5 space-y-4 text-sm leading-7 sm:text-[15px]">
                  {(selectedArticle.body ? [selectedArticle.body] : [selectedArticle.excerpt]).map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </article>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

import { useState, type ReactNode } from "react";
import { Badge } from "@/components/news/Sections";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getArticle, getArticleByTitle } from "@/data/news";
import type { Article } from "@/data/news";

/**
 * Makes every news block on the homepage clickable without duplicating link
 * markup in each card. Clicking a card opens its story in an on-page dialog.
 */
export function NewsClickArea({ children }: { children: ReactNode }) {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  return (
    <>
      <div
        onClick={(event) => {
          const target = event.target as HTMLElement;
          if (target.closest("a, button, input, form")) return;

          const block = target.closest("article, li");
          if (!block) return;

          const title = block.querySelector("h3, h2, h1")?.textContent?.trim();
          if (!title) return;

          const lookup = getArticleByTitle(title);
          setSelectedArticle(getArticle(lookup?.section ?? "general", lookup?.slug ?? title));
        }}
        className="flex flex-col items-center justify-center [&_article]:cursor-pointer [&_li]:cursor-pointer"
      >
        {children}
      </div>

      <Dialog open={selectedArticle !== null} onOpenChange={(open) => !open && setSelectedArticle(null)}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto p-0">
          {selectedArticle && (
            <article>
              {selectedArticle.image && (
                <img
                  src={selectedArticle.image}
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
                    {selectedArticle.subHead}
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1 border-y border-border py-3 text-[11px] text-muted-foreground">
                  <span className="font-bold text-foreground">{selectedArticle.author}</span>
                  <span>{selectedArticle.location}</span>
                  <span>{selectedArticle.published}</span>
                  <span>{selectedArticle.readTime}</span>
                </div>

                <div className="mt-5 space-y-4 text-sm leading-7 sm:text-[15px]">
                  {selectedArticle.body.map((paragraph) => (
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

import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Header } from "@/components/news/Header";
import { Footer, Newsletter } from "@/components/news/Footer";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Zero Tolerance India" },
      {
        name: "description",
        content: "Get in touch with the Zero Tolerance India newsroom.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="mx-auto max-w-[1200px] px-4 py-8 sm:py-12">
        <nav className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <span>/</span>
          <span className="text-primary">Contact Us</span>
        </nav>

        <div className="section-rule mt-5">
          <p className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase">The newsroom</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">Contact Us</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Have a story tip, a correction, or a question? Send a note to the Zero Tolerance India
            team.
          </p>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <aside className="bg-ink p-6 text-background sm:p-8">
            <p className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase">Reach us</p>
            <h2 className="mt-3 text-2xl font-black">Let&apos;s start a conversation.</h2>
            <div className="mt-8 space-y-5 text-sm">
              <div className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="font-bold">Email</p>
                  <a href="mailto:desk@zerotoleranceindia.com" className="mt-1 block opacity-75 hover:text-primary">
                    contact@ztilive.com
                  </a>
                </div>
              </div>
              <div className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="font-bold">Newsroom</p>
                  <p className="mt-1 opacity-75">Mon–Sat, 10:00–18:00 IST</p>
                </div>
              </div>
              <div className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="font-bold">Location</p>
                  <p className="mt-1 opacity-75">India</p>
                </div>
              </div>
            </div>
          </aside>

          <form onSubmit={(event) => event.preventDefault()} className="border border-border p-6 sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-xs font-bold">
                Your name
                <input required name="name" type="text" className="mt-2 w-full border border-input bg-background px-3 py-3 text-sm font-normal outline-none focus:border-primary" />
              </label>
              <label className="text-xs font-bold">
                Email address
                <input required name="email" type="email" className="mt-2 w-full border border-input bg-background px-3 py-3 text-sm font-normal outline-none focus:border-primary" />
              </label>
            </div>
            <label className="mt-5 block text-xs font-bold">
              Subject
              <input required name="subject" type="text" className="mt-2 w-full border border-input bg-background px-3 py-3 text-sm font-normal outline-none focus:border-primary" />
            </label>
            <label className="mt-5 block text-xs font-bold">
              Message
              <textarea required name="message" rows={6} className="mt-2 w-full resize-y border border-input bg-background px-3 py-3 text-sm font-normal outline-none focus:border-primary" />
            </label>
            <button type="submit" className="mt-6 flex items-center gap-2 bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90">
              Send message <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </main>

      <Newsletter />
      <Footer />
    </div>
  );
}
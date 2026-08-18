import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Seo } from '@/components/shared/Seo';
import { SectionHeading } from '@/components/shared/SectionHeading';

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <Seo
        title="Contact"
        description="Get in touch with the FORVA PropTech team for demos, questions, and support."
      />

      <section className="border-b border-white/8 bg-navy-radial py-16 sm:py-20">
        <div className="container-page text-center">
          <SectionHeading
            center
            eyebrow="Contact"
            title="Let's talk about your lead engine"
            subtitle="Whether you're an individual realtor or running a full agency, we'll help you get started."
          />
        </div>
      </section>

      <section className="py-16">
        <div className="container-page grid gap-8 lg:grid-cols-3">
          <div className="space-y-6">
            <div className="card p-6">
              <Mail size={20} className="text-accent-300" />
              <h3 className="mt-3 text-sm font-semibold text-white">Email</h3>
              <p className="mt-1 text-sm text-silver-400">hello@forva.net</p>
            </div>
            <div className="card p-6">
              <Phone size={20} className="text-accent-300" />
              <h3 className="mt-3 text-sm font-semibold text-white">Phone</h3>
              <p className="mt-1 text-sm text-silver-400">(415) 555-0142</p>
            </div>
            <div className="card p-6">
              <MapPin size={20} className="text-accent-300" />
              <h3 className="mt-3 text-sm font-semibold text-white">Location</h3>
              <p className="mt-1 text-sm text-silver-400">San Francisco, CA</p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="card p-6 sm:p-8">
              {submitted ? (
                <div className="flex flex-col items-center gap-3 py-12 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
                    <Send size={22} />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Message sent</h3>
                  <p className="text-sm text-silver-400">
                    Thanks for reaching out. Our team will respond within one business day.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                  className="space-y-4"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label" htmlFor="name">Name</label>
                      <input id="name" className="input" required placeholder="Your name" />
                    </div>
                    <div>
                      <label className="label" htmlFor="email">Email</label>
                      <input id="email" type="email" className="input" required placeholder="you@example.com" />
                    </div>
                  </div>
                  <div>
                    <label className="label" htmlFor="company">Company / Agency</label>
                    <input id="company" className="input" placeholder="Optional" />
                  </div>
                  <div>
                    <label className="label" htmlFor="message">Message</label>
                    <textarea id="message" className="input min-h-[120px] resize-y" required placeholder="Tell us about your team and what you're looking for..." />
                  </div>
                  <button type="submit" className="btn-primary w-full sm:w-auto">
                    <Send size={16} />
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

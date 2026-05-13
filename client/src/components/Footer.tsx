import { ArrowRight, Instagram, Mail } from 'lucide-react';
import Logo from './Logo';
import WhatsAppIcon from './WhatsAppIcon';

const productLinks = ['Agentes de IA', 'Fluxos de WhatsApp', 'Automações', 'Integrações'];
const companyLinks = ['Sobre', 'Como funciona', 'Privacidade', 'Termos'];
const contactLinks = ['WhatsApp', 'Instagram', 'E-mail'];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer relative overflow-hidden border-t border-slate-200 bg-white">
      <div className="footer-main relative z-10">
        <div className="container mx-auto max-w-7xl px-4 py-14">
          <div className="grid gap-10 md:grid-cols-[1.3fr_0.7fr_0.7fr_0.8fr]">
            <div className="footer-brand">
              <div className="flex items-center gap-3">
                <Logo className="footer-logo h-16 w-auto" />
                <div>
                  <div className="text-xs text-slate-500">AI automation studio</div>
                </div>
              </div>
              <p className="footer-description mt-5 max-w-sm text-sm leading-7 text-slate-600">
                Criamos automações, agentes de IA e fluxos conversacionais para empresas que querem vender, atender e captar leads com mais autoridade.
              </p>
            </div>

            <div className="footer-columns contents">
              <FooterColumn title="Produto" links={productLinks} />
              <FooterColumn title="Empresa" links={companyLinks} />

              <div className="footer-column">
                <h4 className="mb-4 text-sm font-semibold text-slate-950">Contato</h4>
                <ul className="mb-5 space-y-3">
                  {contactLinks.map((link) => (
                    <li key={link}>
                      <a href="#" className="group inline-flex items-center gap-1 text-sm text-slate-600 transition hover:text-sky-700">
                        {link}
                        <ArrowRight className="h-3 w-3 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                      </a>
                    </li>
                  ))}
                </ul>
                <div className="footer-socials flex gap-3">
                  <SocialLink href="https://instagram.com/automationtoy" label="Instagram">
                    <Instagram className="h-5 w-5" />
                  </SocialLink>
                  <SocialLink href="https://wa.me/5511987793213" label="WhatsApp">
                    <WhatsAppIcon className="h-6 w-6" />
                  </SocialLink>
                  <SocialLink href="mailto:contato@automationtoyou.com" label="Email">
                    <Mail className="h-5 w-5" />
                  </SocialLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom relative z-10">
        <div className="container mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-sm md:flex-row md:items-center md:justify-between">
          <p>&copy; {currentYear} ATY Automation Studio. Todos os direitos reservados.</p>
          <p>Design, IA e automação para experiências comerciais melhores.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div className="footer-column">
      <h4 className="mb-4 text-sm font-semibold text-slate-950">{title}</h4>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link}>
            <a href="#" className="group inline-flex items-center gap-1 text-sm text-slate-600 transition hover:text-sky-700">
              {link}
              <ArrowRight className="h-3 w-3 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
    >
      {children}
    </a>
  );
}

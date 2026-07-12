const SUPPORT_LINKS = [
  {
    label: "Patreon",
    href: "https://patreon.com/kiberastories",
    display: "patreon.com/kiberastories",
  },
  {
    label: "Ko-fi",
    href: "https://ko-fi.com/kiberastories",
    display: "ko-fi.com/kiberastories",
  },
  {
    label: "M-Pesa",
    href: "tel:+254711254986",
    display: "+254 711 254986",
  },
] as const;

export default function Footer() {
  return (
    <footer className="footer">
      <p className="footer__heading">Support the creator</p>
      <ul className="footer__links">
        {SUPPORT_LINKS.map((link) => (
          <li key={link.label}>
            <a
              className="footer__link"
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={
                link.href.startsWith("http") ? "noopener noreferrer" : undefined
              }
            >
              <span className="footer__link-label">{link.label}</span>
              <span className="footer__link-value">{link.display}</span>
            </a>
          </li>
        ))}
      </ul>
      <p className="footer__credit">
        PhotoCards by{" "}
        <a
          href="https://storitellah.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Storitellah
        </a>
      </p>
    </footer>
  );
}

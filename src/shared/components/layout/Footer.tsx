import React from "react";
import "./Footer.css";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__content">
        <p className="footer__copyright">
          © {currentYear} Podcaster. All rights reserved.
        </p>
        <nav className="footer__nav" aria-label="Footer navigation">
          <ul className="footer__links">
            <li>
              <a
                href="https://www.apple.com/itunes/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__link"
              >
                Powered by iTunes
              </a>
            </li>
            <li>
              <a
                href="https://github.com/lisnielsm/podcaster"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__link"
              >
                GitHub
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;

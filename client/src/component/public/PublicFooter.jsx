
import React from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

// =====================================================
// PUBLIC FOOTER
// =====================================================

const PublicFooter = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // =====================================================
  // CURRENT YEAR
  // =====================================================

  const currentYear = new Date().getFullYear();

  // =====================================================
  // CONTACT INFORMATION
  // =====================================================

  const contactInfo = {
    email: "abdussamad.7562@gmail.com",
    whatsapp: "9519770595",
  };

  // =====================================================
  // SCROLL TO SECTION
  // =====================================================

  const handleSectionClick = (sectionId) => {
    // Already on Home
    if (location.pathname === "/") {
      const section = document.getElementById(sectionId);

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }

      return;
    }

    // Navigate to Home first
    navigate(`/#${sectionId}`);
  };

  // =====================================================
  // FOOTER NAVIGATION
  // =====================================================

  const productLinks = [
    {
      label: "Features",
      section: "features",
    },
    {
      label: "Our Goals",
      section: "goals",
    },
  ];

  const companyLinks = [
    {
      label: "About",
      section: "about",
    },
    {
      label: "Contact",
      section: "contact",
    },
  ];

  // =====================================================
  // CONTACT LINKS
  // =====================================================

  const contactLinks = [
    {
      label: "Email",
      href: `mailto:${contactInfo.email}`,
      external: false,
    },
    {
      label: "WhatsApp",
      href: "https://wa.me/91951977059",
      external: true,
    },
  ];

  // =====================================================
  // SOCIAL LINKS
  // =====================================================

  const socialLinks = [
    {
      label: "GitHub",
      href: "https://github.com/Mr-Samad3011",
      icon: (
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.604-3.369-1.34-3.369-1.34-.455-1.156-1.11-1.464-1.11-1.464-.908-.621.069-.608.069-.608 1.004.07 1.532 1.03 1.532 1.03.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.748-1.025 2.748-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.744 0 .268.18.579.688.481A10.002 10.002 0 0022 12c0-5.523-4.477-10-10-10z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },

    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/abdus-samad-7a6864304",
      icon: (
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M6.94 8.5H3.56V20h3.38V8.5zM5.25 3A2 2 0 103.25 5a2 2 0 002-2zM20.44 13.42c0-3.47-1.85-5.09-4.31-5.09-1.99 0-2.88 1.1-3.38 1.87V8.5H9.37V20h3.38v-5.69c0-1.5.28-2.95 2.14-2.95 1.83 0 1.85 1.72 1.85 3.05V20h3.38l.32-6.58z" />
        </svg>
      ),
    },

    {
      label: "Twitter",
      href: "https://x.com/AbdusSamad75624",
      icon: (
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817-5.964 6.817H1.684l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
        </svg>
      ),
    },
  ];

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">

      {/* =================================================
          MAIN FOOTER
      ================================================= */}

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* =================================================
              BRAND
          ================================================= */}

          <div className="lg:col-span-2">

            <button
              type="button"
              onClick={() => {
                if (location.pathname === "/") {
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                } else {
                  navigate("/");
                }
              }}
              className="group flex items-center gap-3"
              aria-label="Go to NOVA home"
            >

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-sm font-bold text-slate-950 transition group-hover:scale-105">
                N
              </div>

              <div className="text-left">

                <p className="text-xl font-bold tracking-tight text-white">
                  NOVA
                </p>

                <p className="text-[10px] font-medium tracking-[0.2em] text-slate-500">
                  TEAM PRODUCTIVITY
                </p>

              </div>

            </button>

            <p className="mt-5 max-w-md text-sm leading-6 text-slate-400">
              A modern team productivity platform designed to help
              teams plan projects, manage tasks, collaborate
              efficiently, and achieve better results together.
            </p>

            {/* =================================================
                SOCIAL LINKS
            ================================================= */}

            <div className="mt-6 flex items-center gap-3">

              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-800 text-slate-400 transition hover:border-slate-600 hover:bg-slate-900 hover:text-white"
                >
                  {social.icon}
                </a>
              ))}

            </div>

          </div>


          {/* =================================================
              PRODUCT
          ================================================= */}

          <div>

            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Product
            </h3>

            <ul className="mt-5 space-y-3">

              {productLinks.map((item) => (
                <li key={item.section}>

                  <button
                    type="button"
                    onClick={() =>
                      handleSectionClick(item.section)
                    }
                    className="text-sm text-slate-400 transition hover:text-white"
                  >
                    {item.label}
                  </button>

                </li>
              ))}

              <li>
                <Link
                  to="/login"
                  className="text-sm text-slate-400 transition hover:text-white"
                >
                  Login
                </Link>
              </li>

              <li>
                <Link
                  to="/register"
                  className="text-sm text-slate-400 transition hover:text-white"
                >
                  Get Started
                </Link>
              </li>

            </ul>

          </div>


          {/* =================================================
              COMPANY
          ================================================= */}

          <div>

            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Company
            </h3>

            <ul className="mt-5 space-y-3">

              {companyLinks.map((item) => (
                <li key={item.section}>

                  <button
                    type="button"
                    onClick={() =>
                      handleSectionClick(item.section)
                    }
                    className="text-sm text-slate-400 transition hover:text-white"
                  >
                    {item.label}
                  </button>

                </li>
              ))}

              {/* =================================================
                  EMAIL
              ================================================= */}

              <li>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="text-sm text-slate-400 transition hover:text-white"
                >
                  Email
                </a>
              </li>


              {/* =================================================
                  WHATSAPP
              ================================================= */}

              <li>
                <a
                  href={`https://wa.me/${contactInfo.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-400 transition hover:text-white"
                >
                  WhatsApp
                </a>
              </li>


              {/* =================================================
                  PRIVACY
              ================================================= */}

              <li>
                <Link
                  to="/privacy"
                  className="text-sm text-slate-400 transition hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>


              {/* =================================================
                  TERMS
              ================================================= */}

              <li>
                <Link
                  to="/terms"
                  className="text-sm text-slate-400 transition hover:text-white"
                >
                  Terms of Service
                </Link>
              </li>

            </ul>

          </div>

        </div>


        {/* =================================================
            CONTACT BAR
        ================================================= */}

        <div className="mt-12 grid gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5 sm:grid-cols-3">

          {/* EMAIL */}

          <a
            href={`mailto:${contactInfo.email}`}
            className="group flex items-center gap-3 rounded-xl p-3 transition hover:bg-slate-800"
          >

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-white transition group-hover:bg-white group-hover:text-slate-950">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 6.75A2.75 2.75 0 015.75 4h12.5A2.75 2.75 0 0121 6.75v10.5A2.75 2.75 0 0118.25 20H5.75A2.75 2.75 0 013 17.25V6.75z"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6l8 6 8-6"
                />
              </svg>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Email
              </p>

              <p className="text-sm font-medium text-slate-200">
                {contactInfo.email}
              </p>
            </div>

          </a>


          {/* WHATSAPP */}

          <a
            href={`https://wa.me/${contactInfo.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-xl p-3 transition hover:bg-slate-800"
          >

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-white transition group-hover:bg-white group-hover:text-slate-950">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M20.52 3.48A11.85 11.85 0 0012.05 0C5.5 0 .17 5.33.17 11.89c0 2.1.55 4.15 1.6 5.96L.1 24l6.3-1.65a11.9 11.9 0 005.65 1.44h.01c6.55 0 11.88-5.33 11.88-11.89 0-3.17-1.23-6.15-3.42-8.42zM12.06 21.8h-.01a9.9 9.9 0 01-5.05-1.38l-.36-.21-3.74.98 1-3.64-.24-.38a9.87 9.87 0 01-1.52-5.28C2.14 6.43 6.58 2 12.05 2a9.87 9.87 0 017 2.9 9.87 9.87 0 012.9 7c0 5.47-4.44 9.9-9.89 9.9z" />

                <path d="M17.6 14.2c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.46-.88-.78-1.48-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.03 1-1.03 2.45s1.05 2.84 1.2 3.04c.15.2 2.06 3.15 5 4.42.7.3 1.25.48 1.68.61.71.23 1.35.2 1.86.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z" />
              </svg>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                WhatsApp
              </p>

              <p className="text-sm font-medium text-slate-200">
                Chat with us
              </p>
            </div>

          </a>


          {/* CONTACT */}

          <button
            type="button"
            onClick={() => handleSectionClick("contact")}
            className="group flex items-center gap-3 rounded-xl p-3 text-left transition hover:bg-slate-800"
          >

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-white transition group-hover:bg-white group-hover:text-slate-950">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 11.5a8.38 8.38 0 01-8.5 8.5 8.74 8.74 0 01-3.62-.78L3 21l1.78-5.88A8.74 8.74 0 014 11.5 8.5 8.5 0 0112.5 3 8.38 8.38 0 0121 11.5z"
                />
              </svg>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Contact
              </p>

              <p className="text-sm font-medium text-slate-200">
                Contact our team
              </p>
            </div>

          </button>

        </div>


        {/* =================================================
            CTA
        ================================================= */}

        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

          <div className="flex flex-col gap-5 px-6 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8">

            <div>

              <h3 className="text-lg font-semibold text-white">
                Ready to improve your team's workflow?
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Start organizing projects and collaborating
                smarter with NOVA.
              </p>

            </div>

            <Link
              to="/register"
              className="inline-flex shrink-0 items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              Get Started
            </Link>

          </div>

        </div>


        {/* =================================================
            BOTTOM
        ================================================= */}

        <div className="mt-10 flex flex-col gap-4 border-t border-slate-800 pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">

          <p className="text-slate-500">
            © {currentYear} NOVA. All rights reserved.
          </p>

          <p className="text-slate-600">
            Built for productive teams.
          </p>

        </div>

      </div>

    </footer>
  );
};

export default PublicFooter;

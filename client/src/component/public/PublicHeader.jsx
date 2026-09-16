
import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

// =====================================================
// PUBLIC HEADER
// =====================================================

const PublicHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);

  // =====================================================
  // NAVIGATION
  // =====================================================

  const navigation = [
    {
      name: "Home",
      section: "home",
    },
    {
      name: "About",
      section: "about",
    },
    {
      name: "Our Goals",
      section: "goals",
    },
    {
      name: "Contact",
      section: "contact",
    },
  ];

  // =====================================================
  // CLOSE MOBILE MENU ON ROUTE / HASH CHANGE
  // =====================================================

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, location.hash]);

  // =====================================================
  // ESCAPE KEY
  // =====================================================

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  // =====================================================
  // BODY SCROLL LOCK
  // =====================================================

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // =====================================================
  // SCROLL TO HOME SECTION
  // =====================================================

  const handleSectionClick = (sectionId) => {
    setMobileOpen(false);

    // ---------------------------------------------------
    // Already on Home
    // ---------------------------------------------------

    if (location.pathname === "/") {
      const section =
        document.getElementById(sectionId);

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      } else {
        // If section does not exist yet
        window.location.hash = sectionId;
      }

      return;
    }

    // ---------------------------------------------------
    // Navigate from another public page
    // ---------------------------------------------------

    navigate(`/#${sectionId}`);
  };

  // =====================================================
  // LOGO CLICK
  // =====================================================

  const handleLogoClick = () => {
    setMobileOpen(false);

    if (location.pathname === "/") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      // Remove hash when clicking logo on Home
      if (location.hash) {
        navigate("/", {
          replace: true,
        });
      }

      return;
    }

    navigate("/");
  };

  // =====================================================
  // MOBILE TOGGLE
  // =====================================================

  const toggleMobileMenu = () => {
    setMobileOpen((previous) => !previous);
  };

  // =====================================================
  // DESKTOP NAV CLASS
  // =====================================================

  const getNavLinkClass = (section) => {
    const isHome =
      location.pathname === "/" &&
      section === "home" &&
      !location.hash;

    const isSectionActive =
      location.pathname === "/" &&
      location.hash === `#${section}`;

    const isActive =
      isHome || isSectionActive;

    return `
      rounded-lg
      px-3 py-2
      text-sm font-medium
      transition-all duration-200

      ${
        isActive
          ? "bg-slate-900 text-white shadow-sm"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      }
    `;
  };

  // =====================================================
  // MOBILE NAV CLASS
  // =====================================================

  const getMobileNavClass = (section) => {
    const isHome =
      location.pathname === "/" &&
      section === "home" &&
      !location.hash;

    const isSectionActive =
      location.pathname === "/" &&
      location.hash === `#${section}`;

    const isActive =
      isHome || isSectionActive;

    return `
      block w-full
      rounded-lg
      px-4 py-3
      text-sm font-medium
      transition-all duration-200

      ${
        isActive
          ? "bg-slate-900 text-white"
          : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
      }
    `;
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <header
      className="
        sticky top-0 z-50
        border-b border-slate-200
        bg-white/95
        backdrop-blur
      "
    >
      {/* =================================================
          MAIN HEADER
      ================================================= */}

      <div
        className="
          mx-auto
          flex h-16
          max-w-7xl
          items-center
          justify-between
          px-4
          sm:px-6
          lg:px-8
        "
      >
        {/* =================================================
            LOGO
        ================================================= */}

        <button
          type="button"
          onClick={handleLogoClick}
          aria-label="Go to NOVA home"
          className="
            flex items-center gap-2
            rounded-lg
            outline-none
            focus-visible:ring-2
            focus-visible:ring-slate-400
            focus-visible:ring-offset-2
          "
        >
          <div
            className="
              flex h-9 w-9
              items-center justify-center
              rounded-xl
              bg-slate-900
              text-sm font-bold
              text-white
              shadow-sm
            "
          >
            N
          </div>

          <div className="text-left">
            <p
              className="
                text-lg
                font-bold
                tracking-tight
                text-slate-900
              "
            >
              NOVA
            </p>

            <p
              className="
                -mt-1 hidden
                text-[10px]
                font-medium
                tracking-wider
                text-slate-400
                sm:block
              "
            >
              TEAM PRODUCTIVITY
            </p>
          </div>
        </button>

        {/* =================================================
            DESKTOP NAVIGATION
        ================================================= */}

        <nav
          aria-label="Main navigation"
          className="
            hidden
            items-center
            gap-1
            md:flex
          "
        >
          {navigation.map((item) => (
            <button
              key={item.section}
              type="button"
              onClick={() =>
                handleSectionClick(item.section)
              }
              className={getNavLinkClass(
                item.section
              )}
            >
              {item.name}
            </button>
          ))}
        </nav>

        {/* =================================================
            DESKTOP AUTH ACTIONS
        ================================================= */}

        <div
          className="
            hidden
            items-center
            gap-2
            md:flex
          "
        >
          {/* LOGIN */}

          <Link
            to="/login"
            className="
              rounded-lg
              px-4 py-2.5
              text-sm font-semibold
              text-slate-700
              transition
              hover:bg-slate-100
              hover:text-slate-900
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-slate-400
              focus-visible:ring-offset-2
            "
          >
            Login
          </Link>

          {/* GET STARTED */}

          <Link
            to="/register"
            className="
              rounded-lg
              bg-slate-900
              px-4 py-2.5
              text-sm font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-slate-800
              hover:shadow
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-slate-400
              focus-visible:ring-offset-2
            "
          >
            Get Started
          </Link>
        </div>

        {/* =================================================
            MOBILE MENU BUTTON
        ================================================= */}

        <button
          type="button"
          onClick={toggleMobileMenu}
          aria-label={
            mobileOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={mobileOpen}
          aria-controls="public-mobile-navigation"
          className="
            rounded-lg
            p-2
            text-slate-700
            transition
            hover:bg-slate-100
            hover:text-slate-900
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-slate-400
            md:hidden
          "
        >
          {mobileOpen ? (
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* =================================================
          MOBILE NAVIGATION
      ================================================= */}

      {mobileOpen && (
        <div
          id="public-mobile-navigation"
          className="
            border-t
            border-slate-200
            bg-white
            md:hidden
          "
        >
          <div
            className="
              mx-auto
              max-w-7xl
              px-4
              py-4
              sm:px-6
            "
          >
            <nav
              aria-label="Mobile navigation"
              className="space-y-1"
            >
              {navigation.map((item) => (
                <button
                  key={item.section}
                  type="button"
                  onClick={() =>
                    handleSectionClick(
                      item.section
                    )
                  }
                  className={`
                    ${getMobileNavClass(
                      item.section
                    )}
                    text-left
                  `}
                >
                  {item.name}
                </button>
              ))}
            </nav>

            {/* DIVIDER */}

            <div
              className="
                my-4
                border-t
                border-slate-200
              "
            />

            {/* AUTH */}

            <div className="space-y-2">
              <Link
                to="/login"
                onClick={() =>
                  setMobileOpen(false)
                }
                className="
                  block w-full
                  rounded-lg
                  border
                  border-slate-200
                  px-4 py-3
                  text-center
                  text-sm font-semibold
                  text-slate-700
                  transition
                  hover:bg-slate-50
                  hover:text-slate-900
                "
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={() =>
                  setMobileOpen(false)
                }
                className="
                  block w-full
                  rounded-lg
                  bg-slate-900
                  px-4 py-3
                  text-center
                  text-sm font-semibold
                  text-white
                  transition
                  hover:bg-slate-800
                "
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicHeader;

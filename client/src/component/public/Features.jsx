
import React from "react";
import { Link } from "react-router-dom";

// =====================================================
// FEATURE DATA
// =====================================================

const features = [
  {
    title: "Project Management",
    description:
      "Create, organize, track, and manage projects from a single centralized workspace.",
    icon: (
      <svg
        className="h-6 w-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 6.75A2.25 2.25 0 016 4.5h4.379a2.25 2.25 0 011.591.659l1.121 1.121a2.25 2.25 0 001.591.659H18a2.25 2.25 0 012.25 2.25v8.061A2.25 2.25 0 0118 19.5H6a2.25 2.25 0 01-2.25-2.25V6.75z"
        />
      </svg>
    ),
  },

  {
    title: "Task Management",
    description:
      "Break projects into manageable tasks, assign responsibilities, and keep work moving forward.",
    icon: (
      <svg
        className="h-6 w-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 5.25h9M9 12h9M9 18.75h9"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 5.25l1 1 2-2M4.5 12l1 1 2-2M4.5 18.75l1 1 2-2"
        />
      </svg>
    ),
  },

  {
    title: "Team Collaboration",
    description:
      "Bring owners, managers, and team members together with clear project-level collaboration.",
    icon: (
      <svg
        className="h-6 w-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2"
        />
        <circle cx="9.5" cy="7" r="4" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17 11a4 4 0 100-8M21 21v-2a4 4 0 00-3-3.87"
        />
      </svg>
    ),
  },

  {
    title: "Role-Based Access",
    description:
      "Control what users can create, update, delete, and manage using role-based permissions.",
    icon: (
      <svg
        className="h-6 w-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <rect
          x="4"
          y="10"
          width="16"
          height="10"
          rx="2"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 10V7a4 4 0 018 0v3"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 14v2"
        />
      </svg>
    ),
  },

  {
    title: "Real-Time Notifications",
    description:
      "Stay informed about important activities, updates, assignments, and project events.",
    icon: (
      <svg
        className="h-6 w-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18 8a6 6 0 00-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10 21h4"
        />
      </svg>
    ),
  },

  {
    title: "Analytics & Insights",
    description:
      "Understand project progress, task activity, priorities, and team workload through useful insights.",
    icon: (
      <svg
        className="h-6 w-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 19V9M10 19V5M16 19v-7M22 19V3"
        />
      </svg>
    ),
  },

  {
    title: "Secure Authentication",
    description:
      "Protect your workspace with authenticated access and controlled user sessions.",
    icon: (
      <svg
        className="h-6 w-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3l7 3v5c0 4.5-2.9 8.5-7 10-4.1-1.5-7-5.5-7-10V6l7-3z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4"
        />
      </svg>
    ),
  },

  {
    title: "Centralized Workspace",
    description:
      "Keep projects, tasks, teams, notifications, and productivity information together in one place.",
    icon: (
      <svg
        className="h-6 w-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="3"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 9h18M9 21V9"
        />
      </svg>
    ),
  },
];

// =====================================================
// FEATURE CARD
// =====================================================

const FeatureCard = ({
  icon,
  title,
  description,
}) => {
  return (
    <div
      className="
        group relative overflow-hidden rounded-2xl
        border border-slate-200 bg-white p-6
        shadow-sm
        transition-all duration-300
        hover:-translate-y-1
        hover:border-slate-300
        hover:shadow-lg
      "
    >
      {/* TOP ACCENT */}

      <div
        className="
          absolute left-0 top-0 h-1 w-0
          bg-slate-900
          transition-all duration-300
          group-hover:w-full
        "
      />

      {/* ICON */}

      <div
        className="
          flex h-12 w-12 items-center justify-center
          rounded-xl bg-slate-100
          text-slate-900
          transition-all duration-300
          group-hover:bg-slate-900
          group-hover:text-white
        "
      >
        {icon}
      </div>

      {/* CONTENT */}

      <h3 className="mt-5 text-lg font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>

      {/* LEARN MORE */}

      <div
        className="
          mt-5 flex items-center gap-2
          text-sm font-semibold text-slate-700
          transition-all duration-300
          group-hover:gap-3
          group-hover:text-slate-900
        "
      >
        <span>Explore</span>

        <svg
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
};

// =====================================================
// FEATURES
// =====================================================

const Features = () => {
  return (
    <section
      id="features"
      className="relative overflow-hidden bg-slate-50 py-20 sm:py-24"
    >
      {/* BACKGROUND DECORATION */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute
          -left-32 top-20 h-72 w-72
          rounded-full bg-blue-100/40
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute
          -right-32 bottom-20 h-72 w-72
          rounded-full bg-purple-100/40
          blur-3xl
        "
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* =================================================
            SECTION HEADER
        ================================================= */}

        <div className="mx-auto max-w-3xl text-center">

          <span
            className="
              inline-flex items-center rounded-full
              border border-slate-200
              bg-white px-3 py-1
              text-xs font-semibold uppercase
              tracking-wider text-slate-600
              shadow-sm
            "
          >
            Powerful Features
          </span>

          <h2
            className="
              mt-5 text-3xl font-bold
              tracking-tight text-slate-900
              sm:text-4xl lg:text-5xl
            "
          >
            Everything your team needs
            <span className="block text-slate-500">
              to work better together.
            </span>
          </h2>

          <p
            className="
              mx-auto mt-5 max-w-2xl
              text-base leading-7 text-slate-500
              sm:text-lg
            "
          >
            NOVA brings project management, task tracking,
            team collaboration, security, and productivity
            insights together in one simple workspace.
          </p>

        </div>

        {/* =================================================
            FEATURE GRID
        ================================================= */}

        <div
          className="
            mt-14 grid gap-5
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>

        {/* =================================================
            CTA
        ================================================= */}

        <div
          className="
            mt-16 overflow-hidden rounded-3xl
            bg-slate-900 px-6 py-10
            shadow-xl
            sm:px-10 sm:py-12
            lg:flex lg:items-center
            lg:justify-between lg:px-12
          "
        >

          <div className="max-w-2xl">

            <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Built for productive teams
            </p>

            <h3 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
              Ready to organize your team's work?
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-400 sm:text-base">
              Create your workspace and start managing
              projects, tasks, and team collaboration more
              efficiently.
            </p>

          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row lg:mt-0">

            <Link
              to="/register"
              className="
                inline-flex items-center justify-center
                rounded-xl bg-white px-5 py-3
                text-sm font-semibold text-slate-900
                shadow-sm
                transition
                hover:bg-slate-100
              "
            >
              Get Started
            </Link>

            <a
              href="#about"
              className="
                inline-flex items-center justify-center
                rounded-xl border border-slate-700
                px-5 py-3
                text-sm font-semibold text-white
                transition
                hover:bg-slate-800
              "
            >
              Learn More
            </a>

          </div>

        </div>

      </div>
    </section>
  );
};

export default Features;


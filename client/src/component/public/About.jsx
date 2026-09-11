
import React from "react";
import { Link } from "react-router-dom";

// =====================================================
// ABOUT SECTION
// =====================================================

const About = () => {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-28"
    >
      {/* =================================================
          BACKGROUND DECORATION
      ================================================= */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute left-0 top-20 h-72 w-72 rounded-full bg-blue-50 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-slate-100 blur-3xl" />
      </div>

      {/* =================================================
          CONTAINER
      ================================================= */}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* =================================================
            SECTION HEADER
        ================================================= */}

        <div className="mx-auto max-w-3xl text-center">

          <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600">
            About NOVA
          </span>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            A smarter way to
            <span className="text-blue-600">
              {" "}manage your team
            </span>
          </h2>

          <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
            NOVA is a modern team productivity platform designed to help
            organizations manage projects, coordinate teams, track tasks,
            and stay focused on meaningful work.
          </p>

        </div>

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <div className="mt-16 grid items-center gap-12 lg:grid-cols-2 lg:gap-20">

          {/* =================================================
              LEFT — VISUAL
          ================================================= */}

          <div className="relative">

            {/* Main Card */}

            <div className="relative rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm sm:p-7">

              {/* Dashboard Header */}

              <div className="rounded-2xl bg-white p-5 shadow-sm">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-xs font-medium text-slate-400">
                      TEAM WORKSPACE
                    </p>

                    <h3 className="mt-1 text-lg font-bold text-slate-900">
                      Project Overview
                    </h3>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-xs font-bold text-white">
                    N
                  </div>

                </div>

                {/* Progress */}

                <div className="mt-6">

                  <div className="mb-2 flex items-center justify-between">

                    <span className="text-xs font-medium text-slate-500">
                      Overall Progress
                    </span>

                    <span className="text-xs font-bold text-slate-900">
                      78%
                    </span>

                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full w-[78%] rounded-full bg-slate-900" />
                  </div>

                </div>

                {/* Mini Stats */}

                <div className="mt-6 grid grid-cols-3 gap-3">

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-lg font-bold text-slate-900">
                      24
                    </p>

                    <p className="mt-1 text-[11px] text-slate-500">
                      Tasks
                    </p>
                  </div>

                  <div className="rounded-xl bg-blue-50 p-3">
                    <p className="text-lg font-bold text-blue-600">
                      08
                    </p>

                    <p className="mt-1 text-[11px] text-blue-600">
                      Members
                    </p>
                  </div>

                  <div className="rounded-xl bg-green-50 p-3">
                    <p className="text-lg font-bold text-green-600">
                      92%
                    </p>

                    <p className="mt-1 text-[11px] text-green-600">
                      On Track
                    </p>
                  </div>

                </div>

              </div>

              {/* Activity */}

              <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm">

                <div className="flex items-center justify-between">

                  <h4 className="text-sm font-bold text-slate-900">
                    Recent Activity
                  </h4>

                  <span className="text-xs text-slate-400">
                    Today
                  </span>

                </div>

                <div className="mt-4 space-y-3">

                  <ActivityItem
                    letter="A"
                    text="Updated project progress"
                    time="10 min ago"
                  />

                  <ActivityItem
                    letter="S"
                    text="Completed a project task"
                    time="32 min ago"
                  />

                  <ActivityItem
                    letter="M"
                    text="Joined the project team"
                    time="1 hr ago"
                  />

                </div>

              </div>

            </div>

            {/* Floating Badge */}

            <div className="absolute -bottom-5 -right-4 hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-lg sm:block">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  ✓
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Work organized
                  </p>

                  <p className="text-xs text-slate-500">
                    Everything in one place
                  </p>
                </div>

              </div>

            </div>

          </div>

          {/* =================================================
              RIGHT — CONTENT
          ================================================= */}

          <div>

            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Built for productive teams
            </p>

            <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Bring your projects,
              people and progress together.
            </h3>

            <p className="mt-5 leading-7 text-slate-600">
              Managing a team should not require jumping between multiple
              disconnected tools. NOVA brings the essential parts of
              collaboration into one focused workspace.
            </p>

            {/* FEATURES */}

            <div className="mt-8 space-y-6">

              <Feature
                number="01"
                title="Centralized Projects"
                description="Create, organize and monitor projects from a single workspace."
              />

              <Feature
                number="02"
                title="Team Collaboration"
                description="Keep project owners, members and responsibilities clearly organized."
              />

              <Feature
                number="03"
                title="Task Visibility"
                description="Track work progress and make sure important tasks stay visible."
              />

              <Feature
                number="04"
                title="Useful Insights"
                description="Understand project activity and productivity through meaningful analytics."
              />

            </div>

            {/* CTA */}

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">

              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                Get Started
              </Link>

              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Contact Us
              </a>

            </div>

          </div>

        </div>

        {/* =================================================
            VALUES
        ================================================= */}

        <div className="mt-24 border-t border-slate-200 pt-16">

          <div className="grid gap-8 md:grid-cols-3">

            <ValueCard
              title="Simple"
              description="A clean workspace that helps teams focus on their work instead of complicated software."
            />

            <ValueCard
              title="Secure"
              description="Role-based access and controlled project permissions help keep your workspace protected."
            />

            <ValueCard
              title="Scalable"
              description="Designed to support growing teams, projects and organizational workflows."
            />

          </div>

        </div>

      </div>
    </section>
  );
};

// =====================================================
// ACTIVITY ITEM
// =====================================================

const ActivityItem = ({
  letter,
  text,
  time,
}) => {
  return (
    <div className="flex items-center gap-3">

      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
        {letter}
      </div>

      <div className="min-w-0 flex-1">

        <p className="truncate text-xs font-medium text-slate-700">
          {text}
        </p>

        <p className="mt-0.5 text-[10px] text-slate-400">
          {time}
        </p>

      </div>

    </div>
  );
};

// =====================================================
// FEATURE
// =====================================================

const Feature = ({
  number,
  title,
  description,
}) => {
  return (
    <div className="flex gap-4">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
        {number}
      </div>

      <div>

        <h4 className="text-base font-bold text-slate-900">
          {title}
        </h4>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          {description}
        </p>

      </div>

    </div>
  );
};

// =====================================================
// VALUE CARD
// =====================================================

const ValueCard = ({
  title,
  description,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-md">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
        ✓
      </div>

      <h3 className="mt-5 text-lg font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>

    </div>
  );
};

export default About;


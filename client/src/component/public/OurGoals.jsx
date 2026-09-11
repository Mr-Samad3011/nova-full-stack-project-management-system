
import React from "react";
import { Link } from "react-router-dom";

// =====================================================
// OUR GOALS SECTION
// =====================================================
// Public landing page section.
//
// Purpose:
// - Explain NOVA's core goals
// - Show the problems NOVA aims to solve
// - Present clear productivity values
// - Provide CTA for new users
// - Fully responsive
// - Tailwind CSS only
// =====================================================

const OurGoals = () => {
  return (
    <section
      id="goals"
      className="relative overflow-hidden bg-slate-50 py-20 sm:py-24 lg:py-28"
    >

      {/* =================================================
          BACKGROUND DECORATION
      ================================================= */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >

        <div
          className="
            absolute
            -left-32
            top-20
            h-80
            w-80
            rounded-full
            bg-blue-100/50
            blur-3xl
          "
        />

        <div
          className="
            absolute
            -right-32
            bottom-10
            h-96
            w-96
            rounded-full
            bg-slate-200/60
            blur-3xl
          "
        />

      </div>


      {/* =================================================
          CONTAINER
      ================================================= */}

      <div
        className="
          relative
          mx-auto
          max-w-7xl
          px-4
          sm:px-6
          lg:px-8
        "
      >

        {/* =================================================
            SECTION HEADER
        ================================================= */}

        <div
          className="
            mx-auto
            max-w-3xl
            text-center
          "
        >

          <span
            className="
              inline-flex
              items-center
              rounded-full
              border
              border-slate-200
              bg-white
              px-4
              py-1.5
              text-xs
              font-semibold
              uppercase
              tracking-wider
              text-slate-600
              shadow-sm
            "
          >
            Our Goals
          </span>


          <h2
            className="
              mt-5
              text-3xl
              font-bold
              tracking-tight
              text-slate-900

              sm:text-4xl

              lg:text-5xl
            "
          >
            Helping teams work
            <span className="text-blue-600">
              {" "}better together.
            </span>
          </h2>


          <p
            className="
              mt-5
              text-base
              leading-7
              text-slate-600

              sm:text-lg
              sm:leading-8
            "
          >
            NOVA is built around a simple idea: when teams have
            clarity, visibility and the right tools, they can spend
            less time managing work and more time getting meaningful
            work done.
          </p>

        </div>


        {/* =================================================
            GOALS GRID
        ================================================= */}

        <div
          className="
            mt-16
            grid
            gap-6

            sm:grid-cols-2

            lg:grid-cols-3
          "
        >

          <GoalCard
            number="01"
            title="Simplify Project Management"
            description="Make it easier to create, organize and monitor projects without unnecessary complexity."
            icon={<ProjectIcon />}
          />


          <GoalCard
            number="02"
            title="Improve Team Collaboration"
            description="Keep project owners, team members and responsibilities connected through one shared workspace."
            icon={<TeamIcon />}
          />


          <GoalCard
            number="03"
            title="Increase Productivity"
            description="Help teams prioritize important work, reduce distractions and maintain consistent progress."
            icon={<ProductivityIcon />}
          />


          <GoalCard
            number="04"
            title="Create Better Visibility"
            description="Give teams a clear view of tasks, project status, deadlines and overall progress."
            icon={<VisibilityIcon />}
          />


          <GoalCard
            number="05"
            title="Support Better Decisions"
            description="Turn project activity and performance information into useful insights for teams and managers."
            icon={<InsightIcon />}
          />


          <GoalCard
            number="06"
            title="Grow With Your Team"
            description="Provide a flexible foundation that can support teams as their projects, workflows and responsibilities grow."
            icon={<GrowthIcon />}
          />

        </div>


        {/* =================================================
            MAIN GOAL BANNER
        ================================================= */}

        <div
          className="
            mt-16
            overflow-hidden
            rounded-3xl
            bg-slate-900
            shadow-xl
          "
        >

          <div
            className="
              grid
              items-center
              gap-10
              px-6
              py-10

              sm:px-10
              sm:py-12

              lg:grid-cols-[1fr_auto]
              lg:px-14
              lg:py-14
            "
          >

            {/* CONTENT */}

            <div>

              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >

                <span
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-lg
                    bg-white/10
                    text-sm
                    font-bold
                    text-white
                  "
                >
                  N
                </span>

                <span
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    text-slate-400
                  "
                >
                  The NOVA Goal
                </span>

              </div>


              <h3
                className="
                  mt-5
                  max-w-2xl
                  text-2xl
                  font-bold
                  leading-tight
                  text-white

                  sm:text-3xl

                  lg:text-4xl
                "
              >
                Turn scattered work into
                organized progress.
              </h3>


              <p
                className="
                  mt-4
                  max-w-2xl
                  text-sm
                  leading-6
                  text-slate-400

                  sm:text-base
                  sm:leading-7
                "
              >
                From the first project idea to the final
                delivery, NOVA gives your team a clear place
                to plan, collaborate, execute and measure
                progress.
              </p>

            </div>


            {/* CTA */}

            <div
              className="
                flex
                shrink-0
                flex-col
                gap-3

                sm:flex-row

                lg:flex-col
              "
            >

              <Link
                to="/register"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-white
                  px-6
                  py-3
                  text-sm
                  font-semibold
                  text-slate-900
                  transition

                  hover:bg-slate-100

                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-white
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-slate-900
                "
              >
                Start with NOVA

                <ArrowIcon />

              </Link>


              <a
                href="#contact"
                className="
                  inline-flex
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-white/20
                  px-6
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  transition

                  hover:bg-white/10

                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-white
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-slate-900
                "
              >
                Learn More
              </a>

            </div>

          </div>

        </div>


        {/* =================================================
            BOTTOM PRINCIPLES
        ================================================= */}

        <div
          className="
            mt-16
            grid
            gap-6

            md:grid-cols-3
          "
        >

          <Principle
            title="Clarity"
            description="Everyone should understand what needs to be done, who owns it and where the project stands."
          />

          <Principle
            title="Focus"
            description="Teams should spend their energy completing meaningful work instead of managing unnecessary complexity."
          />

          <Principle
            title="Progress"
            description="Every project should provide measurable visibility into what has been completed and what comes next."
          />

        </div>

      </div>

    </section>
  );
};


// =====================================================
// GOAL CARD
// =====================================================

const GoalCard = ({
  number,
  title,
  description,
  icon,
}) => {
  return (
    <article
      className="
        group
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-6
        shadow-sm
        transition
        duration-200

        hover:-translate-y-1
        hover:border-slate-300
        hover:shadow-lg
      "
    >

      {/* TOP */}

      <div
        className="
          flex
          items-start
          justify-between
          gap-4
        "
      >

        <div
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-xl
            bg-slate-900
            text-white
            transition
            group-hover:bg-blue-600
          "
        >
          {icon}
        </div>


        <span
          className="
            text-xs
            font-bold
            tracking-wider
            text-slate-300
          "
        >
          {number}
        </span>

      </div>


      {/* CONTENT */}

      <h3
        className="
          mt-6
          text-lg
          font-bold
          text-slate-900
        "
      >
        {title}
      </h3>


      <p
        className="
          mt-2
          text-sm
          leading-6
          text-slate-500
        "
      >
        {description}
      </p>

    </article>
  );
};


// =====================================================
// PRINCIPLE
// =====================================================

const Principle = ({
  title,
  description,
}) => {
  return (
    <div
      className="
        border-l-2
        border-slate-300
        pl-5
      "
    >

      <h3
        className="
          text-base
          font-bold
          text-slate-900
        "
      >
        {title}
      </h3>

      <p
        className="
          mt-2
          text-sm
          leading-6
          text-slate-500
        "
      >
        {description}
      </p>

    </div>
  );
};


// =====================================================
// PROJECT ICON
// =====================================================

const ProjectIcon = () => (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    aria-hidden="true"
  >
    <rect
      x="3"
      y="4"
      width="18"
      height="16"
      rx="2"
    />

    <path
      strokeLinecap="round"
      d="M8 9h8M8 13h5M8 17h3"
    />
  </svg>
);


// =====================================================
// TEAM ICON
// =====================================================

const TeamIcon = () => (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"
    />

    <circle
      cx="9"
      cy="7"
      r="4"
    />

    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
    />
  </svg>
);


// =====================================================
// PRODUCTIVITY ICON
// =====================================================

const ProductivityIcon = () => (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
    />
  </svg>
);


// =====================================================
// VISIBILITY ICON
// =====================================================

const VisibilityIcon = () => (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"
    />

    <circle
      cx="12"
      cy="12"
      r="3"
    />
  </svg>
);


// =====================================================
// INSIGHT ICON
// =====================================================

const InsightIcon = () => (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 19V5M4 19h16"
    />

    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7 15l4-4 3 2 5-6"
    />

    <circle
      cx="7"
      cy="15"
      r="1"
    />

    <circle
      cx="11"
      cy="11"
      r="1"
    />

    <circle
      cx="14"
      cy="13"
      r="1"
    />

    <circle
      cx="19"
      cy="7"
      r="1"
    />
  </svg>
);


// =====================================================
// GROWTH ICON
// =====================================================

const GrowthIcon = () => (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 17l6-6 4 4 8-9"
    />

    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 6h6v6"
    />
  </svg>
);


// =====================================================
// ARROW ICON
// =====================================================

const ArrowIcon = () => (
  <svg
    className="h-4 w-4"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="
        M3.5 10a.75.75 0 01.75-.75h10.19
        l-3.22-3.22a.75.75 0 011.06-1.06l4.5
        4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75
        0 11-1.06-1.06l3.22-3.22H4.25A.75.75
        0 013.5 10z
      "
      clipRule="evenodd"
    />
  </svg>
);


export default OurGoals;


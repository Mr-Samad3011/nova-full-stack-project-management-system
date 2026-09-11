
import { Link } from "react-router-dom";


// =====================================================
// HERO SECTION
// =====================================================
// Public landing page hero section.
//
// Main goals:
// - Clearly explain NOVA
// - Strong primary CTA
// - Secondary CTA
// - Productivity-focused messaging
// - Responsive design
// - No authentication dependency
// =====================================================

const Hero = () => {

  return (

    <section
      className="
        relative overflow-hidden
        bg-white
      "
    >

      {/* =================================================
          BACKGROUND DECORATION
      ================================================= */}

      <div
        className="
          pointer-events-none
          absolute inset-0
          overflow-hidden
        "
          aria-hidden="true"
      >

        {/* TOP RIGHT */}

        <div
          className="
            absolute
            -right-24
            -top-24
            h-72
            w-72
            rounded-full
            bg-slate-100
            blur-3xl
          "
        />

        {/* BOTTOM LEFT */}

        <div
          className="
            absolute
            -bottom-32
            -left-24
            h-80
            w-80
            rounded-full
            bg-blue-50
            blur-3xl
          "
        />

        {/* GRID */}

        <div
          className="
            absolute
            inset-0
            opacity-40
          "
          style={{
            backgroundImage:
              `
                linear-gradient(
                  to right,
                  rgb(226 232 240 / 0.35) 1px,
                  transparent 1px
                ),
                linear-gradient(
                  to bottom,
                  rgb(226 232 240 / 0.35) 1px,
                  transparent 1px
                )
              `,
            backgroundSize: "48px 48px",
          }}
        />

      </div>


      {/* =================================================
          CONTENT
      ================================================= */}

      <div
        className="
          relative
          mx-auto
          max-w-7xl
          px-4
          pb-20
          pt-16
          sm:px-6
          sm:pb-24
          sm:pt-20
          lg:px-8
          lg:pb-28
          lg:pt-24
        "
      >

        <div
          className="
            grid
            items-center
            gap-12
            lg:grid-cols-2
            lg:gap-16
          "
        >

          {/* =================================================
              LEFT CONTENT
          ================================================= */}

          <div
            className="
              max-w-2xl
            "
          >

            {/* BADGE */}

            <div
              className="
                mb-6
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-slate-200
                bg-slate-50
                px-3
                py-1.5
              "
            >

              <span
                className="
                  h-2
                  w-2
                  rounded-full
                  bg-green-500
                "
                aria-hidden="true"
              />

              <span
                className="
                  text-xs
                  font-semibold
                  tracking-wide
                  text-slate-600
                "
              >
                BUILT FOR BETTER TEAMWORK
              </span>

            </div>


            {/* HEADING */}

            <h1
              className="
                text-4xl
                font-bold
                leading-tight
                tracking-tight
                text-slate-900

                sm:text-5xl
                sm:leading-tight

                lg:text-6xl
                lg:leading-[1.08]
              "
            >

              Organize work.

              <span
                className="
                  block
                  text-slate-500
                "
              >
                Empower your team.
              </span>

              <span
                className="
                  block
                  text-slate-900
                "
              >
                Deliver better.
              </span>

            </h1>


            {/* DESCRIPTION */}

            <p
              className="
                mt-6
                max-w-xl
                text-base
                leading-7
                text-slate-500

                sm:text-lg
                sm:leading-8
              "
            >
              NOVA brings projects, tasks, teams, analytics,
              and communication together in one simple
              workspace built for productive teams.
            </p>


            {/* =================================================
                CTA BUTTONS
            ================================================= */}

            <div
              className="
                mt-8
                flex
                flex-col
                gap-3

                sm:flex-row
                sm:items-center
              "
            >

              {/* PRIMARY CTA */}

              <Link
                to="/signup"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-slate-900
                  px-6
                  py-3.5
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                  transition
                  duration-200

                  hover:bg-slate-800
                  hover:shadow-md

                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-slate-500
                  focus-visible:ring-offset-2
                "
              >

                Get Started

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

              </Link>


              {/* SECONDARY CTA */}

              <Link
                to="/about"
                className="
                  inline-flex
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-6
                  py-3.5
                  text-sm
                  font-semibold
                  text-slate-700
                  transition
                  duration-200

                  hover:border-slate-300
                  hover:bg-slate-50
                  hover:text-slate-900

                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-slate-400
                  focus-visible:ring-offset-2
                "
              >
                Explore NOVA
              </Link>

            </div>


            {/* =================================================
                TRUST / SUPPORTING TEXT
            ================================================= */}

            <div
              className="
                mt-8
                flex
                flex-wrap
                items-center
                gap-x-6
                gap-y-3
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-xs
                  font-medium
                  text-slate-500
                "
              >

                <CheckIcon />

                Project Management

              </div>


              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-xs
                  font-medium
                  text-slate-500
                "
              >

                <CheckIcon />

                Team Collaboration

              </div>


              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-xs
                  font-medium
                  text-slate-500
                "
              >

                <CheckIcon />

                Real-time Insights

              </div>

            </div>

          </div>


          {/* =================================================
              RIGHT PRODUCT PREVIEW
          ================================================= */}

          <div
            className="
              relative
              mx-auto
              w-full
              max-w-xl
              lg:max-w-none
            "
          >

            {/* =================================================
                MAIN DASHBOARD CARD
            ================================================= */}

            <div
              className="
                relative
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-2xl
                shadow-slate-200/70
              "
            >

              {/* WINDOW HEADER */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  border-b
                  border-slate-100
                  px-4
                  py-3
                "
              >

                <div
                  className="
                    flex
                    items-center
                    gap-1.5
                  "
                >

                  <span
                    className="
                      h-2.5
                      w-2.5
                      rounded-full
                      bg-slate-200
                    "
                  />

                  <span
                    className="
                      h-2.5
                      w-2.5
                      rounded-full
                      bg-slate-200
                    "
                  />

                  <span
                    className="
                      h-2.5
                      w-2.5
                      rounded-full
                      bg-slate-200
                    "
                  />

                </div>


                <div
                  className="
                    rounded-md
                    bg-slate-50
                    px-3
                    py-1
                    text-[10px]
                    font-semibold
                    text-slate-400
                  "
                >
                  NOVA WORKSPACE
                </div>

              </div>


              {/* DASHBOARD BODY */}

              <div
                className="
                  grid
                  min-h-[380px]
                  grid-cols-[150px_1fr]
                  sm:min-h-[420px]
                "
              >

                {/* SIDEBAR */}

                <div
                  className="
                    hidden
                    border-r
                    border-slate-100
                    bg-slate-50/70
                    p-4
                    sm:block
                  "
                >

                  {/* MINI LOGO */}

                  <div
                    className="
                      mb-6
                      flex
                      items-center
                      gap-2
                    "
                  >

                    <div
                      className="
                        flex
                        h-7
                        w-7
                        items-center
                        justify-center
                        rounded-lg
                        bg-slate-900
                        text-[10px]
                        font-bold
                        text-white
                      "
                    >
                      N
                    </div>

                    <span
                      className="
                        text-xs
                        font-bold
                        text-slate-800
                      "
                    >
                      NOVA
                    </span>

                  </div>


                  {/* SIDEBAR ITEMS */}

                  <div className="space-y-1">

                    <MiniSidebarItem
                      label="Dashboard"
                      active
                    />

                    <MiniSidebarItem
                      label="Projects"
                    />

                    <MiniSidebarItem
                      label="Tasks"
                    />

                    <MiniSidebarItem
                      label="Team"
                    />

                    <MiniSidebarItem
                      label="Analytics"
                    />

                  </div>

                </div>


                {/* DASHBOARD CONTENT */}

                <div
                  className="
                    min-w-0
                    p-4
                    sm:p-6
                  "
                >

                  {/* DASHBOARD TITLE */}

                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      gap-4
                    "
                  >

                    <div>

                      <div
                        className="
                          h-3
                          w-28
                          rounded
                          bg-slate-200
                        "
                      />

                      <div
                        className="
                          mt-2
                          h-2
                          w-40
                          rounded
                          bg-slate-100
                        "
                      />

                    </div>


                    <div
                      className="
                        h-8
                        w-8
                        rounded-full
                        bg-slate-100
                      "
                    />

                  </div>


                  {/* STAT CARDS */}

                  <div
                    className="
                      mt-6
                      grid
                      grid-cols-2
                      gap-3
                      lg:grid-cols-3
                    "
                  >

                    <StatPreview
                      label="Projects"
                      value="12"
                    />

                    <StatPreview
                      label="Tasks"
                      value="48"
                    />

                    <StatPreview
                      label="Team"
                      value="08"
                      className="hidden lg:block"
                    />

                  </div>


                  {/* PROJECT PREVIEW */}

                  <div
                    className="
                      mt-5
                      rounded-xl
                      border
                      border-slate-100
                      bg-white
                      p-4
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                      "
                    >

                      <div
                        className="
                          h-2.5
                          w-28
                          rounded
                          bg-slate-200
                        "
                      />

                      <div
                        className="
                          rounded-full
                          bg-green-50
                          px-2.5
                          py-1
                          text-[9px]
                          font-semibold
                          text-green-600
                        "
                      >
                        ON TRACK
                      </div>

                    </div>


                    {/* PROGRESS */}

                    <div className="mt-5">

                      <div
                        className="
                          flex
                          justify-between
                          text-[9px]
                          text-slate-400
                        "
                      >

                        <span>Project progress</span>

                        <span>72%</span>

                      </div>

                      <div
                        className="
                          mt-2
                          h-2
                          overflow-hidden
                          rounded-full
                          bg-slate-100
                        "
                      >

                        <div
                          className="
                            h-full
                            w-[72%]
                            rounded-full
                            bg-slate-900
                          "
                        />

                      </div>

                    </div>


                    {/* TEAM ROWS */}

                    <div
                      className="
                        mt-5
                        space-y-3
                      "
                    >

                      <PreviewTeamRow
                        letter="A"
                        width="w-32"
                      />

                      <PreviewTeamRow
                        letter="R"
                        width="w-24"
                      />

                      <PreviewTeamRow
                        letter="S"
                        width="w-28"
                      />

                    </div>

                  </div>

                </div>

              </div>

            </div>


            {/* =================================================
                FLOATING ANALYTICS CARD
            ================================================= */}

            <div
              className="
                absolute
                -bottom-6
                -left-5
                hidden
                w-48
                rounded-xl
                border
                border-slate-200
                bg-white
                p-4
                shadow-xl
                sm:block
              "
            >

              <div
                className="
                  flex
                  items-center
                  justify-between
                "
              >

                <span
                  className="
                    text-[10px]
                    font-semibold
                    text-slate-500
                  "
                >
                  TEAM PRODUCTIVITY
                </span>

                <span
                  className="
                    text-xs
                    font-bold
                    text-green-600
                  "
                >
                  +18%
                </span>

              </div>


              <div
                className="
                  mt-4
                  flex
                  h-10
                  items-end
                  gap-1
                "
              >

                <Bar height="h-4" />

                <Bar height="h-6" />

                <Bar height="h-5" />

                <Bar height="h-8" />

                <Bar height="h-7" />

                <Bar height="h-10" />

                <Bar height="h-9" />

              </div>

            </div>


            {/* =================================================
                FLOATING STATUS CARD
            ================================================= */}

            <div
              className="
                absolute
                -right-4
                -top-5
                hidden
                rounded-xl
                border
                border-slate-200
                bg-white
                px-4
                py-3
                shadow-xl
                sm:block
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

                <div
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    bg-green-50
                  "
                >

                  <span
                    className="
                      h-2.5
                      w-2.5
                      rounded-full
                      bg-green-500
                    "
                  />

                </div>

                <div>

                  <p
                    className="
                      text-[10px]
                      font-bold
                      text-slate-800
                    "
                  >
                    Everything on track
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-[9px]
                      text-slate-400
                    "
                  >
                    Your team is productive
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          BOTTOM TRUST STRIP
      ================================================= */}

      <div
        className="
          relative
          border-t
          border-slate-100
          bg-slate-50/70
        "
      >

        <div
          className="
            mx-auto
            flex
            max-w-7xl
            flex-col
            items-center
            justify-between
            gap-3
            px-4
            py-4
            text-center

            sm:flex-row
            sm:px-6
            sm:text-left

            lg:px-8
          "
        >

          <p
            className="
              text-xs
              font-medium
              text-slate-400
            "
          >
            A focused workspace for modern teams.
          </p>


          <div
            className="
              flex
              items-center
              gap-5
              text-[10px]
              font-semibold
              uppercase
              tracking-wide
              text-slate-400
            "
          >

            <span>Projects</span>

            <span>Tasks</span>

            <span>Teams</span>

            <span>Insights</span>

          </div>

        </div>

      </div>

    </section>

  );

};


// =====================================================
// CHECK ICON
// =====================================================

const CheckIcon = () => (

  <svg
    className="
      h-4
      w-4
      shrink-0
      text-green-600
    "
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >

    <path
      fillRule="evenodd"
      d="
        M16.704 5.29a1 1 0 010 1.42l-7.2
        7.2a1 1 0 01-1.415.005l-3.5-3.4a1
        1 0 111.39-1.44l2.792 2.694 6.494-6.494
        a1 1 0 011.439.015z
      "
      clipRule="evenodd"
    />

  </svg>

);


// =====================================================
// MINI SIDEBAR ITEM
// =====================================================

const MiniSidebarItem = ({
  label,
  active = false,
}) => (

  <div
    className={`
      rounded-md
      px-2.5
      py-2
      text-[9px]
      font-medium

      ${
        active
          ? "bg-slate-900 text-white"
          : "text-slate-400"
      }
    `}
  >
    {label}
  </div>

);


// =====================================================
// STAT PREVIEW
// =====================================================

const StatPreview = ({
  label,
  value,
  className = "",
}) => (

  <div
    className={`
      rounded-xl
      border
      border-slate-100
      bg-slate-50/60
      p-3
      ${className}
    `}
  >

    <p
      className="
        text-[9px]
        font-medium
        text-slate-400
      "
    >
      {label}
    </p>

    <p
      className="
        mt-1
        text-lg
        font-bold
        text-slate-800
      "
    >
      {value}
    </p>

  </div>

);


// =====================================================
// TEAM PREVIEW ROW
// =====================================================

const PreviewTeamRow = ({
  letter,
  width,
}) => (

  <div
    className="
      flex
      items-center
      gap-3
    "
  >

    <div
      className="
        flex
        h-7
        w-7
        shrink-0
        items-center
        justify-center
        rounded-full
        bg-slate-100
        text-[9px]
        font-bold
        text-slate-600
      "
    >
      {letter}
    </div>

    <div
      className={`
        h-2
        ${width}
        rounded
        bg-slate-100
      `}
    />

    <div
      className="
        ml-auto
        h-2
        w-12
        rounded
        bg-slate-100
      "
    />

  </div>

);


// =====================================================
// BAR
// =====================================================

const Bar = ({
  height,
}) => (

  <div
    className={`
      w-3
      rounded-t
      bg-slate-300
      ${height}
    `}
  />

);


export default Hero;

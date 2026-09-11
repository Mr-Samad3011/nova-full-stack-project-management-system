
import {
  useState,
} from "react";

// =====================================================
// INITIAL FORM STATE
// =====================================================

const initialForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

// =====================================================
// CONTACT INFORMATION
// =====================================================

const contactInfo = [
  {
    title: "Email",
    value: "support@nova-team.com",
    href: "mailto:support@nova-team.com",
    description: "Send us an email anytime.",
    icon: (
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
          d="M3 7.5A2.5 2.5 0 015.5 5h13A2.5 2.5 0 0121 7.5v9a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 013 16.5v-9z"
        />

        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.5 7l8.5 6 8.5-6"
        />
      </svg>
    ),
  },

  {
    title: "Support",
    value: "Help Center",
    href: "#",
    description: "Get help with your workspace.",
    icon: (
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <circle cx="12" cy="12" r="9" />

        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.5 9a2.5 2.5 0 115 0c0 1.5-1.25 2-2.5 2.75-.75.45-1 1-1 1.75"
        />

        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 17h.01"
        />
      </svg>
    ),
  },

  {
    title: "Response Time",
    value: "Within 24 hours",
    href: null,
    description: "We aim to respond quickly.",
    icon: (
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <circle
          cx="12"
          cy="12"
          r="9"
        />

        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 7v5l3 2"
        />
      </svg>
    ),
  },
];

// =====================================================
// CONTACT INFO CARD
// =====================================================

const ContactInfoCard = ({
  title,
  value,
  href,
  description,
  icon,
}) => {
  const content = (
    <div
      className="
        group flex items-start gap-4
        rounded-2xl border border-slate-200
        bg-white p-5
        transition-all duration-300
        hover:-translate-y-0.5
        hover:border-slate-300
        hover:shadow-md
      "
    >
      {/* ICON */}

      <div
        className="
          flex h-11 w-11 shrink-0
          items-center justify-center
          rounded-xl bg-slate-100
          text-slate-700
          transition
          group-hover:bg-slate-900
          group-hover:text-white
        "
      >
        {icon}
      </div>

      {/* CONTENT */}

      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </p>

        <p className="mt-1 truncate text-sm font-bold text-slate-900">
          {value}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        className="block"
      >
        {content}
      </a>
    );
  }

  return content;
};

// =====================================================
// CONTACT
// =====================================================

const Contact = () => {
  const [form, setForm] =
    useState(initialForm);

  const [errors, setErrors] =
    useState({});

  const [status, setStatus] =
    useState({
      type: "",
      message: "",
    });

  const [submitting, setSubmitting] =
    useState(false);

  // ===================================================
  // HANDLE INPUT
  // ===================================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setStatus({
      type: "",
      message: "",
    });
  };

  // ===================================================
  // VALIDATION
  // ===================================================

  const validateForm = () => {
    const newErrors = {};

    const name =
      form.name.trim();

    const email =
      form.email.trim();

    const subject =
      form.subject.trim();

    const message =
      form.message.trim();

    if (!name) {
      newErrors.name =
        "Please enter your name.";
    } else if (name.length < 2) {
      newErrors.name =
        "Name must contain at least 2 characters.";
    }

    if (!email) {
      newErrors.email =
        "Please enter your email.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
      )
    ) {
      newErrors.email =
        "Please enter a valid email address.";
    }

    if (!subject) {
      newErrors.subject =
        "Please enter a subject.";
    } else if (subject.length < 3) {
      newErrors.subject =
        "Subject must contain at least 3 characters.";
    }

    if (!message) {
      newErrors.message =
        "Please enter your message.";
    } else if (message.length < 10) {
      newErrors.message =
        "Message must contain at least 10 characters.";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  // ===================================================
  // SUBMIT
  // ===================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setStatus({
      type: "",
      message: "",
    });

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);

      /*
       * =================================================
       * PRODUCTION BACKEND INTEGRATION
       * =================================================
       *
       * Replace this section with your API call.
       *
       * Example:
       *
       * await api.post("/contact", form);
       *
       * =================================================
       */

      await new Promise((resolve) =>
        setTimeout(resolve, 800)
      );

      setStatus({
        type: "success",
        message:
          "Your message has been received. We'll get back to you soon.",
      });

      setForm(initialForm);

      setErrors({});
    } catch (error) {
      console.error(
        "Contact Form Error:",
        error
      );

      setStatus({
        type: "error",
        message:
          "Unable to send your message right now. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <section
      id="contact"
      className="
        relative overflow-hidden
        bg-slate-50
        py-20 sm:py-24
      "
    >
      {/* =================================================
          BACKGROUND DECORATION
      ================================================= */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute
          -left-32 top-20
          h-72 w-72
          rounded-full
          bg-blue-100/40
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute
          -right-32 bottom-20
          h-72 w-72
          rounded-full
          bg-purple-100/40
          blur-3xl
        "
      />

      <div
        className="
          relative mx-auto max-w-7xl
          px-4 sm:px-6 lg:px-8
        "
      >
        {/* =================================================
            SECTION HEADER
        ================================================= */}

        <div className="mx-auto max-w-3xl text-center">

          <span
            className="
              inline-flex items-center
              rounded-full
              border border-slate-200
              bg-white
              px-3 py-1
              text-xs font-semibold
              uppercase tracking-wider
              text-slate-600
              shadow-sm
            "
          >
            Contact Us
          </span>

          <h2
            className="
              mt-5
              text-3xl font-bold
              tracking-tight text-slate-900
              sm:text-4xl lg:text-5xl
            "
          >
            Let's build a more
            <span className="block text-slate-500">
              productive workspace.
            </span>
          </h2>

          <p
            className="
              mx-auto mt-5 max-w-2xl
              text-base leading-7
              text-slate-500
              sm:text-lg
            "
          >
            Have a question, feedback, or need help
            getting started with NOVA? Send us a message
            and our team will be happy to help.
          </p>

        </div>

        {/* =================================================
            CONTACT GRID
        ================================================= */}

        <div
          className="
            mt-14 grid gap-8
            lg:grid-cols-[0.8fr_1.2fr]
            lg:items-start
          "
        >

          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <div>

            <div
              className="
                rounded-3xl
                bg-slate-900
                p-7
                shadow-xl
                sm:p-8
              "
            >

              <span
                className="
                  inline-flex
                  rounded-full
                  bg-white/10
                  px-3 py-1
                  text-xs font-semibold
                  uppercase tracking-wider
                  text-slate-300
                "
              >
                Get in touch
              </span>

              <h3
                className="
                  mt-5 text-2xl
                  font-bold text-white
                  sm:text-3xl
                "
              >
                We're here to help.
              </h3>

              <p
                className="
                  mt-4 text-sm
                  leading-6 text-slate-400
                "
              >
                Whether you're exploring NOVA,
                managing your first project, or
                building a larger team workspace,
                we're here to make your experience
                easier.
              </p>

              {/* CONTACT INFORMATION */}

              <div className="mt-8 space-y-3">

                {contactInfo.map(
                  (item) => (
                    <ContactInfoCard
                      key={item.title}
                      {...item}
                    />
                  )
                )}

              </div>

              {/* SMALL NOTE */}

              <div
                className="
                  mt-7 border-t
                  border-slate-800
                  pt-6
                "
              >
                <p className="text-xs leading-5 text-slate-500">
                  We respect your privacy and use
                  the information you provide only
                  to respond to your request.
                </p>
              </div>

            </div>

          </div>

          {/* =================================================
              RIGHT SIDE - FORM
          ================================================= */}

          <div
            className="
              rounded-3xl
              border border-slate-200
              bg-white
              p-6
              shadow-sm
              sm:p-8
            "
          >

            <div className="mb-7">

              <h3
                className="
                  text-xl font-bold
                  text-slate-900
                  sm:text-2xl
                "
              >
                Send us a message
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Fill out the form and we'll get
                back to you as soon as possible.
              </p>

            </div>

            {/* =================================================
                SUCCESS / ERROR
            ================================================= */}

            {status.message && (
              <div
                role="alert"
                className={`
                  mb-6 rounded-xl
                  border px-4 py-3
                  text-sm
                  ${
                    status.type === "success"
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }
                `}
              >
                {status.message}
              </div>
            )}

            {/* =================================================
                FORM
            ================================================= */}

            <form
              onSubmit={handleSubmit}
              noValidate
              className="space-y-5"
            >

              {/* NAME + EMAIL */}

              <div
                className="
                  grid gap-5
                  sm:grid-cols-2
                "
              >

                {/* NAME */}

                <div>

                  <label
                    htmlFor="contact-name"
                    className="
                      mb-2 block
                      text-sm font-semibold
                      text-slate-700
                    "
                  >
                    Name
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="name"
                    placeholder="Your name"
                    aria-invalid={
                      Boolean(errors.name)
                    }
                    aria-describedby={
                      errors.name
                        ? "contact-name-error"
                        : undefined
                    }
                    className={`
                      w-full rounded-xl
                      border px-4 py-3
                      text-sm text-slate-900
                      outline-none
                      transition
                      placeholder:text-slate-400
                      ${
                        errors.name
                          ? "border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                          : "border-slate-200 bg-white focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                      }
                    `}
                  />

                  {errors.name && (
                    <p
                      id="contact-name-error"
                      className="mt-1.5 text-xs text-red-600"
                    >
                      {errors.name}
                    </p>
                  )}

                </div>

                {/* EMAIL */}

                <div>

                  <label
                    htmlFor="contact-email"
                    className="
                      mb-2 block
                      text-sm font-semibold
                      text-slate-700
                    "
                  >
                    Email
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                    placeholder="you@example.com"
                    aria-invalid={
                      Boolean(errors.email)
                    }
                    aria-describedby={
                      errors.email
                        ? "contact-email-error"
                        : undefined
                    }
                    className={`
                      w-full rounded-xl
                      border px-4 py-3
                      text-sm text-slate-900
                      outline-none
                      transition
                      placeholder:text-slate-400
                      ${
                        errors.email
                          ? "border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                          : "border-slate-200 bg-white focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                      }
                    `}
                  />

                  {errors.email && (
                    <p
                      id="contact-email-error"
                      className="mt-1.5 text-xs text-red-600"
                    >
                      {errors.email}
                    </p>
                  )}

                </div>

              </div>

              {/* SUBJECT */}

              <div>

                <label
                  htmlFor="contact-subject"
                  className="
                    mb-2 block
                    text-sm font-semibold
                    text-slate-700
                  "
                >
                  Subject
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  aria-invalid={
                    Boolean(errors.subject)
                  }
                  aria-describedby={
                    errors.subject
                      ? "contact-subject-error"
                      : undefined
                  }
                  className={`
                    w-full rounded-xl
                    border px-4 py-3
                    text-sm text-slate-900
                    outline-none
                    transition
                    placeholder:text-slate-400
                    ${
                      errors.subject
                        ? "border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                        : "border-slate-200 bg-white focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    }
                  `}
                />

                {errors.subject && (
                  <p
                    id="contact-subject-error"
                    className="mt-1.5 text-xs text-red-600"
                  >
                    {errors.subject}
                  </p>
                )}

              </div>

              {/* MESSAGE */}

              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label
                    htmlFor="contact-message"
                    className="
                      text-sm font-semibold
                      text-slate-700
                    "
                  >
                    Message
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <span className="text-xs text-slate-400">
                    {form.message.length}/1000
                  </span>

                </div>

                <textarea
                  id="contact-message"
                  name="message"
                  value={form.message}
                  onChange={(event) => {
                    if (
                      event.target.value.length <=
                      1000
                    ) {
                      handleChange(event);
                    }
                  }}
                  rows={6}
                  maxLength={1000}
                  placeholder="Tell us how we can help..."
                  aria-invalid={
                    Boolean(errors.message)
                  }
                  aria-describedby={
                    errors.message
                      ? "contact-message-error"
                      : undefined
                  }
                  className={`
                    w-full resize-none
                    rounded-xl border
                    px-4 py-3
                    text-sm leading-6
                    text-slate-900
                    outline-none
                    transition
                    placeholder:text-slate-400
                    ${
                      errors.message
                        ? "border-red-300 bg-red-50/30 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                        : "border-slate-200 bg-white focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    }
                  `}
                />

                {errors.message && (
                  <p
                    id="contact-message-error"
                    className="mt-1.5 text-xs text-red-600"
                  >
                    {errors.message}
                  </p>
                )}

              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={submitting}
                className="
                  inline-flex w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-slate-900
                  px-5 py-3.5
                  text-sm font-semibold
                  text-white
                  shadow-sm
                  transition
                  hover:bg-slate-800
                  focus:outline-none
                  focus:ring-2
                  focus:ring-slate-400
                  focus:ring-offset-2
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >

                {submitting ? (
                  <>
                    <span
                      className="
                        h-4 w-4
                        animate-spin
                        rounded-full
                        border-2
                        border-white/30
                        border-t-white
                      "
                    />

                    Sending...
                  </>
                ) : (
                  <>
                    Send Message

                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </>
                )}

              </button>

              <p className="text-center text-xs leading-5 text-slate-400">
                By submitting this form, you agree
                that we may contact you regarding
                your request.
              </p>

            </form>

          </div>

        </div>

      </div>
    </section>
  );
};

export default Contact;

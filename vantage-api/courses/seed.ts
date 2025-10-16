import { ProgramModel } from "./courses.model";

export async function seedFellowshipProgram() {
  const slug = "global-banking-finance-fellowship";
  const existing = await ProgramModel.findOne({ slug }).lean();
  if (existing) return { seeded: false, reason: "already exists" } as const;

  const seed = {
    programId: slug,
    kind: "fellowship",
    slug,
    title: "Investment Banking Fellowship",
    subtitle:
      "Investment Banking | Venture Capital | Wealth & Private Banking | Credit & Risk",
    description:
      "Taught by the leaders who shaped trillion-dollar finance. Led by MDs and CEOs from top investment banks, wealth firms, and VC funds, this fellowship gives a select cohort a closed-door view of how leaders think & strategize in ESG, fintech, credit, private banking, & risk, while building the networks & edge to break into the most competitive roles in finance.",
    tags: [
      "investment banking",
      "venture capital",
      "wealth",
      "private banking",
      "credit",
      "risk",
      "fellowship",
    ],
    pricing: { currency: "USD", tuition: 200, taxesIncluded: true },
    mode: "hybrid" as const,
    location: "Remote + Onsite Sessions",
    sections: {
      // Keep keys exactly as in the page and in the same order
      navbar: { enabled: true },
      hero: {
        heading: "Investment Banking Fellowship",
        subheading: "Taught by the leaders who shaped trillion-dollar finance",
        cta: {
          primaryLabel: "Apply Now",
          primaryUrl: "/apply",
          secondaryLabel: "Learn More",
          secondaryUrl: "/fellowships",
        },
      },
      courseInfo: {
        summary:
          "Step Into the Fellowship — Led by MDs and CEOs from top investment banks, wealth firms, and VC funds, this fellowship gives a select cohort a closed-door view of how leaders think & strategize in ESG, fintech, credit, private banking, & risk.",
        outcomes: [
          "Starts On: 27th October 2025",
          "Duration: 02 Weeks",
          "Eligibility: Final-year students, postgraduates, & young professionals",
          "Price: US$200 (All inclusive)",
        ],
        modules: [
          {
            id: "m1",
            title: "Week 1 — Core Finance, Modelling & Markets",
            weeks: 1,
            topics: [
              "Inside an Investment Bank (Syed Raza — Ex MD & CEO, Barclays)",
              "Corporate Finance & Valuation Fundamentals (Rakesh Kripalini — MD, LGT Wealth India)",
              "Financial Modelling Basics (JF Coppenolle — Investment Director, Abeille Assurances)",
              "Capital Markets Overview (Sandeep Das — MD & CEO, Centrum Wealth)",
              "Risk, Regulation & Ethics (Syed Raza — Ex MD & CEO, Barclays)",
            ],
          },
          {
            id: "m2",
            title: "Week 2 — Inside the Fellowship: A Day-to-Day Experience",
            weeks: 1,
            topics: [
              "Deep dives with leaders across IB, Wealth, VC, Credit & Risk",
              "Peer collaboration, mentor feedback, and live case discussions",
            ],
          },
        ],
      },
      overview: {
        title: "Vantage Community",
        paragraphs: [
          "Join a select global network of finance enthusiasts.",
          "Build lasting connections, collaborate across borders, and grow through exclusive events and learning sessions hosted year-round.",
        ],
      },
      learningHighlights: {
        title: "Learning Highlights",
        highlights: [
          {
            id: "h1",
            label: "IB Foundations",
            value:
              "Understand global banking operations, financial modeling, and capital management in global markets.",
          },
          {
            id: "h2",
            label: "Deal Dynamics",
            value:
              "Gain practical deal experience, craft winning pitchbooks, and prepare for global finance careers.",
          },
          {
            id: "h3",
            label: "Global Banking & Wealth",
            value:
              "Master private banking, lending, markets, and core investment banking fundamentals.",
          },
          {
            id: "h4",
            label: "Career Acceleration",
            value:
              "CV reviews, LinkedIn optimisation, recruiter-led mock interviews, & peer network.",
          },
        ],
      },
      programDirector: {
        name: "Syed Raza",
        title:
          "Co-founder & Lead Instructor; Former C-level Managing Director, Barclays",
        bio: "Commanded a $1T balance sheet at Barclays; FT Top 100 Banking Executives; architected industry-leading Early Career Programme.",
      },
      mentors: {
        mentors: [
          { id: "m-sr", name: "Syed Raza", title: "Ex MD & CEO, Barclays" },
          {
            id: "m-rk",
            name: "Rakesh Kripalini",
            title: "MD, LGT Wealth India",
          },
          {
            id: "m-jf",
            name: "JF Coppenolle",
            title: "Investment Director, Abeille Assurances",
          },
          {
            id: "m-sd",
            name: "Sandeep Das",
            title: "MD & CEO, Centrum Wealth",
          },
        ],
      },
      threeStep: {
        steps: [
          {
            id: "s1",
            title: "Apply",
            description: "Submit your application",
          },
          {
            id: "s2",
            title: "Interview",
            description: "Interaction to assess fit",
          },
          {
            id: "s3",
            title: "Join Us",
            description: "Receive decision & secure your spot",
          },
        ],
      },
      builtFor: {
        audience: [
          {
            id: "a1",
            title: "Undergraduate and Recent Graduates",
            description:
              "Gain exposure to industry leaders and understand how global finance operates.",
          },
          {
            id: "a2",
            title: "Postgraduate Students",
            description:
              "Transform academic expertise into real-world perspective through direct engagement with CXOs.",
          },
          {
            id: "a3",
            title: "Young Professionals",
            description:
              "Move beyond entry-level work and accelerate into high-impact roles by learning from executives.",
          },
        ],
      },
      admissionScholarshipFees: {
        startDate: "2025-10-27",
        durationWeeks: 2,
        pricing: { currency: "USD", tuition: 200, taxesIncluded: true },
        scholarship: {
          available: true,
          description:
            "Up to 20% tuition support for outstanding candidates and those from underrepresented backgrounds.",
        },
        applicationDeadline: "2025-09-25",
      },
      certificate: {
        title: "Stand out with the Vantage Certificate",
        description:
          "Elevate your profile with a recruiter-reviewed resume, LinkedIn optimisation, and a mock interview from an investment banking recruiter.",
      },
      callToAction: { primaryLabel: "Apply Now", primaryUrl: "/apply" },
      faq: {
        items: [
          { id: "q1", question: "What is the duration?", answer: "Two weeks." },
          {
            id: "q2",
            question: "Who is eligible?",
            answer:
              "Final-year students, postgraduates, and young professionals.",
          },
          {
            id: "q3",
            question: "What will I learn?",
            answer:
              "Foundational IB knowledge, deal dynamics, global banking & wealth, and career acceleration.",
          },
          {
            id: "q4",
            question: "Any prerequisites?",
            answer: "No strict prerequisites; curiosity and drive recommended.",
          },
          {
            id: "q5",
            question: "What support will I receive?",
            answer:
              "Mentorship from leaders, recruiter feedback, peer network, and community events.",
          },
        ],
      },
      footer: { enabled: true },
    },
  };

  const created = await ProgramModel.create(seed);
  return { seeded: true, id: created._id } as const;
}

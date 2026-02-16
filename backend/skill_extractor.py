DATA_ANALYST_SKILLS = [
    "sql",
    "python",
    "r",

    "pandas",
    "numpy",

    "statistics",
    "probability",
    "hypothesis testing",
    "regression",
    "a/b testing",

    "excel",
    "power bi",
    "tableau",
    "matplotlib",
    "seaborn",

    "data cleaning",
    "data wrangling",
    "data preprocessing",

    "business analysis",
    "kpi",
    "dashboard",
    "reporting",

    "mysql",
    "postgresql"
]


UIUX_SKILLS = [

    "figma",
    "adobe xd",
    "sketch",
    "invision",
    "zeplin",

    "user research",
    "user interviews",
    "usability testing",
    "persona creation",
    "user journey",
    "information architecture",

    "ui design",
    "visual design",
    "layout design",
    "color theory",
    "typography",

    "wireframing",
    "low fidelity wireframes",
    "high fidelity wireframes",
    "prototyping",
    "interactive prototypes",

    "ux design",
    "design thinking",
    "human centered design",
    "accessibility",
    "wcag",

    "design system",
    "component library",
    "style guide",

    "developer handoff",
    "design documentation",
    "agile",
    "scrum",

    "html",
    "css",
    "responsive design",

    "hotjar",
    "maze",
    "user testing",

    "case study",
    "portfolio",
    "storytelling"
]


def extract_skills(text):
    text = text.lower()
    found_skills = []

    for skill in DATA_ANALYST_SKILLS + UIUX_SKILLS:
        if skill in text:
            found_skills.append(skill)

    return list(set(found_skills))

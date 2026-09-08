export const metadata = {
    title: "Organization Structure — Committee, Leadership & Batch Reps | Biddyasetu",
    description:
        "Explore the full governing structure of Biddyasetu: Executive Leadership, Secretariat, Executive Members, and Batch Representatives from SSC batches of Adarsha High School, Kaitola.",

    keywords: [
        "Biddyasetu committee",
        "alumni organization structure",
        "executive committee Bangladesh",
        "school alumni leadership",
        "Adarsha High School committee",
        "batch representatives",
        "Biddyasetu secretariat",
        "alumni organization Bangladesh",
    ],

    openGraph: {
        title: "Organization Structure — Biddyasetu Committee & Leadership",
        description:
            "Meet the Executive Committee, Secretariat, and Batch Representatives of Biddyasetu — the alumni organization of Adarsha High School, Kaitola.",
        url: "https://biddyasetu.org/structure",
        type: "website",
        images: [{ url: "/logo.png", width: 1200, height: 630, alt: "Biddyasetu Organization Structure" }],
    },

    twitter: {
        card: "summary_large_image",
        title: "Biddyasetu — Organization Structure & Leadership",
        description:
            "Executive committee, secretaries, members, and batch representatives of Biddyasetu alumni organization.",
        images: ["/logo.png"],
    },
};

export default function StructureLayout({ children }) {
    return <>{children}</>;
}

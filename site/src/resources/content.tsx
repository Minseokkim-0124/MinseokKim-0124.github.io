import { About, Blog, Gallery, Home, Newsletter, Person, Social, Work } from "@/types";
import { Introduction } from "@/components/academic/Introduction";
import cv from "./cv.json";
import photos from "./gallery.json";

const person: Person = {
  firstName: "Minseok",
  lastName: "Kim",
  name: "Minseok Kim",
  role: "Computer Vision Researcher",
  avatar: "/assets/profile-new.jpg",
  email: "alstjrx1x1@kaist.ac.kr",
  location: "Asia/Seoul",
  languages: ["Korean", "English"],
  locale: "en",
};
const social: Social = [
  { name: "Email", icon: "email", link: "mailto:alstjrx1x1@kaist.ac.kr", essential: true },
  { name: "Google Scholar", icon: "book", link: "https://scholar.google.com/citations?user=74B4XPgAAAAJ", essential: true },
  { name: "GitHub", icon: "github", link: "https://github.com/Minseokkim-0124/", essential: true },
];
const home: Home = {
  path: "/",
  label: "Home",
  title: "Minseok Kim — Computer Vision Researcher",
  description:
    "Ph.D. candidate at KAIST VILAB. Research in multimodal AI, 3D understanding, egocentric intelligence, and audio-visual generation for AR/VR and wearable devices.",
  image: "/assets/profile-new.jpg",
  headline: <>Minseok Kim</>,
  featured: { display: false, title: "", href: "/publications/" },
  subline: <>Computer Vision Researcher</>,
};
const about: About = {
  path: "/about",
  label: "About",
  title: "About Minseok",
  description: home.description,
  tableOfContent: { display: false, subItems: false },
  avatar: { display: true },
  calendar: { display: false, link: "" },
  intro: { display: true, title: "Introduction", description: <Introduction /> },
  work: {
    display: true,
    title: "Experience",
    experiences: cv.sections.Experience.map((item) => ({
      company: item.company,
      role: item.position,
      timeframe: `${item.start_date} – ${item.end_date}`,
      achievements: item.highlights,
      images: [],
    })),
  },
  studies: {
    display: true,
    title: "Education",
    institutions: cv.sections.Education.map((item) => ({
      name: item.institution,
      description: (
        <>
          {item.studyType} in {item.area}
          <br />
          {item.start_date} – {item.end_date} · {item.highlights.join(" · ")}
        </>
      ),
    })),
  },
  technical: {
    display: true,
    title: "Beyond research",
    skills: [
      {
        title: "A little about me",
        description: (
          <>
            My background is in mechanical engineering. I completed my bachelor’s degree at Hanyang University and my master’s degree at KAIST, where
            I am now pursuing my Ph.D. at VILAB. Outside research, I enjoy playing electric guitar, taking photographs, and working out. My{" "}
            <a href="/gallery/">gallery</a> collects moments from travels and everyday life.
          </>
        ),
        tags: [{ name: "Electric guitar" }, { name: "Photography" }, { name: "Working out" }],
        images: [],
      },
    ],
  },
};
const work: Work = {
  path: "/work",
  label: "Projects",
  title: "Research projects",
  description: "Robotics and autonomous systems projects by Minseok Kim at KAIST.",
};
const blog: Blog = { path: "/blog", label: "Blog", title: "Blog", description: "" };
const gallery: Gallery = {
  path: "/gallery",
  label: "Gallery",
  title: "Through my lens",
  description: "Photographs from travels and everyday life.",
  images: photos.map((p) => ({ ...p, orientation: p.width > p.height ? "horizontal" : "vertical" })),
};
const newsletter: Newsletter = { display: false, title: "", description: "" };
export { person, social, home, about, work, blog, gallery, newsletter };

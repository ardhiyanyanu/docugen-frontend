import { Footer } from "@/components/footer";
import { LandingPageHeader } from "@/components/landing-page-header";

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingPageHeader
        items={[
          { title: "Home", href: "/" },
          { title: "Features", href: "/#features" },
          { title: "Github", href: "https://github.com/ardhiyanyanu/docugen", external: true },
        ]}
      />
      <main className="flex-1">{props.children}</main>
      <Footer
        builtBy="Ardhiyan Syahrullah"
        builtByLink="https://ardhiyan.site/"
        githubLink="https://github.com/ardhiyanyanu/docugen"
        twitterLink="https://twitter.com/ardhiyanyanu"
        linkedinLink="https://www.linkedin.com/in/ardhiyanyanu/"
      />
    </div>
  );
}

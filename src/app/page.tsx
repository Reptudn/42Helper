import Card from "@/components/Card";
import { Project } from "@/types/projects";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Hello Next.js + Tailwind 👋</h1>
      <p className="text-gray-600 mt-2">Your clean project is ready.</p>
      <Card
        projectTitle="My Project"
        description="This is a description of my project."
        tags={[Project.CPP_04, Project.TRANSCENDENCE, Project.MINISHELL]}
        userImageUrl="https://via.placeholder.com/150"
        intraName="John Doe"
      />
    </main>
  );
}

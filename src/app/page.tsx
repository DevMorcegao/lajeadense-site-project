import HomeContent from "@/components/HomeContent";
import { InstagramFeed } from "@/components/portfolio/InstagramFeed";

// Configura revalidação estática incremental (ISR) de 3 horas para a página Home
export const revalidate = 10800;

export default function Home() {
  return (
    <HomeContent>
      <InstagramFeed />
    </HomeContent>
  );
}

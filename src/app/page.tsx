import { client } from "@/lib/sanity";
import HomeContent from "@/components/HomeContent";
import { InstagramFeed } from "@/components/portfolio/InstagramFeed";

// Configura revalidação estática incremental (ISR) de 3 horas para a página Home
export const revalidate = 10800;

export default async function Home() {
  let homeImages = null;
  try {
    homeImages = await client.fetch(`*[_type == "homeImages"][0]`);
  } catch (error) {
    console.error("Erro ao buscar imagens da Home no Sanity:", error);
  }

  return (
    <HomeContent homeImages={homeImages}>
      <InstagramFeed />
    </HomeContent>
  );
}

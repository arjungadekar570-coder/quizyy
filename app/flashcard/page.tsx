import FlashcardClient, { type FlashcardItem } from "./FlashcardClient";

interface Props {
  searchParams: Promise<{ data?: string }>;
}

export default async function FlashcardPage({ searchParams }: Props) {
  const params = await searchParams;
  let flashcards: FlashcardItem[] | null = null;

  if (params.data) {
    try {
      flashcards = JSON.parse(
        decodeURIComponent(params.data)
      ) as FlashcardItem[];
    } catch {
      // Malformed data — fall through to mock
    }
  }

  return <FlashcardClient flashcards={flashcards} />;
}

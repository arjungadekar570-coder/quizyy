import QuizClient, { type QuizItem } from "./QuizClient";

interface Props {
  searchParams: Promise<{ data?: string }>;
}

export default async function QuizPage({ searchParams }: Props) {
  const params = await searchParams;
  let questions: QuizItem[] | null = null;

  if (params.data) {
    try {
      questions = JSON.parse(decodeURIComponent(params.data)) as QuizItem[];
    } catch {
      // Malformed data — fall through to mock
    }
  }

  return <QuizClient questions={questions} />;
}

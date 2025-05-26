import { Question } from "./NewForm";
import QuestionItem from "./QuestionItem";

type QuestionsListProps = {
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
};

export default function QuestionsList({ questions, setQuestions }: QuestionsListProps) {
  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        text: "",
        type: "text",
        isRequired: false,
        choices: [],
      },
    ]);
  };

  const removeQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Questions</h2>
      {questions.length === 0 && (
        <p className="text-gray-500 mb-6 italic">No questions added yet.</p>
      )}
      {questions.map((q, i) => (
        <QuestionItem
          key={q.id}
          question={q}
          index={i}
          removeQuestion={removeQuestion}
          setQuestions={setQuestions}
        />
      ))}
      <button
        type="button"
        onClick={addQuestion}
        className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
      >
        + Add Question
      </button>
    </section>
  );
}

import { Question, Choice } from "./NewForm";

type ChoicesListProps = {
  question: Question;
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
};

export default function ChoicesList({ question, setQuestions }: ChoicesListProps) {
  const addChoice = () => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === question.id
          ? {
              ...q,
              choices: [...q.choices, { id: crypto.randomUUID(), text: "" }],
            }
          : q
      )
    );
  };

  const removeChoice = (choiceId: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === question.id
          ? { ...q, choices: q.choices.filter((c) => c.id !== choiceId) }
          : q
      )
    );
  };

  const updateChoiceText = (choiceId: string, text: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === question.id
          ? {
              ...q,
              choices: q.choices.map((c) =>
                c.id === choiceId ? { ...c, text } : c
              ),
            }
          : q
      )
    );
  };

  return (
    <div className="pl-4 border-l-4 border-blue-400 bg-blue-50 rounded-md p-4">
      <label className="block font-semibold mb-3 text-blue-700">Choices</label>
      {question.choices.map((c, ci) => (
        <div key={c.id} className="flex items-center space-x-3 mb-3">
          <input
            type="text"
            placeholder={`Choice #${ci + 1}`}
            value={c.text}
            onChange={(e) => updateChoiceText(c.id, e.target.value)}
            required
            className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <button
            type="button"
            onClick={() => removeChoice(c.id)}
            className="text-red-600 hover:text-red-800 font-bold text-2xl leading-none"
            aria-label="Remove choice"
          >
            &times;
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addChoice}
        className="text-blue-600 font-semibold hover:underline"
      >
        + Add Choice
      </button>
    </div>
  );
}

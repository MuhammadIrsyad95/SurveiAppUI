import { Question } from "./NewForm";
import ChoicesList from "./ChoicesList";

type QuestionItemProps = {
  question: Question;
  index: number;
  removeQuestion: (id: string) => void;
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
};

export default function QuestionItem({ question, index, removeQuestion, setQuestions }: QuestionItemProps) {
  const updateQuestion = (updatedQuestion: Question) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q))
    );
  };

  return (
    <div className="border border-gray-300 rounded-lg p-6 mb-6 relative bg-gray-50 hover:shadow-lg transition-shadow">
      <button
        type="button"
        onClick={() => removeQuestion(question.id)}
        className="absolute top-3 right-3 text-red-600 text-xl font-bold hover:text-red-800"
        aria-label="Remove question"
      >
        &times;
      </button>
      <label className="block font-medium text-gray-700 mb-2">
        Question #{index + 1} <span className="text-red-600">*</span>
      </label>
      <input
        type="text"
        placeholder="Type your question here"
        value={question.text}
        onChange={(e) =>
          updateQuestion({ ...question, text: e.target.value })
        }
        required
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition mb-4"
      />
      <label className="block font-medium text-gray-700 mb-1">Question Type</label>
      <select
        className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        value={question.type}
        onChange={(e) => {
          const newType = e.target.value as Question["type"];
          updateQuestion({
            ...question,
            type: newType,
            choices:
              newType === "multiple-choice"
                ? question.choices.length > 0
                  ? question.choices
                  : [{ id: crypto.randomUUID(), text: "" }]
                : [],
          });
        }}
      >
        <option value="text">Text</option>
        <option value="multiple-choice">Multiple Choice</option>
      </select>
      <label className="inline-flex items-center mb-4">
        <input
          type="checkbox"
          checked={question.isRequired}
          onChange={(e) =>
            updateQuestion({ ...question, isRequired: e.target.checked })
          }
          className="mr-2"
        />
        <span className="text-gray-700">Required</span>
      </label>
      {question.type === "multiple-choice" && (
        <ChoicesList question={question} setQuestions={setQuestions} />
      )}
    </div>
  );
}

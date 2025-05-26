type FormHeaderProps = {
  title: string;
  description: string;
  setTitle: (value: string) => void;
  setDescription: (value: string) => void;
};

export default function FormHeader({ title, description, setTitle, setDescription }: FormHeaderProps) {
  return (
    <>
      <section>
        <label htmlFor="title" className="block text-lg font-medium text-gray-700 mb-2">
          Form Title <span className="text-red-600">*</span>
        </label>
        <input
          id="title"
          type="text"
          placeholder="Enter your form title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
      </section>
      <section>
        <label htmlFor="description" className="block text-lg font-medium text-gray-700 mb-2 mt-6">
          Description (optional)
        </label>
        <textarea
          id="description"
          placeholder="Describe your form"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
        />
      </section>
    </>
  );
}

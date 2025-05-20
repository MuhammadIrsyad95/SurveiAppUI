export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-4 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
        <div className="w-full md:w-auto text-center md:text-left mb-2 md:mb-0">
          Survey Form App © {new Date().getFullYear()} - Kalventis. Hak cipta dilindungi undang-undang.
        </div>
        <div className="w-full md:w-auto text-center md:text-right">
          Version 1.1
        </div>
      </div>
    </footer>
  );
}

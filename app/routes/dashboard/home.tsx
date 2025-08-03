function Home() {
  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-lg w-full text-center space-y-6">
        <h1 className="text-3xl font-bold text-blue-700">
          Welcome to Vocabulary Dashboard
        </h1>
        <p className="text-gray-600">
          Manage your vocabulary list, add new words, and keep track of
          everything easily.
        </p>
      </div>
    </div>
  );
}

export default Home;

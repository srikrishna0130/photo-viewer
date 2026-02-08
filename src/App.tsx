/**
 * Main App Component
 * 
 * Entry point for the Photo Viewer application
 * Manages overall layout and state coordination
 */
function App(): JSX.Element {
  return (
    <div className="flex h-screen w-full bg-gray-100">
      <header className="absolute top-0 left-0 right-0 bg-white shadow-sm p-4 z-10">
        <h1 className="text-2xl font-bold text-gray-800">Photo Viewer</h1>
        <p className="text-sm text-gray-600 mt-1">
          Select a folder to get started
        </p>
      </header>

      <main className="flex w-full pt-20">
        <div className="flex items-center justify-center w-full">
          <div className="text-center">
            <div className="text-6xl mb-4">📁</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              No Folder Selected
            </h2>
            <p className="text-gray-500 mb-4">
              Click the button below to select a folder with photos
            </p>
            <button
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => alert('File System Access API integration coming next!')}
            >
              Select Folder
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

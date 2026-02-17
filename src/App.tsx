import Header from "@/components/Header/Header";
import CameraFeed from "@/components/camera/CameraFeed";
import InstructionsPanel from "@/components/InstructionsPanel/InstructionsPanel";

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex flex-1 items-center justify-center px-4 pb-8">
        <div className="flex w-full max-w-3xl flex-col items-center gap-4">
          <InstructionsPanel />
          <CameraFeed />
        </div>
      </main>
    </div>
  );
}

export default App;

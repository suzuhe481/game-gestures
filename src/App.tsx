import Header from "@/components/Header";
import CameraFeed from "@/components/camera/CameraFeed";

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex flex-1 items-center justify-center px-4 pb-8">
        <CameraFeed />
      </main>
    </div>
  );
}

export default App;

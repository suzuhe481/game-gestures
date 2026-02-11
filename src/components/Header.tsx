import EffectSelector from "@/components/EffectSelector";

function Header() {
  return (
    <header className="flex w-full flex-wrap items-center justify-between gap-3 px-6 py-4">
      <h1 className="text-2xl font-bold tracking-tight text-gg-accent">
        Game Gestures
      </h1>
      <EffectSelector />
    </header>
  );
}

export default Header;

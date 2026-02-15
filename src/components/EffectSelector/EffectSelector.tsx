import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffectsStore } from "@/store/effects-store";

function EffectSelector() {
  const effects = useEffectsStore((s) => s.effects);
  const selectedEffectId = useEffectsStore((s) => s.selectedEffectId);
  const selectEffect = useEffectsStore((s) => s.selectEffect);

  return (
    <div className="flex items-center gap-3">
      <label
        htmlFor="effect-select"
        className="text-sm text-gg-text-secondary whitespace-nowrap"
      >
        Effect
      </label>
      <Select value={selectedEffectId} onValueChange={selectEffect}>
        <SelectTrigger className="w-65" id="effect-select">
          <SelectValue placeholder="Select an effect" />
        </SelectTrigger>
        <SelectContent>
          {effects.map((effect) => (
            <SelectItem key={effect.id} value={effect.id}>
              {effect.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default EffectSelector;

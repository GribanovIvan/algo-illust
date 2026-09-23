// initial animation delay: the "8" item the speed list shows as selected
export const DEFAULT_DELAY = 3600 / 9;

type ParamsProps = {
    setIllustDelay: (delay: number) => void;
    disabled?: boolean;
    setVariant: (variant: number) => void;
}

const Params = ({setIllustDelay, setVariant, disabled}: ParamsProps) => {
  return (
    <>
      <label htmlFor="illustSpeed">Speed:</label>
        <select
          id="illustSpeed"
          disabled={disabled}
          name="illustSpeed"
          defaultValue={DEFAULT_DELAY}
          title="Animation speed"
          onChange={(e) => setIllustDelay(parseInt(e.target.value))}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={3600 / (i + 2)}>{i + 1}</option>
          ))}
          <option value={40}>extreme</option>
        </select>
        <label htmlFor="variant">Var:</label>
        <select
          id="variant"
          disabled={disabled}
          name="variant"
          defaultValue={0}
          onChange={(e) => setVariant(parseInt(e.target.value))}
        >
          {Array.from({ length: 18 }, (_, i) => (
            <option key={i} value={i}>{i === 0 ? "rand" : i}</option>
          ))}
        </select>
    </>
  )
};

export default Params;
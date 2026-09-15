import './Form.module.scss';

export const MIN_LENGTH = 2;
// larger arrays freeze the tab while being generated
export const MAX_LENGTH = 100000;

const SizeForm = ({onLengthSubmit}: {onLengthSubmit:  (length: number) => void}) => {
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const length = parseInt(data.get('arrayLength')?.toString() || '0');
    if (length >= MIN_LENGTH && length <= MAX_LENGTH) onLengthSubmit(length);
  }

  return (
    <form onSubmit={onSubmit}>
      <span>
        <label htmlFor="arrayLength">Array Length:</label>
        <input
          id="arrayLength"
          name="arrayLength"
          placeholder="length"
          type={"number"}
          defaultValue="10"
          min={MIN_LENGTH}
          max={MAX_LENGTH}
        />
      </span>
      <input type="submit" value="Run" title="Start" />
    </form>
  )
}

export default SizeForm;
import './Form.scss';

const SizeForm = ({onLengthSubmit}: {onLengthSubmit:  (length: number) => void}) => {
  // TODO: make function to extract number from input
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const length = parseInt(data.get('arrayLength')?.toString() || '0');
    onLengthSubmit(length);
  }

  return (
    <form onSubmit={onSubmit}>
      <span>
        <label htmlFor="arrayLength">Array Length:</label>
        <input
          name="arrayLength"
          id="arrayLength"
          placeholder="length"
          type={"number"}
          defaultValue="10"
          min={2}
        />
      </span>
      <input type="submit" value="Run" title="Start" />
    </form>
  )
}

export default SizeForm;
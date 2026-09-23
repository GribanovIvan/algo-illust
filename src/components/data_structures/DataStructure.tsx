import { useOutletContext } from 'react-router-dom';
import { DSTypeId, OutletContextDS } from '../../utils/types/ds.types';
import styles from "./DS.module.scss";

const DataStructure = () => {
  const [arrayState, DSType, statsState]: OutletContextDS = useOutletContext();
  const [array, setArray] = arrayState;
  const [stats, setStats] = statsState;
  
  const deleteElement = (index: number) => {
    if(canDelete(DSType, index, array.length)) {
      const newArray = [...array];
      newArray.splice(index, 1);
      setArray(newArray);
      setStats(null);
    }
  }

  return (
    <div className={isStackLike(DSType) ? styles['stack-like'] : styles['list-like']}>
    {array.map((value, i) => (
      <div data-value={value} key={i} 
        className={`
          ${DSStyles[DSType](i, array.length)} 
          ${stats && 
            (stats.foundIndex === i ? styles.found : '') + ' ' +
            (stats.min === value ? styles.min : 
              stats.max === value ? styles.max : 
               '')}`}
        onClick={() => deleteElement(i)}
      ></div>
    ))}
  </div>
  )
};

export default DataStructure;

const isStackLike = (type: DSTypeId) => type === 'deque' || type === 'stack' || type === 'queue';

const DSStyles = {
  'stack': (i: number, length: number) => 
    (i === length - 1) ? styles.deletable : '',

  'queue': (i: number) => 
    (i === 0) ? styles.deletable : '',

  'deque': (i: number, length: number) => 
    (i === 0 || i === length - 1) ? styles.deletable : '',

  'linked-list': (i: number, length: number) => 
    `${styles.deletable} ${(i === length - 1) ? styles.null : ''}`,

  'doubly-linked': (i: number, length: number) => 
    `${styles.deletable} ${styles['doubly-list-item']} ${(i === length - 1) ? styles.null : ''}`,

  'circular-linked': (i: number) => 
    `${styles.deletable} ${(i === 0) ? styles['circular-arrow'] : ''}`,

  'tree': (i: number, length: number) =>
    `${styles.deletable} ${(i === length - 1) ? styles.null : ''}`,
}

const canDelete = (type: DSTypeId, index: number, length: number) => { 
  switch (type) {
    case 'stack':
      return index === length - 1;
    case 'queue':
      return index === 0;
    case 'deque':
      return index === 0 || index === length - 1;
    default:
      return true;
  }
}
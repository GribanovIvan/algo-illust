import { HighlightedElements, SortArray } from '../../utils/types/sort.types';
import styles from './Graph.module.scss';

const Graph = ({ array, swaps } : {array: SortArray, swaps: HighlightedElements}) => {
  const scale = Math.max(100, ...array.filter((item): item is number => typeof item === "number").map(Math.abs));
  const activeColor = "#33c267";
  return (
    <div className={styles.illustration} style={{gap: (array.length >= 40) ? ".1rem" : "1rem"}}>
      { !Array.isArray(array[0]) ? 
      array.map((item, index) =>
        <div key={index} 
            className={`${styles.arrayItem} ${swaps?.sorted && styles.sorted}`} 
            style={{ width: 100 / array.length + '%', height: ((typeof item === 'number') ? Math.max(1, Math.abs(item) / scale * 100) : 80).toString() + '%' }}>
          <div
            className={`
              ${styles.rectangle} 
              ${swaps?.green && swaps.green.includes(index) && styles.green} 
              ${swaps?.orange && swaps.orange.includes(index) && styles.orange}
            `}
            style={swaps?.sorted ? { transitionDelay: (array.length >= 40) ? `${index*0.005}s` : `${index*0.07}s`, backgroundColor: activeColor}: {}}
            >
          </div>{array.length <= 40 ? item : null}
        </div>
      ) : null}
    </div>
  )
}

export default Graph;
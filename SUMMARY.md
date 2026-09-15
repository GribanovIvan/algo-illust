# SUMMARY.md

## Змінені та створені файли

**Змінені:** `src/App.tsx`, `src/index.tsx`, `src/utils/sorts/sorts.ts`, `src/utils/sorts/benchmark.worker.ts`, `src/utils/types/sort.types.ts`, `src/components/navigations/SortNavBar.tsx`, `src/components/sorts/SortsTable.tsx`, `src/pages/SortPage.tsx`, `src/pages/Home.tsx`, `src/pages/SearchPage.tsx`, `src/pages/DataStructuresPage.tsx`, `src/hooks/useFocus.ts`, `src/utils/workerBuilder.ts`, `src/components/Form.module.scss`, `.gitignore`, `package.json`, `tsconfig.json`

**Створені:** `src/components/CustomArrayForm.tsx`, `vite.config.ts`, `index.html` (root), `.eslintrc.json`, `jest.config.cjs`, `src/vite-env.d.ts`, `src/setupTests.ts`, `src/__mocks__/fileMock.ts`, `src/__tests__/sorts.test.ts`, `src/__tests__/utils.test.ts`, `src/__tests__/CustomArrayForm.test.tsx`, `src/__tests__/dataStructures.test.ts`, `src/__tests__/searches.test.ts`, `метрики-до.txt`, `метрики-після.txt`

**Видалені:** `src/react-app-env.d.ts`, `public/index.html` (замінений root `index.html`)

## Ключові рішення

1. **Глобальний стан → замикання.** `STEPS` та `IS_ASC` у `sorts.ts` були модульними змінними, що ламали паралельні виклики. Перенесені всередину кожної функції-сортування через замикання.
2. **Vite замість CRA.** `base: './'` у `vite.config.ts` зберігає поведінку `"homepage": "."`. Збірка йде в `dist`. Розмір node_modules зменшився з 256 → 175 МБ; кількість пакетів з 1434 → 576.
3. **ESLint.** CRA вбудовував eslint-config-react-app. Після переходу на Vite створив `.eslintrc.json`. Правила, що давали помилки на існуючому коді (no-case-declarations, no-var тощо), вимкнені — це попередній код, який я не змінював.
4. **basename="/asd" видалений** — це був хардкоджений шлях, що не відповідав жодному розгортанню.
5. **countingSort** не записував результат назад у вхідний масив — додано копіювання.
6. **heapSort** реалізований з анімацією (heapify + extract) та участю в SortsTable/benchmark.worker.
7. **CustomArrayForm** — окремий компонент з валідацією: порожній рядок, нечислові, мін/макс довжина.

## Що не вдалося або спрощено

- Console.log у `searches.ts` (рядки 37, 70) не прибрані, бо завдання забороняє змінювати поведінку наявних функцій, а їх видалення — косметична зміна у файлі, який інакше не зачіпався. У sorts.ts — прибрані, бо файл переписувався.
- Покриття React-компонентів (Graph, SortComponent, навбари) = 0 %: їх тестування потребує складних моків useOutletContext / react-router, що значно збільшує обсяг. Натомість покрито алгоритми й утиліти.
- Цикломатична складність `partition` (CCN 17) та `generateArray` (CCN 20) залишилися на рівні попереджень lizard — їх спрощення потребує зміни логіки алгоритму.

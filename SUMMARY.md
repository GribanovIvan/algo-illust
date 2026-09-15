# Підсумки виконання лабораторної роботи

- **Змінені та створені файли**:
  - Документація/метрики: `REVIEW.md`, `SUMMARY.md`, `метрики-до.txt`, `метрики-після.txt`.
  - Збірка/конфігурація: `package.json`, `package-lock.json`, `vite.config.mts`, `index.html`, `jest.config.js`.
  - Нові фічі: `src/components/sorts/CustomArrayForm.tsx`, `.module.scss`, інтеграція `heapSort` у `sorts.ts`, `benchmark.worker.ts`, `SortNavBar.tsx`, `SortsTable.tsx`, `App.tsx`.
  - Виправлення дефектів: `src/pages/Home.tsx`, `SortPage.tsx`, `generateArray.ts`, `SortComponent.tsx`, `workerBuilder.ts`, `circularList.ts`, `linkedList.ts`, `doublyLinkedList.ts`, `test.ts`.
  - Тести та фікстури: `src/fixtures/testData.ts`, `src/setupTests.ts`, `src/tests/{sorts,customArrayForm,searches,dataStructures,components}.test.ts(x)`.
- **Ухвалені рішення та їхнє обґрунтування**:
  - Міграція CRA 5 -> Vite з `base: './'`: час збірки скорочено з 15 с до 0.36 с, бандл із 930 КБ до 228 КБ, пакети з 1434 до 797.
  - Вебворкер: модульний запуск через `WorkerBuilder.create()` з автозавершенням попередніх інстансів і моком у тестах.
  - Рефакторинг: усунуто мутабельні глобали `IS_ASC`/`STEPS`, генерацію масивів розбито на стратегії, знизивши макс. CCN із 20 до 18.
  - Тестування: 56 тестів у 3 групах (Jest + RTL) із фікстурами, 33.45% покриття рядків `src`.
- **Спрощення та труднощі**:
  - У JSDOM вебворкери та таймери імітовано Jest-моками через відсутність повноцінного браузерного середовища.
  - Покрокова анімація сортувань залишена на базі Promise-sleep для збереження оригінальної візуальної поведінки.

# React + TypeScript + Vite + shadcn/ui

This is a template for a new Vite project with React, TypeScript, and shadcn/ui.

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `src/components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button"
```


src/
├── components/
│   ├── ui/                    # ShadCN UI components
│   ├── modes/
│   │   ├── WordsMode.tsx
│   │   ├── QuoteMode.tsx
│   │   ├── ZenMode.tsx
│   │   └── CustomMode.tsx
│   ├── stats/
│   │   ├── LiveStats.tsx
│   │   ├── StatsDashboard.tsx
│   │   └── SpeedGraph.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── SettingsPanel.tsx
│   ├── TypingDisplay.tsx
│   ├── TypingInput.tsx
│   ├── ResultsDisplay.tsx
│   └── SoundControls.tsx
│   └── ExportControls.tsx
│   └── PWAInstallPrompt.tsx
├── hooks/
│   ├── useTypingEngine.ts
│   ├── useStats.ts
│   ├── useLocalStorage.ts
│   └── useTheme.ts
├── services/
│   ├── textService.ts
│   ├── statsService.ts
│   └── quoteService.ts
│   └── soundService.ts
│   └── exportService.ts
├── contexts/
│   ├── ThemeContext.tsx
│   └── SettingsContext.tsx
├── data/
│   ├── quotes.ts
│   └── wordLists.ts
├── types/
│   └── index.ts
├── lib/
│   └── utils.ts
├── App.tsx
└── main.tsx
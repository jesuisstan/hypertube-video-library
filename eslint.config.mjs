import typescriptEslint from "@typescript-eslint/eslint-plugin";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import react from "eslint-plugin-react";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...compat.extends("next/core-web-vitals", "prettier"), {
    plugins: {
        "@typescript-eslint": typescriptEslint,
        "simple-import-sort": simpleImportSort,
        react,
    },

    languageOptions: {
        parser: tsParser,
    },

    rules: {
        "simple-import-sort/imports": ["error", {
            groups: [
                ["^react", "^next"],
                ["^@?\\w", "^\\w"],
                ["^@components"],
                ["^@templates", "^@organisms", "^@molecules", "^@atoms"],
                ["^@stores", "^@hooks", "^@utils"],
                ["^@config", "^@const", "^@customTypes"],
                ["^@styles", "^@public", "^@types"],
                ["^[./]"],
            ],
        }],
    },
}];
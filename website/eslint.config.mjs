import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

/**
 * eslint-config-next 16 exports flat config arrays directly, so there is no
 * FlatCompat shim here — routing these through @eslint/eslintrc throws on the
 * plugin's circular `configs` reference.
 */
const eslintConfig = [
  { ignores: [".next/**", "node_modules/**", "data/**", "next-env.d.ts"] },
  ...coreWebVitals,
  ...typescript,
];

export default eslintConfig;

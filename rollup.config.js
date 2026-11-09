import typescript from 'rollup-plugin-typescript2';
import dts from 'rollup-plugin-dts';

export default  [
  // standard package
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.js",
      format: "es",
    },
    // An explicit include: rollup-plugin-typescript2's default, "**/*.ts+(|x)",
    // matches nothing with picomatch 2.3.2, so no .ts file would resolve.
    plugins: [typescript({ include: ["**/*.ts"] })],
    external: ["@fullstackcraftllc/codevideo-types"]
  },
  // type declarations
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.d.ts", 
        format: "es",
      },
    ],
    plugins: [
      dts(),
    ],
    external: ["@fullstackcraftllc/codevideo-types"]
  },
];


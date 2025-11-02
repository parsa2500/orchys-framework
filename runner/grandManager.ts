import { runGrand } from "./roadMap";
const args = process.env.npm_config_argv
  ? JSON.parse(process.env.npm_config_argv).original.slice(2)
  : process.argv.slice(2);

const grandName = args.join(" ");

if (!grandName) {
  console.error("❌ Please specify a Grand scenario name.");
  process.exit(1);
}

runGrand(grandName);

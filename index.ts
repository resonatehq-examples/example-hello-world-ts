import { Resonate } from "@resonatehq/sdk";
import type { Context } from "@resonatehq/sdk";

const resonate = new Resonate();

function* baz(_: Context, greetee: string): Generator<any, string, any> {
  console.log("running baz");
  return `Hello ${greetee} from baz!`;
}

function* bar(_: Context, greetee: string): Generator<any, string, any> {
  console.log("running bar");
  return `Hello ${greetee} from bar!`;
}

function* foo(ctx: Context, greetee: string): Generator<any, string, any> {
  console.log("running foo");
  const fooGreeting = `Hello ${greetee} from foo!`;
  const barGreeting = yield* ctx.run(bar, greetee);
  const bazGreeting = yield* ctx.run(baz, greetee);
  const greeting = `${fooGreeting} ${barGreeting} ${bazGreeting}`;
  return greeting;
}

const fooR = resonate.register("foo", foo);

async function main() {
  try {
    const result = await fooR.run("greeting-workflow-1", "World");
    console.log(result);
    resonate.stop();
  } catch (e) {
    console.log(e);
  }
}

main();

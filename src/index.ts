import { spawn } from "child_process";

export const exec = (
  command: string,
  options: string[]
): Promise<number | null> => {
  const child = spawn(command, options);
  child.stdout.on("data", (data) => {
    console.log(data.toString());
  });

  return new Promise((resolve) => {
    child.on("close", (code: number | null) => {
      resolve(code);
    });
  });
};

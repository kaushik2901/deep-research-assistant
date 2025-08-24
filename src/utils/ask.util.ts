import * as inquirer from "inquirer";

export default async function ask(prompt: string): Promise<string> {
  const answers = await inquirer.default.prompt([
    {
      type: "input",
      name: "response",
      message: prompt,
    },
  ]);
  return answers.response;
}
import chalk from "chalk";

export default function printBanner() {
  console.log(
    chalk.bold.blue(`

  ██████╗ ███████╗███████╗██████╗ ██╗   ██╗███████╗██╗      █████╗ ██╗   ██╗
  ██╔══██╗██╔════╝██╔════╝██╔══██╗██║   ██║██╔════╝██║     ██╔══██╗╚██╗ ██╔╝
  ██║  ██║█████╗  █████╗  ██████╔╝██║   ██║█████╗  ██║     ███████║ ╚████╔╝ 
  ██║  ██║██╔══╝  ██╔══╝  ██╔══██╗╚██╗ ██╔╝██╔══╝  ██║     ██╔══██║  ╚██╔╝  
  ██████╔╝███████╗███████╗██║  ██║ ╚████╔╝ ███████╗███████╗██║  ██║   ██║   
  ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝  ╚═══╝  ╚══════╝╚══════╝╚═╝  ╚═╝   ╚═╝   
                                                                            
  `)
  );
  console.log(
    chalk.yellow(
      "An intelligent research agent with ambiguity detection and clarification capabilities\n"
    )
  );
}
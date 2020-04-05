import meow from "meow"

export const cli = meow(
  `
  Usage
    $ testing http://localhost:3000
  `
)


if(!cli.input[0]) {
  cli.showHelp()
  process.exit(0)
}



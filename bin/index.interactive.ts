#! /usr/bin/env node

import chalk from "chalk";
import clear from "clear";
import { validate as checkEmailValidity } from "email-validator";
import figlet from "figlet";
import inquirer from "inquirer";
import Bot, { IBotOptions } from "./Bot";
import { ROOT_DIR, VERSION } from "./constants";
import { log } from "./utils";
import FileConfigProvider from "./FileConfigProvider";
import fs from "fs";

interface Data {
  email: string;
  password: string;
  figmaAccessToken: string;
  projectsIds: string;
  downloadTimeout: number;
  interactionDelay: number;
  typingDelay: number;
  diffHoursWasModified: number;
}

const displayTitle = () => {
  clear();

  const title = figlet.textSync("FIGMA.\nBACKUP");
  const version = figlet.textSync(
    ` > figma-backup v${VERSION} - INTERACTIVE INTERFACE`,
    { font: "Term" }
  );

  const styledTitle = chalk.magenta(title);
  const styledVersion = chalk.bold.red(version);

  log(`${styledTitle}\n${styledVersion}\n`);
};

const askForData = async () => {
  return inquirer.prompt<Data>([
    {
      name: "email",
      message: "Enter the email address of your figma account:",
      validate: value => {
        if (!value || (<string>value).length === 0)
          return "This argument is required!";

        if (!checkEmailValidity((<string>value).toLowerCase()))
          return "Email address is invalid!";

        return true;
      }
    },
    {
      name: "password",
      type: "password",
      message: "Enter the password of your figma account:",
      validate: value => {
        if (!value || (<string>value).length === 0)
          return "This argument is required!";
        return true;
      }
    },
    {
      name: "figmaAccessToken",
      message: "Enter the figma access token:",
      validate: value => {
        if (!value || (<string>value).length === 0)
          return "This argument is required!";
        return true;
      }
    },
    {
      name: "projectsIds",
      message: [
        "Enter the ids of your figma projects:",
        "(Separate the ids with SPACE(s). i.e. ID1 ID2 ID3)"
      ].join("\n")
    },
    {
      name: "downloadTimeout",
      message: [
        "Enter the download timeout (in minutes):",
        "(This number indicates the maximum amount of time the bot has to wait for a file to be downloaded.)"
      ].join("\n"),
      default: 60,
      type: "number"
    },
    {
      name: "interactionDelay",
      message: [
        "Enter the interaction delay (in seconds):",
        "(This number indicates the delay between interactions.)"
      ].join("\n"),
      default: 2,
      type: "number"
    },
    {
      name: "typingDelay",
      message: [
        "Enter the typing delay (in miliseconds):",
        "(This number indicates the delay to type a new character.)"
      ].join("\n"),
      default: 100,
      type: "number"
    },
    {
      name: "diffHoursWasModified",
      message: [
        "Enter how many hours have passed since the last modification (in hours):",
        "(This number indicates is backup needed.)"
      ].join("\n"),
      default: 2,
      type: "number"
    }
  ]);
};

const dataToBotConstructorParams = (data: Data): IBotOptions => {
  const authData = { email: data.email, password: data.password };
  const projectsIds = data.projectsIds.split(" ");
  return {
    authData,
    projectsIds,
    figmaAccessToken: data.figmaAccessToken,
    downloadTimeout: data.downloadTimeout * 1000,
    interactionDelay: data.interactionDelay * 1000,
    typingDelay: data.typingDelay,
    diffHoursWasModified: data.diffHoursWasModified
  };
};

const startBot = async () => {
  if (!fs.existsSync(ROOT_DIR)) fs.mkdirSync(ROOT_DIR);
  clear();

  log(`${chalk.magenta(figlet.textSync("START"))}\n`);
  
  const fileConfigProvider = new FileConfigProvider();

  log(chalk.red(">") + chalk.bold(` Reading the file config...`));

  const config = await fileConfigProvider.getConfig() || dataToBotConstructorParams(await askForData());
  
  await fileConfigProvider.setConfig(
    config
  );


  await new Bot(config).start();
};

const run = async () => {
  displayTitle();
  await startBot();
};

void run();

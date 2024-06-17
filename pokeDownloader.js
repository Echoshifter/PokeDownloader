import inquirer from "inquirer";
import { input, checkbox } from "@inquirer/prompts";
import fs from "fs";
// import path from "path.js";

const questions = [
  {
    type: "input",
    name: "pokemon",
    message: "What pokemon would you like to search for?",
  },
  {
    type: "checkbox",
    name: "content",
    message: "What would you like to download? Stats, Sprites, Artwork?",
    choices: [
      { name: "Stats", value: "stats" },
      {
        name: "Sprites",
        value: "sprites",
      },
      { name: "Artwork", value: "artwork" },
    ],
  },
];
const getAnswers = async () => {
  inquirer.prompt(questions).then((answers) => {
    const pokemon = answers.pokemon;
    const content = answers.content;
    return [pokemon, content];
  });
};

const getPokemon = async () => {
  const [pokemon, content] = await getAnswers();
  //   const pokemon = await input({
  //     message: "What pokemon would you like to search for?",
  //   });
  //   const content = await checkbox({
  //     message: "What would you like to download? Stats, Sprites, Artwork?",
  //     choices: [
  //       { name: "Stats", value: "stats" },
  //       {
  //         name: "Sprites",
  //         value: "sprites",
  //       },
  //       { name: "Artwork", value: "artwork" },
  //     ],
  //   });
  const directoryPath = `./${pokemon}`;
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath);
  }
  fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.toLowerCase()}`)
    .then((response) => response.json())
    .then((json) => {
      const stats = json.stats;
      const sprites = json.sprites;
      const artwork = json.sprites["other"]["official-artwork"];
      for (const [key, value] of sprites) {
      }
    });
};
getPokemon();

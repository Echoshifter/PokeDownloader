import { input, checkbox, confirm } from "@inquirer/prompts";
import fs from "fs";

const getPokemon = async () => {
  const pokemon = await input({
    message: "What Pokemon would you like to search for?",
  });
  const content = await checkbox({
    message: "What would you like to download?",
    choices: [
      { name: "Stats", value: "stats" },
      {
        name: "Sprites",
        value: "sprites",
      },
      { name: "Artwork", value: "artwork" },
    ],
  });
  const isFinished = await confirm({
    message: "Would you like to search for another Pokemon?",
    default: false,
  });
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
      if (content.includes("sprites")) {
        for (const [key, value] of Object.entries(sprites)) {
          if (typeof value === "string") {
            fetch(`${value}`)
              .then((image) => image.arrayBuffer())
              .then((result) => {
                const buffer = Buffer.from(result);
                fs.writeFileSync(`${directoryPath}/${key}.png`, buffer);
                console.log(`Sprites saved to ${directoryPath}/${key}.png`);
              });
          }
        }
      }
      if (content.includes("artwork")) {
        fetch(json.sprites["other"]["official-artwork"]["front_default"])
          .then((response) => response.arrayBuffer())
          .then((result) => {
            const artBuffer = Buffer.from(result);
            fs.writeFileSync(
              `${directoryPath}/official-artwork.png`,
              artBuffer
            );
            console.log(
              `Artwork saved to ${directoryPath}/official-artwork.png`
            );
          });
      }
      if (content.includes("stats")) {
        const statsText = stats
          .map((stat) => `${stat.stat.name}: ${stat.base_stat}`)
          .join("\n");
        fs.writeFileSync(`${directoryPath}/stats.txt`, statsText);
        console.log(`Stats saved to ${directoryPath}/stats.txt`);
      }
    });
  if (isFinished === true) {
    getPokemon();
  }
};

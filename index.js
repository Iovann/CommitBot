const { promises: fs } = require('fs');

const readmeFilePath = './README.md';
const msInOneDay = 1000 * 60 * 60 * 24;
const today = new Date();

async function readREADME() {
  return await fs.readFile(readmeFilePath, 'utf-8');
}

function generateNewREADME(content) {
  const readmeRow = content.split('\n');

  const replacements = {
    day_before_new_years: getDBNWSentence(),
    today_date: getTodayDate(),
    gabot_signing: getGabotSigning(),
  };

  Object.entries(replacements).forEach(([identifier, replacement]) => {
    const identifierIndex = findIdentifierIndex(readmeRow, identifier);
    if (identifierIndex !== -1) {
      readmeRow[identifierIndex] = readmeRow[identifierIndex].replace(
        `<#${identifier}>`,
        replacement
      );
    }
  });

  return readmeRow.join('\n');
}

function findIdentifierIndex(rows, identifier) {
  return rows.findIndex(row => row.includes(`<#${identifier}>`));
}

function getTodayDate() {
  return today.toDateString();
}

function getGabotSigning() {
  const moodByDay = {
    0: 'love',
    1: 'hate',
    2: 'wickedness',
    3: 'pleasure',
    4: 'cruelty',
    5: 'horror',
    6: 'wickedness',
  };
  const mood = moodByDay[today.getDay()];
  return `🤖 This README.md is updated with ${mood}, by Gabot ❤️`;
}

function getDBNWSentence() {
  const nextYear = today.getFullYear() + 1;
  const nextYearDate = new Date(`${nextYear}-01-01`);
  const timeUntilNewYear = nextYearDate - today;
  const dayUntilNewYear = Math.round(timeUntilNewYear / msInOneDay);
  return `**${dayUntilNewYear} days before ${nextYear} ⏱**`;
}

async function main() {
  try {
    const content = await readREADME();
    const newREADME = generateNewREADME(content);
    await fs.writeFile(readmeFilePath, newREADME);
    console.log('README.md updated successfully!');
  } catch (error) {
    console.error('Error updating README.md:', error);
  }
}

main();

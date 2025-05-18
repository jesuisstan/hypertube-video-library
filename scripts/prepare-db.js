// TO RUN USE: node scripts/prepare-db.js
// This script prepares the database by deleting existing tables and creating new ones.

const { execSync } = require('child_process');
const readline = require('readline');

// Function to prompt user for input
const promptUser = (query) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
};

// Function to dynamically load ESM modules
const loadChalk = async () => {
  try {
    const chalk = await import('chalk');
    return chalk.default; // ESM modules use `default` exports
  } catch (err) {
    return null;
  }
};

// Function to run shell commands
const runCommand = (chalk, command) => {
  try {
    console.log(chalk.blue(`Running: ${command}`)); // Command in blue
    execSync(command, { stdio: 'inherit' });
    console.log(chalk.green(`${command} - completed successfully.`)); // Success in green
  } catch (error) {
    console.error(chalk.red(`${command} - failed with error:`), error); // Error in red
    process.exit(1); // Exit on failure
  }
};

// Sequentially run each script
const runCommands = (chalk) => {
  runCommand(chalk, 'node ./scripts/delete-table.js chat'); // MATCHA PROJECT
  runCommand(chalk, 'node ./scripts/delete-table.js visits'); // MATCHA PROJECT
  runCommand(chalk, 'node ./scripts/delete-table.js likes'); // MATCHA PROJECT
  runCommand(chalk, 'node ./scripts/delete-table.js matches'); // MATCHA PROJECT
  runCommand(chalk, 'node ./scripts/delete-table.js blocked_users'); // MATCHA PROJECT
  runCommand(chalk, 'node ./scripts/delete-table.js notifications'); // MATCHA PROJECT
  runCommand(chalk, 'node ./scripts/delete-table.js movies_bookmarks'); // HYPERTUBE PROJECT
  runCommand(chalk, 'node ./scripts/delete-table.js movies_watched'); // HYPERTUBE PROJECT
  runCommand(chalk, 'node ./scripts/delete-table.js users'); // HYPERTUBE & MATCHA PROJECT

  runCommand(chalk, 'node ./scripts/create-table-users.js');
  runCommand(chalk, 'node ./scripts/fill-table-users.js');
  runCommand(chalk, 'node ./scripts/create-tables-activity.js');
};

// Main function
(async () => {
  let chalk = await loadChalk();
  if (!chalk) {
    const answer = await promptUser(
      'Chalk (text colorizer) is not installed. Do you want to install it? (y/n): '
    );
    if (answer.toLowerCase() === 'y') {
      console.log('Installing chalk...');
      try {
        execSync('npm install chalk', { stdio: 'inherit' });
        chalk = await loadChalk();
        if (chalk) {
          console.log(chalk.green('Chalk installed successfully!'));
        }
      } catch (installError) {
        console.error('Failed to install chalk:', installError);
      }
    }
  }

  if (!chalk) {
    // Fallback to no colors if chalk couldn't be loaded
    chalk = { blue: (text) => text, green: (text) => text, red: (text) => text };
    console.log('Running without chalk colors.');
  }

  runCommands(chalk);
})();

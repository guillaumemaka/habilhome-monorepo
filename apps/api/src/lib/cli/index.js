/* eslint-disable no-console */
import cli from 'commander';
import readlineSync from 'readline-sync';
import User from '../../models/mongo/user';
import mongoose from 'mongoose';
import { connect } from '../mongoose';
import _ from 'lodash';

cli
  .version('0.0.1')
  .command('create-user')
  .option('-e, --email <email>', 'User email address')
  .option('-f, --firstname <firstname>', 'User firstname', null)
  .option('-l, --lastname <lastname>', 'User lastname', null)
  .option('-r, --roles <roles>', 'User roles', (val) => val.split(','))
  .option('-a, --active', 'Activate the user account', false);

async function createUser(cli) {
  let firstName = cli.firstname;
  if (!firstName) {
    firstName = readlineSync.question('Enter the user firstname:');
  }

  let lastName = cli.lastname;
  if (!lastName) {
    lastName = readlineSync.question('Enter the user lastname:');
  }
  const availableRoles = ['admin', 'user'];
  const selectedRoles = [];
  let index = 0;

  do {
    index = readlineSync.keyInSelect(availableRoles, 'Add role');
    if (index !== -1) {
      selectedRoles.push(availableRoles[index]);
      console.log(`Role ${availableRoles[index]} added!`);
    }
  } while (index !== -1);

  const roles = _.concat(cli.roles || [], selectedRoles, ['user']);
  console.debug(roles);

  await connect();

  let email = cli.email;
  if (!email) {
    email = readlineSync.questionEMail('Enter the user email address:', {
      validate: (email) => {
        const user = User.findOne({ email });
        if (user) {
          return `User with email ${email} already exists!`;
        }
        return true;
      },
    });
  }

  let active = cli.active;

  const password = readlineSync.questionNewPassword('Enter user password:', {
    min: 8,
    max: 15,
  });

  const user = new User({ email, active, firstName, lastName, roles });
  user.setPassword(password);

  try {
    await user.save();
    console.log(
      `User ${firstName} ${lastName} with email address: ${email} created successfuly!`
    );
  } catch (err) {
    console.error(err);
  }

  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
  } catch (err) {
    console.log('An error occured');
    console.error(err);
  }

  process.exit(0);
}

cli.parse(process.argv);

createUser(cli);

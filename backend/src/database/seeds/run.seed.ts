import roleSeed from './role.seed';
import tagsSeed from './tags.seed';
import userSeed from './user.seed';
import blogSeed from './blog.seed';

async function runSeed() {
  await roleSeed();
  await userSeed();
  await tagsSeed();
  await blogSeed();
}

runSeed();

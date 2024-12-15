import { firstOrNull, from, query } from 'linq-functional';
import execa from 'execa';

import { version as pkgVersion } from '../../../package.json';
import { allSiteData } from 'content-collections';

import { whereIdEquals } from './selectors';

export async function getSiteData() {
  try {
    const data = query(from(allSiteData), whereIdEquals('main'), firstOrNull());
    return data;
  } catch (error) {
    console.error('Failed to load site data', error);
    throw new Error('Failed to load site data');
  }
}

export async function getFooterData() {
  try {
    const items = allSiteData;
    const footer = query(from(items), whereIdEquals('footer'), firstOrNull());
    return footer;
  } catch (error) {
    console.error('Failed to load footer data', error);
    throw new Error('Failed to load footer data');
  }
}

export async function getAppVersion() {
  try {
    const version = pkgVersion;
    const { stdout: commonCommit } = await execa('git', [
      'merge-base',
      'HEAD',
      'master',
    ]);
    const { stdout: buildno } = await execa('git', [
      'rev-list',
      '--count',
      `${commonCommit}..HEAD`,
    ]);
    const { stdout: hash } = await execa('git', ['rev-parse', 'HEAD']);
    const { stdout: branchname } = await execa('git', [
      'branch',
      '--show-current',
    ]);

    return { version, buildno, hash, branchname };
  } catch (error) {
    console.error('Failed to load app version', error);
    throw new Error('Failed to load app version');
  }
}

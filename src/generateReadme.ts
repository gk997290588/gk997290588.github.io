import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { mirrorSites } from './web/constant/mirrorSites';
import { thanks } from './web/constant/thanks';
import { padName } from './web/util/padName';

let content = readFileSync(join(__dirname, '..', 'readmeTemplate.md'), 'utf8');

content = content.replace(
  '☆☆☆☆☆【占位：镜像站列表】☆☆☆☆☆',
  mirrorSites.map(({ origin, provider }, index) => `- [镜像站 ${index + 1} | ${/^https?:\/\/(.*)$/.exec(origin)![1]}（感谢${padName(provider)}提供）](${origin})`).join('\n')
);

content = content.replace(
  '☆☆☆☆☆【占位：鸣谢列表】☆☆☆☆☆',
  thanks.map(({ name, link }) => (link === undefined)
    ? `- ${name}`
    : `- [${name}](${link})`
  ).join('\n'),
);

writeFileSync(join(__dirname, '..', 'Readme.md'), content, 'utf8');

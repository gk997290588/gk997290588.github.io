import { contactInfo } from '../data/settings';
import { h } from '../hs';
import { Content } from './contentControl';

export function loadContactInfo(content: Content) {
  if (!contactInfo.getValue()) {
    return;
  }
  const block = content.addBlock({
    initElement: h('div',
      h('h3', '欢迎加入《可穿戴科技》相关讨论组'),
      h('ul',
        h('li',
          'Telegram 群：',
          h('a.regular', {
            href: 'https://t.me/joinchat/Dt8_WlJnmEwYNbjzlnLyNA',
            target: '_blank',
          }, 'https://t.me/joinchat/Dt8_WlJnmEwYNbjzlnLyNA'),
          h('ul',
            h('li', '非常欢迎色情，但是若要讨论血腥内容，请用群描述内的 R18G 群组。'),
          ),
        ),
        h('li',
          'Telegram 更新推送频道：',
          h('a.regular', {
            href: 'https://t.me/joinchat/AAAAAEpkRVwZ-3s5V3YHjA',
            target: '_blank',
          }, 'https://t.me/joinchat/AAAAAEpkRVwZ-3s5V3YHjA'),
        ),
        h('li',
          'Twitter：',
          h('a.regular', {
            href: 'https://twitter.com/NovelWTech',
            target: '_blank',
          }, '@NovelWTech'),
        ),
        h('li',
          'QQ 群',
          h('ul',
            h('li', '严格禁止政治/色情媒体，发现一次就永封。'),
            h('li',
              h('span', {
                style: {
                  'font-weight': 'bold',
                  'text-decoration': 'underline',
                }
              }, '只收大号，小号勿扰'),
              h('ul', h('li', '如果申请被拒绝，说明等级不够高，请使用大号。如果大号也被拒绝，请加上方 Telegram 群。')),
            ),
            h('li', '因人数限制，满人时会踢出不活跃用户。若要潜水，请进上方 Telegram 群。'),
            // h('li', '一群：462213854（人满）'),
            h('li', '二群：1154421904'),
          ),
        ),
      ),
      h('a.regular', {
        href: '#',
        onclick: ((event: any) => {
          event.preventDefault();
          block.directRemove();
          contactInfo.setValue(false);
        }),
      }, '点此永久关闭本提示'),
    ),
  });
}

import { h } from '../hs';
import { Page } from './pages';
import { registerWithResultPopup, tokenItem } from '../control/userControl';
import { Modal, showGenericError, showGenericLoading } from '../control/modalControl';
import { backendUrl } from '../control/backendControl';
import { formatRelativePath } from '../util/formatRelativePath';
import { lastElement } from '../util/array';
import { relativePathLookUpMap } from '../data/data';
import { padName } from '../util/padName';
import { StringPersistentItem } from '../control/persistentItem';

/**
 * Convert a string to 32 bit hash
 * https://stackoverflow.com/a/47593316
 */
function xmur3(strSeed: string) {
  let h = 1779033703 ^ strSeed.length;
  for (let i = 0; i < strSeed.length; i++) {
    h = Math.imul(h ^ strSeed.charCodeAt(i), 3432918353),
      h = h << 13 | h >>> 19;
  }
  return () => {
    h = Math.imul(h ^ h >>> 16, 2246822507);
    h = Math.imul(h ^ h >>> 13, 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

/**
 * Create a seeded random number generator using the four passed in 32 bit
 * number as seeds.
 * https://stackoverflow.com/a/47593316
 *
 * @param a seed
 * @param b seed
 * @param c seed
 * @param d seed
 * @returns seeded random number generator
 */
function sfc32(a: number, b: number, c: number, d: number) {
  return () => {
    a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
    let t = (a + b) | 0;
    a = b ^ b >>> 9;
    b = c + (c << 3) | 0;
    c = (c << 21 | c >>> 11);
    d = d + 1 | 0;
    t = t + d | 0;
    c = c + t | 0;
    return (t >>> 0) / 4294967296;
  };
}

interface CandidateChapter {
  voteId: number;
  relativePath: string;
  overrideTitle?: string;
}

const candidates: Array<CandidateChapter> = [
  { voteId: 0, relativePath: '支线/特别篇-公主殿下.html' },
  { voteId: 1, relativePath: '支线/新能源.html' },
  { voteId: 2, relativePath: '支线/长期贞操带实验第七次定期报告/第一幕.html', overrideTitle: '长期贞操带实验第七次定期报告' },
  { voteId: 3, relativePath: '支线/SBC-基金会档案/次元阴蒂环.html' },
  { voteId: 4, relativePath: '支线/SBC-基金会档案/淫纹打印机.html' },
  { voteId: 5, relativePath: '支线/SBC-基金会档案/173-号拘束衣.html' },
  { voteId: 6, relativePath: '支线/长期贞操带实验定期报告（番外）.html' },
  { voteId: 7, relativePath: '支线/疼痛实验记录/第一次调研报告.html', overrideTitle: '疼痛实验记录' },
  { voteId: 8, relativePath: '支线/新能源：美妙的旅程.html' },
  { voteId: 9, relativePath: '支线/城岭樱的游街仪式.html' },
  { voteId: 10, relativePath: '支线/好朋友，不吵架.html' },
  { voteId: 11, relativePath: '支线/梦野与千夏.html' },
  { voteId: 12, relativePath: '道具集/mWatch.html' },
  { voteId: 13, relativePath: '道具集/强制灌食器.html' },
  { voteId: 14, relativePath: '道具集/拟真穿戴式猫耳猫尾.html' },
  { voteId: 15, relativePath: '道具集/充电宝少女捕获器.html' },
  { voteId: 16, relativePath: '道具集/现代女仆管理系统.html' },
  { voteId: 17, relativePath: '道具集/可穿戴装置-γ-型介绍.html' },
  { voteId: 18, relativePath: '道具集/载人风筝.html' },
  { voteId: 19, relativePath: '道具集/强奸体验机.html' },
  { voteId: 20, relativePath: '道具集/未知录像文件.html' },
  { voteId: 21, relativePath: '道具集/智子.html' },
  { voteId: 22, relativePath: '道具集/强制高潮快感枪.html' },
  { voteId: 23, relativePath: '道具集/森宇奶茶杯.html' },
  { voteId: 24, relativePath: '道具集/拟真穿戴式猫耳猫尾-2.html' },
  { voteId: 25, relativePath: '道具集/可穿戴科技的其他版本-·-Flexible-(Episode-1).html' },
  { voteId: 26, relativePath: '道具集/家庭用多功能放置架套装.html' },
  { voteId: 27, relativePath: '道具集/使人快乐的-PS4.html' },
  { voteId: 28, relativePath: '道具集/家庭-SM-套件.html' },
  { voteId: 29, relativePath: '道具集/舔脚授权协议-0.0.html' },
  { voteId: 30, relativePath: '支线/日常就是要惊险刺激——且淫乱.html'},
  { voteId: 31, relativePath: '支线/所以说，甜蜜的反杀也是日常的一部分.html' },
];

export function isCandidate(relativePath: string) {
  return candidates.some(candidate => candidate.relativePath === relativePath);
}

let hasRandomized = false;
const seedItem = new StringPersistentItem('wtcupRandomSeed');
function ensureCandidatesAreRandomized() {
  if (hasRandomized) {
    return;
  }
  hasRandomized = true;
  // 原来打算用 token 当种子来决定随机顺序的，然后突然意识到这个 hash 和随机算法
  // 估计并不密码学安全。有一定可能性可以通过投票顺序倒推出来 token... 即使
  // 只用 token 的一部分也不行，因为早期的 token 是 hex，所以强度本身并不是非常
  // 高。如果能倒推出一部分就会显著降低安全度，所以现在干脆直接随机生成一个值当
  // 种子好了。当然这样的缺陷是不同设备同一个账号显示顺序会不一样，不过这个问题
  // 应该不大。
  // 另外，不使用用户名作为种子的原因是，其实现在不确定 initialization 是否完
  // 成，所以如果要用用户名这里还要等一个 initialization，特别麻烦。
  // 不使用 SHA256 的原因也是嫌麻烦。
  // const token = tokenItem.getValue()!;
  // const seedFn = xmur3(token.substr(8));
  if (!seedItem.exists()) {
    const seed = String(Math.random());
    seedItem.setValue(seed);
  }
  const seedFn = xmur3(seedItem.getValue()!);
  const rng = sfc32(seedFn(), seedFn(), seedFn(), seedFn());
  candidates.sort(() => rng() - 0.5);
}

let hasStarted = false;
const voteStatus: Array<number> = new Array(candidates.length).fill(0);

export const wtcupVote: Page = {
  name: 'wtcup-vote',
  handler: content => {
    const startVote = () => {
      if (!tokenItem.exists()) {
        const $nameInput = h('input');
        const $emailInput = h('input');
        const registerModal = new Modal(h('div', [
          h('h1', '请填写投票人信息'),
          h('p', '您的昵称或邮箱不会伴随投票结果公开。'),
          h('.input-group', [
            h('span', '昵称（必填）：'),
            $nameInput,
          ]),
          h('.input-group', [
            h('span', '邮箱（可选）：'),
            $emailInput,
          ]),
          h('.button-container', [
            h('div', {
              onclick: () => {
                const loadingModal = showGenericLoading();
                registerWithResultPopup(
                  $nameInput.value,
                  $emailInput.value === '' ? null : $emailInput.value
                ).then(success => {
                  if (success) {
                    registerModal.close();
                    initializeVotingBlocks();
                  }
                }).finally(() => loadingModal.close());
              }
            }, '确认'),
            h('div', {
              onclick: () => registerModal.close(),
            }, '取消'),
          ]),
        ]));
        registerModal.open();
      } else {
        const loadingModal = showGenericLoading('正在加载投票记录...');
        fetch(`${backendUrl}/event/getWtcupVotes`, {
          cache: 'no-cache',
          method: 'POST',
          headers: new Headers({
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify({ token: tokenItem.getValue()! }),
        }).then(response => response.json()).then((votes: Array<{
          chapter_vote_id: number,
          rating: number,
        }>) => {
          for (const vote of votes) {
            voteStatus[vote.chapter_vote_id] = vote.rating;
          }
          initializeVotingBlocks();
        }, showGenericError).finally(() => loadingModal.close());
      }
    };
    const $welcomeBlock = h('div', [
      h('h1', '《可穿戴科技》第一届西塔杯评选投票'),
      h('p', [
        '欢迎参与《可穿戴科技》',
        h('a.regular', {
          href: '#META/第一届西塔杯评选.html',
        }, '第一届西塔杯'),
        '评选投票。您的投票将直接决定西塔杯的评选结果。'
      ]),
      h('p', '请点击下方按钮开始投票。'),
      h('.button-container', [
        h('div', {
          onclick: startVote,
        }, '开始投票'),
      ]),
    ]);
    const welcomeBlock = content.addBlock({
      initElement: $welcomeBlock,
    });
    if (hasStarted) {
      initializeVotingBlocks();
    }
    function initializeVotingBlocks() {
      hasStarted = true;
      ensureCandidatesAreRandomized();
      welcomeBlock.directRemove();
      content.addBlock({
        initElement: h('div', [
          h('h1', '投票方式'),
          h('p', '请点击星星对以下作品评分。所有作品默认处于“未评分”状态。处于“未评分”状态的评分项将不用作计算作品分数。点击星星左侧的“×”可将作品评分重置为“未评分”状态。'),
          h('p', '作品将以随机顺序出现。'),
          h('p', '您的投票会被实时保存。您可以随时回到这里修改所做出的评分。')
        ]),
      });
      for (const candidate of candidates) {
        const formattedRelativePath = formatRelativePath(candidate.relativePath);
        const title = candidate.overrideTitle ?? lastElement(formattedRelativePath.split(' > '));
        const $clear = h('.choice.clear', 'clear');
        const stars: Array<HTMLDivElement> = [];
        let hovering = -1;
        const updateDisplay = () => {
          const rating = voteStatus[candidate.voteId];
          $clear.classList.toggle('dimmed', rating === 0);
          stars.forEach(($star, index) => {
            if (rating === 0) {
              if (hovering !== -1) {
                $star.classList.toggle('dimmed', false);
                $star.classList.toggle('less-dimmed', true);
              } else {
                $star.classList.toggle('dimmed', true);
                $star.classList.toggle('less-dimmed', false);
              }
            } else {
              $star.classList.toggle('dimmed', false);
              $star.classList.toggle('less-dimmed', false);
            }

            $star.innerText = (index <= (hovering !== -1 ? hovering : (rating - 1))) ? 'star' : 'star_border';
          });
        };
        let lastConfirmed = voteStatus[candidate.voteId];
        let isSending = false;
        let waitingToSend = -1;
        const fetchSendVote = (rating: number) => {
          isSending = true;
          fetch(`${backendUrl}/event/voteWtcup`, {
            cache: 'no-cache',
            method: 'POST',
            headers: new Headers({
              'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
              token: tokenItem.getValue()!,
              chapter_vote_id: candidate.voteId,
              rating,
            }),
          }).then(response => response.json()).then(() => {
            isSending = false;
            lastConfirmed = rating;
            if (waitingToSend !== -1) {
              fetchSendVote(waitingToSend);
              waitingToSend = -1;
            }
          }, () => {
            isSending = false;
            showGenericError(padName(title) + '的评分提交失败，请重试。');
            voteStatus[candidate.voteId] = lastConfirmed; // Revert
            updateDisplay();
            waitingToSend = -1;
          });
        };
        const castVote = (rating: number) => {
          if (isSending) {
            waitingToSend = rating;
          }
          voteStatus[candidate.voteId] = rating;
          updateDisplay();
          fetchSendVote(rating);
        };
        for (let i = 0; i < 5; i++) {
          let touchStart = 0;
          const onClick = () => {
            if (voteStatus[candidate.voteId] === i + 1) {
              castVote(0);
            } else {
              castVote(i + 1);
            }
          };
          stars.push(h('.choice.star', {
            onmouseenter: () => {
              hovering = i;
              updateDisplay();
            },
            onmouseleave: () => {
              hovering = -1;
              updateDisplay();
            },
            ontouchstart: () => {
              touchStart = Date.now();
            },
            ontouchend: (event: TouchEvent) => {
              if (event.cancelable) {
                event.preventDefault();
              }
              if (Date.now() - touchStart > 200) {
                return;
              }
              onClick();
            },
            onclick: onClick,
          }));
        }
        $clear.addEventListener('click', () => castVote(0));
        updateDisplay();
        content.addBlock({
          initElement: h('.wtcup-vote', [
            h('h2', title),
            h('p', relativePathLookUpMap.get(candidate.relativePath)!.chapter.authors
              .map(authorRole => authorRole.role + '：' + authorRole.name).join('，')),
            h('p', '请选择评分：'),
            h('.stars-container', [
              $clear,
              ...stars,
            ]),
            h('p', [
              '文章链接：',
              h('a.regular', {
                href: `#${candidate.relativePath}`,
              }, formattedRelativePath),
            ]),
          ]) as HTMLDivElement,
        });
      }
      content.addBlock({
        initElement: h('div', [
          h('h1', '投票完成！'),
          h('p', '以上就是所有参与评选的作品。感谢参与《可穿戴科技》第一届西塔杯评选投票，您的评分都已自动保存并上传至服务器。评选结果将在投票结束（北京时间 2020 年 12 月 31 日 23 时）后尽快发布。在投票结束前，您可以随时回到这里修改所做出的评分。'),
        ]),
      });
    }
    return true;
  },
};

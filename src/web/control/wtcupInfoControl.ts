
import { h } from '../hs';
import { isCandidate } from '../pages/wtcupVote';
import { Content } from './contentControl';

// const voteDate = 1607007600000; // new Date('2020-12-03T23:00:00.000+08:00').getTime()
const endDate = 1609426800000; // new Date('2020-12-31T23:00:00.000+08:00').getTime()

export function isWtcupStillOn() {
  return Date.now() < endDate;
}

export function loadWtcupInfoPre(content: Content, relativePath: string) {
  if (!isWtcupStillOn()) {
    return;
  }
  if (isCandidate(relativePath)) {
    content.addBlock({
      initElement: h('div',
        h('h3', `本文正在参与第一届西塔杯年度最佳已完结文章评选！`),
        h('p',
          '评选结果由投票决定，欢迎',
          h('a.regular', {
            href: '##page/wtcup-vote',
          }, '点此参与投票'),
          '。'
        ),
      ),
    });
  }
}

export function loadWtcupInfo(content: Content) {
  content.addBlock({
    initElement: h('div',
      h('h3', `第一届西塔杯年度最佳已完结文章评选已经结束！`),
      h('p',
        '西塔杯选出了年度十佳作品以及三位获奖作者，',
        h('a.regular', {
          href: '#META/第一届西塔杯评选.html',
        }, '点此查看评选结果'),
        '。'
      ),
    ),
  });
}

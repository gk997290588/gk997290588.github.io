import { BUILD_FAILED_DESC, BUILD_FAILED_OK, BUILD_FAILED_TITLE } from './constant/messages';
import './control/analyticsControl';
import { followQuery } from './control/followQuery';
import { notify } from './control/modalControl';
import { updateSelection } from './control/updateSelection';
import { data } from './data/data';
import { animation } from './data/settings';
import { MainMenu } from './menu/MainMenu';
import { id } from './util/DOM';
import { init, tokenItem } from './control/userControl';

const $warning = id('warning');

if ($warning !== null) {
  $warning.addEventListener('click', () => {
    $warning.style.opacity = '0';
    if (animation.getValue()) {
      $warning.addEventListener('transitionend', () => {
        $warning.remove();
      });
    } else {
      $warning.remove();
    }
  });
}

const $buildNumber = id('build-number');
$buildNumber.innerText = `Build ${data.buildNumber}`;

export const mainMenu = new MainMenu();
mainMenu.setActive(true);

if (tokenItem.exists()) {
  init(tokenItem.getValue()!);
}

if (data.buildError) {
  notify(BUILD_FAILED_TITLE, BUILD_FAILED_DESC, BUILD_FAILED_OK);
}

document.addEventListener('selectionchange', () => {
  updateSelection();
});

window.addEventListener('popstate', () => {
  followQuery();
});

followQuery();

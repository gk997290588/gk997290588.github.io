import { Menu } from '../Menu';
import { ChaptersMenu } from './ChaptersMenu';
import { ContactMenu } from './ContactMenu';
import { LinkExchangeMenu } from './LinkExchangeMenu';
import { SettingsMenu } from './SettingsMenu';
import { StatsMenu } from './StatsMenu';
import { StyleMenu } from './StyleMenu';
import { ThanksMenu } from './ThanksMenu';
import { isWtcupStillOn } from '../control/wtcupInfoControl';

export class MainMenu extends Menu {
  public constructor() {
    super('', null);
    this.addLink(new ChaptersMenu(this));
    if (isWtcupStillOn()) {
      this.addItem('西塔杯投票', { button: true, link: '##page/wtcup-vote' });
    }
    this.addLink(new ThanksMenu(this));
    this.addLink(new StyleMenu(this));
    this.addLink(new ContactMenu(this));
    this.addItem('最新评论', { button: true, link: '##page/recent-comments' });
    this.addLink(new LinkExchangeMenu(this));
    this.addItem('源代码', { button: true, link: 'https://gitlab.com/SCLeo/wearable-technology' });
    this.addLink(new SettingsMenu(this));
    this.addLink(new StatsMenu(this));
  }
}

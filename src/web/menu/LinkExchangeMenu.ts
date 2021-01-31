import { ItemDecoration, Menu } from '../Menu';
export class LinkExchangeMenu extends Menu {
  public constructor(parent: Menu) {
    super('友情链接', parent);
    this.addItem('艾利浩斯学院 图书馆', {
      small: true,
      button: true,
      link: 'http://ailihaosi.xyz/',
      decoration: ItemDecoration.ICON_LINK,
    });
    this.addItem('acted 咕咕喵的小说和小游戏', {
      small: true,
      button: true,
      link: 'https://acted.gitlab.io/h3/',
      decoration: ItemDecoration.ICON_LINK,
    });
    this.addItem('琥珀版可穿戴科技', {
      small: true,
      button: true,
      link: 'https://www.pixiv.net/novel/show.php?id=12189481',
      decoration: ItemDecoration.ICON_LINK,
    });
    this.addItem('零点之书', {
      small: true,
      button: true,
      link: 'https://zerono.page',
      decoration: ItemDecoration.ICON_LINK,
    });
  }
}
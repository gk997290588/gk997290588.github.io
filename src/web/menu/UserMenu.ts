import { showLoginModal, showUpdateProfileModal } from '../control/userControl';
import { Menu } from '../Menu';

export class UserMenu extends Menu {
  public constructor(parent: Menu) {
    super('评论身份管理', parent);
    this.addItem('身份令牌', {
      small: true,
      button: true,
    }).onClick(() => {
      showLoginModal();
    });
    this.addItem('修改身份信息', {
      small: true,
      button: true,
    }).onClick(() => {
      showUpdateProfileModal();
    });
  }
}

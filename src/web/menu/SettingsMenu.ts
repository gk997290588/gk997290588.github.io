import { stylePreviewArticle } from '../constant/stylePreviewArticle';
import { newContent, Side } from '../control/contentControl';
import { Layout } from '../control/layoutControl';
import { animation, BooleanSetting, charCount, contactInfo, developerMode, earlyAccess, EnumSetting, fontFamily, gestureSwitchChapter, useComments, warning, wtcdGameQuickLoadConfirm } from '../data/settings';
import { ItemDecoration, ItemHandle, Menu } from '../Menu';
import { UserMenu } from './UserMenu';

export class EnumSettingMenu extends Menu {
  public constructor(parent: Menu, label: string, setting: EnumSetting, usePreview: boolean) {
    super(`${label}设置`, parent, usePreview ? Layout.SIDE : Layout.MAIN);
    let currentHandle: ItemHandle;
    if (usePreview) {
      this.activateEvent.on(() => {
        const block = newContent(Side.RIGHT).addBlock();
        block.element.innerHTML = stylePreviewArticle;
      });
    }
    setting.options.forEach((valueName, value) => {
      const handle = this.addItem(valueName, { small: true, button: true, decoration: ItemDecoration.SELECTABLE })
        .onClick(() => {
          currentHandle.setSelected(false);
          handle.setSelected(true);
          setting.setValue(value);
          currentHandle = handle;
        });
      if (value === setting.getValue()) {
        currentHandle = handle;
        handle.setSelected(true);
      }
    });
  }
}

export class SettingsMenu extends Menu {
  public constructor(parent: Menu) {
    super('设置', parent);

    this.addLink(new UserMenu(this), true);
    this.addBooleanSetting('NSFW 警告', warning);
    this.addBooleanSetting('使用动画', animation);
    this.addBooleanSetting('显示编写中章节', earlyAccess);
    this.addBooleanSetting('显示评论', useComments);
    this.addBooleanSetting('手势切换章节（仅限手机）', gestureSwitchChapter);
    this.addEnumSetting('字体', fontFamily, true);
    this.addBooleanSetting('显示每个章节的字数', charCount);
    this.addBooleanSetting('WTCD 游戏快速读取前确认', wtcdGameQuickLoadConfirm);
    this.addBooleanSetting('开发人员模式', developerMode);
    this.addBooleanSetting('文章末显示联系信息', contactInfo);
  }
  public addBooleanSetting(label: string, setting: BooleanSetting) {
    const getText = (value: boolean) => `${label}：${value ? '开' : '关'}`;
    const handle = this.addItem(getText(setting.getValue()), { small: true, button: true })
      .onClick(() => {
        setting.toggle();
      });
    setting.event.on(newValue => {
      handle.setInnerText(getText(newValue));
    });
  }
  public addEnumSetting(label: string, setting: EnumSetting, usePreview?: true) {
    const getText = () => `${label}：${setting.getValueName()}`;
    const handle = this.addItem(getText(), { small: true, button: true });
    const enumSettingMenu = new EnumSettingMenu(this, label, setting, usePreview === true);
    handle.linkTo(enumSettingMenu).onClick(() => {
      this.activateEvent.once(() => {
        handle.setInnerText(getText());
      });
    });
  }
}

const STORAGE_KEY = "cowabunga_settings";

const defaultSettings = {
  musicEnabled: true
}

export class SettingsManager {
  static loadSettings() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultSettings;
  }

  static saveSettings(settings) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }

  static toggleMusic() {
    const settings = this.loadSettings();
    settings.musicEnabled = !settings.musicEnabled;
    this.saveSettings(settings);
    return settings.musicEnabled;
  }
}
import * as RN from "react-native";
import type { AlertButton, AlertOptions } from "react-native";
import { translateUiText } from "./language-runtime";

const PATCH_FLAG = "__lifelink_auto_localization_patched__";

declare global {
  var __lifelink_auto_localization_patched__: boolean | undefined;
}

const translateTextValue = (value: string | undefined) =>
  typeof value === "string" ? translateUiText(value) : value;

const patchAlert = () => {
  const originalAlert = RN.Alert.alert.bind(RN.Alert);
  RN.Alert.alert = (
    title: string,
    message?: string,
    buttons?: AlertButton[],
    options?: AlertOptions
  ) => {
    const translatedTitle = translateTextValue(title);
    const translatedMessage = translateTextValue(message);
    const translatedButtons = buttons?.map((button: AlertButton) => ({
      ...button,
      text: translateTextValue(button.text),
    }));

    return originalAlert(
      translatedTitle ?? title,
      translatedMessage ?? message,
      translatedButtons,
      options
    );
  };
};

export const initializeAutoLocalization = () => {
  if (global[PATCH_FLAG]) return;

  try {
    patchAlert();
  } catch (error) {
    console.warn("Auto-localization Alert patch failed:", error);
  }

  global[PATCH_FLAG] = true;
};

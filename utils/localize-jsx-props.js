const { translateUiText } = require("./language-runtime");

const translatableProps = new Set([
  "title",
  "label",
  "tabBarLabel",
  "placeholder",
  "headerTitle",
  "buttonText",
  "message",
  "subtitle",
  "description",
  "emptyTitle",
  "emptyDescription",
  "cancelText",
  "confirmText",
]);

const translateChildren = (children) => {
  if (typeof children === "string") {
    return translateUiText(children);
  }

  if (Array.isArray(children)) {
    return children.map((child) => translateChildren(child));
  }

  return children;
};

const isPlainObject = (value) => {
  if (!value || typeof value !== "object") return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
};

const isReactElementLike = (value) =>
  !!value && typeof value === "object" && value.$$typeof !== undefined;

const deepTranslateByKey = (value, seen = new WeakSet(), depth = 0) => {
  if (depth > 5) return value;

  if (Array.isArray(value)) {
    let changed = false;
    const mapped = value.map((item) => {
      const next =
        Array.isArray(item) || isPlainObject(item)
          ? deepTranslateByKey(item, seen, depth + 1)
          : item;
      if (next !== item) changed = true;
      return next;
    });
    return changed ? mapped : value;
  }

  if (!value || typeof value !== "object") return value;
  if (!isPlainObject(value)) return value;
  if (seen.has(value)) return value;
  seen.add(value);

  let changed = false;
  const output = {};

  for (const [key, propValue] of Object.entries(value)) {
    let nextValue = propValue;

    if (typeof propValue === "string" && translatableProps.has(key)) {
      nextValue = translateUiText(propValue);
    } else if (
      !isReactElementLike(propValue) &&
      (Array.isArray(propValue) || isPlainObject(propValue))
    ) {
      nextValue = deepTranslateByKey(propValue, seen, depth + 1);
    }

    if (nextValue !== propValue) changed = true;
    output[key] = nextValue;
  }

  return changed ? output : value;
};

const localizeElementProps = (_type, props) => {
  if (!props || typeof props !== "object") return props;

  let localizedProps = deepTranslateByKey(props);
  if (!localizedProps || typeof localizedProps !== "object") return localizedProps;

  if (localizedProps.children !== undefined) {
    const translatedChildren = translateChildren(localizedProps.children);
    if (translatedChildren !== localizedProps.children) {
      if (localizedProps === props) localizedProps = { ...props };
      localizedProps.children = translatedChildren;
    }
  }

  return localizedProps;
};

module.exports = {
  localizeElementProps,
  translateChildren,
};

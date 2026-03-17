import React, { type JSX } from "react";

import { text_modules } from "@/utils/text_modules";
import { subtitle, title } from "@/components/primitives";

export type LanguageSystemParams = Record<
  string,
  string | number | React.ReactNode
>;

const styleFunctionMap = {
  title: title,
  subtitle: subtitle,
};

type StyleTypeKey = keyof typeof styleFunctionMap;

type StyleFunction = typeof title | typeof subtitle;
type PossibleStyleVariants = Parameters<StyleFunction>[0];

type StyleOptions = {
  as?: React.ElementType;
  class?: string;
} & (PossibleStyleVariants extends undefined | null | boolean | number | string
  ? Record<string, any>
  : PossibleStyleVariants);

type SpanFunctionOptions = {
  key: string;
  params?: LanguageSystemParams;
  style_type?: StyleTypeKey;
  style_options?: StyleOptions;
};

type GetFunctionOptions = {
  key: string;
  params?: LanguageSystemParams;
};

type LanguageSystem = {
  get: (options: GetFunctionOptions) => string;
  span: (options: SpanFunctionOptions) => JSX.Element;
};

const parseTextRobust = (
  text: string,
  params: LanguageSystemParams = {},
): (string | React.ReactNode)[] => {
  const regex = /({\w+})|<(br)\s*\/?>|<(\/?\w+)>/g;
  const result: (string | React.ReactNode)[] = [];
  let lastIndex = 0;
  let keyCounter = 0;

  // @ts-ignore
  for (const match of text.matchAll(regex)) {
    const index = match.index!;

    if (index > lastIndex) {
      result.push(text.substring(lastIndex, index));
    }

    const fullMatch = match[0];
    const placeholderContent = match[1];
    const brTag = match[2];
    const styleTagContent = match[3];

    if (placeholderContent) {
      const paramKey = placeholderContent.substring(
        1,
        placeholderContent.length - 1,
      );
      const paramValue = params[paramKey];

      if (paramValue !== undefined && paramValue !== null) {
        if (React.isValidElement(paramValue)) {
          result.push(
            React.cloneElement(paramValue, {
              key: `param-${paramKey}-${keyCounter++}`,
            }),
          );
        } else {
          result.push(paramValue);
        }
      } else {
        result.push(fullMatch);
        // eslint-disable-next-line no-console
        console.warn(
          `Placeholder "${fullMatch}" found, but no matching parameter provided.`,
        );
      }
    } else if (brTag) {
      result.push(<br key={`br-${keyCounter++}`} />);
    } else if (styleTagContent) {
      result.push(fullMatch);
    }

    lastIndex = index + fullMatch.length;
  }

  if (lastIndex < text.length) {
    result.push(text.substring(lastIndex));
  }

  return result;
};

/**
 * The `languageSystem` object provides utilities for retrieving and rendering localized text with dynamic parameter substitution and inline styling.
 *
 * @remarks
 * - The `get` method retrieves a translation string by key, replaces placeholders with provided parameters, and strips HTML tags.
 * - The `span` method renders a React element with the translated text, supporting inline style tags (e.g., `<blue>`, `<red>`) and custom style options.
 *
 * @property get - Retrieves a translated string by key, substituting parameters and removing HTML tags.
 * @param get.key - The translation key to look up.
 * @param get.params - An object mapping placeholder names to their replacement values.
 * @returns The translated string with parameters substituted and HTML tags removed.
 *
 * @property span - Renders a React element with the translated text, supporting inline style tags and custom styling.
 * @param span.key - The translation key to look up.
 * @param span.params - An object mapping placeholder names to their replacement values.
 * @param span.style_type - The style type to use for the text (e.g., "title", "subtitle", "span").
 * @param span.style_options - Additional style options, including custom class names and tag overrides.
 * @returns A React element containing the styled, translated text.
 *
 * @example
 * // Basic usage for translation
 * languageSystem.get({ key: "greeting", params: { name: "Alice" } });
 *
 * @example
 * // Rendering styled text in a React component
 * languageSystem.span({
 *   key: "welcome_message",
 *   params: { user: "Bob" },
 *   style_type: "subtitle",
 *   style_options: { class: "custom-class" }
 * });
 */
const languageSystem: LanguageSystem = {
  get: ({ key, params = {} }) => {
    let translation = text_modules[key] || key;

    Object.keys(params).forEach((paramKey) => {
      const placeholder = `{${paramKey}}`;
      const value = params[paramKey];
      const replacement =
        typeof value === "string" || typeof value === "number"
          ? String(value)
          : "";

      translation = translation.replace(
        new RegExp(placeholder.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"), "g"),
        replacement,
      );
    });
    translation = translation
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<[^>]+>/g, "");

    return translation;
  },

  span: ({ key, params = {}, style_type, style_options = {} }) => {
    const rawText = text_modules[key] || key;
    const effectiveStyleType = style_type || "title";
    const styleFn = styleFunctionMap[effectiveStyleType];

    if (!styleFn) {
      // eslint-disable-next-line no-console
      console.error(
        `Style function for type "${effectiveStyleType}" not found.`,
      );
      const fallbackContent = parseTextRobust(rawText, params).map(
        (part, index) =>
          React.isValidElement(part) ? (
            part
          ) : (
            <React.Fragment key={`fallback-${index}`}>{part}</React.Fragment>
          ),
      );

      return <span key={key}>{fallbackContent}</span>;
    }

    const defaultTag: React.ElementType =
      effectiveStyleType === "title"
        ? "h1"
        : effectiveStyleType === "subtitle"
          ? "p"
          : "span";
    const AsTag = style_options.as || defaultTag;
    const {
      as: _as,
      class: additionalClasses,
      ...restStyleOptions
    } = style_options;

    const baseVariantProps = { ...restStyleOptions };

    if (!baseVariantProps.color) {
      // @ts-ignore
      baseVariantProps.color = undefined;
    }
    // @ts-ignore
    const baseVariantClasses = styleFn({
      ...baseVariantProps,
      class: undefined,
    });
    const finalWrapperClassName =
      `${baseVariantClasses} ${additionalClasses || ""}`.trim();

    const parsedParts = parseTextRobust(rawText, params);
    const renderedElements: React.ReactNode[] = [];
    let currentInlineStyleProps: Partial<PossibleStyleVariants> | null = null;
    const knownInlineStyleTags: Record<
      string,
      Partial<PossibleStyleVariants>
    > = {
      blue: { color: "blue" },
      pink: { color: "pink" },
      violet: { color: "violet" },
      yellow: { color: "yellow" },
      cyan: { color: "cyan" },
      green: { color: "green" },
      red: { color: "red" },
      orange: { color: "orange" },
    };

    parsedParts.forEach((part, index) => {
      const uniqueKey = `part-${key}-${index}`;

      if (typeof part === "string") {
        const openTagMatch = part.match(/^<(\w+)>$/);
        const closeTagMatch = part.match(/^<\/(\w+)>$/);

        if (openTagMatch) {
          const tagName = openTagMatch[1].toLowerCase();

          if (knownInlineStyleTags[tagName]) {
            currentInlineStyleProps = knownInlineStyleTags[tagName];
          } else {
            // eslint-disable-next-line no-console
            console.warn(`Unsupported style tag found: ${part}`);
          }
        } else if (closeTagMatch) {
          currentInlineStyleProps = null;
        } else {
          if (currentInlineStyleProps) {
            const combinedProps = {
              ...baseVariantProps,
              ...currentInlineStyleProps,
            };
            // @ts-ignore
            const inlineSpanClassName = styleFn({
              ...combinedProps,
              class: undefined,
            });

            renderedElements.push(
              <span key={uniqueKey} className={inlineSpanClassName}>
                {part}
              </span>,
            );
          } else {
            renderedElements.push(part);
          }
        }
      } else {
        if (
          currentInlineStyleProps &&
          React.isValidElement(part) &&
          part.type !== React.Fragment
        ) {
          const combinedProps = {
            ...baseVariantProps,
            ...currentInlineStyleProps,
          };
          // @ts-ignore
          const inlineSpanClassName = styleFn({
            ...combinedProps,
            class: undefined,
          });

          renderedElements.push(
            <span key={`${uniqueKey}-wrapper`} className={inlineSpanClassName}>
              {part}
            </span>,
          );
        } else {
          renderedElements.push(part);
        }
      }
    });

    const finalChildren = renderedElements.filter(
      (el) => el !== null && el !== undefined,
    );

    return React.createElement(
      AsTag,
      {
        className: finalWrapperClassName,
        key: key,
      },
      ...finalChildren,
    );
  },
};

export default languageSystem;

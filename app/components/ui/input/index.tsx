import React, { forwardRef, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  StyleSheet,
  Pressable,
  ViewStyle,
} from "react-native";

/**
 * Design tokens (ajuste pra sua paleta)
 */
const tokens = {
  radius: 12,
  spacing: { xs: 6, sm: 8, md: 12, lg: 16 },
  font: { sm: 14, md: 16, lg: 18, label: 14, helper: 12 },
  colors: {
    bg: "#0B0B0C",
    surface: "#151518",
    surfaceAlt: "#1C1C20",
    text: "#EDEDED",
    textMuted: "#B9B9C0",
    border: "#2A2A31",
    borderFocus: "#6E56CF", // roxinho
    borderError: "#E5484D",
    placeholder: "#8A8A95",
    disabledBg: "#111114",
    disabledText: "#6D6D73",
    success: "#46A758",
    warning: "#F5A524",
  },
};

type Size = "sm" | "md" | "lg";
type Variant = "outline" | "filled" | "ghost";

export type InputProps = Omit<TextInputProps, "onChange" | "editable"> & {
  label?: string;
  helperText?: string;
  error?: string | boolean;
  left?: React.ReactNode;
  right?: React.ReactNode;
  size?: Size;
  variant?: Variant;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  /**
   * Quando true e secureTextEntry=true, mostra um ícone/texto para alternar visibilidade.
   */
  showPasswordToggle?: boolean;
  /**
   * Aplica estilo "valido" (ex.: após validação ok)
   */
  isValid?: boolean;
  containerStyle?: ViewStyle;
};

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      helperText,
      error,
      left,
      right,
      size = "md",
      variant = "outline",
      isDisabled,
      isReadOnly,
      showPasswordToggle,
      secureTextEntry,
      isValid,
      containerStyle,
      style,
      placeholderTextColor = tokens.colors.placeholder,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);
    const [hide, setHide] = useState<boolean>(!!secureTextEntry);

    const hasError = Boolean(error);
    const hasLabel = Boolean(label);
    const hasHelper = Boolean(helperText) || hasError;

    const dims = useMemo(() => {
      const paddingY =
        size === "sm" ? tokens.spacing.sm : size === "lg" ? tokens.spacing.lg : tokens.spacing.md;
      const paddingX =
        size === "sm" ? tokens.spacing.md : size === "lg" ? tokens.spacing.lg : tokens.spacing.md;
      const fontSize =
        size === "sm" ? tokens.font.sm : size === "lg" ? tokens.font.lg : tokens.font.md;
      const height = size === "sm" ? 40 : size === "lg" ? 52 : 46;
      return { paddingY, paddingX, fontSize, height };
    }, [size]);

    const variantStyle = useMemo(() => {
      switch (variant) {
        case "filled":
          return { backgroundColor: tokens.colors.surfaceAlt, borderWidth: 0 };
        case "ghost":
          return { backgroundColor: "transparent", borderWidth: 0 };
        default:
          return { backgroundColor: tokens.colors.surface, borderWidth: StyleSheet.hairlineWidth };
      }
    }, [variant]);

    const borderColor = useMemo(() => {
      if (hasError) return tokens.colors.borderError;
      if (focused) return tokens.colors.borderFocus;
      if (isValid) return tokens.colors.success;
      return tokens.colors.border;
    }, [hasError, focused, isValid]);

    const editable = !isDisabled && !isReadOnly;

    return (
      <View style={[styles.wrapper, containerStyle]}>
        {hasLabel && (
          <Text
            style={[
              styles.label,
              { color: isDisabled ? tokens.colors.disabledText : tokens.colors.textMuted },
            ]}
          >
            {label}
          </Text>
        )}

        <View
          style={[
            styles.inputOuter,
            {
              borderColor,
              ...variantStyle,
              opacity: isDisabled ? 0.6 : 1,
              minHeight: dims.height,
              borderRadius: tokens.radius,
            },
          ]}
        >
          {left ? <View style={styles.accessory}>{left}</View> : null}

          <TextInput
            ref={ref}
            style={[
              styles.input,
              {
                color: isDisabled ? tokens.colors.disabledText : tokens.colors.text,
                paddingVertical: dims.paddingY - 2,
                paddingHorizontal: left ? tokens.spacing.xs : dims.paddingX,
                fontSize: dims.fontSize,
              },
              style,
            ]}
            placeholderTextColor={placeholderTextColor}
            editable={editable}
            onFocus={(e) => {
              setFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              props.onBlur?.(e);
            }}
            secureTextEntry={hide}
            {...props}
          />

          {showPasswordToggle && secureTextEntry ? (
            <Pressable
              onPress={() => setHide((v) => !v)}
              style={styles.accessory}
              disabled={isDisabled}
              hitSlop={8}
            >
              <Text style={{ color: tokens.colors.textMuted }}>
                {hide ? "Mostrar" : "Ocultar"}
              </Text>
            </Pressable>
          ) : right ? (
            <View style={styles.accessory}>{right}</View>
          ) : null}
        </View>

        {hasHelper ? (
          <Text
            style={[
              styles.helper,
              {
                color: hasError
                  ? tokens.colors.borderError
                  : isValid
                  ? tokens.colors.success
                  : tokens.colors.textMuted,
              },
            ]}
            numberOfLines={2}
          >
            {hasError && typeof error === "string" ? error : helperText}
          </Text>
        ) : null}
      </View>
    );
  }
);

Input.displayName = "Input";

const styles = StyleSheet.create({
  wrapper: { width: "100%", gap: 6 },
  label: {
    fontSize: tokens.font.label,
    fontWeight: "500",
  },
  inputOuter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderColor: tokens.colors.border,
    borderWidth: StyleSheet.hairlineWidth,
  },
  input: {
    flex: 1,
  },
  accessory: {
    paddingHorizontal: tokens.spacing.md,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  helper: {
    fontSize: tokens.font.helper,
    lineHeight: 16,
  },
});

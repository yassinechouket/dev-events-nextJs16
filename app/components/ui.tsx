import React from "react";

export function Input(
  props: React.ComponentPropsWithoutRef<"input">
) {
  return <input {...props} />;
}

export function Button(
  props: React.ComponentPropsWithoutRef<"button">
) {
  return <button {...props} />;
}

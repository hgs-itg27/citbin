"use client";

import React from "react";
import { Button } from "@heroui/react";

/**
 * A button component that navigates the user to the device management overview page.
 *
 * When clicked, this button redirects the browser to the "/admin/overview" route.
 * The button is styled with the primary color and displays the label "Verwaltung öffnen".
 *
 * @component
 * @returns {JSX.Element} The rendered button component for device management navigation.
 */
export default function DeviceManagementButton() {
  return (
    <Button
      color="primary"
      onPress={() => {
        window.location.href = "/admin/overview";
      }}
    >
      Verwaltung öffnen
    </Button>
  );
}

import * as a11yAnnotations from "@storybook/addon-a11y/preview";
import { setProjectAnnotations } from "@storybook/react-vite";
import { beforeAll } from "vitest";
import * as projectAnnotations from "./preview";

// Annotations are applied by hand: addon-vitest's own setup file fails to
// import aria-query's elementRoles, and a manual setup skips addon defaults.
const project = setProjectAnnotations([a11yAnnotations, projectAnnotations]);

beforeAll(project.beforeAll);

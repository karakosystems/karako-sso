import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../../components/theme-provider";
import { Button } from "../../../components/ui/button";
import { useI18n } from "../../i18n";

export function ModeToggle() {
    const { theme, setTheme } = useTheme();
    const { msgStr } = useI18n();

    const isDark = theme === "dark";

    return (
        <Button
            variant="outline"
            size="icon"
            aria-label={msgStr(isDark ? "switchToLightMode" : "switchToDarkMode")}
            onClick={() => setTheme(isDark ? "light" : "dark")}
        >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
    );
}

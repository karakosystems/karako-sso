import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LogoutOtherSessions } from "@/login/components/LogoutOtherSessions";
import { useI18n } from "@/login/i18n";
import { useKcContext } from "@/login/KcContext";
import { useKcClsx } from "@keycloakify/login-ui/useKcClsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { assert } from "tsafe/assert";
import { Template } from "../../components/Template";

export function Page() {
    const { kcContext } = useKcContext();
    assert(kcContext.pageId === "login-config-totp.ftl");

    const { msg, msgStr, advancedMsg } = useI18n();

    const { kcClsx } = useKcClsx();

    return (
        <Template
            cardClassName="max-w-2xl"
            headerNode={msg("loginTotpTitle")}
            displayMessage={!kcContext.messagesPerField.existsError("totp", "userLabel")}
        >
            <div className="space-y-6">
                <ol
                    id="kc-totp-settings"
                    className="list-decimal space-y-4 pl-5 text-sm text-foreground/80"
                >
                    <li className="space-y-2">
                        <p>{msg("loginTotpStep1")}</p>
                        <ul
                            className="ml-4 list-disc space-y-1 pl-2"
                            id="kc-totp-supported-apps"
                        >
                            {kcContext.totp.supportedApplications.map(app => (
                                <li key={app}>{advancedMsg(app)}</li>
                            ))}
                        </ul>
                    </li>

                    {kcContext.mode == "manual" ? (
                        <>
                            <li className="space-y-3">
                                <p>{msg("loginTotpManualStep2")}</p>
                                <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
                                    <code
                                        id="kc-totp-secret-key"
                                        className="block break-all rounded border bg-secondary px-3 py-2 font-mono text-sm"
                                    >
                                        {kcContext.totp.totpSecretEncoded}
                                    </code>
                                    <Button variant="outline" size="sm" asChild>
                                        <a href={kcContext.totp.qrUrl}>
                                            {msg("loginTotpScanBarcode")}
                                        </a>
                                    </Button>
                                </div>
                            </li>
                            <li className="space-y-3">
                                <p>{msg("loginTotpManualStep3")}</p>
                                <dl className="grid grid-cols-1 gap-3 rounded-lg border bg-muted/30 p-4 text-sm sm:grid-cols-2">
                                    <div className="flex items-center justify-between gap-2">
                                        <dt className="text-muted-foreground">
                                            {msg("loginTotpType")}
                                        </dt>
                                        <dd className="rounded bg-secondary px-2 py-1 font-mono text-xs">
                                            {msg(
                                                `loginTotp.${kcContext.totp.policy.type}`
                                            )}
                                        </dd>
                                    </div>
                                    <div className="flex items-center justify-between gap-2">
                                        <dt className="text-muted-foreground">
                                            {msg("loginTotpAlgorithm")}
                                        </dt>
                                        <dd className="rounded bg-secondary px-2 py-1 font-mono text-xs">
                                            {kcContext.totp.policy.getAlgorithmKey()}
                                        </dd>
                                    </div>
                                    <div className="flex items-center justify-between gap-2">
                                        <dt className="text-muted-foreground">
                                            {msg("loginTotpDigits")}
                                        </dt>
                                        <dd className="rounded bg-secondary px-2 py-1 font-mono text-xs">
                                            {kcContext.totp.policy.digits}
                                        </dd>
                                    </div>
                                    <div className="flex items-center justify-between gap-2">
                                        <dt className="text-muted-foreground">
                                            {kcContext.totp.policy.type === "totp"
                                                ? msg("loginTotpInterval")
                                                : msg("loginTotpCounter")}
                                        </dt>
                                        <dd className="rounded bg-secondary px-2 py-1 font-mono text-xs">
                                            {kcContext.totp.policy.type === "totp"
                                                ? kcContext.totp.policy.period
                                                : kcContext.totp.policy.initialCounter}
                                        </dd>
                                    </div>
                                </dl>
                            </li>
                        </>
                    ) : (
                        <li className="space-y-3">
                            <p>{msg("loginTotpStep2")}</p>
                            <div className="flex flex-col items-center gap-3">
                                <img
                                    id="kc-totp-secret-qr-code"
                                    className="h-auto w-full max-w-60 rounded border bg-white p-2"
                                    src={`data:image/png;base64, ${kcContext.totp.totpSecretQrCode}`}
                                    alt="QR code"
                                />
                                <Button variant="outline" size="sm" asChild>
                                    <a href={kcContext.totp.manualUrl} id="mode-manual">
                                        {msg("loginTotpUnableToScan")}
                                    </a>
                                </Button>
                            </div>
                        </li>
                    )}
                    <li className="space-y-1">
                        <p>{msg("loginTotpStep3")}</p>
                        <p className="text-muted-foreground">
                            {msg("loginTotpStep3DeviceName")}
                        </p>
                    </li>
                </ol>

                <form
                    action={kcContext.url.loginAction}
                    className="space-y-4"
                    id="kc-totp-settings-form"
                    method="post"
                >
                    <div className={kcClsx("kcFormGroupClass")}>
                        <Field>
                            <FieldLabel htmlFor="totp">
                                {msg("authenticatorCode")}{" "}
                                <span className="text-destructive">*</span>
                            </FieldLabel>
                            <Input
                                type="text"
                                id="totp"
                                name="totp"
                                autoComplete="off"
                                aria-invalid={kcContext.messagesPerField.existsError(
                                    "totp"
                                )}
                            />
                            {kcContext.messagesPerField.existsError("totp") && (
                                <FieldError>
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: kcSanitize(
                                                kcContext.messagesPerField.get("totp")
                                            )
                                        }}
                                    />
                                </FieldError>
                            )}
                        </Field>
                        <input
                            type="hidden"
                            id="totpSecret"
                            name="totpSecret"
                            value={kcContext.totp.totpSecret}
                        />
                        {kcContext.mode && (
                            <input
                                type="hidden"
                                id="mode"
                                name="mode"
                                value={kcContext.mode}
                            />
                        )}
                    </div>

                    <div className={kcClsx("kcFormGroupClass")}>
                        <Field>
                            <FieldLabel htmlFor="userLabel">
                                {msg("loginTotpDeviceName")}{" "}
                                {kcContext.totp.otpCredentials.length >= 1 && (
                                    <span className="text-destructive">*</span>
                                )}
                            </FieldLabel>
                            <Input
                                type="text"
                                id="userLabel"
                                name="userLabel"
                                autoComplete="off"
                                aria-invalid={kcContext.messagesPerField.existsError(
                                    "userLabel"
                                )}
                            />
                            {kcContext.messagesPerField.existsError("userLabel") && (
                                <FieldError>
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: kcSanitize(
                                                kcContext.messagesPerField.get(
                                                    "userLabel"
                                                )
                                            )
                                        }}
                                    />
                                </FieldError>
                            )}
                        </Field>
                    </div>

                    <div className={kcClsx("kcFormGroupClass")}>
                        <LogoutOtherSessions />
                    </div>

                    {kcContext.isAppInitiatedAction ? (
                        <div className="flex justify-between gap-3">
                            <Button
                                variant="secondary"
                                value="true"
                                id="cancelTOTPBtn"
                                name="cancel-aia"
                                type="submit"
                                className="flex-1"
                            >
                                {msgStr("doCancel")}
                            </Button>
                            <Button id="saveTOTPBtn" type="submit" className="flex-1">
                                {msgStr("doSubmit")}
                            </Button>
                        </div>
                    ) : (
                        <Button id="saveTOTPBtn" className="w-full" type="submit">
                            {msgStr("doSubmit")}
                        </Button>
                    )}
                </form>
            </div>
        </Template>
    );
}

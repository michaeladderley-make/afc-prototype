"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  PIXEL_PROVIDERS,
  emptyPixelSettings,
  pixelExampleText,
  pixelIdError,
  type PixelSettings,
} from "@/lib/partner-settings";

export function TrackingPixelField({
  idPrefix,
  values,
  onChange,
  description,
  inherited = false,
  onCustomize,
  onReset,
}: {
  idPrefix: string;
  values?: PixelSettings;
  onChange: (pixel: Partial<PixelSettings>) => void;
  description?: string;
  inherited?: boolean;
  onCustomize?: () => void;
  onReset?: () => void;
}) {
  const pixel = values ?? emptyPixelSettings();
  const pageAction =
    inherited && onCustomize ? (
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="shrink-0"
        onClick={onCustomize}
      >
        Override for this page
      </Button>
    ) : !inherited && onReset ? (
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="shrink-0"
        onClick={onReset}
      >
        Use Portal default
      </Button>
    ) : null;

  return (
    <FieldSet>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <FieldLegend variant="label">Tracking pixels</FieldLegend>
          {description ? (
            <FieldDescription>{description}</FieldDescription>
          ) : null}
        </div>
        {pageAction}
      </div>
      <FieldGroup className="gap-5">
        {PIXEL_PROVIDERS.map((provider) => {
          const fieldId = `${idPrefix}-${provider.value}`;
          const value = pixel[provider.value] ?? "";
          const error = inherited
            ? null
            : pixelIdError(provider.value, value);
          return (
            <Field
              key={provider.value}
              data-invalid={error ? true : undefined}
              className="gap-2"
            >
              <FieldLabel htmlFor={fieldId}>{provider.label}</FieldLabel>
              <Input
                id={fieldId}
                value={value}
                autoComplete="off"
                spellCheck={false}
                placeholder={provider.example}
                disabled={inherited}
                aria-invalid={error ? true : undefined}
                onChange={(event) =>
                  onChange({
                    [provider.value]: event.target.value,
                  } as Partial<PixelSettings>)
                }
              />
              {error ? (
                <FieldError>{error}</FieldError>
              ) : (
                <FieldDescription>
                  {pixelExampleText(provider.value)}
                </FieldDescription>
              )}
            </Field>
          );
        })}
      </FieldGroup>
    </FieldSet>
  );
}

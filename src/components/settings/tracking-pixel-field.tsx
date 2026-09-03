"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  PIXEL_PROVIDERS,
  emptyPixelSettings,
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
  return (
    <FieldSet>
      <FieldLegend variant="label">Tracking pixels</FieldLegend>
      <FieldGroup className="gap-5">
        {PIXEL_PROVIDERS.map((provider) => {
          const fieldId = `${idPrefix}-${provider.value}`;
          return (
            <Field key={provider.value} className="gap-2">
              <FieldLabel htmlFor={fieldId}>{provider.label}</FieldLabel>
              <Input
                id={fieldId}
                value={pixel[provider.value] ?? ""}
                autoComplete="off"
                spellCheck={false}
                placeholder="Pixel ID"
                disabled={inherited}
                onChange={(event) =>
                  onChange({
                    [provider.value]: event.target.value,
                  } as Partial<PixelSettings>)
                }
              />
            </Field>
          );
        })}
        {description ? <FieldDescription>{description}</FieldDescription> : null}
        {inherited && onCustomize ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="self-start"
            onClick={onCustomize}
          >
            Use different IDs for this page
          </Button>
        ) : null}
        {!inherited && onReset ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="self-start"
            onClick={onReset}
          >
            Use global IDs
          </Button>
        ) : null}
      </FieldGroup>
    </FieldSet>
  );
}

"use client";

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
}: {
  idPrefix: string;
  values?: PixelSettings;
  onChange: (pixel: Partial<PixelSettings>) => void;
  description?: string;
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
      </FieldGroup>
    </FieldSet>
  );
}
